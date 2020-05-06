<!-- PLAYER VIEW -->
<!-- 1. Header -->
<!-- 2. Player controls -->
<!-- 3. Lists (TOC & Bookmarks) -->

<template>
  <div class="loading" v-if="!loaded">
    <div class="text-center">
      <v-progress-circular indeterminate></v-progress-circular>
      <!-- <div v-if="loadingError" class="mt-6 body-2 text--secondary">
        An errror occured while loading the book. Retrying...
      </div> -->
    </div>
  </div>
  <div v-else class="player-container" :class="{ disabled: disabled }">
    <div
      class="mx-2 my-2 d-flex flex-no-wrap justify-space-between player-header"
      @click.stop="$emit('open-player')"
    >
      <v-slide-y-reverse-transition hide-on-leave leave-absolute>
        <!-- Book: what's playing -->
        <div key="1" v-if="!closed" class="ml-2">
          <span class="overline secondary--text">Listening to</span>
          <h1 class="headline serif">{{ book.metadata.title }}</h1>
          <span class="subtitle-1 secondary--text">
            {{ tab == 0 ? "Chapter 2" : "" }}
          </span>
        </div>
        <!-- MOBILE: Book collapsed: play/pause -->
        <div key="2" v-if="closed" class="d-flex align-center">
          <v-btn text icon @click.stop="handleTogglePlay">
            <icon-pause v-if="playing" />
            <icon-play v-else />
          </v-btn>
          <div class="subtitle-2">
            {{ book.metadata.title }}
            <span>•</span> Ch. 2
          </div>
        </div>
      </v-slide-y-reverse-transition>

      <v-slide-y-reverse-transition hide-on-leave>
        <!-- Book: tertiary actions -->
        <div key="1" v-if="!closed && !openLists" class="ml-auto">
          <v-btn text icon @click.stop="openLists = !openLists">
            <icon-list />
          </v-btn>
        </div>
        <!-- Book collapsed: secondary action -->
        <div key="2" v-if="closed" class="ml-auto">
          <v-btn text icon @click.stop>
            <icon-back />
          </v-btn>
        </div>
        <v-btn
          key="3"
          v-if="tab == 1"
          text
          icon
          @click.stop="openLists = false"
        >
          <icon-close />
        </v-btn>
      </v-slide-y-reverse-transition>
    </div>

    <!-- <v-tabs-items vertical v-model="tab">
    <v-tab-item v-show="loaded" key="actions">-->
    <!--  -->

    <!-- TODO: Transition -->
    <keep-alive>
      <player-main
        v-if="tab == 0"
        @load="loaded = true"
        @pause="playing = false"
        @play="playing = true"
        @disable="disabled = !disabled"
        ref="player"
        :chapters="chapters"
      />
    </keep-alive>
    <player-lists v-if="tab == 1" @close-lists="tab = 0" />
  </div>
</template>

<script>
import PlayerMain from "~/components/player/PlayerMain.vue";
import PlayerLists from "~/components/player/player-mobile-lists.vue";
import IconList from "@/assets/UI_iconoteka_list__playlist_queue_r_a.svg";
import IconClose from "@/assets/UI_iconoteka_close__delete__cross__clear_r_a.svg";
import IconBack from "@/assets/Arrows_iconoteka_rotate_ccw_r_a.svg";
import IconPlay from "@/assets/Multimedia_iconoteka_play_circle_a_f.svg";
import IconPause from "@/assets/Multimedia_iconoteka_pause_circle_r_f.svg";
import { mapState } from "vuex";
export default {
  components: {
    PlayerMain,
    PlayerLists,
    IconList,
    IconClose,
    IconBack,
    IconPlay,
    IconPause
  },
  props: ["closed"],
  data: () => ({
    loaded: false,
    playing: false,
    openLists: false,
    disabled: false,
    sources: []
  }),
  computed: {
    ...mapState(["book"]),
    tab() {
      if (this.closed) return 0;
      else if (this.openLists) return 1;
      else return 0;
    },
    chapters() {
      return this.$store.getters.chapters;
    }
  },
  beforeDestroy() {
    if (typeof window !== "undefined") {
      window.removeEventListener("resize", this.onResize, { passive: true });
    }
  },
  methods: {
    handleTogglePlay() {
      this.$refs.player.togglePlayback();
    }
  }
};
</script>
