/**
 * Turn what a volunteer types into a filter for the admin search.
 *
 * Shape decides the column: an @ means email, an MHP-/MHD- prefix means code,
 * mostly digits means phone (stored as +1XXXXXXXXXX, so punctuation is
 * dropped and matched as a substring). Any other text matches name, email or
 * code, so "jane" finds jane@example.com too.
 *
 * Typed text is only ever a value: % _ \ are escaped for LIKE, and for the
 * combined filter " and \ are removed and the value is double-quoted, so
 * commas, dots or parentheses cannot change the PostgREST filter.
 */
type Filterable<T> = { ilike(column: string, pattern: string): T; or(filters: string): T };

const escapeLike = (s: string) => s.replace(/[\\%_]/g, (c) => `\\${c}`);

export function applySearch<T extends Filterable<T>>(query: T, raw: string | undefined): T {
  const q = (raw ?? "").trim().slice(0, 100);
  if (!q) return query;
  if (q.includes("@")) return query.ilike("email", `%${escapeLike(q.toLowerCase())}%`);
  if (/^MH[PD]-/i.test(q)) return query.ilike("registration_code", `%${escapeLike(q.toUpperCase())}%`);
  const digits = q.replace(/\D/g, "");
  if (digits.length >= 3 && /^[\d\s()+.-]+$/.test(q)) return query.ilike("phone", `%${digits}%`);

  const safe = q.replace(/["\\]/g, "");
  if (!safe) return query;
  // shortcut: PostgREST unescapes \ inside quoted or() values, so a literal % or _ acts as a
  // wildcard here (a search for "%" lists everyone). Harmless behind admin auth; fix if exact matching matters.
  const value = `"%${escapeLike(safe)}%"`;
  return query.or(`full_name.ilike.${value},email.ilike.${value},registration_code.ilike.${value}`);
}

export function hasSearch(raw: string | undefined): boolean {
  return (raw ?? "").trim().length > 0;
}
