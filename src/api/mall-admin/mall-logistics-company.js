import request from '@/utils/httpRequest'
const prefix = "/mall-admin";

/**
 * 物流公司列表（分页）
 */
export function getLogisticsCompanyList(params) {
  return request({
    url: prefix+'/logistics/company/list',
    method: 'get',
    params: params
  })
}

/**
 * 物流公司列表（分页）（带enable）
 */
export function getListWithExpressSetting(params) {
  return request({
    url: prefix+'/logistics/company/listWithExpressSetting',
    method: 'get',
    params: params
  })
}

/**
 * 物流公司列表（不分页）（带enable）
 */
export function listAll(params) {
  return request({
    url: prefix+'/logistics/company/listAll',
    method: 'get',
    params: params
  })
}

/**
 * 新增物流公司
 */
export function saveLogisticsCompany(data) {
  return request({
    url: prefix+'/logistics/company/save',
    method: 'post',
    data: data
  })
}

/**
 * 修改物流公司
 */
export function updateLogisticsCompany(data) {
  return request({
    url: prefix+'/logistics/company/update',
    method: 'put',
    data: data
  })
}

/**
 * 删除物流公司
 */
export function deleteLogisticsCompany(data) {
  return request({
    url: prefix+'/logistics/company/delete',
    method: 'delete',
    data: data
  })
}

/**
 * 根据用户id查询发货信息
 */
export function getLogisticsCompanyById(params) {
  return request({
    url: prefix+'/logistics/company/getLogisticsCompanyById',
    method: 'get',
    params: params
  })
}
