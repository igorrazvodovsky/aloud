<template>
  <div class="text-center">
    <v-dialog v-model="dialog" width="30em">
      <template v-slot:activator="{ on }">
        <v-btn title="About, feedback, and keyboard shortcuts" large icon v-on="on">
          <icon-help />
        </v-btn>
      </template>

      <v-card>
        <v-card-text class="pt-6 body-1 serif text--primary">
          <p>
            <em>Aloud</em> is an audiobook player designed and developed by
            <a
              rel="author"
              href="http://igorrazvodovsky.com/"
            >Igor Razvodovsky</a>. All books are in the public domain and are made by the
            <a
              rel="external"
              href="https://librivox.org/"
            >Librivox</a>
            volunteers 🙇.
          </p>
          <p>
            The App is made with
            <a href="https://nuxtjs.org/">NuxtJS</a>. Text is
            set in
            <a
              rel="external"
              href="https://github.com/adobe-fonts/source-serif-pro"
            >Source Serif Pro</a>
            &
            <a
              rel="external"
              href="https://github.com/adobe-fonts/source-sans-pro"
            >Source Sans Pro</a>
            families. Icons are part of
            <a
              rel="external"
              href="http://iconoteka.com/"
            >Iconoteka</a>.
          </p>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn rounded text color="secondary" @click="dialog = false">Close</v-btn>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import IconHelp from "@/assets/Text_iconoteka_help__question__faq_r_s.svg";
export default {
  components: {
    IconHelp
  },
  data() {
    return {
      dialog: false
    };
  }
};
</script>
