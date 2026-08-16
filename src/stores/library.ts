import { defineStore } from "pinia";
import { computed, ref, watch } from "vue";
import bookshelfData from "@/assets/bookshelf.json";
import {
  ArchiveError,
  fetchItem,
  firstValue,
  toChapters,
  type ArchiveItem,
  type Chapter
} from "@/api/archive";

export interface Book {
  id: string;
  title: string;
  author: string;
}

/** Where the listener left off in a given book. */
export interface Progress {
  chapter: number;
  time: number;
}

type Status = "loading" | "ready" | "error";

const STORAGE_KEY = "aloud";
const STORAGE_VERSION = __APP_VERSION__;
const PERSIST_INTERVAL = 5000;

const bookshelf = bookshelfData as Book[];

/** Only these fields are persisted — never the archive.org response. */
interface PersistedState {
  version: string;
  currentBookId: string;
  rate: number;
  progress: Record<string, Progress>;
}

function readPersisted(): PersistedState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as PersistedState;
    // A version bump invalidates the saved shape rather than the listener's place.
    if (parsed.version !== STORAGE_VERSION) return null;
    return parsed;
  } catch {
    return null;
  }
}

export const useLibrary = defineStore("library", () => {
  const restored = readPersisted();

  const currentBookId = ref(restored?.currentBookId ?? bookshelf[0].id);
  const rate = ref(restored?.rate ?? 1);
  const progress = ref<Record<string, Progress>>(restored?.progress ?? {});

  const item = ref<ArchiveItem | null>(null);
  const status = ref<Status>("loading");
  const error = ref<string | null>(null);

  let inFlight: AbortController | null = null;

  const book = computed<Book>(
    () => bookshelf.find((entry) => entry.id === currentBookId.value) ?? bookshelf[0]
  );

  const chapters = computed<Chapter[]>(() => (item.value ? toChapters(item.value) : []));

  const title = computed(() => (item.value ? item.value.metadata.title : book.value.title));
  const author = computed(() =>
    item.value ? firstValue(item.value.metadata.creator) : book.value.author
  );

  const currentProgress = computed<Progress>(
    () => progress.value[currentBookId.value] ?? { chapter: 0, time: 0 }
  );

  const chapterIndex = computed(() =>
    Math.min(currentProgress.value.chapter, Math.max(chapters.value.length - 1, 0))
  );

  const currentChapter = computed<Chapter | null>(
    () => chapters.value[chapterIndex.value] ?? null
  );

  const time = computed(() => currentProgress.value.time);

  /** Seconds left in the book from the current position. */
  const remaining = computed(() => {
    const chapter = currentChapter.value;
    if (!chapter) return 0;
    const rest = chapters.value
      .slice(chapterIndex.value + 1)
      .reduce((total, next) => total + next.duration, 0);
    return Math.max(chapter.duration - time.value, 0) + rest;
  });

  /** Cumulative offset of each chapter from the start of the book. */
  const chapterOffsets = computed(() => {
    let running = 0;
    return chapters.value.map((chapter) => {
      const offset = running;
      running += chapter.duration;
      return offset;
    });
  });

  function setProgress(next: Partial<Progress>) {
    const id = currentBookId.value;
    progress.value = {
      ...progress.value,
      [id]: { ...currentProgress.value, ...next }
    };
  }

  function setTime(seconds: number) {
    setProgress({ time: Math.max(0, Math.round(seconds)) });
  }

  function setChapter(index: number, seconds = 0) {
    if (index < 0 || index >= chapters.value.length) return;
    setProgress({ chapter: index, time: Math.max(0, Math.round(seconds)) });
  }

  function setRate(next: number) {
    rate.value = next;
  }

  async function load(id: string) {
    inFlight?.abort();
    const controller = new AbortController();
    inFlight = controller;

    status.value = "loading";
    error.value = null;

    try {
      const fetched = await fetchItem(id, controller.signal);
      if (controller.signal.aborted) return;
      item.value = fetched;
      status.value = "ready";
    } catch (cause) {
      if (cause instanceof DOMException && cause.name === "AbortError") return;
      item.value = null;
      status.value = "error";
      error.value =
        cause instanceof ArchiveError ? cause.message : "Something went wrong loading this book.";
    } finally {
      if (inFlight === controller) inFlight = null;
    }
  }

  function selectBook(id: string) {
    if (id === currentBookId.value) return;
    currentBookId.value = id;
    void load(id);
  }

  function retry() {
    void load(currentBookId.value);
  }

  // Persist a small, throttled slice. The previous implementation wrote the
  // entire state — including the archive.org response — on every mutation,
  // which during playback meant a six-figure JSON string once a second.
  let pending: ReturnType<typeof setTimeout> | null = null;

  function flush() {
    pending = null;
    const snapshot: PersistedState = {
      version: STORAGE_VERSION,
      currentBookId: currentBookId.value,
      rate: rate.value,
      progress: progress.value
    };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot));
    } catch {
      // A full or unavailable quota must never interrupt playback.
    }
  }

  watch([currentBookId, rate, progress], () => {
    if (pending) return;
    pending = setTimeout(flush, PERSIST_INTERVAL);
  });

  // Trailing writes would otherwise be lost when the tab is backgrounded or closed.
  if (typeof document !== "undefined") {
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "hidden") flush();
    });
    window.addEventListener("pagehide", flush);
  }

  return {
    bookshelf,
    currentBookId,
    book,
    item,
    status,
    error,
    chapters,
    chapterIndex,
    currentChapter,
    chapterOffsets,
    time,
    rate,
    title,
    author,
    remaining,
    load,
    selectBook,
    retry,
    setChapter,
    setTime,
    setRate
  };
});
