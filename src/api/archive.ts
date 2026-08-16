/**
 * Typed client for the Internet Archive metadata API.
 *
 * The player depends entirely on the shape of this response, so the parsing
 * lives here as pure functions that can be exercised against a fixture without
 * a browser or a component.
 */

export interface ArchiveFile {
  name: string;
  source: string;
  format: string;
  /** Seconds as a decimal string ("786.96") or "H:MM:SS" / "MM:SS". */
  length?: string;
  title?: string;
  /** "7" or "7/12". */
  track?: string;
}

export interface ArchiveMetadata {
  identifier: string;
  title: string;
  creator?: string | string[];
  description?: string | string[];
}

export interface ArchiveItem {
  metadata: ArchiveMetadata;
  files: ArchiveFile[];
}

export interface Chapter {
  index: number;
  title: string;
  url: string;
  /** Seconds. */
  duration: number;
}

export class ArchiveError extends Error {
  constructor(
    message: string,
    readonly cause?: unknown
  ) {
    super(message);
    this.name = "ArchiveError";
  }
}

const ENDPOINT = "https://archive.org/metadata/";
const DOWNLOAD = "https://archive.org/download/";

/** Archive.org reports duration either as decimal seconds or as a clock string. */
export function parseDuration(value: string | undefined): number {
  if (!value) return 0;
  if (!value.includes(":")) {
    const seconds = Number.parseFloat(value);
    return Number.isFinite(seconds) ? seconds : 0;
  }
  return value
    .split(":")
    .reduce((total, part) => total * 60 + (Number.parseFloat(part) || 0), 0);
}

/** Track numbers arrive as "7" or "7/12"; only the position matters. */
function parseTrack(track: string | undefined): number {
  if (!track) return Number.MAX_SAFE_INTEGER;
  const position = Number.parseInt(track.split("/")[0], 10);
  return Number.isFinite(position) ? position : Number.MAX_SAFE_INTEGER;
}

function isPlayableChapter(file: ArchiveFile): boolean {
  return (
    file.source === "original" &&
    typeof file.format === "string" &&
    file.format.includes("MP3") &&
    !file.format.includes("ZIP") &&
    file.track !== undefined
  );
}

/**
 * Reduce an item to the ordered list of chapters the player can play.
 *
 * The original files carry `length` themselves, so — unlike the previous
 * implementation — this does not cross-reference the `derivative` entries.
 * That lookup was both redundant and unguarded.
 */
export function toChapters(item: ArchiveItem): Chapter[] {
  const identifier = item.metadata.identifier;

  return item.files
    .filter(isPlayableChapter)
    .sort((a, b) => parseTrack(a.track) - parseTrack(b.track))
    .map((file, index) => ({
      index,
      title: file.title ?? file.name,
      url: `${DOWNLOAD}${encodeURIComponent(identifier)}/${encodeURIComponent(file.name)}`,
      duration: parseDuration(file.length)
    }));
}

/** First value of a field the API returns as either a string or an array. */
export function firstValue(field: string | string[] | undefined): string {
  if (Array.isArray(field)) return field[0] ?? "";
  return field ?? "";
}

/**
 * Fetch an item's metadata.
 *
 * Rejects on transport failure, a non-2xx status, or a body that does not carry
 * the fields the player needs — so callers can actually surface the failure.
 * The previous version resolved to `undefined` in every one of those cases.
 */
export async function fetchItem(id: string, signal?: AbortSignal): Promise<ArchiveItem> {
  let response: Response;
  try {
    response = await fetch(ENDPOINT + encodeURIComponent(id), { signal });
  } catch (cause) {
    if (cause instanceof DOMException && cause.name === "AbortError") throw cause;
    throw new ArchiveError("Could not reach the Internet Archive.", cause);
  }

  if (!response.ok) {
    throw new ArchiveError(`The Internet Archive returned ${response.status}.`);
  }

  let payload: unknown;
  try {
    payload = await response.json();
  } catch (cause) {
    throw new ArchiveError("The Internet Archive sent a response we couldn't read.", cause);
  }

  if (!isArchiveItem(payload)) {
    throw new ArchiveError("This book is no longer available from the Internet Archive.");
  }

  return payload;
}

function isArchiveItem(value: unknown): value is ArchiveItem {
  if (typeof value !== "object" || value === null) return false;
  const candidate = value as Partial<ArchiveItem>;
  return (
    Array.isArray(candidate.files) &&
    typeof candidate.metadata === "object" &&
    candidate.metadata !== null &&
    typeof candidate.metadata.identifier === "string"
  );
}
