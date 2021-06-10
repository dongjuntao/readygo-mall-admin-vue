import request from '@/utils/httpRequest'

/**
 * 列表
 */
export function getMenuList(params) {
  return request({
    url: '/system/menu/list',
    method: 'get',
    params: params
  })
}

/**
 * 删除角色
 */
export function deleteMenu(pathParam) {
  return request({
    url: '/system/menu/delete/'+pathParam,
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
    url: '/system/menu/info/'+pathParam,
    method: 'get'
  })
}


/**
 * 保存角色信息
 */
export function saveMenu(data) {
  return request({
    url: '/system/menu/save',
    method: 'post',
    data: data
  })
}

/**
 * 修改角色信息
 */
export function updateMenu(data) {
  return request({
    url: '/system/menu/update',
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
    url: '/system/menu/select',
    method: 'get'
  })
}
