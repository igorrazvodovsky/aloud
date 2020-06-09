import Vue from "vue";
import Vuetify from "vuetify/lib";
import colors from "vuetify/es5/util/colors";

Vue.use(Vuetify);

const mq = window.matchMedia("(prefers-color-scheme: dark)");

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

try {
  // Chrome & Firefox
  mq.addEventListener("change", _e => {
    vuetify.framework.theme.dark = _e.matches;
  });
} catch (e1) {
  try {
    // Safari
    mq.addListener(_e => {
      vuetify.framework.theme.dark = _e.matches;
    });
  } catch (e2) {
    console.error(e2);
  }
}
