
export default {
  namespaced: true,
  state: {
    contactList: []
  },
  mutations: {
    ADD_CONTACT (state, contact) {
      state.contactList = contact.concat(state.contactList)
    },
    PUSH_CONTACT (state, contact) {
      state.contactList.push(contact)
    },
    ONLINE_MESSAGE (state, message) {

    },
    OFFLINE_MESSAGE (state, message) {

    }
  },
  actions: {
  }
}
