<script setup lang="ts">
import { inject, ref } from "vue";
import { playerKey, SKIP_SECONDS } from "@/composables/usePlayer";
import { useLibrary } from "@/stores/library";
import ProgressScrubber from "@/components/player/ProgressScrubber.vue";
import PlayPauseButton from "@/components/player/PlayPauseButton.vue";
import ChapterList from "@/components/player/ChapterList.vue";
import RateMenu from "@/components/player/RateMenu.vue";
import IconRewind from "@/components/icons/IconRewind.vue";
import IconForward from "@/components/icons/IconForward.vue";
import IconList from "@/components/icons/IconList.vue";
import IconClose from "@/components/icons/IconClose.vue";
import IconPlayCircle from "@/components/icons/IconPlayCircle.vue";
import IconPauseCircle from "@/components/icons/IconPauseCircle.vue";

const { collapsed = false } = defineProps<{ collapsed?: boolean }>();
const emit = defineEmits<{ expand: [] }>();

const player = inject(playerKey)!;
const library = useLibrary();

const chaptersOpen = ref(false);
</script>

<template>
  <section class="mobile" aria-label="Player">
    <!-- Collapsed: the mini player that peeks above the bookshelf sheet.
         Two sibling buttons rather than one nested in the other, which would
         be invalid markup and unusable from the keyboard. -->
    <div v-if="collapsed" class="mobile__mini">
      <button
        type="button"
        class="mobile__mini-toggle"
        :aria-label="player.playing.value ? 'Pause' : 'Play'"
        @click="player.toggle()"
      >
        <IconPauseCircle v-if="player.playing.value" />
        <IconPlayCircle v-else />
      </button>
      <button type="button" class="mobile__mini-text" @click="emit('expand')">
        {{ library.title }}
        <span aria-hidden="true">•</span>
        Ch. {{ library.chapterIndex + 1 }}
      </button>
    </div>

    <template v-else>
      <header class="mobile__header">
        <div class="mobile__titles">
          <p class="eyebrow">Listening to</p>
          <h1 class="serif mobile__title">{{ library.title }}</h1>
          <p v-if="!chaptersOpen" class="muted mobile__chapter">
            {{ library.currentChapter?.title }}
          </p>
        </div>
        <button
          type="button"
          class="icon-button"
          :aria-label="chaptersOpen ? 'Close table of contents' : 'Table of contents'"
          :aria-expanded="chaptersOpen"
          @click="chaptersOpen = !chaptersOpen"
        >
          <IconClose v-if="chaptersOpen" />
          <IconList v-else />
        </button>
      </header>

      <div v-if="chaptersOpen" class="mobile__chapters">
        <ChapterList @select="chaptersOpen = false" />
      </div>

      <div v-else class="mobile__body">
        <ProgressScrubber />

        <div class="mobile__transport">
          <button
            type="button"
            class="icon-button"
            :aria-label="`Back ${SKIP_SECONDS} seconds`"
            @click="player.skip(-SKIP_SECONDS)"
          >
            <IconRewind />
          </button>
          <PlayPauseButton />
          <button
            type="button"
            class="icon-button"
            :aria-label="`Forward ${SKIP_SECONDS} seconds`"
            @click="player.skip(SKIP_SECONDS)"
          >
            <IconForward />
          </button>
        </div>

        <div class="mobile__options">
          <RateMenu />
        </div>
      </div>
    </template>
  </section>
</template>

<style scoped>
.mobile {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-block-size: 0;
  padding-inline: var(--gutter);
}

.mobile__mini {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  inline-size: 100%;
  padding-block: 0.5rem;
  text-align: start;
}

.mobile__mini-toggle {
  display: grid;
  place-items: center;
  inline-size: 2.25rem;
  block-size: 2.25rem;
  flex: none;
  color: var(--ink-muted);
  cursor: pointer;
}

.mobile__mini-toggle svg {
  inline-size: 1.75rem;
  block-size: 1.75rem;
}

.mobile__mini-text {
  flex: 1;
  min-inline-size: 0;
  font-size: 0.875rem;
  text-align: start;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.mobile__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  padding-block: 0.75rem;
}

.mobile__titles {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
  min-inline-size: 0;
}

.mobile__title {
  font-size: var(--step-2);
  line-height: 1.15;
  text-wrap: balance;
}

.mobile__chapter {
  font-size: var(--step-0);
}

.mobile__chapters {
  overflow-y: auto;
  min-block-size: 0;
  padding-block-end: 1rem;
}

.mobile__body {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-block-size: 0;
  gap: 1rem;
}

.mobile__transport {
  display: flex;
  align-items: center;
  justify-content: space-around;
  flex: 1;
}

.mobile__options {
  display: flex;
  justify-content: center;
  padding-block-end: 1.5rem;
}
</style>
