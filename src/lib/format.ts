/** "13:07" or "1:02:33" — the scrubber and chapter list readouts. */
export function clock(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const total = Math.round(seconds);
  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const secs = total % 60;
  const paddedSecs = String(secs).padStart(2, "0");
  if (hours > 0) return `${hours}:${String(minutes).padStart(2, "0")}:${paddedSecs}`;
  return `${minutes}:${paddedSecs}`;
}

/** "2 hr 42 min" — approximate durations in prose. */
export function approximate(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds <= 0) return "0 min";
  const total = Math.round(seconds);
  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  if (hours > 0) return `${hours} hr ${minutes} min`;
  return `${minutes} min`;
}

/** "+0:15" / "−0:30" — the transient skip readout on the scrubber thumb. */
export function signedClock(seconds: number): string {
  const sign = seconds < 0 ? "−" : "+";
  return `${sign}${clock(Math.abs(seconds))}`;
}
