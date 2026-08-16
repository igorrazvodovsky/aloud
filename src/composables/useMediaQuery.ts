import { onScopeDispose, readonly, ref } from "vue";

/** Reactive `matchMedia`, replacing the old resize listener writing to the store. */
export function useMediaQuery(query: string) {
  const list = window.matchMedia(query);
  const matches = ref(list.matches);

  const update = (event: MediaQueryListEvent) => {
    matches.value = event.matches;
  };
  list.addEventListener("change", update);
  onScopeDispose(() => list.removeEventListener("change", update));

  return readonly(matches);
}
