<template>
  <div>
    <!-- <div
      class="mx-2 my-2 d-flex flex-no-wrap justify-space-between"
    >
      <div class="mx-2">
        <span class="overline theme--dark secondary--text">&nbsp;</span>
        <h1 class="title">Northanger Abbey</h1>
      </div>
      <v-btn dark text icon @click.stop="$emit('close-lists')">
        <v-icon>mdi-close-circle</v-icon>
      </v-btn>
    </div>-->
    <v-tabs v-model="tab" dark>
      <v-tab key="toc">Table of contents</v-tab>
      <v-tab key="bookmarks">Bookmarks</v-tab>
    </v-tabs>

    <v-tabs-items dark v-model="tab">
      <v-tab-item key="toc">
        <player-toc />
      </v-tab-item>
      <v-tab-item key="bookmarks">
        <player-bookmarks />
      </v-tab-item>
    </v-tabs-items>
  </div>
</template>

<script>
import PlayerToc from "~/components/PlayerToc.vue";
import PlayerBookmarks from "~/components/PlayerBookmarks.vue";
export default {
  components: {
    PlayerToc,
    PlayerBookmarks
  },
  data: () => ({
    tab: null
  })
};
</script>
