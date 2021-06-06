import request from '@/utils/httpRequest'

/**
 * 管理员用户登录
 */
export function select(params, data) {
  return request({
    url: '/system/role/select',
    method: 'get'
  })
}
