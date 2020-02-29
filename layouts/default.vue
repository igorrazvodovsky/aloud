<template>
  <v-app class="player">
    <!-- <v-system-bar dark>
      <v-spacer></v-spacer>
      <v-icon>mdi-wifi-strength-4</v-icon>
      <v-icon>mdi-signal-cellular-outline</v-icon>
      <v-icon>mdi-battery</v-icon>
      <span>12:30</span>
    </v-system-bar> -->
    <div
      class="mx-2 my-2 d-flex flex-no-wrap justify-space-between"
      @click.stop="open = false"
    >
      <v-slide-y-reverse-transition hide-on-leave leave-absolute>
        <!-- Book: what's playing -->
        <div key="1" v-if="!open" class="ml-2">
          <span class="overline theme--dark secondary--text">Listening to</span>
          <h1 class="title">Chapter 2</h1>
          <span class="subtitle-1 theme--dark secondary--text"
            >of Northanger Abbey</span
          >
        </div>
        <!-- Book collapsed: play/pause -->
        <div key="2" v-if="open" class="d-flex align-center">
          <v-btn dark text icon @click.stop="playing = !playing">
            <v-icon v-if="playing">mdi-pause-circle</v-icon>
            <v-icon v-else>mdi-play-circle</v-icon>
          </v-btn>
          <div class="subtitle-2">Northanger Abbey</div>
        </div>
      </v-slide-y-reverse-transition>

      <v-slide-y-reverse-transition hide-on-leave>
        <!-- Book: tertiary actions -->
        <div key="1" v-if="!open" class="ml-auto">
          <v-btn dark text icon color="secondary">
            <v-icon>mdi-information-outline</v-icon>
          </v-btn>
          <v-btn dark text icon color="secondary">
            <v-icon>mdi-format-list-bulleted</v-icon>
          </v-btn>
          <v-btn dark text icon color="secondary">
            <v-icon>mdi-dots-horizontal</v-icon>
          </v-btn>
        </div>
        <!-- Book collapsed: secondary action -->
        <div key="2" v-if="open" class="ml-auto">
          <v-btn dark text icon color="secondary">
            <v-icon>mdi-rewind-30</v-icon>
          </v-btn>
        </div>
      </v-slide-y-reverse-transition>
    </div>
    <v-layout
      v-if="!open"
      column
      justify-space-between
      align-stretch
      player-container
    >
      <!-- Chapter progress -->
      <v-flex xs12>
        <v-slider
          dark
          v-model="currentTime"
          min="0"
          max="100"
          hide-details
          class="mt-6"
        ></v-slider>
        <div class="d-flex justify-space-between mx-4">
          <div class="overline theme--dark secondary--text">04:15</div>
          <v-spacer></v-spacer>
          <div class="overline theme--dark secondary--text">-31:17</div>
        </div>
      </v-flex>

      <!-- Book primary actions -->
      <v-flex
        xs12
        d-flex
        align-center
        justify-space-around
        player-actions-primary
      >
        <v-btn large dark text icon>
          <v-icon>mdi-rewind-30</v-icon>
        </v-btn>
        <button
          :class="
            playing ? 'player-playpause playing' : 'player-playpause paused'
          "
          @click.stop="playing = !playing"
        >
          <!-- <input type="checkbox" value="None" id="playpause" name="check" /> -->
          <label tabindex="1"></label>
        </button>
        <v-btn large dark text icon>
          <v-icon>mdi-fast-forward-30</v-icon>
        </v-btn>
      </v-flex>

      <!-- Book secondary actions -->
      <v-flex xs12 mx-auto my-10>
        <v-btn dark color="secondary" class="px-0" text>
          1.25×
        </v-btn>
        <v-btn dark color="secondary" class="mx-3" text icon>
          <v-icon>mdi-power-sleep</v-icon>
        </v-btn>
        <v-btn dark color="secondary" class="mx-3" text icon>
          <v-icon>mdi-bookmark</v-icon>
        </v-btn>
        <!-- TODO: Switch to reading -->
        <!-- <v-btn dark color="secondary" class="mx-3" text icon>
          <v-icon>mdi-glasses</v-icon>
        </v-btn> -->
      </v-flex>
    </v-layout>
    <v-card
      class="books"
      :style="open ? 'top: 3.25rem' : 'top: 80vh'"
      @click.stop="open = true"
      :ripple="false"
    >
      <v-row justify="space-between" class="pl-4 pr-2">
        <v-col cols="auto">
          <h2 class="title primary--text">
            Books
          </h2>
        </v-col>
        <v-col cols="auto">
          <v-btn @click.stop="" text icon color="secondary">
            <v-icon>mdi-magnify</v-icon>
          </v-btn>
        </v-col>
      </v-row>
      <!-- <v-content> -->
        <!-- <v-container> -->
          <nuxt />
        <!-- </v-container> -->
      <!-- </v-content> -->
    </v-card>
  </v-app>
</template>

<script>
export default {
  data() {
    return {
      sheet: true,
      open: false,
      currentTime: 50,
      playing: false
    };
  }
};
</script>
