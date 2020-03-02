<template>
  <div>
    <div
      class="mx-2 my-2 d-flex flex-no-wrap justify-space-between player-header"
      @click.stop="$emit('open-player')"
    >
      <v-slide-y-reverse-transition hide-on-leave leave-absolute>
        <!-- Book: what's playing -->
        <div key="1" v-if="!closed" class="ml-2">
          <span class="overline theme--dark secondary--text">Listening to</span>
          <h1 class="title">Northanger Abbey</h1>
          <span class="subtitle-1 theme--dark secondary--text">{{tab == 0 ? 'Chapter 2' : ''}}</span>
        </div>
        <!-- Book collapsed: play/pause -->
        <div key="2" v-if="closed" class="d-flex align-center">
          <v-btn dark text icon @click.stop="togglePlayback">
            <v-icon v-if="playing">mdi-pause-circle</v-icon>
            <v-icon v-else>mdi-play-circle</v-icon>
          </v-btn>
          <div class="subtitle-2">
            Northanger Abbey
            <span>•</span> Ch. 2
          </div>
        </div>
      </v-slide-y-reverse-transition>

      <v-slide-y-reverse-transition hide-on-leave>
        <!-- Book: tertiary actions -->
        <div key="1" v-if="openMain" class="ml-auto">
          <v-btn dark text icon color="secondary">
            <v-icon>mdi-information-outline</v-icon>
          </v-btn>
          <v-btn dark text icon color="secondary" @click.stop="tab = 1">
            <v-icon>mdi-format-list-bulleted</v-icon>
          </v-btn>

          <v-menu left>
            <template v-slot:activator="{ on }">
              <v-btn dark text icon color="secondary" v-on="on">
                <v-icon>mdi-dots-horizontal</v-icon>
              </v-btn>
            </template>
            <v-list>
              <v-list-item v-for="(item, index) in actions" :key="index" @click>
                <v-list-item-title>{{ item.title }}</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </div>
        <!-- Book collapsed: secondary action -->
        <div key="2" v-if="closed" class="ml-auto">
          <v-btn dark text icon color="secondary">
            <v-icon>mdi-rewind-30</v-icon>
          </v-btn>
        </div>
        <v-btn key="3" v-if="openLists" dark text icon @click.stop="tab = 0">
          <v-icon>mdi-close-circle</v-icon>
        </v-btn>
      </v-slide-y-reverse-transition>
    </div>

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
    audioSources: ["/northangerabbey_02_austen_64kb.mp3"],
    actions: [
      { title: "Mark as finished" },
      { title: "Share" },
      { title: "Share to Instagram Story" },
      { title: "Gift" }
    ]
  }),
  computed: {
    openLists: function() {
      if (!this.closed && this.tab == 1) return true;
    },
    openMain: function() {
      if (!this.closed && this.tab == 0) return true;
    }
  },
  watch: {
    closed: function() {
      if (this.closed) this.tab = 0;
    }
  }
};
</script>
