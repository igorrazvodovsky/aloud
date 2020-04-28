<template>
  <v-flex xs12>
    <!-- thumb-label -->
    <!-- TODO: EVENTS -->
    <!-- start: stop listening to progress -->
    <!-- mouseup: set a new positions -->
    <!-- thumb-color="#ff5c28" -->
    <v-slider
      color="secondary"
      :thumb-label="rewinding ? 'always' : true"
      v-model="sliderPosition"
      min="0"
      :max="duration"
      hide-details
      class="mt-6"
    >
      <template v-slot:thumb-label>
        <span class="font-weight-bold">
          {{
            rewindingBackwards
              ? "-" + formatTime(Math.abs(rewindedFor))
              : formatTime(rewindedFor)
          }}
        </span>
      </template>
    </v-slider>
    <div class="d-flex justify-space-between mx-4 player-progress">
      <div class="caption secondary--text">
        {{ formatTime(progress * duration) }}
      </div>
      <v-spacer />
      <div class="caption secondary--text">{{ formatTime(duration) }}</div>
    </div>
  </v-flex>
</template>
<script>
export default {
  props: ["rewinding", "duration", "seek", "rewindedFor"],
  computed: {
    rewindingBackwards() {
      return this.rewindedFor < 0;
    },
    progress() {
      if (this.duration === 0) return 0;
      return this.seek / this.duration;
    },
    sliderPosition: {
      get: function() {
        return this.seek;
      },
      set: function(newValue) {
        //TODO: Emit change
      }
    }
  },
  methods: {
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
