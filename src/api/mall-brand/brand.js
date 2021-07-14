import request from '@/utils/httpRequest'
const prefix = "/mall-brand";

/**
 * 品牌列表（分页）
 */
export function getBrandList(params) {
  return request({
    url: prefix+'/brand/list',
    method: 'get',
    params: params
  })
}

/**
 * 品牌列表（不分页）
 */
export function getBrandListAll(params) {
  return request({
    url: prefix+'/brand/listAll',
    method: 'get',
    params: params
  })
}

/**
 * 删除品牌
 */
export function deleteBrand(data) {
  return request({
    url: prefix+'/brand/delete',
    method: 'delete',
    data: data
  })
}

/**
 * 根据用户id查询品牌信息
 */
export function getBrandById(params) {
  return request({
    url: prefix+'/brand/getBrandById',
    method: 'get',
    params: params
  })
}

/**
 * 保存品牌
 */
export function saveBrand(data) {
  return request({
    url: prefix+'/brand/save',
    method: 'post',
    data: data
  })
}

/**
 * 修改品牌
 */
export function updateBrand(data) {
  return request({
    url: prefix+'/brand/update',
    method: 'put',
    data: data
  })
}
