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
          <span class="subtitle-1 theme--dark secondary--text">Chapter 2</span>
        </div>
        <!-- Book collapsed: play/pause -->
        <div key="2" v-if="closed" class="d-flex align-center">
          <v-btn dark text icon @click.stop="togglePlayback">
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
          <v-btn dark text icon color="secondary" @click.stop="$emit('open-lists')">
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

    <v-layout column justify-center align-stretch player-container>
      <!-- Chapter progress -->
      <v-flex xs12>

        <!-- thumb-label -->

        <!-- TODO: EVENTS -->
        <!-- start: stop listening to progress -->
        <!-- mouseup: set a new positions -->
        <v-slider
          thumb-color="#ff5c28"
          :thumb-label="this.rewinding ? 'always' : true"
          dark
          v-model="seek"
          min="0"
          :max="duration"
          hide-details
          class="mt-6"
        >
        <template v-slot:thumb-label>
          <span class="font-weight-bold">{{rewindedFor < 0 ? ('-' + formatTime(Math.abs(rewindedFor))) : formatTime(rewindedFor)}}</span>
        </template>
        </v-slider>
        <div class="d-flex justify-space-between mx-4 player-progress">
          <div class="caption theme--dark secondary--text">{{ formatTime((progress * duration)) }}</div>
          <v-spacer />
          <div class="caption theme--dark secondary--text">{{ formatTime(duration) }}</div>
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
        <v-btn large dark text icon @click.stop="hangleRewind" @mousedown="rewinding = true">
          <v-icon>mdi-rewind-10</v-icon>
        </v-btn>
        <button
          :class="
            playing ? 'player-playpause playing' : 'player-playpause paused'
          "
          @click.stop="togglePlayback"
        >
          <label tabindex="1"></label>
        </button>
        <v-btn large dark text icon @click.stop="hangleForward" @mousedown="rewinding = true">
          <v-icon>mdi-fast-forward-10</v-icon>
        </v-btn>
      </v-flex>

      <!-- Book secondary actions -->
      <v-flex xs12 mx-auto my-8>
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
import VueHowler from 'vue-howler'
import PlayerLists from '~/components/PlayerLists.vue'

export default {
  components: {
    PlayerLists
  },
  mixins: [VueHowler],
  props: ["closed"],
  data() {
    return {
      playing: false,
      player: null,
      seek: 300,
      rewinding: false,
      rewindedFor: 0,
    };
  },
  methods: {
    hangleRewind() {
      clearTimeout(this.rewindTimeout);
      this.setSeek(this.seek - 15);
      this.rewindedFor = this.rewindedFor - 15;
      this.rewindTimeout = setTimeout(function () { this.clearRewind() }.bind(this), 2000)
    },
    hangleForward() {
      clearTimeout(this.rewindTimeout);
      this.setSeek(this.seek + 15);
      this.rewindedFor = this.rewindedFor + 15;
      this.rewindTimeout = setTimeout(function () { this.clearRewind() }.bind(this), 2000)
    },
    clearRewind() {
      this.rewindedFor = 0,
      this.rewinding = false
    },
    formatTime(secs) {
      var minutes = Math.floor(secs / 60) || 0;
      var seconds = (secs - minutes * 60) || 0;
      return (minutes < 9 ? '0' : '') + minutes + ':' + (seconds < 9 ? '0' : '') + Math.round(seconds);
    }
  }
};
</script>
