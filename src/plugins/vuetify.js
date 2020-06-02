import Vue from "vue";
import Vuetify from "vuetify/lib";
import colors from "vuetify/es5/util/colors";

const mq = window.matchMedia("(prefers-color-scheme: dark)");

Vue.use(Vuetify);

export const vuetify = new Vuetify({
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
    dark: mq.matches,
    themes: {
      dark: {
        primary: "#F4F3EE",
        secondary: colors.grey.base
      },
      light: {
        primary: "#2A3663",
        secondary: colors.grey.darken1
      }
    }
  }
});

mq.addEventListener("change", e => {
  vuetify.framework.theme.dark = e.matches;
});
