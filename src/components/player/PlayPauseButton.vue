<script setup lang="ts">
import { inject } from "vue";
import { playerKey } from "@/composables/usePlayer";
import IconPlay from "@/components/icons/IconPlay.vue";
import IconPause from "@/components/icons/IconPause.vue";

const { size = "25vmin" } = defineProps<{ size?: string }>();

const player = inject(playerKey)!;
</script>

<template>
  <button
    class="playpause"
    :class="{ 'playpause--loading': !player.canPlay.value }"
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
  background: var(--play);
  color: var(--on-play);
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
}

/* The icon fills the button: the glyph occupies about a fifth of its own
   viewBox, which is what sets the triangle's size on screen. */
.playpause svg {
  inline-size: 100%;
  block-size: 100%;
}

.playpause:active {
  transform: scale(0.97);
}

.playpause--loading {
  box-shadow: none;
  transform: scale(0.75);
}

.playpause__spinner {
  inline-size: 20%;
  block-size: 20%;
  border-radius: 50%;
  border: 2px solid color-mix(in srgb, var(--on-play) 30%, transparent);
  border-block-start-color: var(--on-play);
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    rotate: 1turn;
  }
}
</style>
