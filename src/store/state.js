import bookshelf from "./../assets/bookshelf.json";

export default () => ({
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
});
