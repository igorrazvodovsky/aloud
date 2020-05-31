<template>
  <v-dialog
    v-model="dialog"
    fullscreen
    hide-overlay
    transition="slide-x-transition"
  >
    <template v-slot:activator="{ on }">
      <v-btn text rounded color="secondary" v-on="on">Table of contents</v-btn>
    </template>
    <v-card>
      <div class="pa-4">
        <v-btn x-large class="dialog__close" icon @click="dialog = false">
          <icon-close />
        </v-btn>
      </div>
      <v-container>
        <v-row no-gutters>
          <v-col md="6" offset-md="3">
            <h2 class="overline secondary--text mb-10 text-center">
              Table of contents
            </h2>
            <player-toc />
          </v-col>
        </v-row>
      </v-container>
    </v-card>
  </v-dialog>
</template>
<script>
import IconClose from "@/assets/UI_iconoteka_close__delete__cross__clear_r_a.svg";
import PlayerToc from "@/components/player/player-toc.vue";
export default {
  components: {
    IconClose,
    PlayerToc
  },
  data() {
    return {
      dialog: false
    };
  },
  created() {
    // Event emitted by selecting a chapter
    this.$root.$on("close-toc", () => {
      this.dialog = false;
    });
  }
};
</script>
