import axios from 'axios'

// TODO: Saving the entire state or only the part of it?
// TODO: Plugin or something else?
// BUG: Will cause a problem when I change the store structure without clearing the localStorage
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
  currentBookID: 'alices_adventures_1003',
  currentTime: 0,
  currentChapter: 0,
  book: {},
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
  setCurrentBookID(state, bookId) {
    state.CurrentBookID = bookId;
  },
  setBook(state, book) {
    state.book = book;
  },
  setRate(state, rate) {
    state.rate = rate;
  },
  setCurrentTime(state, time) {
    state.currentTime = time;
  },
  setCurrentChapter(state, chapter) {
    state.currentChapter = chapter;
  },
  toggleBrowser(state) {
    state.browser = !state.browser;
  },
  initialiseStore(state) {
    if (localStorage.getItem('store') && process.client) {
      Object.assign(state, JSON.parse(localStorage.getItem('store')))
    }
  }
}

export const actions = {
  async setBook({ commit }, bookId) {
    commit('setCurrentBookID', bookId);
    const book = await axios.get('api/metadata/' + bookId);
    commit('setBook', book.data);
  }
};

