<template>
  <div class="player player--desktop">
    <div class="player__header">
      <v-slide-y-transition hide-on-leave leave-absolute>
        <v-progress-linear
          v-if="chapterDuration == 0"
          indeterminate
        ></v-progress-linear>
        <progress-slider
          v-else
          :chapterDuration="chapterDuration"
          :chapter="chapters[currentChapter].title"
          :rewindedFor="rewindedFor"
          @handle-rewind="handleRewind"
        />
      </v-slide-y-transition>
    </div>
    <div class="player__actions">
      <div class="btn--vertical">
        <toc-dialog />
      </div>
      <div class="player__playpause">
        <button
          @click="playAudio"
          :title="currentlyPlaying ? 'Pause' : 'Play'"
          :class="
            !canPlayFile ? 'loading' : currentlyPlaying ? 'playing' : 'paused'
          "
        >
          <v-slide-y-transition hide-on-leave leave-absolute>
            <v-progress-circular
              v-if="!canPlayFile"
              indeterminate
              color="white"
            ></v-progress-circular>
            <icon-play id="icon-play" v-if="!currentlyPlaying && canPlayFile" />
            <icon-pause v-if="currentlyPlaying && canPlayFile" />
          </v-slide-y-transition>
        </button>
      </div>
      <div class="btn--vertical">
        <v-btn disabled text rounded color="secondary">Bookmarks</v-btn>
      </div>
    </div>
    <!-- TODO: Add transition -->
    <div class="player__title">
      <div>
        <div class="overline mb-2 secondary--text">Listening to</div>
        <h1 class="display-3 serif mb-2">{{ book.metadata.title }}</h1>
        <h2 class="display-1 serif secondary--text">
          by {{ book.metadata.creator }}
        </h2>
      </div>
      <div>
        <v-btn @click="handleRewind(-15)" title="Rewind 15 sec" large icon>
          <icon-rewind />
        </v-btn>
        <v-btn
          @click="handleRewind(15)"
          title="Forward 15 sec"
          large
          icon
          class="mr-6"
        >
          <icon-forward />
        </v-btn>
        <rate-menu />
        <!-- <sleep-menu /> -->
        <!-- <v-btn disabled title="Opens in new" large icon>
          <icon-info />
        </v-btn> -->
        <!-- <v-btn disabled title="Add bookmark" large icon>
          <icon-bookmark />
        </v-btn> -->
        <about-dialog class="d-inline" />
      </div>
    </div>
  </div>
</template>
<script>
import { PlayerBase } from "~/components/player/player-base";
import TocDialog from "~/components/player/player-toc-desktop-dialog";
import AboutDialog from "~/components/player/player-desktop-about";
import ProgressSlider from "~/components/player/player-progress-slider.vue";
import SleepMenu from "~/components/player/menus/player-menu-sleep-desktop.vue";
import RateMenu from "~/components/player/menus/player-menu-rate-desktop.vue";
import "~/components/player/player-desktop.scss";
import IconRewind from "@/assets/Arrows_iconoteka_rotate_ccw_r_a.svg";
import IconForward from "@/assets/Arrows_iconoteka_rotate_cw_r_a.svg";
import IconPlay from "@/assets/play.svg";
import IconPause from "@/assets/pause.svg";
import IconBookmark from "@/assets/Files_iconoteka_bookmark_r_s.svg";
import IconInfo from "@/assets/Text_iconoteka_info_sans_serif__more__details__information__about_r_s.svg";

export default {
  components: {
    IconRewind,
    IconForward,
    IconBookmark,
    IconInfo,
    IconPlay,
    IconPause,
    TocDialog,
    AboutDialog,
    SleepMenu,
    RateMenu,
    ProgressSlider
  },
  ...PlayerBase
};
</script>
