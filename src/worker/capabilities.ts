import type { Capability, StaffRole, User } from "../shared/types";

/**
 * Capabilities.
 *
 * Every developer-menu button, API mutation and console command maps to exactly
 * one of these. The menu hides what you cannot do, the API refuses what you
 * cannot do, and neither can drift because both read this table.
 */

export const ALL_CAPABILITIES: Capability[] = [
  "world.play", "world.create", "world.delete",
  "economy.trade", "economy.invest", "economy.ledger", "economy.grant", "economy.set-stat",
  "company.create", "company.delete", "company.ban", "company.manage",
  "politics.vote", "politics.legislate", "politics.campaign", "politics.appoint", "politics.override",
  "diplomacy.treaty", "diplomacy.war", "diplomacy.sanction",
  "military.command",
  "character.create", "character.delete", "character.ban",
  "scenario.create", "scenario.edit", "scenario.delete",
  "rules.manage", "dev.console", "dev.worldedit", "dev.directives",
  "moderation.ban", "moderation.kick", "moderation.mute", "moderation.warn",
  "admin.impersonate", "admin.webhook",
];

export const CAPABILITY_LABELS: Record<Capability, { label: string; group: string; description: string }> = {
  "world.play": { label: "Play", group: "World", description: "Take control of a country, leader or company." },
  "world.create": { label: "Create worlds", group: "World", description: "Spin up new simulations." },
  "world.delete": { label: "Delete worlds", group: "World", description: "Permanently destroy a world." },

  "economy.trade": { label: "Buy and sell", group: "Economy", description: "Trade shares and assets on the exchange." },
  "economy.invest": { label: "Invest", group: "Economy", description: "Take positions in companies and state debt." },
  "economy.ledger": { label: "View ledgers", group: "Economy", description: "See the full financial ledger of any entity." },
  "economy.grant": { label: "Grant funds", group: "Economy", description: "Create money for a player or a state treasury." },
  "economy.set-stat": { label: "Set economic stats", group: "Economy", description: "Force any economic variable to a value." },

  "company.create": { label: "Found companies", group: "Companies", description: "Create new corporations." },
  "company.delete": { label: "Delete companies", group: "Companies", description: "Dissolve a corporation and delist it." },
  "company.ban": { label: "Ban companies", group: "Companies", description: "Prohibit a company from operating or trading." },
  "company.manage": { label: "Manage companies", group: "Companies", description: "Appoint boards, issue shares, force takeovers." },

  "politics.vote": { label: "Vote", group: "Politics", description: "Cast a vote in a legislature." },
  "politics.legislate": { label: "Legislate", group: "Politics", description: "Draft and sponsor bills." },
  "politics.campaign": { label: "Campaign", group: "Politics", description: "Stand for election and canvass." },
  "politics.appoint": { label: "Appoint", group: "Politics", description: "Appoint ministers, judges and committee chairs." },
  "politics.override": { label: "Override politics", group: "Politics", description: "Force outcomes that the vote would not produce." },

  "diplomacy.treaty": { label: "Sign treaties", group: "Diplomacy", description: "Negotiate and withdraw from agreements." },
  "diplomacy.war": { label: "Declare war", group: "Diplomacy", description: "Open and close conflicts." },
  "diplomacy.sanction": { label: "Impose sanctions", group: "Diplomacy", description: "Embargo, freeze assets, restrict technology." },

  "military.command": { label: "Command the military", group: "Military", description: "Direct forces, order mobilisation." },

  "character.create": { label: "Create characters", group: "Characters", description: "Spawn leaders, generals and executives." },
  "character.delete": { label: "Delete characters", group: "Characters", description: "Remove a character from the world." },
  "character.ban": { label: "Ban characters", group: "Characters", description: "Prevent a player playing a character." },

  "scenario.create": { label: "Create scenarios", group: "Scenarios", description: "Author new starting conditions." },
  "scenario.edit": { label: "Edit scenarios", group: "Scenarios", description: "Rewrite built-in scenario data live." },
  "scenario.delete": { label: "Delete scenarios", group: "Scenarios", description: "Remove a scenario." },

  "rules.manage": { label: "Manage rules", group: "Developer", description: "Author and enable automatic world rules." },
  "dev.console": { label: "Developer console", group: "Developer", description: "Run arbitrary console commands against a world." },
  "dev.worldedit": { label: "Edit the world", group: "Developer", description: "Full read-write access to every simulation variable." },
  "dev.directives": { label: "Live directives", group: "Developer", description: "Pin values that persist every tick." },

  "moderation.ban": { label: "Ban users", group: "Moderation", description: "Ban an account from the site." },
  "moderation.kick": { label: "Kick users", group: "Moderation", description: "Disconnect and strip a role mid-session." },
  "moderation.mute": { label: "Mute users", group: "Moderation", description: "Silence an account in chat." },
  "moderation.warn": { label: "Warn users", group: "Moderation", description: "Issue a formal warning." },

  "admin.impersonate": { label: "Impersonate", group: "Administration", description: "Act as another user's account." },
  "admin.webhook": { label: "Send webhooks", group: "Administration", description: "Post moderation messages to Discord." },
};

/** Baseline capability grants by staff role. */
export const ROLE_CAPABILITIES: Record<StaffRole, Capability[]> = {
  player: ["world.play", "economy.trade", "economy.invest", "politics.vote", "politics.legislate", "politics.campaign", "politics.appoint", "character.create"],
  moderator: ["world.play", "economy.trade", "economy.invest", "politics.vote", "politics.legislate", "politics.campaign", "politics.appoint", "character.create", "moderation.warn", "moderation.mute"],
  developer: [
    "world.play", "world.create", "economy.trade", "economy.invest", "economy.ledger",
    "politics.vote", "politics.legislate", "politics.campaign", "politics.appoint",
    "diplomacy.treaty", "military.command", "character.create",
    "scenario.create", "scenario.edit", "rules.manage", "dev.console", "dev.worldedit", "dev.directives",
    "moderation.warn",
  ],
  owner: ALL_CAPABILITIES,
};

export function capabilitiesFor(role: StaffRole, extra: Capability[] = []): Capability[] {
  const base = new Set(ROLE_CAPABILITIES[role] ?? ROLE_CAPABILITIES.player);
  for (const c of extra) if (ALL_CAPABILITIES.includes(c)) base.add(c);
  return [...base];
}

export function has(user: { capabilities?: Capability[] } | null | undefined, cap: Capability): boolean {
  return Boolean(user?.capabilities?.includes(cap));
}

export function requireCapability(user: User | null, cap: Capability): void {
  if (!user) throw new AuthError("Not signed in", 401);
  if (user.bannedUntil && user.bannedUntil > Date.now()) throw new AuthError(`Suspended until ${new Date(user.bannedUntil).toISOString()}`, 403);
  if (!user.capabilities.includes(cap)) throw new AuthError(`Missing capability: ${cap}`, 403);
}

export class AuthError extends Error {
  constructor(message: string, public status = 401) {
    super(message);
    this.name = "AuthError";
  }
}

export function isStaff(role: StaffRole): boolean {
  return role === "moderator" || role === "developer" || role === "owner";
}
export function isDev(role: StaffRole): boolean {
  return role === "developer" || role === "owner";
}