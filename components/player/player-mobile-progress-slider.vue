<template>
  <v-flex xs12>
    <!-- thumb-label -->
    <!-- TODO: EVENTS -->
    <!-- start: stop listening to progress -->
    <!-- mouseup: set a new positions -->
    <!-- thumb-color="#ff5c28" -->
    <v-slider
      :thumb-label="rewindedFor !== 0 ? 'always' : true"
      min="0"
      :max="chapterDuration"
      hide-details
      class="mt-6"
      :value="currentTime"
      @change="setCurrentTime($event)"
    >
      <template v-slot:thumb-label>
        <span class="font-weight-bold">
          {{ rewindingBackwards ? "-" : null
          }}{{ Math.abs(rewindedFor) | MMSSTimeFormat }}
        </span>
      </template>
    </v-slider>
    <div class="d-flex justify-space-between mx-4 player-progress">
      <div class="caption secondary--text">{{ currentTime | MMSSTimeFormat }}</div>
      <v-spacer />
      <div class="caption secondary--text">{{ chapterDuration | MMSSTimeFormat }}</div>
    </div>
  </v-flex>
</template>
<script>
import { PlayerProgressSliderBase } from "~/components/player/player-progress-slider";
export default {
  ...PlayerProgressSliderBase
};
</script>
