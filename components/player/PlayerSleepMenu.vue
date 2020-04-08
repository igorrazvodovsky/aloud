<template>
  <div class="player-sleep text-center" :class="{ active: sleepMenu }">
    <div class="subtitle-1 mb-4">Sleep in 7:15</div>
    <div class="mb-4">
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
    <v-btn text rounded class="ma-2" @click.stop="sleepMenu = !sleepMenu"
      >Turn off</v-btn
    >
    <!-- <v-btn class="ma-2" depressed outlined fab small color="secondary">
            <v-icon class="white--text">mdi-refresh</v-icon>
          </v-btn>-->
    <v-btn rounded text class="ma-2" @click.stop="$emit('close')">Close</v-btn>
  </div>
</template>
<script>
export default {
  props: ["open"],
  data: () => ({
    sleepCurrent: 15,
    sleepOptions: [15, 30, 45, 60]
  })
};
</script>
