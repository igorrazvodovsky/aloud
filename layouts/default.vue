<template>
  <v-app class="player">
    <!-- <player-main preload positionSec="300" :sources="audioSources" :closed="browserOpen" v-on:open-player="browserOpen = false" /> -->
    <player v-on:open-player="browserOpen = false" :closed="browserOpen"/>
    <browser v-on:open-browse="browserOpen = true" :open="browserOpen" />
  </v-app>
</template>

<script>
import Player from '~/components/Player.vue'
import PlayerMain from '~/components/PlayerMain.vue'
import Browser from '~/components/Browser.vue'
export default {
  components: {
    PlayerMain,
    Browser,
    Player
  },
  data() {
    return {
      browserOpen: false,
      audioSources: [
          "/northangerabbey_02_austen_64kb.mp3"
        ]
    };
  },
};
</script>
