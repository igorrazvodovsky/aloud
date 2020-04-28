import { mapState } from "vuex";

export const PlayerBase = {
  // props: ["playlist", "index"],
  data: () => ({
    counter: 0,
  }),
  computed: {
    ...mapState(["book"])
  },
  methods: {
    handleClick() {
      this.counter++;
    },
  }
}
