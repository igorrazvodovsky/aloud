import { mapState } from "vuex";

export const PlayerProgressSliderBase = {
  props: ["rewindedFor", "chapter", "chapterDuration"],
  computed: {
    ...mapState(["rate", "currentTime"]),
    chapters() {
      return this.$store.getters.chapters;
    },
    remainingTime() {
      return this.chapterDuration - this.currentTime
        // Time left in book = sec. left in current chapter + sums of next. chapters in sec.
        // TODO: 'length' is not required property in archive.org API. Either check all books or come up with a better solution (Librivox API?)
        + this.chapters.slice(this.currentChapter + 1).map(chapter => chapter.length.split(':').reduce((acc, time) => (60 * acc) + +time)).reduce((a, b) => a + b, 0);
    },
    rewindingBackwards() {
      return this.rewindedFor < 0;
    },
  },
  methods: {
    setCurrentTime(time) {
      this.$store.commit("setCurrentTime", time);
    }
  }
}
