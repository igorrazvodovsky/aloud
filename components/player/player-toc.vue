<template>
  <v-list>
    <v-list-item-group v-model="current">
      <template v-for="(item, index) in bookTracks">
        <v-list-item :key="index">
          <v-list-item-content>
            <v-list-item-title v-text="item.title"></v-list-item-title>
          </v-list-item-content>
          <v-list-item-action>
            <v-list-item-action-text v-text="item.length"></v-list-item-action-text>
          </v-list-item-action>
        </v-list-item>
        <!-- <v-divider :key="index" /> -->
      </template>
    </v-list-item-group>
  </v-list>
</template>
<script>
import { mapState } from "vuex";

export default {
  computed: {
    bookTracks() {
      return this.$store.getters.bookTracks;
    }
  }
};
</script>
