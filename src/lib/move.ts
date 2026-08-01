/** Return a copy of `list` with the item at `from` moved to index `to`. */
export function move<T>(list: T[], from: number, to: number): T[] {
  const next = [...list]
  next.splice(to, 0, ...next.splice(from, 1))
  return next
}
