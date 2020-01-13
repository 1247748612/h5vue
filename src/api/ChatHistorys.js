import request from '@/utils/request'

/**
 * 根据用户id查询聊天记录
 * @param {String} userId 用户id
 */
export function chatHistorysUser (userId) {
  return request({
    url: `/chat-historys/user/${userId}`,
    method: 'get'
  })
}

/**
 * 用户离线数据
 * @param {String} userId 用户id
 */
export function getUserChatHisotys (data) {
  return request({
    url: `/chat-historys/session`,
    method: 'get'
  })
}

/**
 * 添加聊天记录
 * @param {String} userId 用户id
 */
export function addChatHistorys (data) {
  return request({
    url: `/chat-historys`,
    method: 'post',
    data
  })
}
