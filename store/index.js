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
  book: { metadata: { title: 'Test' } },
})

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

