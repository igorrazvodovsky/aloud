<template>
  <div>
    <!-- :class="{ dimmed: dimmedActions }" -->
    <div
      class="mx-2 my-2 d-flex flex-no-wrap justify-space-between player-header"
      @click.stop="$emit('open-player')"
    >
      <v-slide-y-reverse-transition hide-on-leave leave-absolute>
        <!-- Book: what's playing -->
        <div key="1" v-if="!closed" class="ml-2">
          <span class="overline secondary--text">Listening to</span>
          <h1 class="title">Northanger Abbey</h1>
          <span class="subtitle-1 secondary--text">
            {{
            tab == 0 ? "Chapter 2" : ""
            }}
          </span>
        </div>
        <!-- Book collapsed: play/pause -->
        <div key="2" v-if="closed" class="d-flex align-center">
          <v-btn text icon @click.stop="handleTogglePlay">
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
        <div key="1" v-if="!closed && !openLists" class="ml-auto">
          <!-- <v-btn disabled text icon color="secondary">
            <v-icon>mdi-information-outline</v-icon>
          </v-btn>-->
          <v-btn text icon @click.stop="openLists = !openLists">
            <v-icon>mdi-format-list-bulleted</v-icon>
          </v-btn>

          <!-- <v-menu left>
            <template v-slot:activator="{ on }">
              <v-btn text icon color="secondary" v-on="on">
                <v-icon>mdi-dots-horizontal</v-icon>
              </v-btn>
            </template>
            <v-list>
              <v-list-item v-for="(item, index) in actions" :key="index">
                <v-list-item-title>{{ item.title }}</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>-->
        </div>
        <!-- Book collapsed: secondary action -->
        <div key="2" v-if="closed" class="ml-auto">
          <v-btn text icon @click.stop>
            <v-icon>mdi-rewind-10</v-icon>
          </v-btn>
        </div>
        <v-btn key="3" v-if="tab == 1" text icon @click.stop="openLists = false">
          <v-icon>mdi-close-circle</v-icon>
        </v-btn>
      </v-slide-y-reverse-transition>
    </div>

    <v-progress-circular
      v-if="!loaded"
      :width="16"
      :size="80"
      class="player-loader d-block"
      indeterminate
    ></v-progress-circular>

    <v-tabs v-model="tab" class="d-none">
      <v-tab key="actions"></v-tab>
      <v-tab key="lists"></v-tab>
    </v-tabs>
    <v-tabs-items vertical v-model="tab">
      <v-tab-item v-show="loaded" key="actions">
        <!--  -->
        <player-main
          v-on:load="loaded = true"
          v-on:pause="playing = false"
          v-on:play="playing = true"
          ref="player"
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
    loaded: false,
    playing: false,
    openLists: false,
    actions: [
      { title: "Mark as finished" },
      { title: "Share" },
      { title: "Share to Instagram Story" },
      { title: "Gift book" }
    ]
  }),
  computed: {
    tab() {
      if (this.closed) return 0;
      else if (this.openLists) return 1;
      else return 0;
    }
    // playing() {
    //   return this.$store.state.playing
    // }
  },
  methods: {
    handleTogglePlay() {
      this.$refs.player.togglePlayback();
    }
  }
};
</script>
