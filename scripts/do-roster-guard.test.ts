/**
 * The object's own roster guard and seat reservation, driven without the Worker
 * in front of it.
 *
 *   tsx scripts/do-roster-guard.test.ts
 *
 * The Worker checks the roster before it forwards an action, so the object's
 * check cannot be reached over the public API. This drives the object directly
 * to prove it refuses on its own account as well.
 */
import { SimObject } from "../src/worker/sim-object";

let failures = 0;
const check = (name: string, ok: boolean, detail = "") => {
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}${detail ? `  — ${detail}` : ""}`);
  if (!ok) failures += 1;
};

type Row = Record<string, unknown> | null;

const state: { member: boolean; holder: string | null } = { member: false, holder: null };
const statements: string[] = [];

const DB = {
  prepare(sql: string) {
    statements.push(sql);
    const bound = {
      first: async (): Promise<Row> => {
        if (sql.includes("plays_country = ?")) return state.holder ? { user_id: state.holder } : null;
        if (sql.includes("FROM world_members")) return state.member ? { ok: 1, staff_role: "owner", capabilities_json: null } : null;
        return null; // no checkpoint for this id, so the object builds the scenario
      },
      run: async () => ({ meta: { changes: 1 } }),
    };
    return { bind: () => bound };
  },
};

const stored = new Map<string, unknown>();
const ctx = {
  id: { name: "1900:guard", toString: () => "1900:guard" },
  storage: {
    get: async (key: string) => stored.get(key) ?? null,
    put: async (key: string, value: unknown) => {
      stored.set(key, value);
    },
  },
  acceptWebSocket: () => undefined,
  getWebSockets: () => [],
};
const env = { DB, KV: {} };
const object = new SimObject(ctx as never, env as never);

const act = (body: unknown) =>
  object.fetch(new Request("https://do/action?worldId=1900%3Aguard", { method: "POST", body: JSON.stringify(body) }));

async function main(): Promise<void> {
  const anon = await act({ type: "claim-country", country: "FRA" });
  const anonBody = await anon.json();
  check("the object refuses an action that carries no user", anon.status === 401, `${anon.status} ${JSON.stringify(anonBody)}`);

  const outsider = await act({ type: "claim-country", country: "FRA", userId: "u-outsider" });
  const outsiderBody = await outsider.json();
  check("the object refuses an action from a user with no roster row", outsider.status === 403, `${outsider.status} ${JSON.stringify(outsiderBody)}`);
  check("its refusal names the missing roster entry", /Join this world/.test(String(outsiderBody.message ?? "")), String(outsiderBody.message ?? ""));
  check("a refused action never boots the world", statements.every((s) => !s.includes("world_snapshots")), `${statements.length} statements`);

  state.member = true;
  state.holder = "u1";
  const stolen = await act({ type: "claim-country", country: "FRA", userId: "u2" });
  const stolenBody = await stolen.json();
  check("the object refuses a nation another member reserved", stolenBody.ok === false && /already played/.test(String(stolenBody.message ?? "")), JSON.stringify(stolenBody));

  const own = await act({ type: "claim-country", country: "FRA", userId: "u1" });
  const ownBody = await own.json();
  check("the reserving member still takes their own nation", ownBody.ok === true, JSON.stringify(ownBody));

  state.holder = null;
  const free = await act({ type: "claim-country", country: "ESP", userId: "u2" });
  const freeBody = await free.json();
  check("an unreserved nation is granted", freeBody.ok === true, JSON.stringify(freeBody));
  check("the seat is written back to the roster", statements.some((s) => s.startsWith("UPDATE world_members SET plays_country")), `${statements.length} statements`);

  // --- every country-naming action takes its country from the seat ---
  const COUNTRY_REFUSAL = /country you hold|held by another member|Claim a country/;
  const CASES: [string, Record<string, unknown>][] = [
    ["introduce-bill", { title: "Seat Bill", summary: "", body: "", category: "ordinary" }],
    ["raise-referendum", { question: "Stay the course?" }],
    ["found-company", { name: "Seat Holdings" }],
    ["create-politician", { name: "Seat Candidate" }],
    ["run-for-office", { office: "chamber" }],
    ["appoint-minister", { area: "finance", characterId: "nobody" }],
  ];
  for (const [type, payload] of CASES) {
    const foreign = await (await act({ type, userId: "u1", country: "ESP", ...payload })).json();
    check(`${type} refuses a nation another member holds`, foreign.ok === false && /held by another member/.test(String(foreign.message)), String(foreign.message));
    const unheld = await (await act({ type, userId: "u1", country: "NLD", ...payload })).json();
    check(`${type} refuses a nation the caller does not hold`, unheld.ok === false && /country you hold/.test(String(unheld.message)), String(unheld.message));
    const derived = await (await act({ type, userId: "u1", ...payload })).json();
    check(`${type} derives its country from the seat`, !COUNTRY_REFUSAL.test(String(derived.message ?? "")), String(derived.message));
  }

  const snap = await (await object.fetch(new Request("https://do/snapshot?worldId=1900%3Aguard"))).json();
  const w = snap.world ?? snap;
  check("the bill without a country was filed in the seat", Object.values(w.bills).some((b: any) => b.title === "Seat Bill" && b.country === "FRA"), Object.values(w.bills).map((b: any) => `${b.title}@${b.country}`).join(","));
  check("the referendum without a country was called in the seat", (w.countries.FRA.referendums ?? []).some((r: any) => r.question === "Stay the course?"), `${(w.countries.FRA.referendums ?? []).length} referendums`);
  check("the company without a country is registered in the seat", Object.values(w.companies).some((c: any) => c.name === "Seat Holdings" && c.country === "FRA"), Object.values(w.companies).filter((c: any) => c.name === "Seat Holdings").map((c: any) => c.country).join(","));
  check("the politician without a country was created in the seat", Object.values(w.characters).some((c: any) => c.userId === "u1" && c.country === "FRA"), Object.values(w.characters).filter((c: any) => c.userId === "u1").map((c: any) => c.country).join(","));
  check("nothing landed in the nations the caller named and did not hold", !Object.values(w.bills).some((b: any) => b.title === "Seat Bill" && b.country !== "FRA"), Object.values(w.bills).map((b: any) => b.country).join(","));

  // --- a member with no seat cannot act for a country named or implied ---
  const SEATLESS: [string, Record<string, unknown>][] = [
    ["introduce-bill", { title: "Seatless Bill", summary: "", body: "", category: "ordinary" }],
    ["raise-referendum", { question: "Seatless referendum?" }],
    ["found-company", { name: "Seatless Holdings" }],
    ["create-politician", { name: "Seatless Candidate" }],
    ["run-for-office", { office: "chamber" }],
    ["appoint-minister", { area: "finance", characterId: "nobody" }],
  ];
  for (const [type, payload] of SEATLESS) {
    const held = await (await act({ type, userId: "u3", country: "ESP", ...payload })).json();
    check(`${type} refuses a seatless member naming another member's nation`, held.ok === false && /held by another member/.test(String(held.message)), String(held.message));
    const free = await (await act({ type, userId: "u3", country: "NLD", ...payload })).json();
    check(`${type} refuses a seatless member naming a nation nobody holds`, free.ok === false && /Claim a country/.test(String(free.message)), String(free.message));
    const unnamed = await (await act({ type, userId: "u3", ...payload })).json();
    check(`${type} refuses a seatless member naming no nation`, unnamed.ok === false && /Claim a country/.test(String(unnamed.message)), String(unnamed.message));
  }

  const after = await (await object.fetch(new Request("https://do/snapshot?worldId=1900%3Aguard"))).json();
  const afterWorld = after.world ?? after;
  check("a seatless member filed no bill, company, politician or referendum", !Object.values(afterWorld.bills).some((b: any) => b.title === "Seatless Bill") && !Object.values(afterWorld.companies).some((c: any) => c.name === "Seatless Holdings") && !Object.values(afterWorld.characters).some((c: any) => c.userId === "u3"), `${Object.keys(afterWorld.bills).length} bills, ${Object.keys(afterWorld.companies).length} companies`);
}

main()
  .catch((err) => {
    console.error(err);
    failures += 1;
  })
  .finally(() => process.exit(failures === 0 ? 0 : 1));
