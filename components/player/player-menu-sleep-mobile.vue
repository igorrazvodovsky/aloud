// TODO: Calc button size from the screen width // to make everything fit in one
row

<template>
  <div class="player-sleep text-center" :class="{ active: open }">
    <div class="subtitle-1 mb-4">Sleep in 7:15</div>
    <div class="mb-4">
      <v-btn
        class="ma-2"
        depressed
        outlined
        fab
        small
        @click.stop="$emit('close')"
        >Off</v-btn
      >
      <v-btn
        v-for="(item, i) in sleepOptions"
        :key="i"
        class="ma-2"
        depressed
        outlined
        fab
        small
        >{{ item }}</v-btn
      >
      <v-btn rounded outlined small class="ma-2">End of chapter</v-btn>
    </div>
    <v-btn icon @click.stop="$emit('close')">
      <icon-close />
    </v-btn>
  </div>
</template>
<script>
import IconClose from "@/assets/UI_iconoteka_close__delete__cross__clear_r_a.svg";
import PlayerMenuSleep from "~/components/player/player-menu-sleep";
export default {
  extends: PlayerMenuSleep,
  components: { IconClose }
};
</script>
