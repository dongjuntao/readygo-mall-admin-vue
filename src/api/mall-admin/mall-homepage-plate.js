import request from '@/utils/httpRequest'
const prefix = "/mall-admin";

/**
 * 分页查询商城首页板块列表
 */
export function getHomepagePlateList(params) {
  return request({
    url: prefix+'/homepage/plate/list',
    method: 'get',
    params: params
  })
}

/**
 * 分页查询商城首页板块列表（不分页）
 */
export function getHomepagePlateListAll(params) {
  return request({
    url: prefix+'/homepage/plate/listAll',
    method: 'get',
    params: params
  })
}

/**
 * 删除首页板块
 */
export function deleteHomepagePlate(data) {
  return request({
    url: prefix+'/homepage/plate/delete',
    method: 'delete',
    data: data
  })
}

/**
 *  根据主键id获取板块
 */
export function getHomepagePlateById(params) {
  return request({
    url: prefix+'/homepage/plate/getHomepagePlateById',
    method: 'get',
    params: params
  })
}

/**
 * 保存板块
 */
export function saveHomepagePlate(data) {
  return request({
    url: prefix+'/homepage/plate/save',
    method: 'post',
    data: data
  })
}

/**
 * 启用/禁用
 */
export function updateHomepagePlate(data) {
  return request({
    url: prefix+'/homepage/plate/update',
    method: 'put',
    data: data
  })
}

/**
 * 启用/禁用
 */
export function enable(params) {
  return request({
    url: prefix+'/homepage/plate/enable',
    method: 'put',
    params: params
  })
}

/**
 * 关联商品，用于商城首页展示
 */
export function relateGoods(plateId,data) {
  return request({
    url: prefix+'/homepage/plate/relateGoods/'+plateId,
    method: 'post',
    data: data
  })
}

/**
 *  根据板块id获取关联商品
 */
export function getRelatedGoods(plateId) {
  return request({
    url: prefix+'/homepage/plate/getRelatedGoods/'+plateId,
    method: 'get'
  })
}
