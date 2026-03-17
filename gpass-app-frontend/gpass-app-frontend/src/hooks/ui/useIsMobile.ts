// Igazi érintőképernyős eszközt detektál, nem csak képernyőméretet.
// navigator.maxTouchPoints > 0 iPhone/Android-on true, asztali gépen false.
export function useIsMobile(): boolean {
  return typeof navigator !== "undefined" && navigator.maxTouchPoints > 0
}
