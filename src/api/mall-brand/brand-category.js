import request from '@/utils/httpRequest'
const prefix = "/mall-brand";

/**
 * 品牌分类列表（分页）
 */
export function getBrandCategoryList(params) {
  return request({
    url: prefix+'/brandCategory/list',
    method: 'get',
    params: params
  })
}

/**
 * 品牌分类列表（不分页）
 */
export function getBrandCategoryListAll(params) {
  return request({
    url: prefix+'/brandCategory/listAll',
    method: 'get',
    params: params
  })
}

/**
 * 删除品牌分类
 */
export function deleteCategory(data) {
  return request({
    url: prefix+'/brandCategory/delete',
    method: 'delete',
    data: data
  })
}

/**
 * 根据用户id查询品牌分类信息
 */
export function getCategoryById(params) {
  return request({
    url: prefix+'/brandCategory/getBrandCategoryById',
    method: 'get',
    params: params
  })
}

/**
 * 保存品牌分类
 */
export function saveCategory(data) {
  return request({
    url: prefix+'/brandCategory/save',
    method: 'post',
    data: data
  })
}

/**
 * 修改品牌分类
 */
export function updateCategory(data) {
  return request({
    url: prefix+'/brandCategory/update',
    method: 'put',
    data: data
  })
}
