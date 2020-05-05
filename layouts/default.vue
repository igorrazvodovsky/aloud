// TODO: A better way to set a default?

<template>
  <v-app class="player" v-if="bookDataLoaded">
    <player-desktop-view
      v-if="player && !isMobile"
      @open-player="toggleBrowser"
      :closed="browser"
    />
    <player-mobile-view
      v-if="player && isMobile"
      @open-player="toggleBrowser"
      :closed="browser"
    />
    <browser v-if="browse" @open-browser="toggleBrowser" :open="browser" />
  </v-app>
</template>

<script>
import PlayerMobileView from "~/components/player/player-mobile-view.vue";
import PlayerDesktopView from "~/components/player/player-desktop-view.vue";
import Browser from "~/components/browse/browser.vue";
import { mapState, mapMutations } from "vuex";
import axios from "axios";

export default {
  components: {
    Browser,
    PlayerMobileView,
    PlayerDesktopView
  },

  data() {
    return {
      isMobile: false
    };
  },

  computed: {
    ...mapState(["page", "book", "browser"]),
    player() {
      return this.page == "index" || this.page == "browse";
    },
    // TODO: Better name
    browse() {
      return this.page == "index" || this.page == "browse";
    },
    bookDataLoaded() {
      return !this.book.metadata.title == "";
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
    ...mapMutations(["toggleBrowser"]),
    onResize() {
      this.isMobile = window.innerWidth < 600;
    }
  }
};
</script>
