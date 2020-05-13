<template>
  <div class="bookshelf px-2">
    <v-card
      v-for="book in bookshelf"
      :key="book.archiveOrgId"
      outlined
      tile
      class="mb-3"
      :disabled="book.title == currentBook.title"
      @click.stop="changeBook(book.archiveOrgId)"
    >
      <v-card-text>
        <div class="overline">{{ book.author }}</div>
        <p class="display-1 serif text--primary mb-0">{{ book.title }}</p>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
export default {
  computed: {
    currentBook() {
      return this.$store.state.book.metadata;
    },
    bookshelf() {
      return this.$store.state.bookshelf;
    }
  },
  methods: {
    changeBook(bookId) {
      this.$store.dispatch("setBook", bookId);
      this.$store.commit("toggleBrowser");
    }
  }
};
</script>
