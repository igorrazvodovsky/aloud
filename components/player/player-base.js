import { mapState } from "vuex";

export const PlayerBase = {
  // props: ["playlist", "index"],
  data: () => ({
    counter: 0,
  }),
  computed: {
    book() {
      return this.$store.state.book;
    },
    chapters() {
      return this.$store.getters.chapters;
    },
    remaining() {
      // 1. Total time in sec
      let totalSec = this.book.metadata.runtime.split(':').reduce((acc, time) => (60 * acc) + +time);
      // 2. Sums of prev. chapters in sec.
      // TODO: 'length' is not required in archive.org API. Either check all books or come up with a better solution (Librivox API?)
      // TODO: Define currentChapter and replace '1'
      let previosChaptersSec = this.chapters.slice(0, 1).map(chapter => chapter.length.split(':').reduce((acc, time) => (60 * acc) + +time)).reduce((a, b) => a + b, 0);
      // 3. (total time) - (sums of prev. chapters in sec.) - (progress of the current chapter in sec.) → -XXh XXmin
      // TODO: Add current chapter data
      // TODO: Doesn't work for long books (>24h)
      return new Date((totalSec - previosChaptersSec) * 1000).toISOString().substr(11, 5);
    }
  },
  methods: {
    handleClick() {
      this.counter++;
    },
  }
}
