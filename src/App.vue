<script setup lang="ts">
import { computed, provide, ref, watch } from "vue";
import { useLibrary } from "@/stores/library";
import { playerKey, usePlayer } from "@/composables/usePlayer";
import { useMediaSession } from "@/composables/useMediaSession";
import { useMediaQuery } from "@/composables/useMediaQuery";
import { useKeyboardShortcuts } from "@/composables/useKeyboardShortcuts";
import PlayerDesktop from "@/components/player/PlayerDesktop.vue";
import PlayerMobile from "@/components/player/PlayerMobile.vue";
import BookshelfView from "@/views/BookshelfView.vue";

const library = useLibrary();

// One `<audio>` element for the whole app, owned by this template. Both layouts
// are presentational and read the same player through injection.
const audio = ref<HTMLAudioElement | null>(null);
const player = usePlayer(audio);
provide(playerKey, player);

useMediaSession(player);
useKeyboardShortcuts(player);

const isCompact = useMediaQuery("(max-width: 59.99rem)");

/** On compact screens the bookshelf is a sheet that covers the player. */
const sheetOpen = ref(false);
const shelf = ref<HTMLElement | null>(null);

watch(isCompact, () => {
  sheetOpen.value = false;
});

const problem = computed(() => library.error ?? player.audioError.value);

function toggleSheet() {
  if (isCompact.value) {
    sheetOpen.value = !sheetOpen.value;
  } else {
    shelf.value?.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

void library.load(library.currentBookId);
</script>

<template>
  <audio
    ref="audio"
    preload="metadata"
    @loadedmetadata="player.onLoadedMetadata"
    @timeupdate="player.onTimeUpdate"
    @progress="player.onProgress"
    @canplay="player.onCanPlay"
    @waiting="player.onWaiting"
    @play="player.onPlay"
    @pause="player.onPause"
    @ended="player.onEnded"
    @error="player.onError"
  ></audio>

  <div class="app" :class="{ 'app--sheet-open': sheetOpen }">
    <main class="app__player">
      <div v-if="library.status === 'loading'" class="app__status">
        <span class="app__spinner" aria-hidden="true"></span>
        <p class="visually-hidden">Loading book</p>
      </div>

      <div v-else-if="library.status === 'error'" class="app__status app__status--error">
        <p>{{ library.error }}</p>
        <button type="button" class="text-button app__retry" @click="library.retry()">
          Try again
        </button>
      </div>

      <template v-else>
        <PlayerDesktop v-if="!isCompact" />
        <PlayerMobile v-else :collapsed="sheetOpen" @expand="sheetOpen = false" />
      </template>
    </main>

    <section ref="shelf" class="app__shelf" aria-label="Bookshelf">
      <h2 class="serif app__shelf-heading">
        <button type="button" class="app__shelf-toggle" @click="toggleSheet">Bookshelf</button>
      </h2>
      <BookshelfView @select="sheetOpen = false" />
    </section>

    <!-- Non-blocking feedback: never a dialog, never a silent failure. -->
    <div class="app__toast" role="status" aria-live="polite">
      <p v-if="problem && library.status === 'ready'" class="app__toast-message">
        {{ problem }}
      </p>
    </div>
  </div>
</template>

<style scoped>
.app {
  min-block-size: 100dvh;
}

.app__player {
  block-size: 100dvh;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.app__status {
  display: grid;
  place-items: center;
  gap: 1rem;
  block-size: 100%;
  padding: 2rem;
  text-align: center;
}

.app__status--error {
  color: var(--danger);
}

.app__spinner {
  inline-size: 2rem;
  block-size: 2rem;
  border-radius: 50%;
  border: 2px solid var(--rule);
  border-block-start-color: var(--ink-muted);
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    rotate: 1turn;
  }
}

.app__shelf {
  background: var(--raised);
  padding-block-start: 0.5rem;
}

.app__shelf-heading {
  font-size: var(--step-2);
  padding: 0.75rem var(--gutter);
}

.app__shelf-toggle {
  font: inherit;
}

/* Compact: the shelf is a bottom sheet that slides over the player. */
@media (max-width: 59.99rem) {
  .app {
    block-size: 100dvh;
    overflow: hidden;
  }

  .app__player {
    block-size: calc(100dvh - var(--sheet-peek));
  }

  .app__shelf {
    position: fixed;
    inset-inline: 0;
    inset-block: calc(100dvh - var(--sheet-peek)) 0;
    border-start-start-radius: 1rem;
    border-start-end-radius: 1rem;
    box-shadow: 0 -0.5rem 1.5rem color-mix(in srgb, black 12%, transparent);
    overflow-y: auto;
    transition: inset-block-start 0.28s ease;
  }

  .app--sheet-open .app__player {
    block-size: var(--sheet-peek);
  }

  .app--sheet-open .app__shelf {
    inset-block-start: var(--sheet-peek);
  }
}

/* Wide: player and shelf are two snap-aligned full-height sections. */
@media (min-width: 60rem) {
  .app {
    block-size: 100dvh;
    overflow-y: auto;
    scroll-snap-type: y mandatory;
    scrollbar-width: none;
  }

  .app::-webkit-scrollbar {
    inline-size: 0;
  }

  .app__player,
  .app__shelf {
    scroll-snap-align: start;
  }

  /* Let the shelf heading peek, so the section below is discoverable. */
  .app__player {
    block-size: calc(100dvh - var(--sheet-peek));
  }

  /* A definite height, not a minimum: the spines size themselves with
     `height: 100%`, which only resolves against a definite containing block. */
  .app__shelf {
    block-size: 100dvh;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }
}

.app__toast {
  position: fixed;
  inset-block-end: 1rem;
  inset-inline: 0;
  display: flex;
  justify-content: center;
  pointer-events: none;
  z-index: 10;
}

.app__toast-message {
  padding: 0.75rem 1.25rem;
  border-radius: 999px;
  background: var(--danger);
  color: #fff;
  font-size: var(--step--1);
  box-shadow: 0 0.5rem 1.5rem color-mix(in srgb, black 25%, transparent);
}
</style>
