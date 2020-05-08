<!-- 3. Lists (TOC & Bookmarks) -->

<template>
  <!-- Loading -->
  <div class="loading" v-if="loading">
    <div class="text-center">
      <v-progress-circular indeterminate></v-progress-circular>
      <!-- <div v-if="loadingError" class="mt-6 body-2 text--secondary">
        An errror occured while loading the book. Retrying...
      </div>-->
    </div>
  </div>

  <div
    v-else
    class="player player-mobile"
    :class="{ disabled: speedMenu || sleepMenu }"
  >
    <!-- Header -->
    <div
      class="mx-2 my-2 d-flex flex-no-wrap justify-space-between player-header"
      @click.stop="$emit('open-player')"
    >
      <v-slide-y-reverse-transition hide-on-leave leave-absolute>
        <!-- Book: what's playing -->
        <div key="1" v-if="!closed" class="ml-2">
          <span class="overline secondary--text">Listening to</span>
          <h1 class="headline serif">{{ book.metadata.title }}</h1>
          <span class="subtitle-1 secondary--text">{{
            !openLists ? "Chapter 2" : ""
          }}</span>
        </div>
        <!-- MOBILE: Book collapsed: play/pause -->
        <div key="2" v-if="closed" class="d-flex align-center">
          <v-btn text icon @click.stop="playAudio">
            <icon-pause v-if="currentlyPlaying" />
            <icon-play v-else />
          </v-btn>
          <div class="subtitle-2">
            {{ book.metadata.title }}
            <span>•</span> Ch. 2
          </div>
        </div>
      </v-slide-y-reverse-transition>

      <v-slide-y-reverse-transition hide-on-leave>
        <!-- Book: tertiary actions -->
        <div key="1" v-if="!closed && !openLists" class="ml-auto">
          <v-btn text icon @click.stop="openLists = !openLists">
            <icon-list />
          </v-btn>
        </div>
        <!-- Book collapsed: secondary action -->
        <div key="2" v-if="closed" class="ml-auto">
          <v-btn text icon @click.stop>
            <icon-back />
          </v-btn>
        </div>
        <v-btn
          key="3"
          v-if="openLists"
          text
          icon
          @click.stop="openLists = false"
        >
          <icon-close />
        </v-btn>
      </v-slide-y-reverse-transition>
    </div>

    <!-- 2. MAIN -->
    <!-- TODO: Transition between controls & lists -->
    <keep-alive>
      <!-- <player-main
        @load="loading = false"
        @pause="playing = false"
        @play="playing = true"
        @disable="disabled = !disabled"
        ref="player"
        :chapters="chapters"
      />-->
      <div v-if="!openLists" class="player-actions-container">
        <v-layout
          column
          justify-end
          align-stretch
          player-actions-container-primary
        >
          <!-- Chapter progress -->
          <progress-slider
            v-if="chapterDuration > 0"
            :chapterDuration="chapterDuration"
            :chapter="chapters[currentChapter].title"
            :rewindedFor="rewindedFor"
          />
          <!-- Book primary actions -->
          <v-flex
            xs12
            d-flex
            align-center
            justify-space-around
            player-actions-primary
            my-12
          >
            <v-btn large text icon @click="handleRewind(-15)">
              <icon-rewind />
            </v-btn>
            <button
              :class="
                currentlyPlaying
                  ? 'player-playpause playing'
                  : 'player-playpause paused'
              "
              @click="playAudio"
            >
              <label tabindex="1"></label>
            </button>
            <v-btn large text icon @click="handleRewind(15)">
              <icon-forward />
            </v-btn>
          </v-flex>

          <!-- Book secondary actions -->
          <v-flex xs12 mx-auto my-8>
            <v-btn
              class="px-0 text--secondary body-1"
              text
              rounded
              @click.stop="speedMenu = !speedMenu"
              >{{ rate }}×</v-btn
            >

            <v-btn
              class="mx-3 player-sleep-btn player-sleep-btn--on"
              text
              icon
              @click.stop="sleepMenu = !sleepMenu"
            >
              <icon-sleep />
            </v-btn>
            <v-btn disabled class="mx-3" text icon>
              <icon-bookmark />
            </v-btn>
          </v-flex>
        </v-layout>

        <div class="player-actions-container-secondary">
          <playback-rate-menu
            key="1"
            v-if="speedMenu"
            :open="speedMenu"
            :current-speed="rate"
            @close="speedMenu = false"
          />
          <sleep-menu
            key="2"
            v-if="sleepMenu"
            :open="sleepMenu"
            @close="sleepMenu = false"
          />
        </div>
      </div>
    </keep-alive>
    <player-lists v-if="openLists" @close-lists="openLists = false" />
  </div>
</template>

<script>
import { PlayerBase } from "~/components/player/player-base";
import PlayerLists from "~/components/player/player-mobile-lists.vue";
import IconList from "@/assets/UI_iconoteka_list__playlist_queue_r_a.svg";
import IconClose from "@/assets/UI_iconoteka_close__delete__cross__clear_r_a.svg";
import IconBack from "@/assets/Arrows_iconoteka_rotate_ccw_r_a.svg";
import IconPlay from "@/assets/Multimedia_iconoteka_play_circle_a_f.svg";
import IconPause from "@/assets/Multimedia_iconoteka_pause_circle_r_f.svg";
import { mapState } from "vuex";
import PlaybackRateMenu from "~/components/player/player-mobile-menu-rate.vue";
import SleepMenu from "~/components/player/player-mobile-menu-sleep.vue";
import ProgressSlider from "~/components/player/player-progress-slider.vue";
import IconRewind from "@/assets/Arrows_iconoteka_rotate_ccw_r_a.svg";
import IconForward from "@/assets/Arrows_iconoteka_rotate_cw_r_a.svg";
import IconBookmark from "@/assets/Files_iconoteka_bookmark_r_s.svg";
import IconSleep from "@/assets/Weather_iconoteka_moon__waning_crescent__red_crescent_r_s.svg";
// TODO: Check
import "~/components/player/player-mobile.scss";
import "~/components/player/player.scss";
export default {
  components: {
    PlayerLists,
    IconList,
    IconClose,
    IconBack,
    IconPlay,
    IconPause,
    IconRewind,
    IconForward,
    IconBookmark,
    IconSleep,
    ProgressSlider,
    SleepMenu,
    PlaybackRateMenu
  },
  props: ["closed"],
  ...PlayerBase
};
</script>
