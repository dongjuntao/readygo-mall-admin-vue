import request from '@/utils/httpRequest'
const prefix = "/mall-admin";

/**
 * 运费模板列表
 */
export function getFreightTemplateList(params) {
  return request({
    url: prefix+'/store/freightTemplate/list',
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
