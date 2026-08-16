import { onScopeDispose } from "vue";
import { SKIP_SECONDS, type Player } from "@/composables/usePlayer";

/** True when the keystroke belongs to whatever the listener is typing in. */
function isEditing(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  if (target.isContentEditable) return true;
  return ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName);
}

/**
 * Global playback shortcuts.
 *
 * Unlike the previous implementation these ignore keystrokes aimed at form
 * controls, and only call `preventDefault` for a key they actually handle.
 */
export function useKeyboardShortcuts(player: Player) {
  function onKeyDown(event: KeyboardEvent) {
    if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.altKey) return;
    if (isEditing(event.target)) return;

    switch (event.code) {
      case "Space":
        event.preventDefault();
        player.toggle();
        break;
      case "ArrowLeft":
        event.preventDefault();
        player.skip(-SKIP_SECONDS);
        break;
      case "ArrowRight":
        event.preventDefault();
        player.skip(SKIP_SECONDS);
        break;
      default:
    }
  }

  window.addEventListener("keydown", onKeyDown);
  onScopeDispose(() => window.removeEventListener("keydown", onKeyDown));
}
