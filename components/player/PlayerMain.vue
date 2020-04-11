<template>
  <div class="player-actions-container">
    <v-layout column justify-end align-stretch player-actions-container-primary>
      <!-- Chapter progress -->
      <player-progress-slider
        :rewinding="rewinding"
        :seek="seek"
        :duration="duration"
        :rewindedFor="rewindedFor"
        v-if="duration > 0"
      />
      <!-- Book primary actions -->
      <v-flex xs12 d-flex align-center justify-space-around player-actions-primary my-12>
        <v-btn large text icon @click.stop="handleRewind" @mousedown="rewinding = true">
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
        <v-btn large text icon @click.stop="handleForward" @mousedown="rewinding = true">
          <v-icon>mdi-fast-forward-10</v-icon>
        </v-btn>
      </v-flex>

      <!-- Book secondary actions -->
      <v-flex xs12 mx-auto my-8>
        <v-btn
          class="px-0 font-weight-bold color-medium-emphasis"
          text
          rounded
          @click.stop="handleSpeedMenu"
        >{{ rate }}×</v-btn>
        <v-btn
          class="mx-3 player-sleep-btn player-sleep-btn--on"
          text
          icon
          @click.stop="handleSleepMenu"
        >
          <v-icon>mdi-power-sleep</v-icon>
        </v-btn>
        <v-btn class="mx-3" text icon @click.stop="bookmark = true">
          <v-icon>mdi-bookmark</v-icon>
        </v-btn>
      </v-flex>
    </v-layout>

    <!-- TODO: Move somewhere or add a compensating style. TranslateX moves it with the rest of the stuff -->
    <v-snackbar v-model="bookmark">
      Bookmarked!
      <v-btn text @click="bookmark = false">Add note</v-btn>
    </v-snackbar>

    <div class="player-actions-container-secondary">
      <!-- <v-slide-y-reverse-transition hide-on-leave> -->
      <player-playback-speed-menu
        key="1"
        v-if="speedMenu"
        :open="speedMenu"
        :current-speed="rate"
        @close="handleSpeedMenu"
        @set-speed="setRate"
      />
      <player-sleep-menu key="2" v-if="sleepMenu" :open="sleepMenu" @close="handleSleepMenu" />
      <!-- </v-slide-y-reverse-transition> -->
    </div>
  </div>
</template>

<script>
import { Howl } from "howler";
import PlayerLists from "~/components/player/PlayerLists.vue";
import PlayerPlaybackSpeedMenu from "~/components/player/PlayerPlaybackSpeedMenu.vue";
import PlayerSleepMenu from "~/components/player/PlayerSleepMenu.vue";
import PlayerProgressSlider from "~/components/player/PlayerProgressSlider.vue";
import clamp from "math-clamp";
import values from "object-values";
import assign from "object-assign";

