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
        if (sql.includes("FROM world_members")) return state.member ? { ok: 1 } : null;
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
}

main()
  .catch((err) => {
    console.error(err);
    failures += 1;
  })
  .finally(() => process.exit(failures === 0 ? 0 : 1));
