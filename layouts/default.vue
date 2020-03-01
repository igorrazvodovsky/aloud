<template>
  <v-app class="player">
    <player-main :closed="browserOpen" v-on:open-player="browserOpen = false" />
    <browser v-on:open-browse="browserOpen = true" :open="browserOpen" />
  </v-app>
</template>

<script>
import PlayerMain from '~/components/PlayerMain.vue'
import Browser from '~/components/Browser.vue'
export default {
  components: {
    PlayerMain,
    Browser
  },
  data() {
    return {
      browserOpen: false,
    };
  },
};
</script>
