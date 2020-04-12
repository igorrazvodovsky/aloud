<template>
  <!-- TODO: Add book loading progress?-->
  <v-app class="player" v-if="book">
    <!-- Player or search -->
    <v-slide-x-reverse-transition leave-absolute hide-on-leave>
      <player key="1" v-if="player" @open-player="browser = false" :closed="browser" />
      <search key="2" v-if="page == 'search'" />
    </v-slide-x-reverse-transition>
    <!-- Browser or search results -->
    <v-slide-y-reverse-transition>
      <browser key="1" v-if="browse" @open-browser="browser = true" :open="browser" />
      <search-results key="2" v-if="page == 'search'" />
    </v-slide-y-reverse-transition>
  </v-app>
</template>

<script>
import Player from "~/components/player/Player.vue";
import Search from "~/components/search/Search.vue";
import SearchResults from "~/components/search/SearchResults.vue";
import Browser from "~/components/Browser.vue";
import { mapState } from "vuex";
import axios from "axios";

export default {
  components: {
    Browser,
    Player,
    Search,
    SearchResults
  },
  data() {
    return {
      browser: false
    };
  },
  computed: {
    ...mapState(["page"]),
    player() {
      return this.page == "index" || this.page == "browse";
    },
    browse() {
      return this.page == "index" || this.page == "browse";
    },
    book() {
      return this.$store.state.book;
    }
  },
  mounted() {
    this.$store.commit("initialiseStore");
    // TODO: A better way to load a default
    // TODO: How to store the list of books?
    if (this.$store.book) this.$store.dispatch("setBook", "Anna Karenina");
  }
};
</script>
