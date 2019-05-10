export default {
  namespaced: true,
  state: {
    id: 0,
    userName: '',
    name: ''
  },
  mutations: {
    updateId (state, id) {
      state.id = id
    },
    updateUserName (state, userName) {
      state.userName = userName
    },
    updateName (state, name) {
      state.name = name
    }
  }
}
