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
  /* Layered rather than single, so the falloff stays soft at this size. */
  box-shadow:
    0 2.8px 2.2px rgba(0, 0, 0, 0.02),
    0 6.7px 5.3px rgba(0, 0, 0, 0.028),
    0 12.5px 10px rgba(0, 0, 0, 0.035),
    0 22.3px 17.9px rgba(0, 0, 0, 0.042),
    0 41.8px 33.4px rgba(0, 0, 0, 0.05),
    0 100px 80px rgba(0, 0, 0, 0.07);
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
