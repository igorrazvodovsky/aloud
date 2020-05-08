<template>
  <div class="player__progress">
    <v-slider
      :thumb-label="rewindedFor !== 0 ? 'always' : true"
      min="0"
      :max="chapterDuration"
      hide-details
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
    <div class="player__progress-labels">
      <div>
        <div class="secondary--text">{{ currentTime | MMSSTimeFormat }}</div>
        <template v-if="$device.isDesktop">{{ chapter }}</template>
        <!-- <span class="secondary--text">is read by Laurette</span> -->
      </div>
      <div class="secondary--text text-right">
        <div>{{ chapterDuration | MMSSTimeFormat }}</div>
        <div v-if="$device.isDesktop">
          {{ remainingTime | fancyTimeFormat }} left
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  props: ["rewindedFor", "chapter", "chapterDuration"],
  computed: {
    ...mapState(["rate", "currentTime"]),
    chapters() {
      return this.$store.getters.chapters;
    },
    remainingTime() {
      return (
        this.chapterDuration -
        this.currentTime +
        // Time left in book = sec. left in current chapter + sums of next. chapters in sec.
        // TODO: 'length' is not required property in archive.org API. Either check all books or come up with a better solution (Librivox API?)
        this.chapters
          .slice(this.currentChapter + 1)
          .map(chapter =>
            chapter.length.split(":").reduce((acc, time) => 60 * acc + +time)
          )
          .reduce((a, b) => a + b, 0)
      );
    },
    rewindingBackwards() {
      return this.rewindedFor < 0;
    }
  },
  methods: {
    setCurrentTime(time) {
      this.$store.commit("setCurrentTime", time);
    }
  }
};
</script>
