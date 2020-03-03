<template>
  <div>
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
