import axios from 'axios'
import bookshelf from '~/static/bookshelf.json'

// TODO: Will cause a problem when I change the store structure without clearing the localStorage
const saveStateLocally = store => {
  if (process.client) {
    store.subscribe((mutation, state) => {
      localStorage.setItem('store', JSON.stringify(state));
    })
  }
}

export const plugins = [saveStateLocally]

export const state = () => ({
  page: 'index',
  playing: false,
  browser: false,
  rate: 1.0,
  currentBook: {
    id: 'alices_adventures_1003',
    chapter: 0,
    time: 0,
  },
  book: {},
  bookshelf: bookshelf,
  loading: true
})

export const getters = {
  chapters: state => {
    return (
      Array.from(state.book[state.book.metadata.identifier])
        // 1. Filter for mp3s
        .filter(function (el) {
          // Only 'derivative' has 'length' property
          return el.source == "derivative" && el.format.includes("MP3") && !el.format.includes("ZIP");
        })
        // 2. Sort them by "title"
        // TODO: Not sure if works. Additional tests needed. Should also check for "track" & prioratize it
        // TODO: How about storing a regex for each book to format chapter names?
        // .sort((a, b) =>
        //   a.title.match(/^\d+|\d+\b|\d+(?=\w)/g)[0] >
        //     b.title.match(/^\d+|\d+\b|\d+(?=\w)/g)[0]
        //     ? 1
        //     : -1
        // )
        // // 3. Remove unnecesary properties
        .map(
          ({
            creator,
            album,
            crc32,
            md5,
            sha1,
            size,
            mtime,
            ...keepAttrs
          }) => keepAttrs
        )
        // 4. Add a full URL to a file
        .map(obj => ({
          ...obj, url: "api/download/" +
            state.book.metadata.identifier +
            "/" + obj.name
        }))
    );
  }
}

export const mutations = {
  updatePage(state, pageName) {
    state.page = pageName
  },
  setCurrentBook(state, id) {
    Object.assign(this.state.currentBook, this.state.bookshelf.find(book => {
      return book.id === id
    }))
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
    Object.assign(this.state.bookshelf.find(book => {
      return book.id === this.state.currentBook.id
    }), this.state.currentBook)
  },
  toggleBrowser(state) {
    state.browser = !state.browser;
  },
  toggleLoading(state, value) {
    if (value) state.loading = value
    else state.loading = !state.loading
  },
  initialiseStore(state) {
    if (localStorage.getItem('store') && process.client) {
      Object.assign(state, JSON.parse(localStorage.getItem('store')))
    }
  }
}

export const actions = {
  async loadBook({ commit }, id) {
    commit('toggleLoading', true);
    const book = await axios.get('api/metadata/' + id);
    commit('setBook', book.data);
    commit('toggleLoading', false);
  }
};

