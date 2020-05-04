import { mapState } from "vuex";

export const PlayerBase = {
  // props: ["playlist", "index"],
  data: () => ({
    audio: "",
    currentlyPlaying: false,
    currentlyStopped: false,
    currentTime: 0,
    checkingCurrentPositionInChapter: "",
    chapterDuration: 0,
    currentChapter: 0,
    audioFile: ""
  }),
  computed: {
    book() {
      return this.$store.state.book;
    },
    chapters() {
      return this.$store.getters.chapters;
    },
    remainingTime() {
      return this.chapterDuration - this.currentTime
        // Sums of next. chapters in sec.
        // TODO: 'length' is not required property in archive.org API. Either check all books or come up with a better solution (Librivox API?)
        + this.chapters.slice(this.currentChapter + 1).map(chapter => chapter.length.split(':').reduce((acc, time) => (60 * acc) + +time)).reduce((a, b) => a + b, 0);
    }
  },
  mounted: function () {
    this.changeChapter();
    this.audio.loop = false;
  },
  methods: {
    nextChapter: function () {
      if (this.currentChapter < this.chapters.length - 1)
        this.changeChapter(this.currentChapter + 1);
    },
    prevChapter: function () {
      if (this.currentChapter > 0) this.changeChapter(this.currentChapter - 1);
    },
    changeChapter: function (index) {
      var wasPlaying = this.currentlyPlaying;
      this.imageLoaded = false;
      if (index !== undefined) {
        this.stopAudio();
        this.currentChapter = index;
      }
      this.audioFile = this.chapters[this.currentChapter].url;
      this.audio = new Audio(this.audioFile);
      var localThis = this;
      this.audio.addEventListener("loadedmetadata", function () {
        localThis.chapterDuration = Math.round(this.duration);
      });
      this.audio.addEventListener("ended", this.handleEnded);
      if (wasPlaying) {
        this.playAudio();
      }
    },
    isCurrentChapter: function (index) {
      if (this.currentChapter == index) {
        return true;
      }
      return false;
    },
    getCurrentChapter: function (currentChapter) {
      return this.chapters[currentChapter].url;
    },
    playAudio: function () {
      if (
        this.currentlyStopped == true &&
        this.currentChapter + 1 == this.chapters.length
      ) {
        this.currentChapter = 0;
        this.changeChapter();
      }
      if (!this.currentlyPlaying) {
        this.getCurrentTimeEverySecond(true);
        this.currentlyPlaying = true;
        this.audio.play();
      } else {
        this.stopAudio();
      }
      this.currentlyStopped = false;
    },
    stopAudio: function () {
      this.audio.pause();
      this.currentlyPlaying = false;
      this.pausedMusic();
    },
    handleEnded: function () {
      if (this.currentChapter + 1 == this.chapters.length) {
        this.stopAudio();
        this.currentlyPlaying = false;
        this.currentlyStopped = true;
      } else {
        this.currentlyPlaying = false;
        this.currentChapter++;
        this.changeChapter();
        this.playAudio();
      }
    },
    getCurrentTimeEverySecond: function (startStop) {
      var localThis = this;
      this.checkingCurrentPositionInChapter = setTimeout(
        function () {
          localThis.currentTime = localThis.audio.currentTime;
          localThis.getCurrentTimeEverySecond(true);
        }.bind(this),
        1000
      );
    },
    pausedMusic: function () {
      clearTimeout(this.checkingCurrentPositionInChapter);
    }
  },
  watch: {
    currentTime: function () {
      this.currentTime = Math.round(this.currentTime);
    }
  },
  beforeDestroy: function () {
    this.audio.removeEventListener("ended", this.handleEnded);
    this.audio.removeEventListener("loadedmetadata", this.handleEnded);

    clearTimeout(this.checkingCurrentPositionInChapter);
  }
}
