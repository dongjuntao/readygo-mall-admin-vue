import request from '@/utils/httpRequest'
const prefix = "/mall-admin";

/**
 * 管理员用户登录
 */
export function adminLogin(params, data) {
  return request({
    url: prefix+'/system/admin/login',
    method: 'post',
    params: params,
    data: data
  })
}

/**
 * 管理员退出
 * @param params
 * @param data
 * @returns {*}
 */
export function adminLogout() {
  return request({
    url: prefix+'/system/admin/logout',
    method: 'delete'
  })
}

/**
 * 管理员列表
 */
export function getAdminList(params) {
  return request({
    url: prefix+'/system/admin/list',
    method: 'get',
    params: params
  })
}

/**
 * 删除用户
 */
export function deleteAdmin(data) {
  return request({
    url: prefix+'/system/admin/delete',
    method: 'delete',
    data: data
  })
}

/**
 * 根据用户id查询用户信息
 */
export function getUserById(params) {
  return request({
    url: prefix+'/system/admin/getUserById',
    method: 'get',
    params: params
  })
}

/**
 * 保存用户信息
 */
export function saveAdmin(data) {
  return request({
    url: prefix+'/system/admin/save',
    method: 'post',
    data: data
  })
}

/**
 * 修改用户信息
 */
export function updateAdmin(data) {
  return request({
    url: prefix+'/system/admin/update',
    method: 'put',
    data: data
  })
}
