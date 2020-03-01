<template>
  <v-card
    class="books"
    :style="open ? 'top: 3.25rem' : 'top: 85%'"
    @click.stop="$emit('open-browse')"
    :ripple="false"
  >
    <v-row justify="space-between" class="pl-4 pr-2">
      <v-col cols="auto">
        <h2 class="title primary--text">
          Books
        </h2>
      </v-col>
      <v-col cols="auto">
        <v-btn @click.stop="" text icon color="secondary">
          <v-icon>mdi-magnify</v-icon>
        </v-btn>
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
