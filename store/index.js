// TODO:
// Add additional info (reader, etc.) from the librivox api
// A better compatibility check with local store copy. Progress shouldn't be reset when the version changes

import { version } from '~/package.json';
import axios from 'axios'
import bookshelf from '~/static/bookshelf.json'

const saveStateLocally = store => {
  if (process.client) {
    store.subscribe((mutation, state) => {
      localStorage.setItem('store', JSON.stringify(state));
    })
  }
}

export const plugins = [saveStateLocally]

export const state = () => ({
  version: '',
  page: 'index',
  playing: false,
  browser: false,
  rate: 1.0,
  currentBook: {
    id: 'alice_wonderland_0711_librivox',
    chapter: 0,
    time: 0,
  },
  book: {},
  bookshelf: bookshelf,
  loading: true
})

export const getters = {
  chapters: state => {
    // Take a list of book files
    return Array.from(state.book[state.book.metadata.identifier])
      // 1. Filter for mp3s
      .filter((el) => el.source == "original" && el.format.includes("MP3") && el.hasOwnProperty('track') && !el.format.includes("ZIP"))
      // 2. Sort
      // Track can be in a "XX" or "XX/XX" formats
      .sort((a, b) => a.track.substring(0, (a.track.indexOf('/') !== -1) ? a.track.indexOf('/') : undefined) - b.track.substring(0, (b.track.indexOf('/') !== -1) ? b.track.indexOf('/') : undefined))
      // 3. Remove unnecesary properties
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
      // 4. Add
      .map(obj => ({
        ...obj,
        // 4.1. file URL
        url: "api/download/" +
          state.book.metadata.identifier +
          "/" + obj.name,
        // 4.2. chapter length
        // Find the 'derivative' track with the same title and take 'length' from there
        length: state.book[state.book.metadata.identifier].filter((el) => el.source == "derivative" && el.title == obj.title && el.format.includes("MP3"))[0].length
      }));
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
    // TODO: Meh...
    if (this.$device.isMobile) {
      state.browser = !state.browser;
    }
  },
  toggleLoading(state, value) {
    state.loading = value
  },
  initialiseStore(state) {
    // Check if the store exists
    if (localStorage.getItem('store')) {
      let store = JSON.parse(localStorage.getItem('store'));
      // Check the version stored against current. If different, don't
      // load the cached version
      if (store.version == version) {
        this.replaceState(
          Object.assign(state, store)
        );
      } else {
        state.version = version;
      }
    }
  }
}

export const actions = {
  async loadBookData({ commit }, id) {
    commit('toggleLoading', true);
    return await axios.get('api/metadata/' + id)
      .then(function (response) {
        commit('setBook', response.data);
        return "success"
      })
      .catch(function (error) {
        this.$toast.error('😔 Error while getting the book data', {
          action: {
            text: 'OK',
            onClick: (e, toastObject) => {
              toastObject.goAway(0);
            }
          }
        })
        // TODO: if failed, check for the old data
        console.log(error);
        return "failure"
      })
  }
};

