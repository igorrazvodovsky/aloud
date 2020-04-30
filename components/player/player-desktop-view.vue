<template>
  <div class="player-desktop">
    <div class="player-desktop__progress">
      <v-slider v-model="currentTime" min="0" :max="chapterDuration" hide-details></v-slider>
      <div class="player-desktop__progress-labels body-2">
        <div>
          <div class="secondary--text">{{ currentTime | fancyTimeFormat }}</div>
          {{ chapters[currentSong].title }}
          <!-- <span class="secondary--text">is read by Laurette</span> -->
        </div>
        <div class="secondary--text">
          <div>{{ chapterDuration | fancyTimeFormat }}</div>
          <div>7h 26min left</div>
        </div>
      </div>
    </div>
    <div class="player-desktop__actions">
      <div class="btn--vertical">
        <player-desktop-toc-dialog />
        <!-- <v-btn text rounded color="secondary">Table of contents</v-btn> -->
      </div>
      <button
        @click="playAudio()"
        :class="currentlyPlaying ? 'player-playpause playing' : 'player-playpause paused'"
        title="Play/pause book"
      >
        <label tabindex="1"></label>
      </button>
      <div class="btn--vertical">
        <v-btn disabled text rounded color="secondary">Bookmarks</v-btn>
      </div>
    </div>
    <div class="player-desktop__title">
      <div>
        <div class="overline mb-2 secondary--text">Now listening</div>
        <h1 class="display-3 serif mb-2">{{ book.metadata.title }}</h1>
        <h2 class="display-1 serif secondary--text">{{ book.metadata.creator }}</h2>
      </div>
      <div>
        <v-btn title="Rewind 15 sec" large icon>
          <icon-rewind />
        </v-btn>
        <v-btn title="Forward 15 sec" large icon class="mr-6">
          <icon-forward />
        </v-btn>
        <v-btn text rounded>
          <span class="body-1 text--secondary">1.0×</span>
        </v-btn>
        <sleep-menu />
        <v-btn disabled title="Opens in new" large icon>
          <icon-info />
        </v-btn>
        <v-btn disabled title="Add bookmark" large icon>
          <icon-bookmark />
        </v-btn>
      </div>
    </div>
  </div>
</template>
<script>
import { PlayerBase } from "~/components/player/player-base";
import PlayerDesktopTocDialog from "~/components/player/player-desktop-toc-dialog";
import SleepMenu from "~/components/player/player-desktop-menu-sleep.vue";
import "~/components/player/player-desktop.scss";
import IconRewind from "@/assets/Arrows_iconoteka_rotate_ccw_r_a.svg";
import IconForward from "@/assets/Arrows_iconoteka_rotate_cw_r_a.svg";
import IconBookmark from "@/assets/Files_iconoteka_bookmark_r_s.svg";
import IconInfo from "@/assets/Text_iconoteka_info_sans_serif__more__details__information__about_r_s.svg";

export default {
  components: {
    IconRewind,
    IconForward,
    IconBookmark,
    IconInfo,
    PlayerDesktopTocDialog,
    SleepMenu
  },
  props: ["closed"],

  // Inherit all parent properties
  ...PlayerBase,
  data() {
    return {
      audio: "",
      currentlyPlaying: false,
      currentlyStopped: false,
      currentTime: 0,
      checkingCurrentPositionInChapter: "",
      chapterDuration: 0,
      isPlaylistActive: false,
      currentSong: 0,
      debug: false,
      // TODO: Replace with bookChapters
      // {"title":"The Odyssey: Book 01","bitrate":"64","length":"23:06","format":"64Kbps MP3","original":"odyssey_01_homer_butler.mp3","name":"odyssey_01_homer_butler_64kb.mp3","source":"derivative","howl":null}
      // chapters: [
      //   {
      //     title: "Service Bell",
      //     artist: "Daniel Simion",
      //     url: "https://soundbible.com/mp3/service-bell_daniel_simion.mp3",
      //     image: "https://source.unsplash.com/crs2vlkSe98/400x400"
      //   }
      // ],
      audioFile: ""
    };
  },
  mounted: function() {
    this.changeSong();
    this.audio.loop = false;
  },
  // TODO: MMM?
  filters: {
    fancyTimeFormat: function(s) {
      return (s - (s %= 60)) / 60 + (9 < s ? ":" : ":0") + s;
    }
  },
  methods: {
    togglePlaylist: function() {
      this.isPlaylistActive = !this.isPlaylistActive;
    },
    nextSong: function() {
      if (this.currentSong < this.chapters.length - 1)
        this.changeSong(this.currentSong + 1);
    },
    prevSong: function() {
      if (this.currentSong > 0) this.changeSong(this.currentSong - 1);
    },
    changeSong: function(index) {
      var wasPlaying = this.currentlyPlaying;
      this.imageLoaded = false;
      if (index !== undefined) {
        this.stopAudio();
        this.currentSong = index;
      }
      this.audioFile = this.chapters[this.currentSong].url;
      this.audio = new Audio(this.audioFile);
      var localThis = this;
      this.audio.addEventListener("loadedmetadata", function() {
        localThis.chapterDuration = Math.round(this.duration);
      });
      this.audio.addEventListener("ended", this.handleEnded);
      if (wasPlaying) {
        this.playAudio();
      }
    },
    isCurrentSong: function(index) {
      if (this.currentSong == index) {
        return true;
      }
      return false;
    },
    getCurrentSong: function(currentSong) {
      return this.chapters[currentSong].url;
    },
    playAudio: function() {
      if (
        this.currentlyStopped == true &&
        this.currentSong + 1 == this.chapters.length
      ) {
        this.currentSong = 0;
        this.changeSong();
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
    stopAudio: function() {
      this.audio.pause();
      this.currentlyPlaying = false;
      this.pausedMusic();
    },
    handleEnded: function() {
      if (this.currentSong + 1 == this.chapters.length) {
        this.stopAudio();
        this.currentlyPlaying = false;
        this.currentlyStopped = true;
      } else {
        this.currentlyPlaying = false;
        this.currentSong++;
        this.changeSong();
        this.playAudio();
      }
    },
    getCurrentTimeEverySecond: function(startStop) {
      var localThis = this;
      this.checkingCurrentPositionInChapter = setTimeout(
        function() {
          localThis.currentTime = localThis.audio.currentTime;
          localThis.getCurrentTimeEverySecond(true);
        }.bind(this),
        1000
      );
    },
    pausedMusic: function() {
      clearTimeout(this.checkingCurrentPositionInChapter);
    }
  },
  watch: {
    currentTime: function() {
      this.currentTime = Math.round(this.currentTime);
    }
  },
  beforeDestroy: function() {
    this.audio.removeEventListener("ended", this.handleEnded);
    this.audio.removeEventListener("loadedmetadata", this.handleEnded);

    clearTimeout(this.checkingCurrentPositionInChapter);
  }
};
</script>
