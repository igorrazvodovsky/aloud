<template>
  <div>
    <v-layout :class="{ dimmed: dimmedActions }" column justify-end align-stretch player-container>
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
            <span class="font-weight-bold">
              {{
              rewindedFor < 0
              ? "-" + formatTime(Math.abs(rewindedFor))
              : formatTime(rewindedFor)
              }}
            </span>
          </template>
        </v-slider>
        <div class="d-flex justify-space-between mx-4 player-progress">
          <div class="caption theme--dark secondary--text">{{ formatTime(progress * duration) }}</div>
          <v-spacer />
          <div class="caption theme--dark secondary--text">{{ formatTime(duration) }}</div>
        </div>
      </v-flex>

      <!-- Book primary actions -->
      <v-flex xs12 d-flex align-center justify-space-around player-actions-primary my-12>
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
        <v-btn
          dark
          color="secondary"
          class="px-0"
          text
          @click.stop="speedMenu = !speedMenu"
        >{{ speedCurrent }}×</v-btn>
        <v-btn
          dark
          color="accent"
          class="mx-3 player-sleep-btn player-sleep-btn--on"
          text
          icon
          @click.stop="sleepMenu = !sleepMenu"
        >
          <v-icon>mdi-power-sleep</v-icon>
        </v-btn>
        <v-btn dark color="secondary" class="mx-3" text icon @click.stop="bookmark = true">
          <v-icon>mdi-bookmark</v-icon>
        </v-btn>
        <!-- TODO: Switch to reading -->
        <v-btn dark color="success" class="mx-3" text icon>
          <v-icon>mdi-arrow-down-circle</v-icon>
        </v-btn>
      </v-flex>
    </v-layout>

    <v-snackbar color="primary" v-model="bookmark">
      Bookmarked!
      <v-btn color="secondary" text @click="bookmark = false">Add note</v-btn>
    </v-snackbar>

    <div class="player-secondary-actions-container">
      <v-slide-y-reverse-transition hide-on-leave>
        <!-- Speed -->
        <div
          key="1"
          v-if="speedMenu"
          class="player-speed text-center"
          :class="{ active: speedMenu }"
        >
          <div class="subtitle-1 mb-4">Speed</div>
          <div class="mb-4">
            <v-btn
              v-for="(item, i) in speedOptions"
              :key="i"
              class="ma-2"
              :outlined="item == speedCurrent ? false : true"
              fab
              small
              depressed
              :color="item == speedCurrent ? 'rgb(255, 204, 194)' : 'secondary'"
              @click.stop="speedCurrent = item"
            >
              <span :class="item == speedCurrent ? 'primary--text' : 'white--text'">{{ item }}</span>
            </v-btn>
          </div>
          <v-btn rounded outlined dark color="secondary" @click.stop="speedMenu = !speedMenu">
            <span class="white--text">Close</span>
          </v-btn>
        </div>

        <!-- Sleep -->
        <div
          key="2"
          v-if="sleepMenu"
          class="player-sleep text-center"
          :class="{ active: sleepMenu }"
        >
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
              color="secondary"
            >
              <span class="white--text">{{ item }}</span>
            </v-btn>
            <v-btn rounded outlined dark small class="ma-2" color="secondary">
              <span class="white--text">
                <span class="text-capitalize">End</span>
                <span class="text-lowercase">of chapter</span>
              </span>
            </v-btn>
          </div>
          <v-btn
            depressed
            rounded
            dark
            class="ma-2"
            color="secondary"
            @click.stop="sleepMenu = !sleepMenu"
          >
            <span class="white--text">Turn off</span>
          </v-btn>
          <!-- <v-btn class="ma-2" depressed outlined fab small color="secondary">
            <v-icon class="white--text">mdi-refresh</v-icon>
          </v-btn>-->
          <v-btn
            rounded
            outlined
            dark
            class="ma-2"
            color="secondary"
            @click.stop="sleepMenu = !sleepMenu"
          >
            <span class="white--text">Close</span>
          </v-btn>
        </div>
      </v-slide-y-reverse-transition>
    </div>
  </div>
</template>

<script>
import VueHowler from "vue-howler";
import PlayerLists from "~/components/PlayerLists.vue";

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
      dimmedActions: false,
      bookmark: false,
      speedMenu: false,
      sleepMenu: false,
      speedCurrent: "1.0",
      speedOptions: ["0.75", "1.0", "1.25", "1.5", "1.75", "2.0"],
      sleepCurrent: "15",
      sleepOptions: ["15", "30", "45", "60"]
    };
  },
  watch: {
    speedMenu: function() {
      this.dimmedActions = this.speedMenu;
    },
    sleepMenu: function() {
      this.dimmedActions = this.sleepMenu;
    }
  },
  methods: {
    hangleRewind() {
      clearTimeout(this.rewindTimeout);
      this.setSeek(this.seek - 15);
      this.rewindedFor = this.rewindedFor - 15;
      this.rewindTimeout = setTimeout(
        function() {
          this.clearRewind();
        }.bind(this),
        2000
      );
    },
    hangleForward() {
      clearTimeout(this.rewindTimeout);
      this.setSeek(this.seek + 15);
      this.rewindedFor = this.rewindedFor + 15;
      this.rewindTimeout = setTimeout(
        function() {
          this.clearRewind();
        }.bind(this),
        2000
      );
    },
    clearRewind() {
      (this.rewindedFor = 0), (this.rewinding = false);
    },
    formatTime(secs) {
      var minutes = Math.floor(secs / 60) || 0;
      var seconds = secs - minutes * 60 || 0;
      return (
        (minutes < 9 ? "0" : "") +
        minutes +
        ":" +
        (seconds < 9 ? "0" : "") +
        Math.round(seconds)
      );
    }
  }
};
</script>
