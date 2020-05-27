<template>
  <div class="player__progress">
    <v-slider
      :thumb-label="rewinding ? 'always' : undefined"
      min="0"
      :max="chapterDuration"
      hide-details
      :value="sliderPosition"
      @start="handleStart"
      @end="handleEnd"
      @change="handleEnd"
      :class="rewinding ? 'show-thumb-label' : undefined"
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
        <div class="secondary--text">
          {{ currentBook.time | MMSSTimeFormat }}
        </div>
        <template v-if="$device.isDesktop">{{ chapter }}</template>
        <!-- TODO: Add the narrator from the Librivox API -->
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
  data: () => ({
    sliderPosition: 0,
    manipulatingWith: false
  }),
  watch: {
    // TODO: What's better, deep watching the entire currentBook or simply mapping currentBook.time and currentBook.chapter separately and watch the time directly?
    currentBook: {
      handler: function() {
        // Don't update the slider position while the slider is manipulated with
        if (!this.manipulatingWith) this.sliderPosition = this.currentBook.time;
      },
      deep: true
    }
  },
  computed: {
    ...mapState(["rate", "currentBook"]),
    chapters() {
      return this.$store.getters.chapters;
    },
    rewinding() {
      return !!this.rewindedFor;
    },
    remainingTime() {
      return (
        this.chapterDuration -
        this.currentBook.time +
        // Time left in book = sec. left in current chapter + sums of next. chapters in sec.
        // TODO: 'length' is not required property in archive.org API. Either check all books or come up with a better solution (Librivox API?)
        this.chapters
          .slice(this.currentBook.chapter + 1)
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
    handleStart(value) {
      this.manipulatingWith = true;
    },
    handleEnd(value) {
      this.manipulatingWith = false;
      let rewindedFor = value - this.currentBook.time;
      this.$emit("handle-rewind", rewindedFor);
    }
  },
  mounted() {
    this.sliderPosition = this.currentBook.time;
  }
};
</script>
