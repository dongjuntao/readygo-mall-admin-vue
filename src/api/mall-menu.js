import request from '@/utils/httpRequest'
const prefix = "/mall-admin";

/**
 * 侧边栏
 * @param params
 * @returns {*}
 */
export function getNavbar() {
  return request({
    url: prefix+'/system/menu/navbar',
    method: 'get'
  })
}

/**
 * 列表
 */
export function getMenuList(params) {
  return request({
    url: prefix+'/system/menu/list',
    method: 'get',
    params: params
  })
}

/**
 * 删除角色
 */
export function deleteMenu(pathParam) {
  return request({
    url: prefix+'/system/menu/delete/'+pathParam,
    method: 'delete'
  })
}

/**
 * 菜单信息
 * @param params
 * @returns {*}
 */
export function getMenuInfo(pathParam) {
  return request({
    url: prefix+'/system/menu/info/'+pathParam,
    method: 'get'
  })
}


/**
 * 保存角色信息
 */
export function saveMenu(data) {
  return request({
    url: prefix+'/system/menu/save',
    method: 'post',
    data: data
  })
}

/**
 * 修改角色信息
 */
export function updateMenu(data) {
  return request({
    url: prefix+'/system/menu/update',
    method: 'put',
    data: data
  })
}


/**
 * 菜单选择
 * @param params
 * @param data
 * @returns {*}
 */
export function select(params, data) {
  return request({
    url: prefix+'/system/menu/select',
    method: 'get'
  })
}
