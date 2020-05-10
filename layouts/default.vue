// TODO: A better way to set a default?

<template>
  <v-app class="player" v-if="bookDataLoaded">
    <player-desktop
      v-if="player && $device.isDesktop"
      @open-player="toggleBrowser"
      :closed="browser"
    />
    <player-mobile
      v-if="player && $device.isMobile"
      @open-player="toggleBrowser"
      :closed="browser"
    />
    <!-- <browser v-if="browse" @open-browser="toggleBrowser" :open="browser" /> -->
    <v-card
      class="browse"
      :style="browser ? 'top: 3.25rem' : 'top: calc(100vh - 3.5rem + 1px)'"
      :ripple="false"
    >
      <v-row
        justify="space-between"
        class="pl-4 pr-2 my-3"
        no-gutters
        @click.stop="toggleBrowser"
      >
        <v-col cols="auto">
          <h2 class="headline serif">Bookshelf</h2>
        </v-col>
        <v-col cols="auto"> </v-col>
      </v-row>
      <!-- This component is used only in layouts to display the page components. -->
      <nuxt />
    </v-card>
  </v-app>
</template>

<script>
import PlayerMobile from "~/components/player/player-mobile.vue";
import PlayerDesktop from "~/components/player/player-desktop.vue";
import Browser from "~/components/browse/browser.vue";
import { mapState, mapMutations } from "vuex";
import axios from "axios";

export default {
  components: {
    PlayerMobile,
    PlayerDesktop,
    Browser
  },

  computed: {
    ...mapState(["page", "book", "browser"]),
    player() {
      return this.page == "index" || this.page == "browse";
    },
    bookDataLoaded() {
      return !this.book.metadata.title == "";
    }
  },
  mounted() {
    this.$store.commit("initialiseStore");
    // TODO: A better way to load a default
    // TODO: How to store the list of books?
    if (this.book.metadata.title == "")
      this.$store.dispatch("setBook", "art_of_war_librivox");
  },
  methods: {
    ...mapMutations(["toggleBrowser"])
  }
};
</script>
