<template>
  <div>
    <v-text-field
      class="search-input ma-2"
      hide-details
      dark
      filled
      dense
      placeholder="Books, authors, narrators"
      prepend-inner-icon="mdi-arrow-left"
      append-icon="mdi-magnify"
      rounded
      full-width
      value="wolf hall"
      >
        <template v-slot:prepend-inner>
          <v-icon @click="handleBack">mdi-arrow-left</v-icon>
        </template>
      </v-text-field>
  </div>
</template>

<script>
export default {
  methods: {
    handleBack() {
      this.$router.push({
          path: '/'
      })
    }
  }
};
</script>
