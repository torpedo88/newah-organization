/**
 * Events that have a registration flow, keyed by their `events.slug`.
 *
 * Each event's registrations live in their own table because they collect
 * different things (Indra Jatra: donations and guests; Mha Puja: paid
 * tickets), so the admin needs to know which view to render for a slug. An
 * event created in /admin/events without an entry here has no registration
 * form yet, and the admin says so rather than showing an empty table.
 *
 * The slug of an event listed here is also its public /register/<slug> path
 * and the printed QR codes depend on it, so the admin actions refuse to
 * rename or delete these events.
 */
export const EVENT_REGISTRATIONS = {
  mhapuja: { table: "mhapuja_registrations", registerPath: "/register/mhapuja" },
  indrajatra: { table: "registrations", registerPath: "/register/indrajatra" },
} as const;

export type RegistrationSlug = keyof typeof EVENT_REGISTRATIONS;

export function hasRegistrations(slug: string): slug is RegistrationSlug {
  return Object.prototype.hasOwnProperty.call(EVENT_REGISTRATIONS, slug);
}
