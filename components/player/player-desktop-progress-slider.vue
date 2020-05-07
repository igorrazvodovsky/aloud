<template>
  <div class="player-desktop__progress">
    <v-slider
      :thumb-label="rewindedFor !== 0 ? 'always' : true"
      min="0"
      :max="chapterDuration"
      hide-details
      :value="currentTime"
      @change="setCurrentTime($event)"
    >
      <!-- TODO: Same as mobile -->
      <template v-slot:thumb-label>
        <span class="font-weight-bold">
          {{ rewindingBackwards ? "-" : null
          }}{{ Math.abs(rewindedFor) | MMSSTimeFormat }}
        </span>
      </template>
    </v-slider>
    <div class="player-desktop__progress-labels body-2">
      <div>
        <div class="secondary--text">{{ currentTime | MMSSTimeFormat }}</div>
        {{ chapter }}
        <!-- <span class="secondary--text">is read by Laurette</span> -->
      </div>
      <div class="secondary--text">
        <div>{{ chapterDuration | MMSSTimeFormat }}</div>
        <div>{{ remainingTime | fancyTimeFormat }} left</div>
      </div>
    </div>
  </div>
</template>

<script>
import { PlayerProgressSliderBase } from "~/components/player/player-progress-slider";
export default {
  ...PlayerProgressSliderBase
};
</script>
