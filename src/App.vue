<template>
  <v-app>
    <!-- <v-app-bar app color="primary" dark>
    </v-app-bar> -->
    <v-content class="player">
      <div class="player--loading" v-if="loading">
        <div class="text-center">
          <v-progress-circular indeterminate></v-progress-circular>
          <!-- <div
          v-if="loadingError"
          class="mt-6 body-2 text--secondary"
        >An errror occured while loading the book. Retrying...</div>-->
        </div>
      </div>
      <template v-if="!loading && error == null">
        <player-desktop
          v-if="player && !isMobile"
          @open:player="toggleBrowser"
          :closed="browser"
        />
        <player-mobile
          v-if="player && isMobile"
          @open:player="toggleBrowser"
          :closed="browser"
        />
      </template>
      <v-card
        id="browse"
        class="browse"
        :class="browser ? 'open' : 'closed'"
        :ripple="false"
      >
        <v-row
          justify="space-between"
          class="pl-4 pr-2 my-3"
          no-gutters
          @click.stop="toggleBrowser"
        >
          <v-col cols="auto">
            <h2 class="headline serif">Bookshelf</h2>
          </v-col>
          <v-col cols="auto"></v-col>
        </v-row>
        <router-view />
      </v-card>
    </v-content>
  </v-app>
</template>

<script>
import "@/styles/main.scss";
import PlayerMobile from "@/components/player/player-mobile.vue";
import PlayerDesktop from "@/components/player/player-desktop.vue";
import { mapState, mapActions } from "vuex";

export default {
  name: "App",
  components: {
    PlayerMobile,
    PlayerDesktop
  },
  computed: {
    ...mapState([
      "page",
      "book",
      "browser",
      "currentBook",
      "isMobile",
      "loading",
      "error"
    ]),
    player() {
      return this.page == "index" || this.page == "browse";
    }
  },
  async mounted() {
    this.$store.commit("initialiseStore");
    try {
      await this.fetchBookData(this.currentBook.id);
    } catch (error) {
      // error
    }

    this.onResize();
    window.addEventListener("resize", this.onResize, { passive: true });
  },
  methods: {
    ...mapActions(["fetchBookData"]),
    toggleBrowser() {
      if (this.isMobile) this.$store.commit("toggleBrowser");
      else {
        document.documentElement.style.setProperty("--scroll-snap", "none");
        this.$scrollTo("#browse", {
          container: "body",
          onDone: function() {
            document.documentElement.style.setProperty(
              "--scroll-snap",
              "y mandatory"
            );
          }
        });
      }
    },
    onResize() {
      this.$store.commit("isMobile", window.innerWidth < 960);
    }
  },
  beforeDestroy() {
    if (typeof window !== "undefined") {
      window.removeEventListener("resize", this.onResize, { passive: true });
    }
  }
};
</script>
