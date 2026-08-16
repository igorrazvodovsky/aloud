<script setup lang="ts">
import { inject } from "vue";
import { playerKey } from "@/composables/usePlayer";
import { useLibrary } from "@/stores/library";
import { approximate } from "@/lib/format";

const emit = defineEmits<{ select: [] }>();

const player = inject(playerKey)!;
const library = useLibrary();

function select(index: number) {
  player.goToChapter(index);
  emit("select");
}
</script>

<template>
  <ul class="chapters">
    <li v-for="chapter in library.chapters" :key="chapter.url">
      <button
        type="button"
        class="chapters__item"
        :aria-current="chapter.index === library.chapterIndex ? 'true' : undefined"
        @click="select(chapter.index)"
      >
        <span class="chapters__title">{{ chapter.title }}</span>
        <span v-if="chapter.index > 0" class="chapters__offset muted tabular">
          {{ approximate(library.chapterOffsets[chapter.index]) }}
        </span>
      </button>
    </li>
  </ul>
</template>

<style scoped>
.chapters {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
}

.chapters__item {
  inline-size: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.5rem;
  padding: 0.85rem 1.25rem;
  border-radius: 999px;
  text-align: start;
  transition: background-color 0.15s ease;
}

.chapters__item:hover {
  background: color-mix(in srgb, var(--ink) 5%, transparent);
}

.chapters__item[aria-current="true"] {
  background: color-mix(in srgb, var(--ink) 10%, transparent);
  font-weight: 600;
}

.chapters__offset {
  font-size: var(--step--1);
  white-space: nowrap;
}
</style>
