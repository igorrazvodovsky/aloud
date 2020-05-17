<template lang="html">
    <div class="loading" v-if="loading">
      <v-progress-circular indeterminate></v-progress-circular>
  </div>
</template>

<script>
export default {
  data: () => ({
    loading: false
  }),
  methods: {
    start() {
      this.loading = true;
    },
    finish() {
      this.loading = false;
    }
  }
};
</script>

<style lang="scss">
.loading {
  position: fixed;
  height: 100vh;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  svg {
    width: 2rem;
    height: 2rem;
    opacity: 0.3;
  }
}
</style>
