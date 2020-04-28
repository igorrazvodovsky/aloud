<template>
  <div class="player-desktop">
    <div class="player-desktop__progress">
      <v-slider v-model="sliderPosition" min="0" :max="1000" hide-details></v-slider>
      <div class="player-desktop__progress-labels body-2">
        <div>
          <div class="secondary--text">07:17</div>Chapter 4
          <span class="secondary--text">is read by Laurette</span>
        </div>
        <div class="secondary--text">
          <div>14:55</div>
          <div>7h 26min left</div>
        </div>
      </div>
    </div>
    <div class="player-desktop__actions">
      <div class="btn--vertical">
        <player-desktop-toc-dialog />
        <!-- <v-btn text rounded color="secondary">Table of contents</v-btn> -->
      </div>
      <button class="player-playpause paused">
        <label tabindex="1"></label>
      </button>
      <div class="btn--vertical">
        <v-btn disabled text rounded color="secondary">Bookmarks</v-btn>
      </div>
    </div>
    <div class="player-desktop__title">
      <div>
        <div class="overline mb-2">Now listening</div>
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
          <span class="body-1">1.0×</span>
        </v-btn>
        <v-btn title="Set timer" large icon>
          <icon-sleep />
        </v-btn>
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
import { PlayerBase } from "~/components/player/PlayerBase";
import PlayerDesktopTocDialog from "~/components/player/PlayerDesktopTocDialog";
import "~/components/player/PlayerDesktop.scss";
import IconRewind from "@/assets/Arrows_iconoteka_rotate_ccw_r_a.svg";
import IconForward from "@/assets/Arrows_iconoteka_rotate_cw_r_a.svg";
import IconBookmark from "@/assets/Files_iconoteka_bookmark_r_s.svg";
import IconSleep from "@/assets/Weather_iconoteka_moon__waning_crescent__red_crescent_r_s.svg";
import IconInfo from "@/assets/Text_iconoteka_info_sans_serif__more__details__information__about_r_s.svg";

export default {
  components: {
    IconRewind,
    IconForward,
    IconBookmark,
    IconSleep,
    IconInfo,
    PlayerDesktopTocDialog
  },
  props: ["closed"],

  // Inherit all parent properties
  ...PlayerBase,
  data() {
    return {
      sliderPosition: 300
    };
  }
};
</script>
