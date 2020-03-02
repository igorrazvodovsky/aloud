<template>
  <div>
    <v-tabs v-model="tab" class="d-none">
      <v-tab key="actions">A</v-tab>
      <v-tab key="lists">B</v-tab>
    </v-tabs>
    <v-tabs-items dark v-model="tab">
      <v-tab-item key="actions">
        <player-main
          preload
          positionSec="300"
          :sources="audioSources"
          :closed="closed"
          v-on:open-player="$emit('open-player')"
          v-on:open-lists="tab = 1"
        />
      </v-tab-item>
      <v-tab-item key="lists">
        <player-lists v-on:close-lists="tab = 0" />
      </v-tab-item>
    </v-tabs-items>
  </div>
</template>
<script>
import PlayerMain from "~/components/PlayerMain.vue";
import PlayerLists from "~/components/PlayerLists.vue";
export default {
  components: {
    PlayerMain,
    PlayerLists
  },
  props: ["closed"],
  data: () => ({
    browserOpen: false,
    tab: null,
    audioSources: ["/northangerabbey_02_austen_64kb.mp3"]
  }),
  watch: {
    closed: function() {
      if (this.closed) this.tab = 0;
    }
  }
};
</script>
