<template>
  <div class="mx-3">
    <v-card
      v-for="book in books"
      :key="book.id"
      outlined
      tile
      class="mb-3"
      :disabled="book.title == currentBook.title"
      @click.stop="$store.dispatch('setBook', book.title)"
    >
      <v-card-text>
        <div>{{book.author}}</div>
        <p class="headline text--primary mb-0">{{book.title}}</p>
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
        title: "Anna Karenina",
        author: "Leo Tolstoy"
      },
      {
        id: 2,
        title: "Don Quixote",
        author: "Miguel de Cervantes"
      },
      {
        id: 3,
        title: "Moby Dick, or the Whale",
        author: "Herman Melville"
      },
      {
        id: 4,
        title: "Genji Monogatari",
        author: "Murasaki Shikibu"
      },
      {
        id: 5,
        title: "Idiot",
        author: "Fyodor Dostoyevsky"
      },
      {
        id: 6,
        title: "Pride and Prejudice",
        author: "Jane Austen"
      },
      {
        id: 7,
        title: "The Iliad",
        author: "Homer"
      },
      {
        id: 8,
        title: "Alice’s Adventures in Wonderland",
        author: "Lewis Carroll"
      },
      {
        id: 9,
        title: "The Arabian Nights",
        author: "Husain Haddawy & Muhsin Mahdi"
      },
      {
        id: 10,
        title: "The Count of Monte Cristo",
        author: "Alexandre Dumas"
      }
    ]
  }),
  computed: {
    currentBook() {
      return this.$store.state.book;
    }
  }
};
</script>
