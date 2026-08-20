<script setup lang="ts">
import { computed, inject, useId } from "vue";
import { playerKey, SLEEP_MINUTES, type SleepMode } from "@/composables/usePlayer";
import { clock } from "@/lib/format";
import IconSleep from "@/components/icons/IconSleep.vue";

const player = inject(playerKey)!;
const panelId = useId();

const armed = computed(() => player.sleepMode.value !== null);

/** The trigger carries the timer's state, as the speed menu carries the rate. */
const label = computed(() => {
  if (player.sleepMode.value === "chapter") {
    return "Sleep timer: stopping at the end of this chapter";
  }
  if (armed.value) return `Sleep timer: ${clock(player.sleepRemaining.value)} left`;
  return "Sleep timer";
});

function select(mode: SleepMode) {
  player.setSleep(mode);
  document.getElementById(panelId)?.hidePopover();
}
</script>

<template>
  <div class="sleep">
    <button
      type="button"
      class="sleep__trigger"
      :class="armed ? 'text-button' : 'icon-button'"
      :popovertarget="panelId"
      :aria-label="label"
    >
      <span v-if="armed" class="tabular">{{ clock(player.sleepRemaining.value) }}</span>
      <IconSleep v-else />
    </button>

    <div :id="panelId" popover="auto" class="sleep__panel">
      <button
        type="button"
        class="sleep__option"
        :aria-pressed="player.sleepMode.value === null"
        @click="select(null)"
      >
        Off
      </button>
      <button
        type="button"
        class="sleep__option"
        :aria-pressed="player.sleepMode.value === 'chapter'"
        @click="select('chapter')"
      >
        End of chapter
      </button>
      <button
        v-for="minutes in SLEEP_MINUTES"
        :key="minutes"
        type="button"
        class="sleep__option tabular"
        :aria-pressed="player.sleepMode.value === minutes"
        @click="select(minutes)"
      >
        {{ minutes }} min
      </button>
    </div>
  </div>
</template>

<style scoped>
.sleep {
  display: inline-block;
  position: relative;
}

/* Its own anchor name: `anchor-name` is a document-wide ident, so sharing the
   speed menu's would tether this panel to that button. */
.sleep__trigger {
  anchor-name: --sleep-anchor;
}

.sleep__panel {
  position: absolute;
  margin: 0;
  padding: 0.35rem;
  border: 1px solid var(--rule);
  border-radius: 0.5rem;
  background: var(--raised);
  color: var(--ink);
  box-shadow: 0 0.75rem 2rem color-mix(in srgb, black 22%, transparent);
  display: flex;
  flex-direction: column;
  gap: 0.15rem;

  /* Tether to the trigger, and flip rather than clip at a viewport edge. */
  position-anchor: --sleep-anchor;
  position-area: block-start span-inline-end;
  position-try-fallbacks: flip-block, flip-inline;
  inset: auto;
  margin-block-end: 0.5rem;
}

@supports not (anchor-name: --probe) {
  .sleep__panel {
    inset-block-end: 100%;
    inset-inline-end: 0;
  }
}

.sleep__panel:not(:popover-open) {
  display: none;
}

.sleep__option {
  padding: 0.5rem 1.5rem;
  border-radius: 0.35rem;
  text-align: center;
  white-space: nowrap;
  transition: background-color 0.15s ease;
}

.sleep__option:hover {
  background: color-mix(in srgb, var(--ink) 7%, transparent);
}

.sleep__option[aria-pressed="true"] {
  background: var(--brand);
  color: var(--on-brand);
  font-weight: 600;
}
</style>
