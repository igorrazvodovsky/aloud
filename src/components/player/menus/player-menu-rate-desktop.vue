// TODO: Calc button size from the screen width // to make everything fit in one
row

<template>
  <v-menu>
    <template v-slot:activator="{ on }">
      <v-btn title="Set rate" text rounded v-on="on">
        <span class="body-1 text--secondary">{{ currentRate }}×</span>
      </v-btn>
    </template>
    <!-- TODO: Move to main screen -->
    <!-- <div class="subtitle-1 mb-4">Sleep in 7:15</div> -->
    <v-list offset-y rounded class="text-center">
      <v-list-item
        :disabled="item == currentRate"
        @click="setRate(item)"
        v-for="(item, i) in rateOptions"
        :key="i"
      >
        <v-list-item-title>{{ item }}</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>
<script>
import { PlayerRateBase } from "@/components/player/menus/player-menu-rate";
export default {
  mixins: [PlayerRateBase]
};
</script>
