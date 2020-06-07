// TODO:
// Rewinding back to the previous chapter
// File duplication when rebuilding
import { mapState, mapMutations } from "vuex";

export const PlayerBase = {
  data: () => ({
    audio: "",
    currentlyPlaying: false,
    currentlyStopped: false,
    checkingCurrentPositionInChapter: "",
    chapterDuration: 0,
    audioFile: "",
    canPlayFile: false,
    rewindedFor: 0,
    // TODO: Move mobile/desktop specific properties
    openLists: false,
    speedMenu: false,
    sleepMenu: false
  }),
  computed: {
    ...mapState(["book", "rate", "loading"]),
    currentTime() {
      return this.$store.state.currentBook.time;
    },
    currentChapter() {
      return this.$store.state.currentBook.chapter;
    },
    chapters() {
      return this.$store.getters.chapters;
    }
  },
  mounted: function() {
    this.loadChapter();
    this.audio.loop = false;
    window.addEventListener("keyup", e => {
      if (e.code === "Space" || e.code === "Enter") this.playAudio();
      if (e.code === "ArrowLeft") this.handleRewind(-15);
      if (e.code === "ArrowRight") this.handleRewind(15);
    });
    // Disable page scrolling with 'space'
    window.addEventListener("keydown", e => {
      if (e.code === "Space") {
        e.preventDefault();
      }
    });
    // Event emitted by selecting a chapter in TOC
    this.$root.$on("change-chapter", index => {
      this.changeChapter(index);
    });
  },
  methods: {
    ...mapMutations(["setChapter", "setTime", "setLoading"]),

    // Rewind & forward
    handleRewind(ammount) {
      clearTimeout(this.rewindTimeout);
      let newTime = this.currentTime + ammount;
      this.rewindedFor = this.rewindedFor + ammount;
      if (newTime > 0 && newTime < this.chapterDuration) {
        // TODO: Fix
        this.audio.currentTime = this.currentTime + ammount;
        this.setTime(this.currentTime + ammount);
      }
      // Handle chapter change
      // Back
      else if (newTime < 0 && this.currentChapter > 0) {
        let time =
          this.lengthToSec(this.chapters[this.currentChapter - 1].length) +
          this.currentTime;
        this.changeChapter(this.currentChapter - 1, time);
      }
      // Forth
      else if (
        this.currentTime > this.chapterDuration &&
        this.currentChapter < this.chapters.length - 1
      )
        this.changeChapter(
          this.currentChapter + 1,
          this.currentTime - this.chapterDuration
        );
      // Restart the feedback timer
      this.rewindTimeout = setTimeout(
        function() {
          this.rewindedFor = 0;
        }.bind(this),
        2000
      );
    },
    lengthToSec: function(time) {
      return time
        .split(":")
        .reverse()
        .reduce((sum, x, i) => Number(sum) + Number(x) * (60 * i));
    },
    nextChapter: function() {
      if (this.currentChapter < this.chapters.length - 1)
        this.changeChapter(this.currentChapter + 1);
    },
    prevChapter: function() {
      if (this.currentChapter > 0) this.changeChapter(this.currentChapter - 1);
    },

    loadChapter: function() {
      this.audioFile = this.chapters[this.currentChapter].url;
      this.audio = new Audio(this.audioFile);
      this.audio.preload = "auto";
      this.audio.currentTime = this.currentTime;
      this.canPlayFile = false;
      var localThis = this;
      this.audio.addEventListener("loadedmetadata", function() {
        localThis.chapterDuration = Math.round(this.duration);
        localThis.setLoading(false);
      });
      this.audio.addEventListener("canplaythrough", function() {
        localThis.canPlayFile = true;
      });
      // TODO: readyState is always 1. WHY?
      this.audio.addEventListener("waiting", function() {
        if (localThis.audio.readyState >= 2) localThis.canPlayFile = true;
        else localThis.canPlayFile = false;
      });
      this.audio.addEventListener("error", function(e) {
        // TODO: Try again or switch source
        // if no response has come back after N milliseconds, show the feedback and
        // either start the next attempt or, if this was the third attempt, show "Try later" feedback.
        let msg = "";
        switch (e.target.error.code) {
          case e.target.error.MEDIA_ERR_NETWORK:
            msg = "A network error caused the audio download to fail.";
            break;
          case e.target.error.MEDIA_ERR_DECODE:
            msg =
              "The audio playback was aborted due to a corruption problem or because the audio used features your browser did not support.";
            break;
          case e.target.error.MEDIA_ERR_SRC_NOT_SUPPORTED:
            msg =
              "The audio not be loaded, either because the server or network failed or because the format is not supported.";
            break;
          default:
            msg = "An unknown error occurred.";
            break;
        }
        localThis.$toasted.error("😔 " + msg, {
          action: {
            text: "OK",
            onClick: (e, toastObject) => {
              toastObject.goAway(0);
            }
          }
        });
      });
      this.audio.addEventListener("ended", this.handleEnded);
    },

    changeChapter: function(index, time) {
      // For resuming the playback
      let wasPlaying = this.currentlyPlaying;
      if (index !== undefined) {
        this.stopAudio();
        this.setChapter(index);
      }
      this.setTime(time ? time : 0);
      this.loadChapter(index);
      if (wasPlaying) {
        this.playAudio();
      }
    },

    isCurrentChapter: function(index) {
      if (this.currentChapter == index) {
        return true;
      }
      return false;
    },
    getCurrentChapter: function(currentChapter) {
      return this.chapters[currentChapter].url;
    },

    playAudio: function() {
      // Rewind to start at the end of the book
      if (
        this.currentlyStopped == true &&
        this.currentChapter + 1 == this.chapters.length
      ) {
        this.setChapter(0);
        this.changeChapter();
      }
      // Play/pause
      if (!this.currentlyPlaying) {
        this.getCurrentTimeEverySecond(true);
        this.currentlyPlaying = true;
        this.audio.playbackRate = this.rate;
        this.audio.play();
      } else {
        this.stopAudio();
      }
      this.currentlyStopped = false;
    },
    stopAudio: function() {
      this.audio.pause();
      this.currentlyPlaying = false;
      this.pausedBook();
    },
    handleEnded: function() {
      if (this.currentChapter + 1 == this.chapters.length) {
        this.stopAudio();
        this.currentlyPlaying = false;
        this.currentlyStopped = true;
      } else {
        this.currentlyPlaying = false;
        this.setChapter(this.currentChapter + 1);
        this.changeChapter();
        this.playAudio();
      }
    },
    getCurrentTimeEverySecond: function() {
      var localThis = this;
      this.checkingCurrentPositionInChapter = setTimeout(
        function() {
          localThis.setTime(Math.round(localThis.audio.currentTime));
          localThis.getCurrentTimeEverySecond(true);
        }.bind(this),
        1000
      );
    },
    pausedBook: function() {
      clearTimeout(this.checkingCurrentPositionInChapter);
    }
  },
  watch: {
    rate: function() {
      this.audio.playbackRate = this.rate;
    }
  },
  beforeDestroy: function() {
    this.stopAudio();
    this.audio.removeEventListener("ended", this.handleEnded);
    this.audio.removeEventListener("loadedmetadata", this.handleEnded);
    this.audio.removeEventListener("canplaythrough", this.handleEnded);
    this.audio.removeEventListener("error", this.handleEnded);

    clearTimeout(this.checkingCurrentPositionInChapter);
  }
};
