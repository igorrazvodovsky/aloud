import { version } from "./../../package.json";

export default {
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
  },
  updatePage(state, page) {
    state.page = page;
  },
  setNewBook(state, id) {
    Object.assign(
      state.currentBook,
      state.bookshelf.find(book => {
        return book.id === id;
      })
    );
  },
  saveBookProgress(state) {
    Object.assign(
      state.bookshelf.find(book => {
        return book.id === state.currentBook.id;
      }),
      state.currentBook
    );
  },
  setBookData(state, data) {
    state.book = data;
    state.loading = false;
  },
  setRate(state, rate) {
    state.rate = rate;
  },
  setTime(state, time) {
    state.currentBook.time = time;
  },
  setChapter(state, chapter) {
    state.currentBook.chapter = chapter;
  },
  toggleBrowser(state) {
    // TODO: Meh... watch for it on desktop too?
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
  setMobile(state, value) {
    state.isMobile = value;
  }
};
