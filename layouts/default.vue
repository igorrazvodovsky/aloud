<template>
  <v-app class="player">
    <!-- <v-system-bar dark>
      <v-spacer></v-spacer>
      <v-icon>mdi-wifi-strength-4</v-icon>
      <v-icon>mdi-signal-cellular-outline</v-icon>
      <v-icon>mdi-battery</v-icon>
      <span>12:30</span>
    </v-system-bar> -->
    <player-main :closed="browserOpen" v-on:open-player="browserOpen = false" />
    <v-card
      class="books"
      :style="browserOpen ? 'top: 3.25rem' : 'top: 85vh'"
      @click.stop="browserOpen = true"
      :ripple="false"
    >
      <v-row justify="space-between" class="pl-4 pr-2">
        <v-col cols="auto">
          <h2 class="title primary--text">
            Books
          </h2>
        </v-col>
        <v-col cols="auto">
          <v-btn @click.stop="" text icon color="secondary">
            <v-icon>mdi-magnify</v-icon>
          </v-btn>
        </v-col>
      </v-row>
      <!-- <v-content> -->
        <!-- <v-container> -->
          <nuxt />
        <!-- </v-container> -->
      <!-- </v-content> -->
    </v-card>
  </v-app>
</template>

<script>
import PlayerMain from '~/components/PlayerMain.vue'
export default {
  components: {
    PlayerMain,
  },
  data() {
    return {
      browserOpen: false,
    };
  },
};
</script>
