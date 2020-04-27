<!-- PLAYER VIEW -->
<!-- 1. Header -->
<!-- 2. Player controls -->
<!-- 3. Lists (TOC & Bookmarks) -->

<template>
  <div class="player-container" :class="{ dimmed: dimmed }">
    <v-progress-circular v-if="!loaded" indeterminate class="loading"></v-progress-circular>
    <div
      class="mx-2 my-2 d-flex flex-no-wrap justify-space-between player-header"
      @click.stop="$emit('open-player')"
    >
      <v-slide-y-reverse-transition hide-on-leave leave-absolute>
        <!-- Book: what's playing -->
        <div key="1" v-if="!closed" class="ml-2">
          <span class="overline secondary--text">Listening to</span>
          <h1 class="title">{{ book.metadata.title }}</h1>
          <span class="subtitle-1 secondary--text">
            {{
            tab == 0 ? "Chapter 2" : ""
            }}
          </span>
        </div>
        <!-- MOBILE: Book collapsed: play/pause -->
        <div key="2" v-if="closed" class="d-flex align-center">
          <v-btn text icon @click.stop="handleTogglePlay">
            <v-icon v-if="playing">mdi-pause-circle</v-icon>
            <v-icon v-else>mdi-play-circle</v-icon>
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

    <!-- <v-tabs-items vertical v-model="tab">
    <v-tab-item v-show="loaded" key="actions">-->
    <!--  -->
    <v-slide-y-reverse-transition hide-on-leave>
      <!-- TODO: Learn more -->
      <keep-alive>
        <player-main
          v-if="tab == 0"
          v-show="loaded"
          @load="loaded = true"
          @pause="playing = false"
          @play="playing = true"
          @dim="dimmed = !dimmed"
          ref="player"
          :book-tracks="bookTracks"
        />
      </keep-alive>
      <player-lists v-if="tab == 1" @close-lists="tab = 0" />
    </v-slide-y-reverse-transition>
  </div>
</template>

<script>
import PlayerMain from "~/components/player/PlayerMain.vue";
import PlayerLists from "~/components/player/PlayerLists.vue";
import { mapState } from "vuex";
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
    dimmed: false,
    sources: [],
    actions: [
      { title: "Mark as finished" },
      { title: "Share" },
      { title: "Share to Instagram Story" },
      { title: "Gift book" }
    ]
  }),
  computed: {
    ...mapState(["book"]),
    tab() {
      if (this.closed) return 0;
      else if (this.openLists) return 1;
      else return 0;
    },
    bookTracks() {
      return (
        Array.from(this.book[this.book.metadata.identifier])
          // 1. Filter for mp3s
          .filter(function(el) {
            return el.source == "original" && el.format.includes("MP3");
          })
          // 2. Sort them by "title"
          // TODO: Not sure if works. Additional tests needed. Should also check for "track" & maybe even prioratize it
          .sort((a, b) =>
            a.title.match(/^\d+|\d+\b|\d+(?=\w)/g)[0] >
            b.title.match(/^\d+|\d+\b|\d+(?=\w)/g)[0]
              ? 1
              : -1
          )
          // 3. Remove unnecesary properties
          .map(
            ({
              source,
              creator,
              album,
              crc32,
              md5,
              sha1,
              size,
              mtime,
              ...keepAttrs
            }) => keepAttrs
          )
          // 4. Add a property to store a Howler object
          .map(obj => ({ ...obj, howl: null }))
      );
    }
  },
  beforeDestroy() {
    if (typeof window !== "undefined") {
      window.removeEventListener("resize", this.onResize, { passive: true });
    }
  },
  methods: {
    // async fetchSource() {
    //   const src = await this.$axios.$get(
    //     "api/download/" +
    //       this.book.metadata.identifier +
    //       "/" +
    //       this.bookTracks[0].name
    //   );
    //   this.sources.push(src);
    // },
    handleTogglePlay() {
      this.$refs.player.togglePlayback();
    }
  }
};
</script>
