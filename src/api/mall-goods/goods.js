import request from '@/utils/httpRequest'
const prefix = "/mall-goods";

/**
 * 保存商品信息
 */
export function saveGoods(data) {
  return request({
    url: prefix+'/goods/save',
    method: 'post',
    data: data
  })
}

/**
 * 修改商品信息
 */
export function updateGoods(data) {
  return request({
    url: prefix+'/goods/update',
    method: 'put',
    data: data
  })
}

/**
 * 商品信息
 * @param params
 * @returns {*}
 */
export function getGoodsById(params) {
  return request({
    url: prefix+'/goods/getGoodsById',
    method: 'get',
    params: params
  })
}

/**
 * 删除商品
 */
export function deleteGoods(data) {
  return request({
    url: prefix+'/goods/delete',
    method: 'delete',
    data: data
  })
}

/**
 * 商品列表
 */
export function getGoodsList(params) {
  return request({
    url: prefix+'/goods/list',
    method: 'get',
    params: params
  })
}

/**
 * 申请上架
 */
export function applyOnSale(params) {
  return request({
    url: prefix+'/goods/applyOnSale',
    method: 'put',
    params: params
  })
}

/**
 * 上架审核
 */
export function audit(params) {
  return request({
    url: prefix+'/goods/audit',
    method: 'put',
    params: params
  })
}

/**
 * 下架
 */
export function offShelf(params) {
  return request({
    url: prefix+'/goods/offShelf',
    method: 'put',
    params: params
  })
}

/**
 * 商品列表（不分页）
 */
export function getAllGoodsList(params) {
  return request({
    url: prefix+'/goods/listAll',
    method: 'get',
    params: params
  })
}

