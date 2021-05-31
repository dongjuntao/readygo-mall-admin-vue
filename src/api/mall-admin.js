import request from '@/utils/httpRequest'

/**
 * 管理员用户登录
 */
export function adminLogin(params, data) {
  return request({
    url: '/admin/login',
    method: 'post',
    params: params,
    data: data
  })
}
