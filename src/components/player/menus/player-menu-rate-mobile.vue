<template>
  <div class="player-speed text-center" :class="{ active: open }">
    <div class="subtitle-1 mb-4">Playback speed</div>
    <div class="mb-4">
      <v-btn
        v-for="(item, i) in rateOptions"
        :key="i"
        class="ma-2"
        :outlined="item == currentRate ? false : true"
        fab
        small
        depressed
        :color="item == currentRate ? 'secondary' : ''"
        @click.stop="setRate(item)"
      >
        <span :class="item == currentRate ? 'white--text' : null">
          {{ item }}
        </span>
      </v-btn>
    </div>
    <v-btn icon @click.stop="$emit('close')">
      <icon-close />
    </v-btn>
  </div>
</template>

<script>
import { PlayerRateBase } from "@/components/player/menus/player-menu-rate";
import IconClose from "@/assets/UI_iconoteka_close__delete__cross__clear_r_a.svg";
export default {
  mixins: [PlayerRateBase],
  components: { IconClose },
  props: ["open"]
};
</script>
