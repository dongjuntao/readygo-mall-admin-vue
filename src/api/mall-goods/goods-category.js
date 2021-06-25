import request from '@/utils/httpRequest'
const prefix = "/mall-goods";

/**
 * 商品分类列表
 */
export function getGoodsCategoryTree(params) {
  return request({
    url: prefix+'/goods/category/getGoodsCategoryTree',
    method: 'get',
    params: params
  })
}

/**
 * 新增，修改商品分类时选择上级分类
 */
export function select(params) {
  return request({
    url: prefix+'/goods/category/select',
    method: 'get',
    params: params
  })
}

/**
 * 保存商品分类信息
 */
export function saveGoodsCategory(data) {
  return request({
    url: prefix+'/goods/category/save',
    method: 'post',
    data: data
  })
}

/**
 * 修改菜单信息
 */
export function updateGoodsCategory(data) {
  return request({
    url: prefix+'/goods/category/update',
    method: 'put',
    data: data
  })
}

/**
 * 商品分类信息
 * @param params
 * @returns {*}
 */
export function getGoodsCategoryInfo(pathParam) {
  return request({
    url: prefix+'/goods/category/info/'+pathParam,
    method: 'get'
  })
}

/**
 * 删除商品分类
 */
export function deleteGoodsCategory(pathParam) {
  return request({
    url: prefix+'/goods/category/delete/'+pathParam,
    method: 'delete'
  })
}
