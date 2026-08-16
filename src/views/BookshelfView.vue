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

/* On a wide screen the shelf becomes a row of spines. */
@media (min-width: 60rem) {
  .shelf {
    flex-direction: row;
    align-items: stretch;
    gap: 0.5rem;
    overflow-x: auto;
    padding-block-end: 2rem;
    scrollbar-width: thin;
  }

  .shelf__slot {
    flex: none;
  }

  .shelf__book {
    block-size: 100%;
    min-block-size: 24rem;
    inline-size: auto;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    gap: 2rem;
    padding: 1.5rem 0.75rem;
    writing-mode: vertical-rl;
  }

  .shelf__title {
    font-size: var(--step-2);
  }

  .shelf__author {
    font-size: 0.6875rem;
  }
}
</style>
