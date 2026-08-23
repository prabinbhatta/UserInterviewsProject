// Supabase's generated types for an embedded to-one relation are ambiguous
// without a generated Database type (it infers T | T[]), even though
// PostgREST always returns a single object for a real to-one FK. This just
// normalizes that at the call site instead of repeating the cast everywhere.
export function one<T>(value: T | T[] | null | undefined): T | null {
  if (!value) return null;
  return Array.isArray(value) ? (value[0] ?? null) : value;
}
