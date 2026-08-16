<script setup lang="ts">
import { computed, inject } from "vue";
import { playerKey } from "@/composables/usePlayer";
import { useLibrary } from "@/stores/library";
import { approximate, clock, signedClock } from "@/lib/format";

const { showChapter = false, showRemaining = false } = defineProps<{
  showChapter?: boolean;
  showRemaining?: boolean;
}>();

const player = inject(playerKey)!;
const library = useLibrary();

const max = computed(() => Math.max(Math.round(player.chapterDuration.value), 1));
const value = computed(() => Math.min(Math.round(player.displayTime.value), max.value));

/** Fraction played and fraction buffered, handed to CSS as percentages. */
const playedPercent = computed(() => `${(value.value / max.value) * 100}%`);
const bufferedPercent = computed(
  () => `${Math.min(player.buffered.value / max.value, 1) * 100}%`
);

/**
 * `input` fires continuously while dragging, `change` once on release.
 * Only the release commits a seek — dragging merely previews, which is what
 * keeps a drag across the bar from firing a seek per pixel.
 */
function onInput(event: Event) {
  player.scrubTo(Number((event.target as HTMLInputElement).value));
}

function onChange() {
  player.commitScrub();
}
</script>

<template>
  <div class="scrubber">
    <div class="scrubber__track">
      <div class="scrubber__buffered" aria-hidden="true"></div>
      <div class="scrubber__played" aria-hidden="true"></div>
      <input
        class="scrubber__input"
        type="range"
        min="0"
        :max="max"
        :value="value"
        step="1"
        aria-label="Position in chapter"
        :aria-valuetext="`${clock(value)} of ${clock(max)}`"
        @input="onInput"
        @change="onChange"
      />
      <output v-if="player.skipped.value !== 0" class="scrubber__skip tabular">
        {{ signedClock(player.skipped.value) }}
      </output>
    </div>

    <div class="scrubber__labels">
      <div>
        <div class="tabular">{{ clock(value) }}</div>
        <div v-if="showChapter" class="muted">{{ library.currentChapter?.title }}</div>
      </div>
      <div class="scrubber__labels-end">
        <div class="tabular">{{ clock(max) }}</div>
        <div v-if="showRemaining" class="muted">{{ approximate(library.remaining) }} left</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.scrubber {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.scrubber__track {
  position: relative;
  block-size: 2px;
  background: var(--rule);
}

.scrubber__buffered,
.scrubber__played {
  position: absolute;
  inset-block: 0;
  inset-inline-start: 0;
  pointer-events: none;
}

.scrubber__buffered {
  inline-size: v-bind(bufferedPercent);
  background: color-mix(in srgb, var(--ink) 20%, transparent);
}

.scrubber__played {
  inline-size: v-bind(playedPercent);
  background: var(--brand);
}

/* The native input is the control; the bars above are its skin. */
.scrubber__input {
  position: absolute;
  inset-block: -0.75rem;
  inset-inline: 0;
  inline-size: 100%;
  margin: 0;
  appearance: none;
  background: transparent;
  cursor: pointer;
}

.scrubber__input::-webkit-slider-thumb {
  appearance: none;
  inline-size: 0.75rem;
  block-size: 0.75rem;
  border-radius: 50%;
  border: 0;
  background: var(--brand);
  transition: transform 0.15s ease;
}

.scrubber__input::-moz-range-thumb {
  inline-size: 0.75rem;
  block-size: 0.75rem;
  border-radius: 50%;
  border: 0;
  background: var(--brand);
  transition: transform 0.15s ease;
}

.scrubber__input:hover::-webkit-slider-thumb,
.scrubber__input:active::-webkit-slider-thumb {
  transform: scale(1.3);
}

.scrubber__input:hover::-moz-range-thumb,
.scrubber__input:active::-moz-range-thumb {
  transform: scale(1.3);
}

/* Below the track, not above: the scrubber sits at the top of both layouts,
   so a readout above it would be clipped by the viewport edge. */
.scrubber__skip {
  position: absolute;
  inset-block-start: 1rem;
  inset-inline-start: clamp(2rem, v-bind(playedPercent), calc(100% - 2rem));
  translate: -50% 0;
  z-index: 1;
  padding: 0.15rem 0.5rem;
  border-radius: 999px;
  background: var(--brand);
  color: var(--on-brand);
  font-size: var(--step--1);
  font-weight: 600;
  white-space: nowrap;
}

.scrubber__labels {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  font-size: var(--step--1);
}

.scrubber__labels-end {
  text-align: end;
}
</style>
