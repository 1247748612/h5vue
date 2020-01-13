import CustomerService from 'views/CustomerService'
import ContactCustomerService from 'views/ContactCustomerService'
import Login from 'views/user/Login'

export default [
  {
    path: '/HelperLogin',
    name: 'HelperLogin',
    component: Login,
    meta: {
      title: '客服登录'
    }

  },
  {
    path: '/AllContact',
    name: 'AllContact',
    component: CustomerService,
    meta: {
      title: '所有联系人',
      keepAlive: true
    }
  },
  {
    path: '/ContactUser',
    name: 'ContactUser',
    component: ContactCustomerService,
    meta: {
      title: '与人联系',
      keepAlive: true
    }
  }
]
