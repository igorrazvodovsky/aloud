<template>
  <div>
    <v-tabs v-model="tab">
      <v-tab key="toc">Table of contents</v-tab>
      <v-tab disabled key="bookmarks">Bookmarks</v-tab>
    </v-tabs>
    <v-tabs-items v-model="tab">
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
import PlayerToc from "@/components/player/player-toc.vue";
import PlayerBookmarks from "@/components/player/player-bookmarks.vue";
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
