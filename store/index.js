export const state = () => ({
  page: 'index',
  playing: false,
  book: null
})

export const mutations = {
  updatePage(state, pageName) {
    state.page = pageName
  },
  setBook(state, book) {
    state.book = book;
  }
}

export const actions = {
  // TIL: 'Commit' destructured from the 'context' object which exposes the same set of methods/properties on the store instance
  setBook({ commit }, book) {
    commit('setBook', book);
  }
};
