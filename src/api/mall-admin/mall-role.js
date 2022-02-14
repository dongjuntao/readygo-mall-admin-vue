import request from '@/utils/httpRequest'
const prefix = "/mall-admin";

/**
 * 角色列表
 */
export function getRoleList(params) {
  return request({
    url: prefix+'/system/role/list',
    method: 'get',
    params: params
  })
}

/**
 * 删除角色
 */
export function deleteRole(data) {
  return request({
    url: prefix+'/system/role/delete',
    method: 'delete',
    data: data
  })
}

/**
 * 角色信息
 * @param params
 * @returns {*}
 */
export function getRoleInfo(pathParam) {
  return request({
    url: prefix+'/system/role/info/'+pathParam,
    method: 'get'
  })
}

/**
 * 保存角色信息
 */
export function saveRole(data) {
  return request({
    url: prefix+'/system/role/save',
    method: 'post',
    data: data
  })
}

/**
 * 修改角色信息
 */
export function updateRole(data) {
  return request({
    url: prefix+'/system/role/update',
    method: 'put',
    data: data
  })
}

/**
 * 角色选择
 * @param params
 * @param data
 * @returns {*}
 */
export function select(params, data) {
  return request({
    url: prefix+'/system/role/select',
    method: 'get'
  })
}
