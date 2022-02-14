import request from '@/utils/httpRequest'
const prefix = "/mall-admin";

/**
 * 分页查询商城首页导航列表
 */
export function getHomepageNavbarList(params) {
  return request({
    url: prefix+'/homepage/navbar/list',
    method: 'get',
    params: params
  })
}

/**
 * 分页查询商城首页导航列表（不分页）
 */
export function getHomepageNavbarListAll(params) {
  return request({
    url: prefix+'/homepage/navbar/listAll',
    method: 'get',
    params: params
  })
}

/**
 * 删除导航
 */
export function deleteHomepageNavbar(data) {
  return request({
    url: prefix+'/homepage/navbar/delete',
    method: 'delete',
    data: data
  })
}

/**
 *  根据主键id获取导航
 */
export function getHomepageNavbarById(params) {
  return request({
    url: prefix+'/homepage/navbar/getHomepageNavbarById',
    method: 'get',
    params: params
  })
}

/**
 * 保存导航
 */
export function saveHomepageNavbar(data) {
  return request({
    url: prefix+'/homepage/navbar/save',
    method: 'post',
    data: data
  })
}

/**
 * 修改导航
 */
export function updateHomepageNavbar(data) {
  return request({
    url: prefix+'/homepage/navbar/update',
    method: 'put',
    data: data
  })
}

/**
 * 启用/禁用
 */
export function enable(params) {
  return request({
    url: prefix+'/homepage/navbar/enable',
    method: 'put',
    params: params
  })
}
