/**
 * End-to-end test for the multiplayer lobby path, run against a real local
 * Durable Object (wrangler dev / workerd, local D1 + KV).
 *
 *   node scripts/mp-lobby.test.mjs
 *
 * It starts its own worker on a spare port with a throwaway state directory,
 * seeds three worlds (public, private, full), registers players through the real
 * sign-up route, then drives join / roster / socket / action and every guard.
 */
import { spawn, execSync } from "node:child_process";
import { rmSync, mkdirSync, existsSync, appendFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { setTimeout as sleep } from "node:timers/promises";
import { createHash } from "node:crypto";

const PORT = Number(process.env.MP_PORT ?? 8791);
const BASE = `http://127.0.0.1:${PORT}`;
// Unique per run, so a dev process left by an interrupted run cannot lock it.
// Outside the project: wrangler dev watches the tree and rebuilding while the
// test writes SQLite into it kills the worker mid-run.
const STATE = process.env.MP_STATE ?? join(tmpdir(), `crown-mp-state-${Date.now()}`);
const PUBLIC_WORLD = "1900:mp-public";
const PRIVATE_WORLD = "1900:mp-private";
const FULL_WORLD = "1900:mp-full";
const SMALL_WORLD = "1900:mp-small";
const WIDE_WORLD = "1900:mp-wide";
const PASSWORD = "correct-horse-battery";
// Set MP_DEV_LOG to keep the worker console for a run that dies mid-way.
const DEBUG_LOG = process.env.MP_DEV_LOG ?? null;
const isWin = process.platform === "win32";

let failures = 0;
const check = (name, ok, detail = "") => {
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}${detail ? `  — ${detail}` : ""}`);
  if (!ok) failures += 1;
};

const wrangler = (args) =>
  execSync(`npx --yes wrangler ${args}`, { cwd: process.cwd(), stdio: "pipe", shell: true }).toString();

function d1(sql) {
  return wrangler(`d1 execute crown --local --persist-to ${STATE} --command ${JSON.stringify(sql)}`);
}

let dev = null;
function stopDev() {
  if (!dev) return;
  try {
    if (isWin) execSync(`taskkill /pid ${dev.pid} /T /F`, { stdio: "ignore" });
    else dev.kill("SIGTERM");
  } catch { /* already gone */ }
  dev = null;
}

async function startDev() {
  // A previous wrangler can hold the state directory for a moment after exit.
  for (let attempt = 0; attempt < 3; attempt += 1) {
    dev = spawn(`npx --yes wrangler dev --port ${PORT} --persist-to ${STATE} --log-level warn`, {
      cwd: process.cwd(),
      shell: true,
      stdio: ["ignore", "pipe", "pipe"],
    });
    let log = "";
    dev.stdout.on("data", (b) => { log += String(b); if (DEBUG_LOG) appendFileSync(DEBUG_LOG, String(b)); });
    dev.stderr.on("data", (b) => { log += String(b); if (DEBUG_LOG) appendFileSync(DEBUG_LOG, String(b)); });
    let dead = false;
    dev.on("exit", (code) => {
      // Keep the tail visible: a worker that dies mid-run otherwise looks like a
      // bare network failure.
      if (!dead) console.error(`dev exited (${code})
${log.slice(-1500)}`);
      dead = true;
    });
    for (let i = 0; i < 60 && !dead; i += 1) {
      try {
        const r = await fetch(`${BASE}/api/health`);
        if (r.ok) return;
      } catch { /* not listening yet */ }
      await sleep(1000);
    }
    stopDev();
    await sleep(3000);
    if (attempt === 2) throw new Error(`worker did not become ready on ${BASE}
${log.slice(-2000)}`);
  }
}

const cookieOf = (res) => {
  const raw = res.headers.getSetCookie?.()[0] ?? res.headers.get("set-cookie") ?? "";
  return raw.split(";")[0];
};

async function register(name, ip) {
  const res = await fetch(`${BASE}/api/auth/register`, {
    method: "POST",
    headers: { "content-type": "application/json", "cf-connecting-ip": ip },
    body: JSON.stringify({ email: `${name}@example.test`, password: PASSWORD, username: name }),
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(`register ${name}: ${res.status} ${JSON.stringify(body)}`);
  return { name, cookie: cookieOf(res), id: body.user.id };
}

const json = async (path, opts = {}) => {
  let res;
  try {
    res = await fetch(`${BASE}${path}`, opts);
  } catch (e) {
    const alive = await fetch(`${BASE}/api/health`).then((r) => `alive ${r.status}`).catch((x) => `dead ${x?.cause?.code ?? x?.message}`);
    throw new Error(`fetch ${path} failed (${e?.cause?.code ?? e?.message}); worker ${alive}`);
  }
  return { status: res.status, body: await res.json().catch(() => ({})) };
};

function openSocket(url) {
  return new Promise((resolve, reject) => {
    const ws = new WebSocket(url);
    const frames = [];
    const timer = setTimeout(() => reject(new Error("socket did not open in 15s")), 15000);
    ws.onopen = () => { clearTimeout(timer); resolve({ ws, frames }); };
    ws.onmessage = (ev) => frames.push(JSON.parse(String(ev.data)));
    ws.onerror = () => { clearTimeout(timer); reject(new Error("socket error")); };
  });
}

async function waitFor(frames, predicate, ms = 15000) {
  const end = Date.now() + ms;
  while (Date.now() < end) {
    const hit = frames.find(predicate);
    if (hit) return hit;
    await sleep(200);
  }
  return null;
}

async function main() {
  try { rmSync(STATE, { recursive: true, force: true }); } catch { /* nothing to clear */ }
  mkdirSync(STATE, { recursive: true });
  console.log("applying migrations to", STATE);
  await wrangler(`d1 migrations apply crown --local --persist-to ${STATE}`);
  const now = Date.now();
  for (const [id, isPublic, cap] of [[PUBLIC_WORLD, 1, 8], [PRIVATE_WORLD, 0, 8], [FULL_WORLD, 1, 8], [SMALL_WORLD, 1, 2], [WIDE_WORLD, 1, 8]]) {
    d1(`INSERT INTO worlds (id, name, scenario_id, owner_id, created_at, updated_at, is_public, archived, description, max_players) VALUES ('${id}', '${id}', '1900', NULL, ${now}, ${now}, ${isPublic}, 0, '', ${cap})`);
  }
  // A host with world.create and no staff role, so the lobby's host checks are
  // proved on ownership alone. The session is seeded because this account never
  // signs up through the form, and it is written before the worker starts: a
  // write behind a running worker's back resets the next request.
  const HOST_TOKEN = "mp-lobby-host-token";
  const HOST_ID = "u-mp-host";
  const HOST_COOKIE = `crown_session=${HOST_TOKEN}`;
  d1(`INSERT INTO users (id, platform, platform_id, username, staff_role, capabilities_json, created_at, last_seen_at) VALUES ('${HOST_ID}', 'test', 'mp-host', 'mp_host', 'player', '["world.create"]', ${now}, ${now})`);
  d1(`INSERT INTO sessions (id, user_id, created_at, expires_at) VALUES ('${createHash("sha256").update(HOST_TOKEN).digest("base64url")}', '${HOST_ID}', ${now}, ${now + 3600000})`);
  // Promoted straight in the database, with the capability list a sign-up
  // writes. Nothing in the row grants world.create, so hosting proves the
  // role is folded into the parsed user.
  const PROMOTED_TOKEN = "mp-promoted-token";
  const PROMOTED_ID = "u-mp-promoted";
  const PROMOTED_COOKIE = `crown_session=${PROMOTED_TOKEN}`;
  d1(`INSERT INTO users (id, platform, platform_id, username, staff_role, capabilities_json, created_at, last_seen_at) VALUES ('${PROMOTED_ID}', 'test', 'mp-promoted', 'mp_promoted', 'developer', '["world.play","economy.trade"]', ${now}, ${now})`);
  d1(`INSERT INTO sessions (id, user_id, created_at, expires_at) VALUES ('${createHash("sha256").update(PROMOTED_TOKEN).digest("base64url")}', '${PROMOTED_ID}', ${now}, ${now + 3600000})`);
  await startDev();
  console.log("worker ready on", BASE);

  // Players: nine for the capacity guard, addresses spread so the sign-up limiter
  // does not throttle the fixture.
  const players = [];
  for (let i = 1; i <= 9; i += 1) players.push(await register(`mp_p${i}`, `10.0.0.${i}`));
  // Three more for the per-world cap checks, on their own addresses.
  const capped = [];
  for (let i = 1; i <= 3; i += 1) capped.push(await register(`mp_cap${i}`, `10.0.2.${i}`));
  const owner = players[0];

  // --- unauthenticated join is rejected ---
  const anon = await json(`/api/worlds/${PUBLIC_WORLD}/join`, { method: "POST" });
  check("unauthenticated join is rejected", anon.status === 401, `status ${anon.status}`);

  // --- authenticated join ---
  const join1 = await json(`/api/worlds/${PUBLIC_WORLD}/join`, { method: "POST", headers: { cookie: owner.cookie } });
  check("authenticated join succeeds", join1.status === 200 && join1.body.ok === true, JSON.stringify(join1.body));

  // --- roster reflects the join ---
  const roster = await json(`/api/worlds/${PUBLIC_WORLD}/members`);
  const names = (roster.body.members ?? []).map((m) => m.username);
  check("roster lists the joining player", names.includes(owner.name), names.join(","));
  check("roster has one member", (roster.body.members ?? []).length === 1, String((roster.body.members ?? []).length));

  // --- re-join is idempotent ---
  const join2 = await json(`/api/worlds/${PUBLIC_WORLD}/join`, { method: "POST", headers: { cookie: owner.cookie } });
  const roster2 = await json(`/api/worlds/${PUBLIC_WORLD}/members`);
  check("re-join succeeds", join2.status === 200 && join2.body.ok === true);
  check("re-join does not duplicate the member", (roster2.body.members ?? []).length === 1, String((roster2.body.members ?? []).length));

  // --- private world rejects a non-member ---
  const priv = await json(`/api/worlds/${PRIVATE_WORLD}/join`, { method: "POST", headers: { cookie: owner.cookie } });
  check("private world rejects a non-member", priv.status === 403, `status ${priv.status} ${JSON.stringify(priv.body)}`);

  // --- capacity: eight fit, the ninth is refused ---
  let capStatus = 0;
  for (let i = 0; i < 8; i += 1) {
    const r = await json(`/api/worlds/${FULL_WORLD}/join`, { method: "POST", headers: { cookie: players[i].cookie } });
    capStatus = r.status;
    if (r.status !== 200) break;
  }
  const ninth = await json(`/api/worlds/${FULL_WORLD}/join`, { method: "POST", headers: { cookie: players[8].cookie } });
  check("eight players fit a world", capStatus === 200, `status ${capStatus}`);
  check("ninth player is refused with 409", ninth.status === 409, `status ${ninth.status} ${JSON.stringify(ninth.body)}`);

  // --- the player cap belongs to the world ---
  const smallJoins = [];
  for (let i = 0; i < 2; i += 1) {
    smallJoins.push(await json(`/api/worlds/${SMALL_WORLD}/join`, { method: "POST", headers: { cookie: capped[i].cookie } }));
  }
  const smallThird = await json(`/api/worlds/${SMALL_WORLD}/join`, { method: "POST", headers: { cookie: capped[2].cookie } });
  check("a two-seat world takes two players", smallJoins.every((r) => r.status === 200), smallJoins.map((r) => r.status).join(","));
  check("its third player is refused with 409", smallThird.status === 409, `status ${smallThird.status} ${JSON.stringify(smallThird.body)}`);
  const wideJoin = await json(`/api/worlds/${WIDE_WORLD}/join`, { method: "POST", headers: { cookie: capped[2].cookie } });
  check("a wider world still seats the player the small one refused", wideJoin.status === 200, `status ${wideJoin.status} ${JSON.stringify(wideJoin.body)}`);

  // --- joining reserves a nation, and one nation has one player ---
  const seatA = await json(`/api/worlds/${PUBLIC_WORLD}/join`, { method: "POST", headers: { "content-type": "application/json", cookie: owner.cookie }, body: JSON.stringify({ country: "FRA" }) });
  check("a join reserves the country it names", seatA.status === 200 && seatA.body.country === "FRA", JSON.stringify(seatA.body));
  const seatTaken = await json(`/api/worlds/${PUBLIC_WORLD}/join`, { method: "POST", headers: { "content-type": "application/json", cookie: players[1].cookie }, body: JSON.stringify({ country: "FRA" }) });
  check("a second member cannot reserve the same country", seatTaken.status === 409, `status ${seatTaken.status} ${JSON.stringify(seatTaken.body)}`);
  const seatB = await json(`/api/worlds/${PUBLIC_WORLD}/join`, { method: "POST", headers: { "content-type": "application/json", cookie: players[1].cookie }, body: JSON.stringify({ country: "ESP" }) });
  check("the same member takes a free country instead", seatB.status === 200 && seatB.body.country === "ESP", JSON.stringify(seatB.body));
  const seated = (await json(`/api/worlds/${PUBLIC_WORLD}/members`)).body.members ?? [];
  const seats = Object.fromEntries(seated.map((m) => [m.userId, m.country]));
  check("the roster records which member holds which nation", seats[owner.id] === "FRA" && seats[players[1].id] === "ESP", JSON.stringify(seats));

  // --- websocket: snapshot the client can adopt ---
  const sockInfo = await json(`/api/worlds/${PUBLIC_WORLD}/socket-url`, { headers: { cookie: owner.cookie } });
  const wsPath = sockInfo.body.url;
  check("socket-url is issued", typeof wsPath === "string" && wsPath.includes("/ws"), String(wsPath));

  const { ws, frames } = await openSocket(`ws://127.0.0.1:${PORT}${wsPath}`);
  const snap = await waitFor(frames, (f) => f.type === "snapshot");
  const world = snap?.world;
  check("socket delivers a snapshot frame", Boolean(snap), frames.map((f) => f.type).join(","));
  check("snapshot carries a full world object", Boolean(world && world.id === PUBLIC_WORLD), world?.id ?? "none");
  check("snapshot countries are adoptable", Boolean(world && world.countries && Object.keys(world.countries).length > 50 && Boolean(world.countries.FRA)), world ? String(Object.keys(world.countries ?? {}).length) : "none");
  check("snapshot has markets, wars and firms", Boolean(world && world.companies && world.markets && world.wars && world.startDate), world ? `${Object.keys(world.companies ?? {}).length} firms` : "none");

  ws.send(JSON.stringify({ type: "ping" }));
  const pong = await waitFor(frames, (f) => f.type === "pong", 8000);
  check("socket answers ping with pong", Boolean(pong));

  // --- action produces a patch the client can apply ---
  const before = frames.length;
  const action = await json(`/api/worlds/${PUBLIC_WORLD}/action`, {
    method: "POST",
    headers: { "content-type": "application/json", cookie: owner.cookie },
    body: JSON.stringify({ type: "claim-country", country: "FRA" }),
  });
  check("action is accepted", action.status === 200 && action.body.ok === true, JSON.stringify(action.body));

  const patch = await waitFor(frames, (f) => f.type === "patch" && Array.isArray(f.countries), 20000);
  check("a patch frame arrives after the action", Boolean(patch), patch ? `after ${frames.length - before} frames` : "none");
  const sample = patch?.countries?.find((c) => c.id === "FRA");
  check("patch carries country rows applyPatch can read", Boolean(sample && sample.economy && typeof sample.economy.gdp === "number"), sample ? `FRA gdp ${sample.economy.gdp}` : "none");
  check("patch carries the world clock", Boolean(patch && typeof patch.t === "number" && Array.isArray(patch.events)), patch ? `t=${patch.t}` : "none");

  // --- roster guard: you must be in a world to act in it ---
  const outsider = players[8]; // joined nothing
  const outsiderAction = await json(`/api/worlds/${PUBLIC_WORLD}/action`, {
    method: "POST",
    headers: { "content-type": "application/json", cookie: outsider.cookie },
    body: JSON.stringify({ type: "claim-country", country: "ESP" }),
  });
  check("action from a player who joined no world is rejected", outsiderAction.status === 403, `status ${outsiderAction.status} ${JSON.stringify(outsiderAction.body)}`);

  const privateAction = await json(`/api/worlds/${PRIVATE_WORLD}/action`, {
    method: "POST",
    headers: { "content-type": "application/json", cookie: players[1].cookie },
    body: JSON.stringify({ type: "claim-country", country: "ITA" }),
  });
  check("action from a non-member on a private world is rejected", privateAction.status === 403, `status ${privateAction.status} ${JSON.stringify(privateAction.body)}`);

  // --- the object itself refuses a nation another member holds ---
  const steal = await json(`/api/worlds/${PUBLIC_WORLD}/action`, {
    method: "POST",
    headers: { "content-type": "application/json", cookie: players[1].cookie },
    body: JSON.stringify({ type: "claim-country", country: "FRA" }),
  });
  check("the object refuses a nation another member holds", steal.body.ok === false && /already played/.test(String(steal.body.message ?? "")), JSON.stringify(steal.body));

  // --- a member still acts ---
  const memberAction = await json(`/api/worlds/${PUBLIC_WORLD}/action`, {
    method: "POST",
    headers: { "content-type": "application/json", cookie: owner.cookie },
    body: JSON.stringify({ type: "claim-country", country: "BEL" }),
  });
  check("a member action still succeeds", memberAction.status === 200 && memberAction.body.ok === true, JSON.stringify(memberAction.body));
  const seatedAfter = (await json(`/api/worlds/${PUBLIC_WORLD}/members`)).body.members ?? [];
  check("claiming a nation moves the claimant's seat", seatedAfter.find((m) => m.userId === owner.id)?.country === "BEL", JSON.stringify(seatedAfter.map((m) => [m.userId, m.country])));

  // --- each member's seat decides which country their command moves ---
  const [leverA, leverB] = await Promise.all([
    json(`/api/worlds/${PUBLIC_WORLD}/action`, {
      method: "POST",
      headers: { "content-type": "application/json", cookie: owner.cookie },
      body: JSON.stringify({ type: "set-policy", area: "environment", value: 31 }),
    }),
    json(`/api/worlds/${PUBLIC_WORLD}/action`, {
      method: "POST",
      headers: { "content-type": "application/json", cookie: players[1].cookie },
      body: JSON.stringify({ type: "set-policy", area: "environment", value: 74 }),
    }),
  ]);
  check("two members act at once and both are accepted", leverA.body.ok === true && leverB.body.ok === true, `${JSON.stringify(leverA.body)} | ${JSON.stringify(leverB.body)}`);
  check("each command names the country its own actor holds", /BEL/.test(String(leverA.body.message)) && /ESP/.test(String(leverB.body.message)), `${leverA.body.message} | ${leverB.body.message}`);
  const seatedWorld = (await json(`/api/worlds/${PUBLIC_WORLD}/snapshot`)).body.world;
  check("the first member's lever moved their own country", seatedWorld.countries.BEL.policies.environment === 31, String(seatedWorld.countries.BEL.policies.environment));
  check("the second member's lever moved their own country", seatedWorld.countries.ESP.policies.environment === 74, String(seatedWorld.countries.ESP.policies.environment));
  check("the world records one seat per member", seatedWorld.seats?.[owner.id] === "BEL" && seatedWorld.seats?.[players[1].id] === "ESP", JSON.stringify(seatedWorld.seats));

  const crossed = await json(`/api/worlds/${PUBLIC_WORLD}/action`, {
    method: "POST",
    headers: { "content-type": "application/json", cookie: players[1].cookie },
    body: JSON.stringify({ type: "set-policy", area: "environment", value: 99, country: "BEL" }),
  });
  check("a member cannot move another member's country", crossed.body.ok === false && /country you hold/.test(String(crossed.body.message)), JSON.stringify(crossed.body));
  const seatedAgain = (await json(`/api/worlds/${PUBLIC_WORLD}/snapshot`)).body.world;
  check("the refused attempt changed nothing", seatedAgain.countries.BEL.policies.environment === 31, String(seatedAgain.countries.BEL.policies.environment));

  const seatless = await json(`/api/worlds/${WIDE_WORLD}/action`, {
    method: "POST",
    headers: { "content-type": "application/json", cookie: capped[2].cookie },
    body: JSON.stringify({ type: "set-policy", area: "environment", value: 5 }),
  });
  check("a member with no country is refused a country lever", seatless.body.ok === false && /Claim a country/.test(String(seatless.body.message)), JSON.stringify(seatless.body));

  // --- a seatless member is refused every country-naming action ---
  const wideWorld = (await json(`/api/worlds/${WIDE_WORLD}/snapshot`)).body.world;
  const wideFree = Object.keys(wideWorld?.countries ?? {}).find((iso) => !Object.values(wideWorld?.seats ?? {}).includes(iso)) ?? "NLD";
  for (const [type, payload] of [
    ["introduce-bill", { title: "Seatless Bill", summary: "", body: "", category: "ordinary" }],
    ["raise-referendum", { question: "Seatless referendum?" }],
    ["create-politician", { name: "Seatless Candidate" }],
    ["run-for-office", { office: "chamber" }],
    ["appoint-minister", { area: "finance", characterId: "nobody" }],
  ]) {
    const named = await json(`/api/worlds/${WIDE_WORLD}/action`, {
      method: "POST",
      headers: { "content-type": "application/json", cookie: capped[2].cookie },
      body: JSON.stringify({ type, country: wideFree, ...payload }),
    });
    check(`${type} refuses a seatless member naming a nation`, named.body.ok === false && /Claim a country/.test(String(named.body.message)), JSON.stringify(named.body));
    const unnamed = await json(`/api/worlds/${WIDE_WORLD}/action`, {
      method: "POST",
      headers: { "content-type": "application/json", cookie: capped[2].cookie },
      body: JSON.stringify({ type, ...payload }),
    });
    check(`${type} refuses a seatless member naming no nation`, unnamed.body.ok === false && /Claim a country/.test(String(unnamed.body.message)), JSON.stringify(unnamed.body));
  }
  const seatlessCompany = await json(`/api/worlds/${WIDE_WORLD}/action`, {
    method: "POST",
    headers: { "content-type": "application/json", cookie: capped[2].cookie },
    body: JSON.stringify({ type: "found-company", name: "Seatless Holdings" }),
  });
  check("found-company stops a player before the seat is even read", seatlessCompany.status === 403 && /company.create/.test(JSON.stringify(seatlessCompany.body)), `status ${seatlessCompany.status} ${JSON.stringify(seatlessCompany.body)}`);
  const seatlessWorld = (await json(`/api/worlds/${WIDE_WORLD}/snapshot`)).body.world;
  check("the seatless member filed nothing in that world", !Object.values(seatlessWorld.bills ?? {}).some((b) => b.title === "Seatless Bill") && !Object.values(seatlessWorld.characters ?? {}).some((c) => c.userId === capped[2].id), Object.values(seatlessWorld.bills ?? {}).map((b) => `${b.title}@${b.country}`).join(","));

  // --- a world command uses the same seat ---
  const barrier = await json(`/api/worlds/${PUBLIC_WORLD}/action`, {
    method: "POST",
    headers: { "content-type": "application/json", cookie: players[1].cookie },
    body: JSON.stringify({ type: "trade-barrier", partner: "GBR", value: 0.5 }),
  });
  check("a world command runs for the actor's own country", barrier.body.ok === true, JSON.stringify(barrier.body));
  const afterBarrier = (await json(`/api/worlds/${PUBLIC_WORLD}/snapshot`)).body.world;
  check("the barrier landed on the actor's country, not a global one", Boolean(afterBarrier.countries.ESP.tradeBarriers?.GBR) && !afterBarrier.countries.BEL.tradeBarriers?.GBR, JSON.stringify(afterBarrier.countries.ESP.tradeBarriers ?? {}));

  // --- a vote belongs to the sender's seat, and only once ---
  const billRes = await json(`/api/worlds/${PUBLIC_WORLD}/action`, {
    method: "POST",
    headers: { "content-type": "application/json", cookie: owner.cookie },
    body: JSON.stringify({ type: "introduce-bill", country: "BEL", title: "Ballot Integrity Act", summary: "One seat, one vote.", body: "", category: "ordinary", sponsorId: "", sponsorPartyId: "" }),
  });
  check("a bill can be introduced in the member's country", billRes.body.ok === true, JSON.stringify(billRes.body));
  const politician = await json(`/api/worlds/${PUBLIC_WORLD}/action`, {
    method: "POST",
    headers: { "content-type": "application/json", cookie: owner.cookie },
    body: JSON.stringify({ type: "create-politician", country: "BEL", name: "Ballot Tester" }),
  });
  const characterId = politician.body.data?.characterId;
  check("the member has a character to vote with", typeof characterId === "string", JSON.stringify(politician.body));
  const billWorld = (await json(`/api/worlds/${PUBLIC_WORLD}/snapshot`)).body.world;
  const theBill = Object.values(billWorld.bills).find((b) => b.title === "Ballot Integrity Act" && b.country === "BEL");
  check("the bill is on the order paper", Boolean(theBill), Object.keys(billWorld.bills).join(","));
  const voteBody = { type: "vote", billId: theBill?.id, country: "BEL", choice: "aye", legislatorId: "someone-else", partyId: "fake-party" };
  const cast = await json(`/api/worlds/${PUBLIC_WORLD}/action`, {
    method: "POST",
    headers: { "content-type": "application/json", cookie: owner.cookie },
    body: JSON.stringify(voteBody),
  });
  check("a member votes as themselves", cast.body.ok === true, JSON.stringify(cast.body));
  const voted = (await json(`/api/worlds/${PUBLIC_WORLD}/snapshot`)).body.world.bills[theBill?.id]?.votes ?? [];
  check("the vote is keyed to the sender's character, not the ids it sent", voted.length === 1 && voted[0].legislatorId === characterId && voted[0].partyId !== "fake-party", JSON.stringify(voted));
  const again = await json(`/api/worlds/${PUBLIC_WORLD}/action`, {
    method: "POST",
    headers: { "content-type": "application/json", cookie: owner.cookie },
    body: JSON.stringify(voteBody),
  });
  check("the same seat cannot vote twice", again.body.ok === false && /already voted/.test(String(again.body.message)), JSON.stringify(again.body));
  const stillOne = (await json(`/api/worlds/${PUBLIC_WORLD}/snapshot`)).body.world.bills[theBill?.id]?.votes ?? [];
  check("the rejected repeat added no vote", stillOne.length === 1, JSON.stringify(stillOne.length));
  const noSeat = await json(`/api/worlds/${PUBLIC_WORLD}/action`, {
    method: "POST",
    headers: { "content-type": "application/json", cookie: players[1].cookie },
    body: JSON.stringify({ type: "vote", billId: theBill?.id, country: "BEL", choice: "nay" }),
  });
  check("a member with no seat in that country cannot vote", noSeat.body.ok === false && /no seat/.test(String(noSeat.body.message)), JSON.stringify(noSeat.body));

  // --- a country-naming action is bound to the caller's seat ---
  const foreignBill = await json(`/api/worlds/${PUBLIC_WORLD}/action`, {
    method: "POST",
    headers: { "content-type": "application/json", cookie: players[1].cookie },
    body: JSON.stringify({ type: "introduce-bill", country: "BEL", title: "Foreign Bill", summary: "Not mine.", body: "", category: "ordinary", sponsorId: "", sponsorPartyId: "" }),
  });
  check("an action naming another member's nation is refused", foreignBill.body.ok === false && /held by another member/.test(String(foreignBill.body.message)), JSON.stringify(foreignBill.body));
  const ownBill = await json(`/api/worlds/${PUBLIC_WORLD}/action`, {
    method: "POST",
    headers: { "content-type": "application/json", cookie: players[1].cookie },
    body: JSON.stringify({ type: "introduce-bill", title: "Own Seat Bill", summary: "Mine.", body: "", category: "ordinary", sponsorId: "", sponsorPartyId: "" }),
  });
  check("an action with no country lands in the caller's seat", ownBill.body.ok === true, JSON.stringify(ownBill.body));
  const seatBills = (await json(`/api/worlds/${PUBLIC_WORLD}/snapshot`)).body.world.bills;
  const own = Object.values(seatBills).find((b) => b.title === "Own Seat Bill");
  check("the bill was filed in the caller's country", own?.country === "ESP", String(own?.country));
  const foreignCompany = await json(`/api/worlds/${PUBLIC_WORLD}/action`, {
    method: "POST",
    headers: { "content-type": "application/json", cookie: players[1].cookie },
    body: JSON.stringify({ type: "raise-referendum", country: "BEL", question: "Should this pass?" }),
  });
  check("another action naming that nation is refused too", foreignCompany.body.ok === false && /held by another member/.test(String(foreignCompany.body.message)), JSON.stringify(foreignCompany.body));

  // --- every country-naming action takes its country from the seat ---
  const seatWorld = (await json(`/api/worlds/${PUBLIC_WORLD}/snapshot`)).body.world;
  const freeNation = Object.keys(seatWorld.countries).find((iso) => iso !== "BEL" && iso !== "ESP" && iso !== "FRA" && !Object.values(seatWorld.seats ?? {}).includes(iso) && !seatWorld.countries[iso].annexedBy);
  for (const [type, payload] of [
    ["run-for-office", { office: "chamber" }],
    ["create-politician", { name: "Seat Candidate" }],
    ["appoint-minister", { area: "finance", characterId: "nobody" }],
  ]) {
    const foreign = await json(`/api/worlds/${PUBLIC_WORLD}/action`, {
      method: "POST",
      headers: { "content-type": "application/json", cookie: players[1].cookie },
      body: JSON.stringify({ type, country: "BEL", ...payload }),
    });
    check(`${type} refuses a nation another member holds`, foreign.body.ok === false && /held by another member/.test(String(foreign.body.message)), JSON.stringify(foreign.body));
    const unheld = await json(`/api/worlds/${PUBLIC_WORLD}/action`, {
      method: "POST",
      headers: { "content-type": "application/json", cookie: players[1].cookie },
      body: JSON.stringify({ type, country: freeNation, ...payload }),
    });
    check(`${type} refuses a nation nobody holds`, unheld.body.ok === false && /country you hold/.test(String(unheld.body.message)), JSON.stringify(unheld.body));
  }
  const derivedOffice = await json(`/api/worlds/${PUBLIC_WORLD}/action`, {
    method: "POST",
    headers: { "content-type": "application/json", cookie: players[1].cookie },
    body: JSON.stringify({ type: "run-for-office", office: "chamber" }),
  });
  check("a country-naming action with no country falls back to the seat", !/country you hold|held by another member|Claim a country/.test(String(derivedOffice.body.message ?? "")), JSON.stringify(derivedOffice.body));

  // --- a bill's sponsor and party belong to the member's country ---
  const belParty = (seatWorld.countries.BEL.parties ?? [])[0];
  const espParty = (seatWorld.countries.ESP.parties ?? [])[0];
  check("both countries have a party to name", Boolean(belParty && espParty), `${belParty?.id} ${espParty?.id}`);
  const foreignSponsor = await json(`/api/worlds/${PUBLIC_WORLD}/action`, {
    method: "POST",
    headers: { "content-type": "application/json", cookie: players[1].cookie },
    body: JSON.stringify({ type: "introduce-bill", title: "Foreign Sponsor Bill", summary: "", body: "", category: "ordinary", sponsorId: characterId }),
  });
  check("introduce-bill refuses a sponsor from another member country", foreignSponsor.body.ok === false && /not a politician in Spain/.test(String(foreignSponsor.body.message)), JSON.stringify(foreignSponsor.body));
  const foreignParty = await json(`/api/worlds/${PUBLIC_WORLD}/action`, {
    method: "POST",
    headers: { "content-type": "application/json", cookie: players[1].cookie },
    body: JSON.stringify({ type: "introduce-bill", title: "Foreign Party Bill", summary: "", body: "", category: "ordinary", sponsorPartyId: belParty?.id }),
  });
  check("introduce-bill refuses another member party", foreignParty.body.ok === false && /not registered in Spain/.test(String(foreignParty.body.message)), JSON.stringify(foreignParty.body));
  const foreignPartyMember = await json(`/api/worlds/${PUBLIC_WORLD}/action`, {
    method: "POST",
    headers: { "content-type": "application/json", cookie: players[1].cookie },
    body: JSON.stringify({ type: "create-politician", name: "Party Tester", partyId: belParty?.id }),
  });
  check("create-politician refuses another member party", foreignPartyMember.body.ok === false && /not registered in Spain/.test(String(foreignPartyMember.body.message)), JSON.stringify(foreignPartyMember.body));
  const ownPartyMember = await json(`/api/worlds/${PUBLIC_WORLD}/action`, {
    method: "POST",
    headers: { "content-type": "application/json", cookie: players[1].cookie },
    body: JSON.stringify({ type: "create-politician", name: "Party Member Tester", partyId: espParty?.id }),
  });
  const ownMemberId = ownPartyMember.body.data?.characterId;
  check("create-politician accepts the member own party", ownPartyMember.body.ok === true && typeof ownMemberId === "string", JSON.stringify(ownPartyMember.body));
  const sponsored = await json(`/api/worlds/${PUBLIC_WORLD}/action`, {
    method: "POST",
    headers: { "content-type": "application/json", cookie: players[1].cookie },
    body: JSON.stringify({ type: "introduce-bill", title: "Seat Sponsor Bill", summary: "", body: "", category: "ordinary", sponsorId: ownMemberId }),
  });
  check("introduce-bill accepts the member own character", sponsored.body.ok === true, JSON.stringify(sponsored.body));
  const sponsorBill = Object.values((await json(`/api/worlds/${PUBLIC_WORLD}/snapshot`)).body.world.bills).find((b) => b.title === "Seat Sponsor Bill");
  check("the bill carries the sponsor and the party that sponsor sits in", sponsorBill?.sponsorId === ownMemberId && sponsorBill?.sponsorPartyId === espParty?.id, `${sponsorBill?.sponsorId} / ${sponsorBill?.sponsorPartyId}`);

  // --- a named sponsor's own party is authoritative ---
  const independentParty = await json(`/api/worlds/${PUBLIC_WORLD}/action`, {
    method: "POST",
    headers: { "content-type": "application/json", cookie: owner.cookie },
    body: JSON.stringify({ type: "introduce-bill", title: "Independent Party Bill", summary: "", body: "", category: "ordinary", sponsorId: characterId, sponsorPartyId: belParty?.id }),
  });
  check("introduce-bill refuses a party an independent sponsor does not sit in", independentParty.body.ok === false && /does not sit in that party/.test(String(independentParty.body.message)), JSON.stringify(independentParty.body));
  const espSecond = (seatWorld.countries.ESP.parties ?? [])[1];
  check("the member country has a second party to contradict", Boolean(espSecond), (seatWorld.countries.ESP.parties ?? []).map((p) => p.id).join(","));
  const mismatch = await json(`/api/worlds/${PUBLIC_WORLD}/action`, {
    method: "POST",
    headers: { "content-type": "application/json", cookie: players[1].cookie },
    body: JSON.stringify({ type: "introduce-bill", title: "Mismatch Bill", summary: "", body: "", category: "ordinary", sponsorId: ownMemberId, sponsorPartyId: espSecond?.id }),
  });
  check("introduce-bill refuses a party the sponsor does not sit in", mismatch.body.ok === false && /does not sit in that party/.test(String(mismatch.body.message)), JSON.stringify(mismatch.body));
  const afterNaming = (await json(`/api/worlds/${PUBLIC_WORLD}/snapshot`)).body.world;
  check("the refused foreign bill filed nothing in that nation", !Object.values(afterNaming.bills).some((b) => b.title === "Foreign Bill"), Object.values(afterNaming.bills).map((b) => `${b.title}@${b.country}`).join(","));

  // --- a reserved code has to exist in the world's scenario ---
  const badCode = await json(`/api/worlds/${WIDE_WORLD}/join`, {
    method: "POST",
    headers: { "content-type": "application/json", cookie: capped[1].cookie },
    body: JSON.stringify({ country: "POL" }),
  });
  check("a real code that is absent from the scenario is refused", badCode.status === 400 && /not in that world/.test(String(badCode.body.error)), `status ${badCode.status} ${JSON.stringify(badCode.body)}`);
  const badShape = await json(`/api/worlds/${WIDE_WORLD}/join`, {
    method: "POST",
    headers: { "content-type": "application/json", cookie: capped[1].cookie },
    body: JSON.stringify({ country: "NOPE" }),
  });
  check("a code that is not a country at all is refused", badShape.status === 400, `status ${badShape.status} ${JSON.stringify(badShape.body)}`);

  // --- the command path sits behind the capability table ---
  const devCmd = await json(`/api/worlds/${PUBLIC_WORLD}/action`, {
    method: "POST",
    headers: { "content-type": "application/json", cookie: players[1].cookie },
    body: JSON.stringify({ type: "advance", days: 365 }),
  });
  check("a member cannot move the world clock", devCmd.status === 403 && /dev.directives/.test(JSON.stringify(devCmd.body)), `status ${devCmd.status} ${JSON.stringify(devCmd.body)}`);
  const war = await json(`/api/worlds/${PUBLIC_WORLD}/action`, {
    method: "POST",
    headers: { "content-type": "application/json", cookie: players[1].cookie },
    body: JSON.stringify({ type: "declare-war", target: "USA", cause: "A test dispute." }),
  });
  check("a seat can declare war", war.body.ok === true, JSON.stringify(war.body));
  const sanction = await json(`/api/worlds/${PUBLIC_WORLD}/action`, {
    method: "POST",
    headers: { "content-type": "application/json", cookie: players[1].cookie },
    body: JSON.stringify({ type: "sanction", target: "USA", kind: "financial" }),
  });
  check("a seat can impose sanctions", sanction.body.ok === true, JSON.stringify(sanction.body));
  const debt = await json(`/api/worlds/${PUBLIC_WORLD}/action`, {
    method: "POST",
    headers: { "content-type": "application/json", cookie: players[1].cookie },
    body: JSON.stringify({ type: "default", haircut: 0.4 }),
  });
  check("a seat can default on its debt", debt.body.ok === true, JSON.stringify(debt.body));
  const noCompany = await json(`/api/worlds/${PUBLIC_WORLD}/action`, {
    method: "POST",
    headers: { "content-type": "application/json", cookie: players[1].cookie },
    body: JSON.stringify({ type: "found-company", name: "Test Co" }),
  });
  const panelRate = await json(`/api/worlds/${PUBLIC_WORLD}/action`, {
    method: "POST",
    headers: { "content-type": "application/json", cookie: players[1].cookie },
    body: JSON.stringify({ type: "set-target", value: 0.031 }),
  });
  const panelChoose = await json(`/api/worlds/${PUBLIC_WORLD}/action`, {
    method: "POST",
    headers: { "content-type": "application/json", cookie: players[1].cookie },
    body: JSON.stringify({ type: "choose-country", country: "BEL" }),
  });
  const seatRate = (await json(`/api/worlds/${PUBLIC_WORLD}/snapshot`, { headers: { cookie: players[1].cookie } })).body.world.countries;
  check("a panel command is applied to the sender's seat", panelRate.body.ok === true && Math.abs(seatRate.ESP.economy.centralBank.target - 0.031) < 1e-9, `${JSON.stringify(panelRate.body)} target ${seatRate.ESP.economy.centralBank.target}`);
  check("a seated member cannot choose another country per command", panelChoose.body.ok === false && /country you hold/.test(String(panelChoose.body.message)), JSON.stringify(panelChoose.body));
  check("a lever the role does not hold is refused", noCompany.status === 403 && /company.create/.test(JSON.stringify(noCompany.body)), `status ${noCompany.status} ${JSON.stringify(noCompany.body)}`);
  const unknown = await json(`/api/worlds/${PUBLIC_WORLD}/action`, {
    method: "POST",
    headers: { "content-type": "application/json", cookie: players[1].cookie },
    body: JSON.stringify({ type: "grant", value: 1e12 }),
  });
  check("a type outside the table is refused", unknown.body.ok === false && /Unknown action/.test(String(unknown.body.message)), JSON.stringify(unknown.body));

  // --- the panels' action surface: each command lands on the seat, not a local sim ---
  const panel = (body, cookie = players[1].cookie) => json(`/api/worlds/${PUBLIC_WORLD}/action`, {
    method: "POST",
    headers: { "content-type": "application/json", cookie },
    body: JSON.stringify(body),
  });
  const panelRead = async () => (await json(`/api/worlds/${PUBLIC_WORLD}/snapshot`, { headers: { cookie: players[1].cookie } })).body.world;
  const beforePanel = await panelRead();
  const press = {
    policy: await panel({ type: "apply-policy", budget: { welfare: 0.12 } }),
    rate: await panel({ type: "set-rate", value: 0.04 }),
    research: await panel({ type: "set-research", focus: "industry" }),
    divisions: await panel({ type: "set-divisions", infantry: 0.5, armour: 0.3, artillery: 0.2 }),
    aid: await panel({ type: "send-aid", target: "PRT", share: 0.01 }),
    barrier: await panel({ type: "trade-barrier", partner: "PRT", value: 0.2 }),
    sanction: await panel({ type: "sanction", target: "PRT", kind: "financial" }),
    emergency: await panel({ type: "emergency-powers", value: true }),
    imf: await panel({ type: "imf-bailout" }),
  };
  const unproxied = Object.entries(press).filter(([, r]) => /Missing capability|Unknown action/.test(String(r.body.message ?? r.body.error ?? "")));
  check("every panel action reaches the command layer", unproxied.length === 0, JSON.stringify(unproxied.map(([k, r]) => [k, r.body])));
  const afterPanel = await panelRead();
  const esp = afterPanel.countries.ESP;
  const espPolicyBill = Object.values(afterPanel.bills ?? {}).find((b) => b.country === "ESP" && b.policy?.budget?.welfare === 0.12);
  check("apply-policy lands on the seat as a decree or a bill", press.policy.body.ok === true && (Math.abs(esp.economy.budget.welfare - 0.12) < 1e-9 || Boolean(espPolicyBill)), `${JSON.stringify(press.policy.body)} budget ${esp.economy.budget.welfare} bill ${Boolean(espPolicyBill)}`);
  check("set-rate either moves the seat's rate or is refused by its bank, never by the gate", press.rate.body.ok === true ? Math.abs(esp.economy.monetary.centralBankRate - 0.04) < 1e-9 : /independent|union/.test(String(press.rate.body.message)), JSON.stringify(press.rate.body));
  check("set-research redirects the seat's research", press.research.body.ok === true && esp.tech?.focus === "industry", `${JSON.stringify(press.research.body)} focus ${esp.tech?.focus}`);
  check("set-divisions reorganises the seat's army", press.divisions.body.ok === true && Math.abs(esp.military.divisions.armour - 0.3) < 1e-9, JSON.stringify(press.divisions.body));
  check("send-aid moves money from the seat to the target", press.aid.body.ok === true && esp.economy.fiscal.debt > beforePanel.countries.ESP.economy.fiscal.debt && afterPanel.countries.PRT.economy.fiscal.debt < beforePanel.countries.PRT.economy.fiscal.debt, `${JSON.stringify(press.aid.body)} esp ${beforePanel.countries.ESP.economy.fiscal.debt}->${esp.economy.fiscal.debt} prt ${beforePanel.countries.PRT.economy.fiscal.debt}->${afterPanel.countries.PRT.economy.fiscal.debt}`);
  check("trade-barrier records the barrier on the seat", press.barrier.body.ok === true && Math.abs((esp.tradeBarriers?.PRT ?? 0) - 0.2) < 1e-9, `${JSON.stringify(press.barrier.body)} ${esp.tradeBarriers?.PRT}`);
  check("sanction records the seat as imposer and the target as subject", press.sanction.body.ok === true && Object.values(afterPanel.sanctions ?? {}).some((x) => (x.imposedBy ?? []).includes("ESP") && x.on === "PRT"), JSON.stringify(press.sanction.body));
  check("emergency-powers changes the seat and only the seat", press.emergency.body.ok === true && esp.executive.emergencyPowers === true && afterPanel.countries.FRA.executive.emergencyPowers !== true, JSON.stringify(press.emergency.body));
  check("a panel action outside its era is refused by policy, not capability", press.imf.body.ok === false && /no IMF/.test(String(press.imf.body.message)), JSON.stringify(press.imf.body));
  const seatlessWide = await json(`/api/worlds/${WIDE_WORLD}/action`, { method: "POST", headers: { "content-type": "application/json", cookie: capped[2].cookie }, body: JSON.stringify({ type: "send-aid", target: "PRT", share: 0.01 }) });
  check("a seatless member's panel command is refused before it changes anything", seatlessWide.body.ok === false && /Choose a country|Claim a country/.test(String(seatlessWide.body.message)), JSON.stringify(seatlessWide.body));
  // --- naming another world must not reach it ---
  const beforePrivate = (await json(`/api/worlds/${PRIVATE_WORLD}/snapshot`)).body.world;
  const crossRead = await json(`/api/worlds/${PUBLIC_WORLD}/snapshot?worldId=${encodeURIComponent(PRIVATE_WORLD)}`);
  check("a request naming another world is refused", crossRead.status === 400, `status ${crossRead.status} ${JSON.stringify(crossRead.body)}`);
  const crossWrite = await json(`/api/worlds/${PUBLIC_WORLD}/action?worldId=${encodeURIComponent(PRIVATE_WORLD)}`, {
    method: "POST",
    headers: { "content-type": "application/json", cookie: owner.cookie },
    body: JSON.stringify({ type: "claim-country", country: "PRT" }),
  });
  check("a write naming another world is refused", crossWrite.status === 400, `status ${crossWrite.status} ${JSON.stringify(crossWrite.body)}`);
  const afterPrivate = (await json(`/api/worlds/${PRIVATE_WORLD}/snapshot`)).body.world;
  check("the other world is not mutated by the attempt", beforePrivate.version === afterPrivate.version && beforePrivate.events.length === afterPrivate.events.length, `${beforePrivate.version}/${beforePrivate.events.length} -> ${afterPrivate.version}/${afterPrivate.events.length}`);
  check("the named world was never loaded under the addressed one", Boolean(afterPrivate.countries && Object.keys(afterPrivate.countries).length > 50));
  ws.close();
  // --- a role promoted in the database reaches the parsed user ---
  const promotedMe = await json("/api/auth/me", { headers: { cookie: PROMOTED_COOKIE } });
  check("a database promotion reaches the parsed user", promotedMe.body.user?.staffRole === "developer" && promotedMe.body.user?.capabilities?.includes("world.create"), JSON.stringify({ role: promotedMe.body.user?.staffRole, caps: promotedMe.body.user?.capabilities }));
  const promotedHost = await json("/api/worlds", {
    method: "POST",
    headers: { "content-type": "application/json", cookie: PROMOTED_COOKIE },
    body: JSON.stringify({ scenarioId: "2026", name: "Promoted Host", maxPlayers: 4 }),
  });
  check("a developer promoted in the database can host", promotedHost.body.ok === true && typeof promotedHost.body.id === "string", JSON.stringify(promotedHost.body));
  const playerHost = await json("/api/worlds", {
    method: "POST",
    headers: { "content-type": "application/json", cookie: players[4].cookie },
    body: JSON.stringify({ scenarioId: "2026", name: "Player Host" }),
  });
  check("a plain player still cannot host", playerHost.status === 403, `${playerHost.status} ${JSON.stringify(playerHost.body)}`);
  check("the promoted host owns the world it made", (await json(`/api/worlds/${promotedHost.body.id}/lobby`, { headers: { cookie: PROMOTED_COOKIE } })).body.you?.host === true, String(promotedHost.body.id));
  // --- the lobby: a host opens a world, members claim nations, a countdown holds the clock ---
  const created = await json("/api/worlds", {
    method: "POST",
    headers: { "content-type": "application/json", cookie: HOST_COOKIE },
    body: JSON.stringify({ scenarioId: "1900", name: "Lobby Test", maxPlayers: 6 }),
  });
  check("a developer with world.create opens a lobby", created.body.ok === true && typeof created.body.id === "string", JSON.stringify(created.body));
  const LOBBY_WORLD = String(created.body.id ?? "");
  const lobby = await json(`/api/worlds/${LOBBY_WORLD}/lobby`, { headers: { cookie: HOST_COOKIE } });
  check("the lobby names its host and its members", lobby.body.you?.host === true && lobby.body.world?.members?.some((m) => m.userId === HOST_ID), JSON.stringify(lobby.body.world?.members ?? null));
  check("a new lobby holds the clock with no start time", lobby.body.world?.startsAt === null && lobby.body.world?.lobby === true, JSON.stringify({ startsAt: lobby.body.world?.startsAt, lobby: lobby.body.world?.lobby }));
  const guestLobby = await json(`/api/worlds/${LOBBY_WORLD}/lobby`, { headers: { cookie: players[3].cookie } });
  check("another member can read a public lobby but is not its host", guestLobby.body.you?.host === false && guestLobby.body.world?.id === LOBBY_WORLD, JSON.stringify(guestLobby.body.you));
  const guestClaim = await json(`/api/worlds/${LOBBY_WORLD}/join`, { method: "POST", headers: { "content-type": "application/json", cookie: players[3].cookie }, body: JSON.stringify({ country: "FRA" }) });
  const claimedLobby = await json(`/api/worlds/${LOBBY_WORLD}/lobby`, { headers: { cookie: players[3].cookie } });
  check("a member picks their nation from the lobby", guestClaim.body.ok === true && claimedLobby.body.you?.country === "FRA", JSON.stringify(claimedLobby.body.you));
  const refusedStart = await json(`/api/worlds/${LOBBY_WORLD}/start`, { method: "POST", headers: { "content-type": "application/json", cookie: players[3].cookie }, body: JSON.stringify({ countdownSeconds: 5 }) });
  check("a member cannot start a world they do not host", refusedStart.status === 403, `${refusedStart.status} ${JSON.stringify(refusedStart.body)}`);
  const lobbyClock = await json(`/api/worlds/${LOBBY_WORLD}/snapshot`, { headers: { cookie: HOST_COOKIE } });
  await sleep(2600);
  const lobbyClockAgain = await json(`/api/worlds/${LOBBY_WORLD}/snapshot`, { headers: { cookie: HOST_COOKIE } });
  check("an unopened lobby holds the clock", lobbyClock.body.world?.t === lobbyClockAgain.body.world?.t, `${lobbyClock.body.world?.t} vs ${lobbyClockAgain.body.world?.t}`);
  const started = await json(`/api/worlds/${LOBBY_WORLD}/start`, { method: "POST", headers: { "content-type": "application/json", cookie: HOST_COOKIE }, body: JSON.stringify({ countdownSeconds: 120 }) });
  check("the host starts the world with a countdown", started.body.ok === true && started.body.startsAt > Date.now(), JSON.stringify(started.body));
  const scheduled = await json(`/api/worlds/${LOBBY_WORLD}/lobby`, { headers: { cookie: players[3].cookie } });
  check("every member sees the same start time", scheduled.body.world?.startsAt === started.body.startsAt, `${scheduled.body.world?.startsAt} vs ${started.body.startsAt}`);
  const counting = await json(`/api/worlds/${LOBBY_WORLD}/snapshot`, { headers: { cookie: HOST_COOKIE } });
  await sleep(2600);
  const countingAgain = await json(`/api/worlds/${LOBBY_WORLD}/snapshot`, { headers: { cookie: HOST_COOKIE } });
  check("the countdown holds the clock until it ends", counting.body.world?.t === countingAgain.body.world?.t, `${counting.body.world?.t} vs ${countingAgain.body.world?.t}`);
  const startNow = await json(`/api/worlds/${LOBBY_WORLD}/start`, { method: "POST", headers: { "content-type": "application/json", cookie: HOST_COOKIE }, body: JSON.stringify({ countdownSeconds: 0 }) });
  await sleep(4200);
  const running = await json(`/api/worlds/${LOBBY_WORLD}/snapshot`, { headers: { cookie: HOST_COOKIE } });
  check("starting now releases the clock", startNow.body.ok === true && running.body.world?.t > countingAgain.body.world?.t, `${countingAgain.body.world?.t} -> ${running.body.world?.t}`);
}

try {
  await main();
} catch (err) {
  failures += 1;
  console.error("FAIL  harness error —", err?.stack ?? err);
} finally {
  stopDev();
}
console.log(failures === 0 ? "\nALL CHECKS PASSED" : `\n${failures} CHECK(S) FAILED`);
process.exit(failures === 0 ? 0 : 1);
