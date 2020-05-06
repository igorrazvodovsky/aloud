<template>
  <v-card
    class="browse"
    :style="open ? 'top: 3.25rem' : 'top: calc(100vh - 3.5rem + 1px)'"
    :ripple="false"
  >
    <v-row
      justify="space-between"
      class="pl-4 pr-2 my-3"
      no-gutters
      @click.stop="$emit('open-browser')"
    >
      <v-col cols="auto">
        <h2 class="headline serif">Bookshelf</h2>
      </v-col>
      <v-col cols="auto">
        <!-- <v-btn text icon to="/search" nuxt @click.stop>
          <v-icon>mdi-magnify</v-icon>
        </v-btn>-->
      </v-col>
    </v-row>
    <!-- <v-content> -->
    <!-- <v-container> -->
    <nuxt />
    <!-- </v-container> -->
    <!-- </v-content> -->
  </v-card>
</template>

<script>
export default {
  props: ["open"],
  data() {
    return {};
  }
};
</script>
