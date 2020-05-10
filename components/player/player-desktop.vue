<template>
  <div class="loading" v-if="loading">
    <div class="text-center">
      <v-progress-circular indeterminate></v-progress-circular>
      <div v-if="loadingError" class="mt-6 body-2 text--secondary">
        An errror occured while loading the book. Retrying...
      </div>
    </div>
  </div>
  <div v-else class="player player-desktop">
    <progress-slider
      v-if="chapterDuration > 0"
      :chapterDuration="chapterDuration"
      :chapter="chapters[currentChapter].title"
      :rewindedFor="rewindedFor"
    />
    <div class="player-desktop__actions">
      <div class="btn--vertical">
        <player-desktop-toc-dialog />
      </div>
      <button
        @click="playAudio"
        :class="
          currentlyPlaying
            ? 'player-playpause playing'
            : 'player-playpause paused'
        "
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
import PlayerDesktopTocDialog from "~/components/player/player-toc-desktop-dialog";
import ProgressSlider from "~/components/player/player-progress-slider.vue";
import SleepMenu from "~/components/player/menus/player-menu-sleep-desktop.vue";
import RateMenu from "~/components/player/menus/player-menu-rate-desktop.vue";
import "~/components/player/player-desktop.scss";
import "~/components/player/player.scss";
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
    SleepMenu,
    RateMenu,
    ProgressSlider
  },
  ...PlayerBase
};
</script>
