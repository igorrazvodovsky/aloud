<!-- 3. Lists (TOC & Bookmarks) -->

<template>
  <div
    class="player player--mobile"
    :class="{ disabled: speedMenu || sleepMenu }"
  >
    <!-- Header -->
    <div
      class="mx-2 my-2 d-flex flex-no-wrap justify-space-between player__header"
      @click.stop="$emit('open:player')"
    >
      <v-slide-y-reverse-transition hide-on-leave leave-absolute>
        <!-- Book: what's playing -->
        <div key="1" v-if="!closed" class="ml-2">
          <span class="overline secondary--text">Listening to</span>
          <h1 class="headline serif">{{ book.metadata.title }}</h1>
          <span class="subtitle-1 secondary--text">
            {{ !openLists ? chapters[currentChapter].title : "" }}
          </span>
        </div>
        <!-- MOBILE: Book collapsed: play/pause -->
        <div key="2" v-if="closed" class="d-flex align-center">
          <v-btn text icon @click.stop="playAudio">
            <icon-pause-circle v-if="currentlyPlaying" />
            <icon-play-circle v-else />
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
      <div v-if="!openLists" class="player__body">
        <v-layout column justify-end align-stretch player__main>
          <!-- Chapter progress -->
          <progress-slider
            v-if="chapterDuration > 0"
            :chapterDuration="chapterDuration"
            :chapter="chapters[currentChapter].title"
            :rewindedFor="rewindedFor"
            @handle-rewind="handleRewind"
          />
          <!-- Book primary actions -->
          <v-flex xs12 d-flex align-center justify-space-around player__actions>
            <v-btn large text icon @click="handleRewind(-15)">
              <icon-rewind />
            </v-btn>
            <div class="player__playpause">
              <button
                @click="playAudio"
                :title="currentlyPlaying ? 'Pause' : 'Play'"
                :class="
                  !canPlayFile
                    ? 'loading'
                    : currentlyPlaying
                    ? 'playing'
                    : 'paused'
                "
              >
                <v-slide-y-transition hide-on-leave leave-absolute>
                  <v-progress-circular
                    v-if="!canPlayFile"
                    indeterminate
                    color="white"
                  ></v-progress-circular>
                  <icon-play v-if="!currentlyPlaying && canPlayFile" />
                  <icon-pause v-if="currentlyPlaying && canPlayFile" />
                </v-slide-y-transition>
              </button>
            </div>
            <v-btn large text icon @click="handleRewind(15)">
              <icon-forward />
            </v-btn>
          </v-flex>

          <!-- Book secondary actions -->
          <v-flex xs12 mx-auto my-8 player__options>
            <v-btn
              class="px-0 text--secondary body-1"
              text
              rounded
              @click.stop="speedMenu = !speedMenu"
              >{{ rate }}×</v-btn
            >
            <v-btn
              class="mx-3 player__sleep-btn player__sleep-btn--on"
              text
              icon
              disabled
              @click.stop="sleepMenu = !sleepMenu"
            >
              <icon-sleep />
            </v-btn>
            <v-btn disabled class="mx-3" text icon>
              <icon-bookmark />
            </v-btn>
          </v-flex>
        </v-layout>

        <div class="player__secondary">
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
import { PlayerBase } from "@/components/player/player-base";
import PlayerLists from "@/components/player/player-mobile-lists.vue";
import IconList from "@/assets/UI_iconoteka_list__playlist_queue_r_a.svg";
import IconClose from "@/assets/UI_iconoteka_close__delete__cross__clear_r_a.svg";
import IconBack from "@/assets/Arrows_iconoteka_rotate_ccw_r_a.svg";
import IconPlay from "@/assets/play.svg";
import IconPause from "@/assets/pause.svg";
import IconPlayCircle from "@/assets/Multimedia_iconoteka_play_circle_a_f.svg";
import IconPauseCircle from "@/assets/Multimedia_iconoteka_pause_circle_r_f.svg";
import PlaybackRateMenu from "@/components/player/menus/player-menu-rate-mobile.vue";
import SleepMenu from "@/components/player/menus/player-menu-sleep-mobile.vue";
import ProgressSlider from "@/components/player/player-progress-slider.vue";
import IconRewind from "@/assets/Arrows_iconoteka_rotate_ccw_r_a.svg";
import IconForward from "@/assets/Arrows_iconoteka_rotate_cw_r_a.svg";
import IconBookmark from "@/assets/Files_iconoteka_bookmark_r_s.svg";
import IconSleep from "@/assets/Weather_iconoteka_moon__waning_crescent__red_crescent_r_s.svg";
import "@/components/player/player.scss";
import "@/components/player/player-mobile.scss";
export default {
  components: {
    PlayerLists,
    IconList,
    IconClose,
    IconBack,
    IconPlay,
    IconPause,
    IconPlayCircle,
    IconPauseCircle,
    IconRewind,
    IconForward,
    IconBookmark,
    IconSleep,
    ProgressSlider,
    SleepMenu,
    PlaybackRateMenu
  },
  props: ["closed"],
  created() {
    // Event emitted by selecting a chapter
    this.$root.$on("close-toc", () => {
      this.openLists = false;
    });
  },
  ...PlayerBase
};
</script>
