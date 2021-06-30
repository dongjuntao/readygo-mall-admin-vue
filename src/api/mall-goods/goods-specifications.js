import request from '@/utils/httpRequest'
const prefix = "/mall-goods";

/**
 * 保存商品规格信息
 */
export function saveGoodsSpecifications(data) {
  return request({
    url: prefix+'/goods/specifications/save',
    method: 'post',
    data: data
  })
}

/**
 * 修改商品规格信息
 */
export function updateGoodsSpecifications(data) {
  return request({
    url: prefix+'/goods/specifications/update',
    method: 'put',
    data: data
  })
}

/**
 * 商品规格信息
 * @param params
 * @returns {*}
 */
export function getGoodsSpecificationsById(params) {
  return request({
    url: prefix+'/goods/specifications/getGoodsSpecificationsById',
    method: 'get',
    params: params
  })
}

/**
 * 删除商品规格
 */
export function deleteGoodsSpecifications(data) {
  return request({
    url: prefix+'/goods/specifications/delete',
    method: 'delete',
    data: data
  })
}

/**
 * 商品规格列表
 */
export function getGoodsSpecificationsList(params) {
  return request({
    url: prefix+'/goods/specifications/list',
    method: 'get',
    params: params
  })
}
