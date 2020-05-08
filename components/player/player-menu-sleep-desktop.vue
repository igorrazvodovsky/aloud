// TODO: Calc button size from the screen width // to make everything fit in one
row

<template>
  <v-menu offset-y>
    <template v-slot:activator="{ on }">
      <v-btn disabled title="Set timer" large icon v-on="on">
        <icon-sleep />
      </v-btn>
    </template>
    <!-- TODO: Move to main screen -->
    <!-- <div class="subtitle-1 mb-4">Sleep in 7:15</div> -->
    <v-list>
      <v-list-item @click.stop="$emit('close')">
        <v-list-item-title>Turn off</v-list-item-title>
      </v-list-item>
      <v-list-item>
        <v-list-item-title>End of chapter</v-list-item-title>
      </v-list-item>
      <v-list-item v-for="(item, i) in sleepOptions" :key="i">
        <v-list-item-title>{{ item }} min</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>
<script>
import IconSleep from "@/assets/Weather_iconoteka_moon__waning_crescent__red_crescent_r_s.svg";
import PlayerMenuSleep from "~/components/player/player-menu-sleep";
export default {
  extends: PlayerMenuSleep,
  components: { IconSleep }
};
</script>
