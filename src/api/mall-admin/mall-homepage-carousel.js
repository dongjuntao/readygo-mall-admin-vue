import request from '@/utils/httpRequest'
const prefix = "/mall-admin";

/**
 * 分页查询商城首页轮播图
 */
export function getHomepageCarouselList(params) {
  return request({
    url: prefix+'/homepage/carousel/list',
    method: 'get',
    params: params
  })
}

/**
 * 分页查询商城首页轮播图列表（不分页）
 */
export function getHomepageCarouselListAll(params) {
  return request({
    url: prefix+'/homepage/carousel/listAll',
    method: 'get',
    params: params
  })
}

/**
 * 删除轮播图
 */
export function deleteHomepageCarousel(data) {
  return request({
    url: prefix+'/homepage/carousel/delete',
    method: 'delete',
    data: data
  })
}

/**
 *  根据主键id获取轮播图
 */
export function getHomepageCarouselById(params) {
  return request({
    url: prefix+'/homepage/carousel/getHomepageCarouselById',
    method: 'get',
    params: params
  })
}

/**
 * 保存轮播图
 */
export function saveHomepageCarousel(data) {
  return request({
    url: prefix+'/homepage/carousel/save',
    method: 'post',
    data: data
  })
}

/**
 * 修改轮播图
 */
export function updateHomepageCarousel(data) {
  return request({
    url: prefix+'/homepage/carousel/update',
    method: 'put',
    data: data
  })
}

/**
 * 启用/禁用
 */
export function enable(params) {
  return request({
    url: prefix+'/homepage/carousel/enable',
    method: 'put',
    params: params
  })
}
