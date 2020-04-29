<template>
  <v-list rounded>
    <!-- TODO: Pass the current chapter: v-model="current" -->
    <v-list-item-group>
      <template v-for="(item, index) in chapters">
        <v-list-item :key="index">
          <v-list-item-content>
            <v-list-item-title v-text="item.title"></v-list-item-title>
          </v-list-item-content>
          <v-list-item-action>
            <v-list-item-action-text>
              <span v-if="index > 0">{{chapterPositions[index]}},</span>
              {{item.length}}
            </v-list-item-action-text>
          </v-list-item-action>
        </v-list-item>
      </template>
    </v-list-item-group>
  </v-list>
</template>
<script>
import { mapState } from "vuex";

export default {
  computed: {
    chapters() {
      return this.$store.getters.chapters;
    },
    chapterPositions() {
      // Calc the time of the chapter beginning
      return (
        this.chapters
          .map(c =>
            this.chapters
              .slice(0, this.chapters.indexOf(c))
              .map(chapter =>
                chapter.length
                  .split(":")
                  .reduce((acc, time) => 60 * acc + +time)
              )
              .reduce((a, b) => a + b, 0)
          )
          // TODO: Doesn't work for long books (>24h)
          .map(s => new Date(s * 1000).toISOString().substr(11, 8))
      );
    }
  }
};
</script>
