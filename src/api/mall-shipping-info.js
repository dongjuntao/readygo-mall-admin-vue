import request from '@/utils/httpRequest'
const prefix = "/mall-admin";


/**
 * 发货信息列表
 */
export function getShippingInfoList(params) {
  return request({
    url: prefix+'/store/shippingInfo/list',
    method: 'get',
    params: params
  })
}

/**
 * 新增发货信息
 */
export function saveShippingInfo(data) {
  return request({
    url: prefix+'/store/shippingInfo/save',
    method: 'post',
    data: data
  })
}

/**
 * 修改发货信息
 */
export function updateShippingInfo(data) {
  return request({
    url: prefix+'/store/shippingInfo/update',
    method: 'put',
    data: data
  })
}

/**
 * 删除发货信息
 */
export function deleteShippingInfo(params) {
  return request({
    url: prefix+'/store/shippingInfo/delete',
    method: 'delete',
    params: params
  })
}

/**
 * 根据用户id查询发货信息
 */
export function getShippingInfoById(params) {
  return request({
    url: prefix+'/store/shippingInfo/getShippingInfoById',
    method: 'get',
    params: params
  })
}
