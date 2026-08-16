import { computed, ref, watch, type InjectionKey, type Ref } from "vue";
import { useLibrary } from "@/stores/library";

export const SKIP_SECONDS = 15;

/**
 * Drives a real `<audio>` element from the library store.
 *
 * The element is owned by the template rather than constructed with `new Audio()`,
 * which is what makes `buffered`, `timeupdate` and `preservesPitch` available.
 */
export function usePlayer(el: Ref<HTMLAudioElement | null>) {
  const library = useLibrary();

  const playing = ref(false);
  const canPlay = ref(false);
  const duration = ref(0);
  const buffered = ref(0);
  const audioError = ref<string | null>(null);

  /**
   * Carries "keep playing" across a chapter boundary.
   *
   * The element fires `pause` *before* `ended`, so by the time `onEnded` runs
   * `playing` has already been cleared — the intent has to be explicit rather
   * than inferred from the flag.
   */
  let resumeOnLoad = false;

  /** Non-null while the listener is dragging the scrubber. */
  const scrubbing = ref<number | null>(null);
  /** Net seconds skipped in the current burst, for the transient readout. */
  const skipped = ref(0);
  let skipResetTimer: ReturnType<typeof setTimeout> | null = null;

  /** What the progress UI should show: the drag preview when dragging, else real time. */
  const displayTime = computed(() => scrubbing.value ?? library.time);

  const chapterDuration = computed(() =>
    duration.value || (library.currentChapter?.duration ?? 0)
  );

  const hasNext = computed(() => library.chapterIndex < library.chapters.length - 1);
  const hasPrevious = computed(() => library.chapterIndex > 0);

  function describeError(error: MediaError | null): string {
    switch (error?.code) {
      case MediaError.MEDIA_ERR_NETWORK:
        return "The connection dropped while loading this chapter.";
      case MediaError.MEDIA_ERR_DECODE:
        return "This chapter's audio file appears to be damaged.";
      case MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED:
        return "This chapter couldn't be loaded from the Internet Archive.";
      case MediaError.MEDIA_ERR_ABORTED:
        return "Loading this chapter was interrupted.";
      default:
        return "This chapter couldn't be played.";
    }
  }

  function onLoadedMetadata() {
    const audio = el.value;
    if (!audio) return;
    duration.value = audio.duration;
    // Resume where the listener left off, once the element can accept a seek.
    if (library.time > 0 && Math.abs(audio.currentTime - library.time) > 1) {
      audio.currentTime = library.time;
    }
  }

  function onTimeUpdate() {
    const audio = el.value;
    if (!audio || scrubbing.value !== null) return;
    library.setTime(audio.currentTime);
  }

  function onProgress() {
    const audio = el.value;
    if (!audio || audio.buffered.length === 0) return;
    buffered.value = audio.buffered.end(audio.buffered.length - 1);
  }

  function onEnded() {
    if (hasNext.value) {
      resumeOnLoad = true;
      library.setChapter(library.chapterIndex + 1);
    } else {
      playing.value = false;
      library.setTime(0);
    }
  }

  function onError() {
    audioError.value = describeError(el.value?.error ?? null);
    playing.value = false;
    canPlay.value = false;
  }

  async function play() {
    const audio = el.value;
    if (!audio) return;
    try {
      audioError.value = null;
      await audio.play();
      playing.value = true;
    } catch {
      // Autoplay rejection, or a source that never became playable.
      playing.value = false;
    }
  }

  function pause() {
    el.value?.pause();
    playing.value = false;
  }

  function toggle() {
    if (playing.value) pause();
    else void play();
  }

  /** Move to an absolute position within the current chapter. */
  function seek(seconds: number) {
    const audio = el.value;
    if (!audio) return;
    const clamped = Math.min(Math.max(seconds, 0), chapterDuration.value || seconds);
    audio.currentTime = clamped;
    library.setTime(clamped);
  }

  /**
   * Skip forward or back, crossing chapter boundaries.
   *
   * Reads the element's own clock rather than the store's rounded value, so
   * repeated skips don't accumulate error.
   */
  function skip(amount: number) {
    const audio = el.value;
    if (!audio) return;

    const target = audio.currentTime + amount;

    if (target < 0 && hasPrevious.value) {
      const previous = library.chapters[library.chapterIndex - 1];
      library.setChapter(library.chapterIndex - 1, Math.max(previous.duration + target, 0));
    } else if (target > chapterDuration.value && hasNext.value) {
      library.setChapter(library.chapterIndex + 1, target - chapterDuration.value);
    } else {
      seek(target);
    }

    skipped.value += amount;
    if (skipResetTimer) clearTimeout(skipResetTimer);
    skipResetTimer = setTimeout(() => {
      skipped.value = 0;
    }, 2000);
  }

  function goToChapter(index: number) {
    if (index === library.chapterIndex) return;
    library.setChapter(index);
  }

  function nextChapter() {
    if (hasNext.value) goToChapter(library.chapterIndex + 1);
  }

  function previousChapter() {
    if (hasPrevious.value) goToChapter(library.chapterIndex - 1);
  }

  /** Scrubber interaction: preview while dragging, commit once on release. */
  function scrubTo(seconds: number) {
    scrubbing.value = seconds;
  }

  function commitScrub() {
    if (scrubbing.value === null) return;
    const target = scrubbing.value;
    scrubbing.value = null;
    seek(target);
  }

  // Loading a new chapter resets the element and resumes if we were playing.
  watch(
    () => library.currentChapter?.url,
    (url) => {
      const audio = el.value;
      if (!audio || !url) return;
      const wasPlaying = playing.value || resumeOnLoad;
      resumeOnLoad = false;
      canPlay.value = false;
      duration.value = 0;
      buffered.value = 0;
      audioError.value = null;
      audio.src = url;
      audio.load();
      if (wasPlaying) void play();
    },
    { immediate: true }
  );

  watch(
    () => library.rate,
    (rate) => {
      const audio = el.value;
      if (!audio) return;
      audio.playbackRate = rate;
      // Keep voices sounding like voices at 1.5×.
      audio.preservesPitch = true;
    },
    { immediate: true }
  );

  return {
    playing,
    canPlay,
    duration,
    chapterDuration,
    buffered,
    audioError,
    displayTime,
    skipped,
    scrubbing,
    hasNext,
    hasPrevious,
    play,
    pause,
    toggle,
    seek,
    skip,
    scrubTo,
    commitScrub,
    goToChapter,
    nextChapter,
    previousChapter,
    onLoadedMetadata,
    onTimeUpdate,
    onProgress,
    onEnded,
    onError,
    onCanPlay: () => {
      canPlay.value = true;
    },
    onWaiting: () => {
      canPlay.value = (el.value?.readyState ?? 0) >= HTMLMediaElement.HAVE_FUTURE_DATA;
    },
    onPlay: () => {
      playing.value = true;
    },
    onPause: () => {
      playing.value = false;
    }
  };
}

export type Player = ReturnType<typeof usePlayer>;

export const playerKey = Symbol("aloud-player") as InjectionKey<Player>;
