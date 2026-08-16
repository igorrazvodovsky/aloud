<script setup lang="ts">
import { useLibrary } from "@/stores/library";

const emit = defineEmits<{ select: [] }>();

const library = useLibrary();

function choose(id: string) {
  library.selectBook(id);
  emit("select");
}
</script>

<template>
  <ul class="shelf">
    <li v-for="book in library.bookshelf" :key="book.id" class="shelf__slot">
      <button
        type="button"
        class="shelf__book"
        :disabled="book.id === library.currentBookId"
        :aria-current="book.id === library.currentBookId ? 'true' : undefined"
        @click="choose(book.id)"
      >
        <span class="shelf__title serif">{{ book.title }}</span>
        <span class="shelf__author eyebrow">{{ book.author }}</span>
      </button>
    </li>
  </ul>
</template>

<style scoped>
.shelf {
  list-style: none;
  margin: 0;
  padding: 0 1rem 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.shelf__book {
  inline-size: 100%;
  display: flex;
  flex-direction: column-reverse;
  align-items: flex-start;
  gap: 0.35rem;
  padding: 1.25rem;
  border: 1px solid var(--rule);
  text-align: start;
  transition: border-color 0.2s ease;
}

.shelf__book:hover:not(:disabled) {
  border-color: var(--ink-muted);
}

.shelf__title {
  font-size: var(--step-3);
  line-height: 1.1;
  text-wrap: balance;
}

/* On a wide screen the shelf becomes a rack of spines.
 *
 * Physical properties from here down: `writing-mode: vertical-rl` swaps the
 * logical axes, so `inline-size` would be the spine's height and `block-size`
 * its width — which reads as a bug even when it isn't. */
@media (min-width: 60rem) {
  .shelf {
    flex: 1;
    flex-direction: row;
    align-items: stretch;
    gap: 1rem;
    min-height: 0;
    padding: 0.5rem 1rem;
    overflow-x: auto;
    overflow-y: hidden;
    scrollbar-width: thin;
  }

  .shelf__slot {
    flex: none;
    height: 100%;
  }

  .shelf__book {
    writing-mode: vertical-rl;
    text-orientation: mixed;
    height: 100%;
    width: auto;
    min-width: 6rem;
    padding: 1.25rem 0.85rem;
    gap: 1.5rem;
    /* In vertical-rl the inline axis runs top-to-bottom, so `row` stacks the
       title above the author down the spine. */
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    transform-origin: left top;
    transition: border-color 0.2s ease, transform 0.3s ease;
  }

  /* The book you're listening to leans out of the rack. */
  .shelf__book:disabled {
    opacity: 0.5;
    transform: rotate(-2deg) translateX(-1rem);
  }

  .shelf__title {
    font-size: var(--step-2);
    text-wrap: initial;
  }

  .shelf__author {
    font-size: 0.6875rem;
  }
}
</style>
