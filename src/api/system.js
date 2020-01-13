import request from '@/utils/request'

/**
 * 客服登录
 * @param {传递参数} data
 */
export function customerServicesLogin (data) {
  return request({
    url: '/helper/login',
    method: 'post',
    data
  })
}

/**
 * 用户登录
 * @param {传递参数} data
 */
export function userLogin () {
  return request({
    url: '/user/login',
    method: 'post'
  })
}

/**
 * 获取当前客服个人信息
 * @param {传递参数}} data
 */
export function currentUser () {
  return request({
    url: '/currentUser',
    method: 'get'
  })
}

/**
 * 获取当前客服个人信息
 * @param {传递参数} data
 */
export function currentHelper () {
  return request({
    url: '/currentHelper',
    method: 'get'
  })
}

/**
 * 客服登出
 * @param {传递参数} data
 */
export function helperLogout () {
  return request({
    url: '/helper/logout',
    method: 'post'
  })
}
