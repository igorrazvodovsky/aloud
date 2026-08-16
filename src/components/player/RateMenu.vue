<script setup lang="ts">
import { useId } from "vue";
import { useLibrary } from "@/stores/library";

const library = useLibrary();
const panelId = useId();

const RATES = [0.75, 1, 1.25, 1.5, 1.75, 2] as const;

function select(rate: number) {
  library.setRate(rate);
  document.getElementById(panelId)?.hidePopover();
}
</script>

<template>
  <div class="rate">
    <button
      type="button"
      class="text-button rate__trigger tabular"
      :popovertarget="panelId"
      aria-label="Playback speed"
    >
      {{ library.rate }}×
    </button>

    <div :id="panelId" popover="auto" class="rate__panel">
      <button
        v-for="rate in RATES"
        :key="rate"
        type="button"
        class="rate__option tabular"
        :aria-pressed="rate === library.rate"
        @click="select(rate)"
      >
        {{ rate }}×
      </button>
    </div>
  </div>
</template>

<style scoped>
.rate {
  display: inline-block;
  position: relative;
}

.rate__trigger {
  anchor-name: --rate-anchor;
}

.rate__panel {
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
  position-anchor: --rate-anchor;
  position-area: block-start span-inline-end;
  position-try-fallbacks: flip-block, flip-inline;
  inset: auto;
  margin-block-end: 0.5rem;
}

/* Without anchor positioning the panel would land at its static position, so
   place it against the trigger's own containing block instead. */
@supports not (anchor-name: --probe) {
  .rate__panel {
    inset-block-end: 100%;
    inset-inline-end: 0;
  }
}

.rate__panel:not(:popover-open) {
  display: none;
}

.rate__option {
  padding: 0.5rem 1.5rem;
  border-radius: 0.35rem;
  text-align: center;
  transition: background-color 0.15s ease;
}

.rate__option:hover {
  background: color-mix(in srgb, var(--ink) 7%, transparent);
}

.rate__option[aria-pressed="true"] {
  background: var(--brand);
  color: var(--on-brand);
  font-weight: 600;
}
</style>