export default {
  components: {
    PlayerLists,
    PlayerPlaybackSpeedMenu,
    PlayerSleepMenu,
    PlayerProgressSlider
  },

  props: ["paused"],

  data() {
    return {
      /**
       * The Howl instance used for playback
       */
      _howl: null,
      playing: false,
      rate: 1.0,
      seek: 300,
      duration: 0,
      sources: ["/northangerabbey_02_austen_64kb.mp3"],
      sleepMenu: false,
      speedMenu: false,
      /**
       * Functions that poll the Howl instance
       * to update various data
       */
      _polls: {
        seek: {
          id: null,
          interval: 1000 / 4, // 4 times per second (4Hz)
          hook: () => {
            this.seek = this.$data._howl.seek();
          }
        }
      },
      /**
       * A list of howl events to listen to and
       * functions to call when they are triggered
       */
      _howlEvents: [
        {
          name: "load",
          hook: () => {
            this.duration = this.$data._howl.duration();
            // TODO
            this.setSeek(300);
          }
        },
        "loaderror",
        "playerror",
        {
          name: "play",
          hook: () => {
            this.playing = true;
          }
        },
        {
          name: "end",
          hook: () => {
            this.playing = false;
          }
        },
        {
          name: "pause",
          hook: () => {
            this.playing = false;
          }
        },
        {
          name: "rate",
          hook: () => {
            this.rate = this.$data._howl.rate();
          }
        },
        {
          name: "seek",
          hook: () => {
            this.seek = this.$data._howl.seek();
          }
        },
        "fade"
      ],
      rewinding: false,
      rewindedFor: 0,
      bookmark: false,
      speedMenu: null,
      sleepMenu: null
    };
  },

  created() {
    this._initialize();
  },
  beforeDestroy() {
    this._cleanup();
  },
  watch: {
    playing(playing) {
      // Update the seek
      this.seek = this.$data._howl.seek();

      if (playing) {
        // Start the seek poll
        this.$data._polls.seek.id = setInterval(
          this.$data._polls.seek.hook,
          this.$data._polls.seek.interval
        );
      } else {
        // Stop the seek poll
        clearInterval(this.$data._polls.seek.id);
      }
    },
    paused(paused) {
      console.log(paused);
      this.togglePlayback();
    },
    sources(sources) {
      this._reinitialize();
    }
  },
  methods: {
    _reinitialize() {
      this._cleanup(false);
      this._initialize();
    },
    _initialize() {
      this.$data._howl = new Howl({
        src: this.sources,
        html5: this.html5,
        preload: true,
        rate: this.rate,
        format: this.formats,
        xhrWithCredentials: this.xhrWithCredentials
      });

      const duration = this.$data._howl.duration();
      this.duration = duration;

      if (duration > 0) {
        // The audio file(s) have been cached. Howler won't
        // emit a load event, so we will do this manually
        this.$emit("load");
      }
      // Bind to all Howl events
      this.$data._howlEvents = this.$data._howlEvents.map(event => {
        // Normalize string shorthands to objects
        if (typeof event === "string") {
          event = { name: event };
        }

        // Create a handler
        const handler = (id, details) => {
          if (typeof event.hook === "function") event.hook(id, details);
          this.$emit(event.name, id, details);
        };

        // Bind the handler
        this.$data._howl.on(event.name, handler);

        // Return the name and handler to unbind later
        return assign({}, event, { handler });
      });
    },
    /**
     * Clean up the Howler player
     */
    _cleanup(resetSettings = true) {
      // Stop all playback
      if (this.$data._howl) {
        this.stop();
      }

      // Stop all polls
      values(this.$data._polls).forEach(poll => {
        if (poll.id != null) clearInterval(poll.id);
      });

      // Clear all event listeners
      this.$data._howlEvents.map(event => {
        if (event.handler) {
          if (this.$data._howl) {
            this.$data._howl.off(event.name, event.handler);
          }

          const _event = assign({}, event);
          delete _event.handler;
          return _event;
        }

        return event;
      });

      // Destroy the Howl instance
      this.$data._howl = null;

      this.duration = 0;

      if (resetSettings) {
        this.muted = false;
        this.rate = 1.0;
      }
    },
    play() {
      if (!this.playing) this.$data._howl.play();
    },
    pause() {
      if (this.playing) this.$data._howl.pause();
    },
    togglePlayback() {
      if (!this.playing) {
        this.$data._howl.play();
      } else {
        this.$data._howl.pause();
      }
    },
    /**
     * Set the rate (speed) of the playback
     * @param {Number} rate - The new rate.
     * The value is clamped between 0.5 and 4
     */
    setRate(rate) {
      if (typeof rate !== "number") {
        throw new Error(`rate must be a number, got a ${typeof rate} instead`);
      }

      this.$data._howl.rate(clamp(rate, 0.5, 4));
    },
    /**
     * Set the position of the playback
     * @param {Number} seek - The new position in seconds.
     * The value is clamped between 0 and the duration
     */
    setSeek(seek) {
      if (typeof seek !== "number") {
        throw new Error(`seek must be a number, got a ${typeof seek} instead`);
      }

      this.$data._howl.seek(clamp(seek, 0, this.duration));
    },
    /**
     * Set the progress of the playback
     * @param {Number} progress - The new progress.
     * The value is clamped between 0 and 1
     */
    setProgress(progress) {
      if (typeof progress !== "number") {
        throw new Error(
          `progress must be a number, got a ${typeof progress} instead`
        );
      }

      this.setSeek(clamp(progress, 0, 1) * this.duration);
    },
    handleRewind() {
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
    handleForward() {
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
    handleSpeedMenu() {
      this.$emit("dim");
      this.speedMenu = !this.speedMenu;
    },
    handleSleepMenu() {
      this.$emit("dim");
      this.sleepMenu = !this.sleepMenu;
    }
  }
};
</script>
