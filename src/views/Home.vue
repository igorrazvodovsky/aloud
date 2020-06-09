<template>
  <div class="bookshelf px-2">
    <v-card
      v-for="book in bookshelf"
      :key="book.id"
      outlined
      tile
      class="mb-3"
      :disabled="book.id == currentBook.id"
      @click.stop="changeBook(book.id)"
    >
      <v-card-text>
        <div class="overline">{{ book.author }}</div>
        <p class="display-1 serif text--primary mb-0">{{ book.title }}</p>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";

export default {
  computed: {
    ...mapState(["currentBook", "bookshelf", "isMobile"])
  },
  methods: {
    ...mapMutations(["saveBookProgress", "setNewBook", "toggleBrowser"]),
    changeBook(id) {
      // Save current book's status
      this.saveBookProgress();
      // Set new book
      this.setNewBook(id);
      this.$store.dispatch("fetchBookData", id);
      this.toggleBrowser(false);
      // TODO: Move to seprate function both mobile and desktop behaviour
      if (!this.isMobile) {
        document.documentElement.style.setProperty("--scroll-snap", "none");
        this.$scrollTo("#app", {
          container: "body",
          onDone: function() {
            document.documentElement.style.setProperty(
              "--scroll-snap",
              "y mandatory"
            );
          }
        });
      }
    }
  }
};
</script>
