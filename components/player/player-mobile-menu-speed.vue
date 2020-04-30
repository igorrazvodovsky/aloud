<template>
  <div class="player-speed text-center" :class="{ active: open }">
    <div class="subtitle-1 mb-4">Playback speed</div>
    <div class="mb-4">
      <v-btn
        v-for="(item, i) in speedOptions"
        :key="i"
        class="ma-2"
        :outlined="item == currentSpeed ? false : true"
        fab
        small
        depressed
        :color="item == currentSpeed ? 'secondary' : ''"
        @click.stop="$emit('set-speed', item)"
      >
        <span :class="item == currentSpeed ? 'white--text' : null">
          {{
          item
          }}
        </span>
      </v-btn>
    </div>
    <v-btn icon @click.stop="$emit('close')">
      <icon-close />
    </v-btn>
  </div>
</template>

<script>
import IconClose from "@/assets/UI_iconoteka_close__delete__cross__clear_r_a.svg";
export default {
  components: {
    IconClose
  },
  props: ["open", "currentSpeed"],
  data: () => ({
    speedOptions: [0.75, 1.0, 1.25, 1.5, 1.75, 2.0]
  })
};
</script>
