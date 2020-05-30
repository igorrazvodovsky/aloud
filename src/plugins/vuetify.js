import Vue from "vue";
import Vuetify from "vuetify/lib";
import colors from "vuetify/es5/util/colors";

Vue.use(Vuetify);

const opts = {
  treeShake: true,
  defaultAssets: false,
  icons: {
    iconfont: "md"
  },
  customVariables: ["~/styles/variables.scss"],
  theme: {
    options: {
      customProperties: true
    },
    themes: {
      light: {
        primary: "#2A3663",
        secondary: colors.grey.darken1
      }
    }
  }
};

export default new Vuetify(opts);
