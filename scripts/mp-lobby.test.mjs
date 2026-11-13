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
import { rmSync, mkdirSync, existsSync } from "node:fs";
import { setTimeout as sleep } from "node:timers/promises";

const PORT = Number(process.env.MP_PORT ?? 8791);
const BASE = `http://127.0.0.1:${PORT}`;
// Unique per run, so a dev process left by an interrupted run cannot lock it.
const STATE = process.env.MP_STATE ?? `.cache/mp-test-state-${Date.now()}`;
const PUBLIC_WORLD = "1900:mp-public";
const PRIVATE_WORLD = "1900:mp-private";
const FULL_WORLD = "1900:mp-full";
const SMALL_WORLD = "1900:mp-small";
const WIDE_WORLD = "1900:mp-wide";
const PASSWORD = "correct-horse-battery";
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
    dev.stdout.on("data", (b) => { log += String(b); });
    dev.stderr.on("data", (b) => { log += String(b); });
    let dead = false;
    dev.on("exit", () => { dead = true; });
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
  const res = await fetch(`${BASE}${path}`, opts);
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

  // --- a world command uses the same seat ---
  const barrier = await json(`/api/worlds/${PUBLIC_WORLD}/action`, {
    method: "POST",
    headers: { "content-type": "application/json", cookie: players[1].cookie },
    body: JSON.stringify({ type: "trade-barrier", partner: "GBR", value: 0.5 }),
  });
  check("a world command runs for the actor's own country", barrier.body.ok === true, JSON.stringify(barrier.body));
  const afterBarrier = (await json(`/api/worlds/${PUBLIC_WORLD}/snapshot`)).body.world;
  check("the barrier landed on the actor's country, not a global one", Boolean(afterBarrier.countries.ESP.tradeBarriers?.GBR) && !afterBarrier.countries.BEL.tradeBarriers?.GBR, JSON.stringify(afterBarrier.countries.ESP.tradeBarriers ?? {}));

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
