<template>
  <div class="bookshelf mx-3">
    <v-card
      v-for="book in books"
      :key="book.id"
      outlined
      tile
      class="mb-3"
      :disabled="book.title == currentBook.title"
      @click.stop="$store.dispatch('setBook', book.archiveOrgId)"
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
    books: [
      {
        id: 1,
        archiveOrgId: "alices_adventures_1003",
        title: "Alice's Adventures in Wonderland",
        author: "Lewis Carroll"
      },
      {
        id: 2,
        archiveOrgId: "adventures_holmes",
        title: "The Adventures of Sherlock Holmes",
        author: "Sir Arthur Conan Doyle"
      },
      {
        id: 3,
        archiveOrgId: "art_of_war_librivox",
        title: "The Art of War",
        author: "Sun Tzu"
      },
      {
        id: 4,
        archiveOrgId: "moby_dick_librivox",
        title: "Moby Dick, or the Whale",
        author: "Herman Melville"
      },
      {
        id: 5,
        archiveOrgId: "pride_and_prejudice_librivox",
        title: "Pride and Prejudice",
        author: "Jane Austen"
      },
      {
        id: 6,
        archiveOrgId: "count_monte_cristo_0711_librivox",
        title: "The Count of Monte Cristo",
        author: "Alexandre Dumas"
      },
      {
        id: 7,
        archiveOrgId: "odyssey_butler_librivox",
        title: "The Odyssey",
        author: "Homer"
      },
      {
        id: 8,
        archiveOrgId: "emma_solo_librivox",
        title: "Emma",
        author: "Jane Austen"
      },
      {
        id: 9,
        archiveOrgId: "treasure_island_ap_librivox",
        title: "Treasure Island",
        author: "Robert Louis Stevenson"
      },
      {
        id: 10,
        archiveOrgId: "great_expectations_mfs_0812_librivox",
        title: "Great Expectations",
        author: "Charles Dickens"
      }
    ]
  }),
  computed: {
    currentBook() {
      return this.$store.state.book.metadata;
    }
  }
};
</script>
