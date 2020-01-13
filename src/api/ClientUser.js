import request from '@/utils/request'

/**
 * 根据id获取历史消息
 * @param {客服id} helperId
 */
export function helperAllUser (helperId) {
  return request({
    url: `users/manage/${helperId}`,
    method: 'get'
  })
}
