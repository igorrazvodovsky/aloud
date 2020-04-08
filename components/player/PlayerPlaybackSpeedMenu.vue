<template>
  <div class="player-speed text-center" :class="{ active: open }">
    <div class="subtitle-1 mb-4">Speed</div>
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
        <span :class="item == currentSpeed ? 'white--text' : null">{{
          item
        }}</span>
      </v-btn>
    </div>
    <v-btn rounded text @click.stop="$emit('close')">Close</v-btn>
  </div>
</template>

<script>
export default {
  props: ["open", "currentSpeed"],
  data: () => ({
    speedOptions: [0.75, 1.0, 1.25, 1.5, 1.75, 2.0]
  })
};
</script>
