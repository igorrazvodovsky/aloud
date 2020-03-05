export const state = () => ({
  page: 'index',
  playing: false
})

export const mutations = {
  updatePage(state, pageName) {
    state.page = pageName
  },
  // togglePlay(state) {
  //   state.playing = !state.playing
  // }
}
