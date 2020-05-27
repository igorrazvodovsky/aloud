<template>
  <v-app class="player">
    <div class="loading" v-if="loading && !bookDataLoaded">
      <div class="text-center">
        <v-progress-circular indeterminate></v-progress-circular>
        <!-- <div
          v-if="loadingError"
          class="mt-6 body-2 text--secondary"
        >An errror occured while loading the book. Retrying...</div>-->
      </div>
    </div>
    <template v-else>
      <player-desktop
        v-if="player && $device.isDesktop"
        @open:player="toggleBrowser"
        :closed="browser"
      />
      <player-mobile
        v-if="player && $device.isMobile"
        @open:player="toggleBrowser"
        :closed="browser"
      />
    </template>
    <v-card
      id="browse"
      v-if="bookDataLoaded"
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
      <!-- This component is used only in layouts to display the page components. -->
      <nuxt />
    </v-card>
  </v-app>
</template>

<script>
import PlayerMobile from "~/components/player/player-mobile.vue";
import PlayerDesktop from "~/components/player/player-desktop.vue";
import { mapState, mapMutations } from "vuex";

export default {
  components: {
    PlayerMobile,
    PlayerDesktop
  },
  data: () => ({
    bookDataLoaded: false
  }),
  computed: {
    ...mapState(["page", "book", "browser", "currentBook", "loading"]),
    player() {
      return this.page == "index" || this.page == "browse";
    }
  },
  mounted() {
    this.$store.commit("initialiseStore");
    this.$store
      .dispatch("loadBookData", this.currentBook.id)
      .then(res => {
        if (res === "success") this.bookDataLoaded = true;
      })
      .catch(reason => {
        console.log("Caught failure while loading the book data.ç " + reason);
      });
  },
  methods: {
    toggleBrowser() {
      if (this.$device.isMobile) this.$store.commit("toggleBrowser");
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
    }
  }
};
</script>
