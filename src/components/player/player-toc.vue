<template>
  <v-list rounded class="toc">
    <!-- TODO: Pass the current chapter: v-model="current" -->
    <v-list-item-group :value="currentBook.chapter">
      <template v-for="(item, index) in chapters">
        <v-list-item :key="index" @click="changeChapter(index)">
          <v-list-item-content>
            <v-list-item-title v-text="item.title"></v-list-item-title>
          </v-list-item-content>
          <v-list-item-action>
            <v-list-item-action-text>
              <span v-if="index > 0">
                {{ chapterPositions[index] | fancyTimeFormat }}
              </span>
              <!-- {{item.length}} -->
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
    ...mapState(["chapters", "currentBook"]),
    chapters() {
      return this.$store.getters.chapters;
    },
    chapterPositions() {
      // Calc the time of the beginning of each chapter
      return this.chapters.map(c =>
        this.chapters
          .slice(0, this.chapters.indexOf(c))
          .map(chapter =>
            chapter.length.split(":").reduce((acc, time) => 60 * acc + +time)
          )
          .reduce((a, b) => a + b, 0)
      );
    }
  },
  methods: {
    changeChapter(index) {
      this.$root.$emit("change-chapter", index);
      this.$root.$emit("close-toc");
    }
  }
};
</script>
