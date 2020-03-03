<template>
  <v-app class="player">
    <v-slide-x-reverse-transition leave-absolute hide-on-leave>
      <player key="1" v-if="page == 'index'" v-on:open-player="browserOpen = false" :closed="browserOpen"/>
      <search key=2 v-if="page == 'search'"/>
    </v-slide-x-reverse-transition>
    <v-slide-y-reverse-transition>
      <browser key="1"  v-if="page == 'index'" v-on:open-browse="browserOpen = true" :open="browserOpen" />
      <search-results key="2"  v-if="page == 'search'" />
    </v-slide-y-reverse-transition>
  </v-app>
</template>

<script>
import Player from '~/components/Player.vue'
import Search from '~/components/Search.vue'
import SearchResults from '~/components/SearchResults.vue'
import PlayerMain from '~/components/PlayerMain.vue'
import Browser from '~/components/Browser.vue'
import { mapState } from 'vuex'

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
      browserOpen: false,
      audioSources: [
          "/northangerabbey_02_austen_64kb.mp3"
        ]
    };
  },
  computed: mapState(['page'])
};
</script>
