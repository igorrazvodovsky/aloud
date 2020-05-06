<template>
  <div class="player-desktop">
    <div class="player-desktop__progress">
      <v-slider
        v-model="currentTime"
        min="0"
        :max="chapterDuration"
        hide-details
      ></v-slider>
      <div class="player-desktop__progress-labels body-2">
        <div>
          <div class="secondary--text">{{ currentTime | MMSSTimeFormat }}</div>
          {{ chapters[currentChapter].title }}
          <!-- <span class="secondary--text">is read by Laurette</span> -->
        </div>
        <div class="secondary--text">
          <div>{{ chapterDuration | MMSSTimeFormat }}</div>
          <div>
            {{ remainingTime | fancyTimeFormat }}
          </div>
        </div>
      </div>
    </div>
    <div class="player-desktop__actions">
      <div class="btn--vertical">
        <player-desktop-toc-dialog />
      </div>
      <button
        @click="playAudio()"
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
        <v-btn title="Rewind 15 sec" large icon>
          <icon-rewind />
        </v-btn>
        <v-btn title="Forward 15 sec" large icon class="mr-6">
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
import PlayerDesktopTocDialog from "~/components/player/player-desktop-toc-dialog";
import SleepMenu from "~/components/player/player-desktop-menu-sleep.vue";
import RateMenu from "~/components/player/player-desktop-menu-rate.vue";
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
    RateMenu
  },
  // Inherit all parent properties
  ...PlayerBase
};
</script>
