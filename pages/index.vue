<template>
  <div class="bookshelf mx-3">
    <v-card
      v-for="book in books"
      :key="book.archiveOrgId"
      outlined
      tile
      class="mb-3"
      :disabled="book.title == currentBook.title"
      @click.stop="changeBook(book.archiveOrgId)"
    >
      <v-card-text>
        <div class="overline">{{book.author}}</div>
        <p class="display-1 serif text--primary mb-0">{{book.title}}</p>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
export default {
  data: () => ({
    // TODO: How to store this better?
    // TODO: Store the progress within each book
    // TODO: How about storing a regex for each book to format chapter names?
    books: [
      {
        archiveOrgId: "alices_adventures_1003",
        title: "Alice's Adventures in Wonderland",
        author: "Lewis Carroll",
        currentChapter: 0
      },
      {
        archiveOrgId: "adventures_holmes",
        title: "The Adventures of Sherlock Holmes",
        author: "Sir Arthur Conan Doyle",
        currentChapter: 0
      },
      {
        archiveOrgId: "art_of_war_librivox",
        title: "The Art of War",
        author: "Sun Tzu",
        currentChapter: 0
      },
      {
        archiveOrgId: "moby_dick_librivox",
        title: "Moby Dick, or the Whale",
        author: "Herman Melville",
        currentChapter: 0
      },
      {
        archiveOrgId: "pride_and_prejudice_librivox",
        title: "Pride and Prejudice",
        author: "Jane Austen",
        currentChapter: 0
      },
      {
        archiveOrgId: "count_monte_cristo_0711_librivox",
        title: "The Count of Monte Cristo",
        author: "Alexandre Dumas",
        currentChapter: 0
      },
      {
        archiveOrgId: "odyssey_butler_librivox",
        title: "The Odyssey",
        author: "Homer",
        currentChapter: 0
      },
      {
        archiveOrgId: "emma_solo_librivox",
        title: "Emma",
        author: "Jane Austen",
        currentChapter: 0
      },
      {
        archiveOrgId: "treasure_island_ap_librivox",
        title: "Treasure Island",
        author: "Robert Louis Stevenson",
        currentChapter: 0
      },
      {
        archiveOrgId: "great_expectations_mfs_0812_librivox",
        title: "Great Expectations",
        author: "Charles Dickens",
        currentChapter: 0
      },
      {
        archiveOrgId: "essays_book1_1204_librivox",
        title: "Essays, Book 1",
        author: "Michel de Montaigne",
        currentChapter: 0
      },
      {
        archiveOrgId: "essays_book2_1301_librivox",
        title: "Essays, Book 2",
        author: "Michel de Montaigne",
        currentChapter: 0
      },
      {
        archiveOrgId: "essays_book1_1306_librivox",
        title: "Essays, Book 3",
        author: "Michel de Montaigne",
        currentChapter: 0
      },
      {
        archiveOrgId: "dubliners_0906_librivox",
        title: "Dubliners",
        author: "James Joyce",
        currentChapter: 0
      },
      {
        archiveOrgId: "swannsway_1406_librivox",
        title: "Swann's Way",
        author: "Marcel Proust",
        currentChapter: 0
      }
    ]
  }),
  computed: {
    currentBook() {
      return this.$store.state.book.metadata;
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
