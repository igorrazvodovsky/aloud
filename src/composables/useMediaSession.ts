import { watchEffect } from "vue";
import { useLibrary } from "@/stores/library";
import { SKIP_SECONDS, type Player } from "@/composables/usePlayer";

/**
 * Publishes what's playing to the OS: lock screen, media keys, headphone
 * buttons, and the notification shade.
 */
export function useMediaSession(player: Player) {
  const library = useLibrary();

  if (!("mediaSession" in navigator)) return;
  const session = navigator.mediaSession;

  session.setActionHandler("play", () => void player.play());
  session.setActionHandler("pause", () => player.pause());
  session.setActionHandler("seekbackward", (details) =>
    player.skip(-(details.seekOffset ?? SKIP_SECONDS))
  );
  session.setActionHandler("seekforward", (details) =>
    player.skip(details.seekOffset ?? SKIP_SECONDS)
  );
  session.setActionHandler("seekto", (details) => {
    if (typeof details.seekTime === "number") player.seek(details.seekTime);
  });
  session.setActionHandler("previoustrack", () => player.previousChapter());
  session.setActionHandler("nexttrack", () => player.nextChapter());

  watchEffect(() => {
    if (!library.currentChapter) return;
    session.metadata = new MediaMetadata({
      title: library.currentChapter.title,
      artist: library.author,
      album: library.title,
      artwork: [
        { src: "img/icons/android-chrome-192x192.png", sizes: "192x192", type: "image/png" },
        { src: "img/icons/android-chrome-512x512.png", sizes: "512x512", type: "image/png" }
      ]
    });
  });

  watchEffect(() => {
    session.playbackState = player.playing.value ? "playing" : "paused";
  });

  watchEffect(() => {
    const duration = player.chapterDuration.value;
    if (!Number.isFinite(duration) || duration <= 0) return;
    try {
      session.setPositionState({
        duration,
        playbackRate: library.rate,
        position: Math.min(library.time, duration)
      });
    } catch {
      // Safari throws if position briefly exceeds duration during a chapter change.
    }
  });
}
