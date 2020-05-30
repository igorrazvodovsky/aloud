import Vue from "vue";
import Vuex from "vuex";
import { version } from "./../../package.json";
import bookshelf from "./../assets/bookshelf.json";

Vue.use(Vuex);

async function http(url, method = "GET", data) {
  try {
    const response = await fetch(url, {
      method,
      data
    });

    return await response.json();
  } catch (error) {
    // throw error;
  }
}

const saveStateLocally = store => {
  store.subscribe((mutation, state) => {
    localStorage.setItem("store", JSON.stringify(state));
  });
};

export default new Vuex.Store({
  state: {
    version: "",
    page: "index",
    playing: false,
    browser: false,
    rate: 1.0,
    currentBook: {
      id: "alice_wonderland_0711_librivox",
      chapter: 0,
      time: 0
    },
    book: {},
    bookshelf: bookshelf,
    loading: true,
    error: null,
    isMobile: false
  },
  plugins: [saveStateLocally],
  getters: {
    chapters: state => {
      // Take a list of book files
      return (
        Array.from(state.book[state.book.metadata.identifier])
          // 1. Filter for mp3s
          .filter(
            el =>
              el.source == "original" &&
              el.format.includes("MP3") &&
              !el.format.includes("ZIP") &&
              !!Object.getOwnPropertyDescriptor(el, "track")
          )
          // 2. Sort
          // Track can be in a "XX" or "XX/XX" formats
          .sort(
            (a, b) =>
              a.track.substring(
                0,
                a.track.indexOf("/") !== -1 ? a.track.indexOf("/") : undefined
              ) -
              b.track.substring(
                0,
                b.track.indexOf("/") !== -1 ? b.track.indexOf("/") : undefined
              )
          )
          // 3. Remove unnecesary properties
          .map(
            // eslint-disable-next-line no-unused-vars
            ({ creator, album, crc32, md5, sha1, size, mtime, ...keepAttrs }) =>
              keepAttrs
          )
          // 4. Add
          .map(obj => ({
            ...obj,
            // 4.1. file URL
            url:
              "https://archive.org/download/" +
              state.book.metadata.identifier +
              "/" +
              obj.name,
            // 4.2. chapter length
            // Find the 'derivative' track with the same title and take 'length' from there
            length: state.book[state.book.metadata.identifier].filter(
              el =>
                el.source == "derivative" &&
                el.title == obj.title &&
                el.format.includes("MP3")
            )[0].length
          }))
      );
    }
  },
  mutations: {
    updatePage(state, pageName) {
      state.page = pageName;
    },
    setCurrentBook(state, id) {
      Object.assign(
        this.state.currentBook,
        this.state.bookshelf.find(book => {
          return book.id === id;
        })
      );
    },
    setBook(state, book) {
      state.book = book;
    },
    setRate(state, rate) {
      state.rate = rate;
    },
    setCurrentTime(state, time) {
      state.currentBook.time = time;
    },
    setCurrentChapter(state, chapter) {
      state.currentBook.chapter = chapter;
    },
    saveCurrentProgress(state) {
      Object.assign(
        state.bookshelf.find(book => {
          return book.id === state.currentBook.id;
        }),
        state.currentBook
      );
    },
    toggleBrowser(state) {
      // TODO: Meh...
      if (state.isMobile) {
        state.browser = !state.browser;
      }
    },
    setLoading(state, value) {
      state.loading = value;
    },
    setError(state, value) {
      state.error = value;
    },
    isMobile(state, value) {
      state.isMobile = value;
    },
    initialiseStore(state) {
      // Check if the store exists
      if (localStorage.getItem("store")) {
        let store = JSON.parse(localStorage.getItem("store"));
        // Check the version stored against current. If different, don't load the cached version
        if (store.version == version) {
          this.replaceState(Object.assign(state, store));
        } else {
          state.version = version;
        }
      }
    }
  },
  actions: {
    async fetchBookData({ commit }, id) {
      try {
        commit("setLoading", true);
        const data = await http("https://archive.org/metadata/" + id);
        commit("setBook", data);
      } catch (error) {
        commit("setError", error);

        throw error;
      } finally {
        commit("setLoading", false);
      }
    }
  },
  modules: {}
});
