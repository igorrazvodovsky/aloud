<script setup lang="ts">
import { inject } from "vue";
import { playerKey } from "@/composables/usePlayer";
import IconPlay from "@/components/icons/IconPlay.vue";
import IconPause from "@/components/icons/IconPause.vue";

const { size = "3.5rem" } = defineProps<{ size?: string }>();

const player = inject(playerKey)!;
</script>

<template>
  <button
    class="playpause"
    type="button"
    :aria-label="player.playing.value ? 'Pause' : 'Play'"
    :aria-busy="!player.canPlay.value"
    @click="player.toggle()"
  >
    <span v-if="!player.canPlay.value" class="playpause__spinner" aria-hidden="true"></span>
    <IconPause v-else-if="player.playing.value" />
    <IconPlay v-else />
  </button>
</template>

<style scoped>
.playpause {
  display: grid;
  place-items: center;
  inline-size: v-bind(size);
  block-size: v-bind(size);
  border-radius: 50%;
  background: var(--brand);
  color: var(--on-brand);
  box-shadow: 0 0.5rem 1.5rem color-mix(in srgb, var(--brand) 30%, transparent);
  transition: scale 0.2s ease, box-shadow 0.2s ease;
}

.playpause:hover {
  scale: 1.04;
}

.playpause:active {
  scale: 0.97;
}

.playpause svg {
  inline-size: 60%;
  block-size: 60%;
}

.playpause__spinner {
  inline-size: 40%;
  block-size: 40%;
  border-radius: 50%;
  border: 2px solid color-mix(in srgb, var(--on-brand) 30%, transparent);
  border-block-start-color: var(--on-brand);
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    rotate: 1turn;
  }
}
</style>
