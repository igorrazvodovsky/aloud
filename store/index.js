

// const createStore = () => {
//   return new Vuex.Store({
//     state: {
//       page: 'index'
//     },
//     mutations: {
//       updatePage(state, pageName) {
//         state.page = pageName
//       }
//     }
//   })
// }

export const state = () => ({
  page: 'index'
})

export const mutations = {
  updatePage(state, pageName) {
    state.page = pageName
  }
}
