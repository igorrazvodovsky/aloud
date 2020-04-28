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
  // TODO: Default book
  book: {
    metadata: {
      title: '',
      identifier: 'art_of_war_librivox'
    },
    art_of_war_librivox: [
      { format: "128Kbps MP3", creator: "Sun Tzu", album: "The Art of War", title: "9 The Army on the March - 10 Terrain", track: "5", name: "art_of_war_09-10_sun_tzu.mp3", source: "derivative" },
      { format: "128Kbps MP3", creator: "Sun Tzu", album: "The Art of War", title: "8 The Army on the March - 10 Terrain", track: "4", name: "art_of_war_09-10_sun_tzu.mp3", source: "derivative" }
    ]
  },
})

export const getters = {
  bookTracks: state => {
    return (
      Array.from(state.book[state.book.metadata.identifier])
        // 1. Filter for mp3s
        .filter(function (el) {
          // Only 'derivative' has 'length' property
          return el.source == "derivative" && el.format.includes("MP3");
        })
        // 2. Sort them by "title"
        // TODO: How about using 'track' for sorting chapters?
        // TODO: Not sure if works. Additional tests needed. Should also check for "track" & maybe even prioratize it
        // .sort((a, b) =>
        //   a.title.match(/^\d+|\d+\b|\d+(?=\w)/g)[0] >
        //     b.title.match(/^\d+|\d+\b|\d+(?=\w)/g)[0]
        //     ? 1
        //     : -1
        // )
        // // 3. Remove unnecesary properties
        .map(
          ({
            source,
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
        // 4. Add a property to store a Howler object
        .map(obj => ({ ...obj, howl: null }))
    );
  }
}

export const mutations = {
  updatePage(state, pageName) {
    state.page = pageName
  },
  setBook(state, book) {
    state.book = book;
  },
  initialiseStore(state) {
    if (localStorage.getItem('store') && process.client) {
      Object.assign(state, JSON.parse(localStorage.getItem('store')))
    }
  }
}

export const actions = {
  async setBook({ commit }, bookId) {
    const book = await axios.get('api/metadata/' + bookId);
    commit('setBook', book.data);
  }
};

