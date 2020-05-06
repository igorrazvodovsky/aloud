import { mapMutations } from 'vuex'

export const PlayerRateBase = {
  data: () => ({
    rateOptions: [0.75, 1.0, 1.25, 1.5, 1.75, 2.0]
  }),
  computed: {
    currentRate() {
      return this.$store.state.rate;
    }
  },
  methods: {
    // ...mapMutations(["setRate"]),
    setRate(rate) {
      this.$store.commit("setRate", rate);
    }
  }
}
