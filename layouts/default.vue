<template>
  <v-app class="player">
    <v-slide-x-reverse-transition leave-absolute hide-on-leave>
      <player key="1" v-if="player" v-on:open-player="browser = false" :closed="browser" />
      <search key="2" v-if="page == 'search'" />
    </v-slide-x-reverse-transition>
    <v-slide-y-reverse-transition>
      <browser key="1" v-if="browse" v-on:open-browser="browser = true" :open="browser" />
      <search-results key="2" v-if="page == 'search'" />
    </v-slide-y-reverse-transition>
  </v-app>
</template>

<script>
import Player from "~/components/Player.vue";
import Search from "~/components/Search.vue";
import SearchResults from "~/components/SearchResults.vue";
import PlayerMain from "~/components/PlayerMain.vue";
import Browser from "~/components/Browser.vue";
import { mapState } from "vuex";

export default {
  components: {
    PlayerMain,
    Browser,
    Player,
    Search,
    SearchResults
  },
  data() {
    return {
      browser: false,
      audioSources: ["/northangerabbey_02_austen_64kb.mp3"]
    };
  },
  computed: {
    ...mapState(["page"]),
    player() {
      return this.page == "index" || this.page == "browse";
    },
    browse() {
      return this.page == "index" || this.page == "browse";
    }
  }
};
</script>
