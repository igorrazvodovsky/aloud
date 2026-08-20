<script setup lang="ts">
import { inject, ref } from "vue";
import { playerKey, SKIP_SECONDS } from "@/composables/usePlayer";
import { useLibrary } from "@/stores/library";
import ProgressScrubber from "@/components/player/ProgressScrubber.vue";
import PlayPauseButton from "@/components/player/PlayPauseButton.vue";
import ChapterList from "@/components/player/ChapterList.vue";
import RateMenu from "@/components/player/RateMenu.vue";
import SleepMenu from "@/components/player/SleepMenu.vue";
import AppDialog from "@/components/AppDialog.vue";
import AboutPanel from "@/components/AboutPanel.vue";
import IconRewind from "@/components/icons/IconRewind.vue";
import IconForward from "@/components/icons/IconForward.vue";
import IconHelp from "@/components/icons/IconHelp.vue";

const player = inject(playerKey)!;
const library = useLibrary();

const chaptersOpen = ref(false);
const aboutOpen = ref(false);
</script>

<template>
  <section class="desktop" aria-label="Player">
    <header class="desktop__header">
      <ProgressScrubber show-chapter show-remaining />
    </header>

    <div class="desktop__stage">
      <button
        type="button"
        class="desktop__rail desktop__rail--start"
        @click="chaptersOpen = true"
      >
        Table of contents
      </button>

      <PlayPauseButton />

      <button type="button" class="desktop__rail desktop__rail--end" disabled>
        Bookmarks
      </button>
    </div>

    <footer class="desktop__footer">
      <div class="desktop__titles">
        <p class="eyebrow">Listening to</p>
        <h1 class="serif desktop__title">{{ library.title }}</h1>
        <h2 class="serif desktop__author muted">by {{ library.author }}</h2>
      </div>

      <div class="desktop__actions">
        <button
          type="button"
          class="icon-button"
          :aria-label="`Back ${SKIP_SECONDS} seconds`"
          @click="player.skip(-SKIP_SECONDS)"
        >
          <IconRewind />
        </button>
        <button
          type="button"
          class="icon-button"
          :aria-label="`Forward ${SKIP_SECONDS} seconds`"
          @click="player.skip(SKIP_SECONDS)"
        >
          <IconForward />
        </button>
        <RateMenu />
        <SleepMenu />
        <button
          type="button"
          class="icon-button"
          aria-label="About Aloud"
          @click="aboutOpen = true"
        >
          <IconHelp />
        </button>
      </div>
    </footer>

    <AppDialog v-model="chaptersOpen" label="Table of contents" variant="full">
      <div class="desktop__toc">
        <h2 class="eyebrow desktop__toc-heading">Table of contents</h2>
        <ChapterList @select="chaptersOpen = false" />
      </div>
    </AppDialog>

    <AppDialog v-model="aboutOpen" label="About Aloud">
      <AboutPanel />
    </AppDialog>
  </section>
</template>

<style scoped>
.desktop {
  block-size: 100%;
  display: grid;
  grid-template-rows: auto 1fr auto;
  gap: 1rem;
  /* The progress track runs edge to edge; everything else is inset, so the
     padding lives on the sections rather than the container. */
  padding: 0 0 2rem;
  --scrubber-label-inset: var(--gutter);
}

.desktop__stage {
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  justify-items: center;
  padding-inline: 1.5rem;
  /* Optical compensation, as in the original: the stage reads as sitting too
     high when it is centred geometrically between the track and the title. */
  translate: 0 1.5rem;
}

/* The vertical labels flanking the play button. Each reads outward from the
   play button: up the left edge, down the right. */
.desktop__rail {
  writing-mode: vertical-rl;
  font-size: var(--step--1);
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--ink-muted);
  padding: 1rem 0.5rem;
  transition: color 0.2s ease;
}

.desktop__rail--start {
  rotate: 180deg;
}

.desktop__rail:hover:not(:disabled) {
  color: var(--ink);
}

.desktop__footer {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 2rem;
  flex-wrap: wrap;
  padding-inline: var(--gutter);
}

.desktop__titles {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  min-inline-size: 0;
}

.desktop__title {
  font-size: var(--step-5);
  line-height: 1.05;
  text-wrap: balance;
}

.desktop__author {
  font-size: var(--step-4);
  font-weight: 400;
}

.desktop__actions {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.desktop__toc {
  max-inline-size: 38rem;
  margin-inline: auto;
  padding-block-start: 1rem;
}

.desktop__toc-heading {
  text-align: center;
  margin-block-end: 2.5rem;
}
</style>
