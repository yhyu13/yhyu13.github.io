/**
 * Whether the decorative WebGL backdrop is worth its 492 kB.
 *
 * `StageWash` renders a three.js dot matrix at `opacity: .12` behind the
 * gallery. On a phone that is the most expensive layer on the page and the
 * least visible, so it is skipped for:
 *
 *   - coarse pointers (touch),
 *   - the narrow layout, below the 900px detail boundary,
 *   - `prefers-reduced-motion: reduce` (the CSS already hides the element),
 *   - `navigator.connection.saveData`.
 *
 * The desktop visual language above 900px with a fine pointer is unchanged.
 * Kept out of the component so the decision can be asserted in a test without
 * importing three.js.
 */
export function stageWashAllowed(): boolean {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") return false;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
  if (window.matchMedia("(pointer: coarse)").matches) return false;
  if (window.matchMedia("(max-width: 899.98px)").matches) return false;
  const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
  return connection?.saveData !== true;
}

/** The media queries that can flip `stageWashAllowed()`, for change listeners. */
export function stageWashQueries(): MediaQueryList[] {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") return [];
  return [
    window.matchMedia("(prefers-reduced-motion: reduce)"),
    window.matchMedia("(pointer: coarse)"),
    window.matchMedia("(max-width: 899.98px)"),
  ];
}
