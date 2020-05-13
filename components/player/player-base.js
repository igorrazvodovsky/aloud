import { mapState, mapMutations } from "vuex";

export const PlayerBase = {
  data: () => ({
    audio: "",
    currentlyPlaying: false,
    currentlyStopped: false,
    checkingCurrentPositionInChapter: "",
    chapterDuration: 0,
    audioFile: "",
    rewindedFor: 0,
    loading: true,
    loadingError: false,
    // TODO: Move mobile/desktop specific properties
    openLists: false,
    speedMenu: false,
    sleepMenu: false
  }),
  computed: {
    ...mapState(["book", "rate", "currentBook"]),
    chapters() {
      return this.$store.getters.chapters;
    }
  },
  mounted: function () {
    this.changeChapter();
    this.audio.loop = false;
    window.addEventListener('keyup', event => {
      if (event.code === "Space" || event.code === "Enter") {
        this.playAudio()
      }
    }),
      // Event emitted by selecting a chapter
      this.$nuxt.$on("change-chapter", (index) => {
        this.changeChapter(index)
      });
  },
  methods: {
    ...mapMutations(["setCurrentChapter"]),
    // Rewind & forward
    handleRewind(ammount) {
      clearTimeout(this.rewindTimeout);
      this.setCurrentTime(this.currentBook.time + ammount);
      this.rewindedFor = this.rewindedFor + ammount;
      this.rewindTimeout = setTimeout(
        function () {
          this.rewindedFor = 0;
        }.bind(this),
        2000
      );
    },
    setCurrentTime(time) {
      this.$store.commit("setCurrentTime", time);
    },
    nextChapter: function () {
      if (this.currentBook.chapter < this.chapters.length - 1)
        this.changeChapter(this.currentBook.chapter + 1);
    },
    prevChapter: function () {
      if (this.currentBook.chapter > 0) this.changeChapter(this.currentBook.chapter - 1);
    },
    changeChapter: function (index) {
      var wasPlaying = this.currentlyPlaying;
      if (index !== undefined) {
        this.stopAudio();
        this.setCurrentChapter(index);
      }
      this.setCurrentTime(0);
      this.audioFile = this.chapters[this.currentBook.chapter].url;
      this.audio = new Audio(this.audioFile);
      var localThis = this;
      this.audio.addEventListener("loadedmetadata", function () {
        localThis.chapterDuration = Math.round(this.duration);
        localThis.loading = false;
        localThis.loadingError = false
      });
      this.audio.addEventListener("error", function () {
        // TODO: handle timeouts
        localThis.loadingError = true;
        localThis.playAudio();
      });
      this.audio.addEventListener("ended", this.handleEnded);
      if (wasPlaying) {
        this.playAudio();
      }
    },
    isCurrentChapter: function (index) {
      if (this.currentBook.chapter == index) {
        return true;
      }
      return false;
    },
    getCurrentChapter: function (currentBook) {
      return this.chapters[currentBook.chapter].url;
    },
    playAudio: function () {
      if (
        this.currentlyStopped == true &&
        this.currentBook.chapter + 1 == this.chapters.length
      ) {
        this.setCurrentChapter(0);
        this.changeChapter();
      }
      if (!this.currentlyPlaying) {
        this.getCurrentTimeEverySecond(true);
        this.currentlyPlaying = true;
        this.audio.playbackRate = this.rate;
        this.audio.currentTime = this.currentBook.time;
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
      if (this.currentBook.chapter + 1 == this.chapters.length) {
        this.stopAudio();
        this.currentlyPlaying = false;
        this.currentlyStopped = true;
      } else {
        this.currentlyPlaying = false;
        this.setCurrentChapter(this.currentBook.chapter + 1);
        this.changeChapter();
        this.playAudio();
      }
    },
    getCurrentTimeEverySecond: function (startStop) {
      var localThis = this;
      this.checkingCurrentPositionInChapter = setTimeout(
        function () {
          localThis.setCurrentTime(Math.round(localThis.audio.currentTime));
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
    rate() {
      this.audio.playbackRate = this.rate
    },
    currentBook() {
      this.audio.currentTime = this.currentBook.time
    }
  },
  beforeDestroy: function () {
    this.audio.removeEventListener("ended", this.handleEnded);
    this.audio.removeEventListener("loadedmetadata", this.handleEnded);

    clearTimeout(this.checkingCurrentPositionInChapter);
  }
}
