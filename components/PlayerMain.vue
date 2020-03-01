<template>
  <div>
    <div
      class="mx-2 my-2 d-flex flex-no-wrap justify-space-between"
      @click.stop="$emit('open-player')"
    >
      <v-slide-y-reverse-transition hide-on-leave leave-absolute>
        <!-- Book: what's playing -->
        <div key="1" v-if="!closed" class="ml-2">
          <span class="overline theme--dark secondary--text">Listening to</span>
          <h1 class="title">Chapter 2</h1>
          <span class="subtitle-1 theme--dark secondary--text"
            >of Northanger Abbey</span
          >
        </div>
        <!-- Book collapsed: play/pause -->
        <div key="2" v-if="closed" class="d-flex align-center">
          <v-btn dark text icon @click.stop="handlePlayPause()">
            <v-icon v-if="playing">mdi-pause-circle</v-icon>
            <v-icon v-else>mdi-play-circle</v-icon>
          </v-btn>
          <div class="subtitle-2">Northanger Abbey <span>•</span> Ch. 2</div>
        </div>
      </v-slide-y-reverse-transition>

      <v-slide-y-reverse-transition hide-on-leave>
        <!-- Book: tertiary actions -->
        <div key="1" v-if="!closed" class="ml-auto">
          <v-btn dark text icon color="secondary">
            <v-icon>mdi-information-outline</v-icon>
          </v-btn>
          <v-btn dark text icon color="secondary">
            <v-icon>mdi-format-list-bulleted</v-icon>
          </v-btn>
          <v-btn dark text icon color="secondary">
            <v-icon>mdi-dots-horizontal</v-icon>
          </v-btn>
        </div>
        <!-- Book collapsed: secondary action -->
        <div key="2" v-if="closed" class="ml-auto">
          <v-btn dark text icon color="secondary">
            <v-icon>mdi-rewind-30</v-icon>
          </v-btn>
        </div>
      </v-slide-y-reverse-transition>
    </div>
    <v-layout v-if="!closed" column justify-center align-stretch player-container>
      <!-- Chapter progress -->
      <v-flex xs12>
        <v-slider
          dark
          v-model="currentTime"
          min="0"
          max="100"
          hide-details
          class="mt-6"
        ></v-slider>
        <div class="d-flex justify-space-between mx-4">
          <div class="overline theme--dark secondary--text">04:15</div>
          <v-spacer></v-spacer>
          <div class="overline theme--dark secondary--text">-31:17</div>
        </div>
      </v-flex>

      <!-- Book primary actions -->
      <v-flex
        xs12
        d-flex
        align-center
        justify-space-around
        player-actions-primary
        my-12
      >
        <v-btn large dark text icon>
          <v-icon>mdi-rewind-30</v-icon>
        </v-btn>
        <button
          :class="
            playing ? 'player-playpause playing' : 'player-playpause paused'
          "
          @click.stop="handlePlayPause()"
        >
          <label tabindex="1"></label>
        </button>
        <v-btn large dark text icon>
          <v-icon>mdi-fast-forward-30</v-icon>
        </v-btn>
      </v-flex>

      <!-- Book secondary actions -->
      <v-flex xs12 mx-auto>
        <v-btn dark color="secondary" class="px-0" text>
          1.25×
        </v-btn>
        <v-btn dark color="secondary" class="mx-3" text icon>
          <v-icon>mdi-power-sleep</v-icon>
        </v-btn>
        <v-btn dark color="secondary" class="mx-3" text icon>
          <v-icon>mdi-bookmark</v-icon>
        </v-btn>
        <!-- TODO: Switch to reading -->
        <v-btn dark color="success" class="mx-3" text icon>
          <v-icon>mdi-arrow-down-circle</v-icon>
        </v-btn>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
import { Howl, Howler } from "howler";

export default {
  props: ["closed"],
  data() {
    return {
      currentTime: 50,
      playing: false,
      player: null,
    };
  },
  mounted() {
    this.player = new Howl({
      src: `/northangerabbey_02_austen_64kb.mp3`,
      html5: true,
      volume: 1.0,
      preload: true,
    });
    this.player.seek(50);
  },
  destroyed() {
    if (this.player) {
      this.killPlayer();
    }
    // clearInterval(this.playerInterval);
  },
  methods: {
    handlePlayPause() {
      this.playing = !this.playing;
      if (!this.playing) {
        this.player.pause();
      } else {
        this.player.play();
      }
    },
    killPlayer() {
      if (this.player) {
        this.player.pause();
        this.player = null;
      }
    }
  }
};
</script>
