export default {
  getCustomerServiceInfo: (state) => {
    return state.CustomerService.helperInfo || {}
  },
  getUserInfo: (state) => {
    return state.user.userInfo || {}
  }
}
