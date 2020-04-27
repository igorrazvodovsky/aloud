<!-- 1. Checks the book & sets a default -->
<!-- 2. Mobile/desktop components switch -->
<!-- 3. Main view & bottom sheet switch -->

// TODO: A better way to set a default?

<template>
  <v-app class="player" v-if="book.metadata.title !== ''">
    <!-- Player or search -->
    <v-slide-x-reverse-transition leave-absolute hide-on-leave>
      <player-desktop-view
        key="1"
        v-if="player && !isMobile"
        @open-player="browser = false"
        :closed="browser"
      />
      <player-mobile-view
        key="1"
        v-if="player && isMobile"
        @open-player="browser = false"
        :closed="browser"
      />
      <search key="2" v-if="page == 'search'" />
    </v-slide-x-reverse-transition>

    <!-- Browser or search results -->
    <!-- <v-slide-y-reverse-transition>
      <browser key="1" v-if="browse" @open-browser="browser = true" :open="browser" />
      <search-results key="2" v-if="page == 'search'" />
    </v-slide-y-reverse-transition>-->
  </v-app>
</template>

<script>
import PlayerMobileView from "~/components/player/PlayerMobileView.vue";
import PlayerDesktopView from "~/components/player/PlayerDesktopView.vue";
import Search from "~/components/search/Search.vue";
import SearchResults from "~/components/search/SearchResults.vue";
import Browser from "~/components/Browser.vue";
import { mapState } from "vuex";
import axios from "axios";

export default {
  components: {
    Browser,
    PlayerMobileView,
    PlayerDesktopView,
    Search,
    SearchResults
  },

  data() {
    return {
      browser: false,
      isMobile: false
    };
  },

  computed: {
    ...mapState(["page", "book"]),
    player() {
      return this.page == "index" || this.page == "browse";
    },
    browse() {
      return this.page == "index" || this.page == "browse";
    }
  },
  mounted() {
    this.onResize();
    window.addEventListener("resize", this.onResize, { passive: true });

    this.$store.commit("initialiseStore");
    // TODO: A better way to load a default
    // TODO: How to store the list of books?
    if (this.book.metadata.title == "")
      this.$store.dispatch("setBook", "art_of_war_librivox");
  },
  methods: {
    onResize() {
      this.isMobile = window.innerWidth < 600;
    }
  }
};
</script>
