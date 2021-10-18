import request from '@/utils/httpRequest'
const prefix = "/mall-admin";

/**
 * 运费模板列表（分页）
 */
export function getFreightTemplateList(params) {
  return request({
    url: prefix+'/store/freightTemplate/list',
    method: 'get',
    params: params
  })
}

/**
 * 运费模板列表（不分页）
 */
export function getFreightTemplateListAll(params) {
  return request({
    url: prefix+'/store/freightTemplate/listAll',
    method: 'get',
    params: params
  })
}

/**
 * 新增运费模板
 */
export function saveFreightTemplate(data) {
  return request({
    url: prefix+'/store/freightTemplate/save',
    method: 'post',
    data: data
  })
}

/**
 * 修改运费模板
 */
export function updateFreightTemplate(data) {
  return request({
    url: prefix+'/store/freightTemplate/update',
    method: 'put',
    data: data
  })
}

/**
 * 删除运费模板
 */
export function deleteFreightTemplate(data) {
  return request({
    url: prefix+'/store/freightTemplate/delete',
    method: 'delete',
    data: data
  })
}

/**
 * 根据id获取运费模板
 */
export function getFreightTemplateById(params) {
  return request({
    url: prefix+'/store/freightTemplate/getFreightTemplateById',
    method: 'get',
    params: params
  })
}

/**
 * 设为默认 / 取消默认
 */
export function updateIsDefault(id, params) {
  return request({
    url: prefix+'/store/freightTemplate/updateIsDefault/'+id,
    method: 'put',
    params: params
  })
}
