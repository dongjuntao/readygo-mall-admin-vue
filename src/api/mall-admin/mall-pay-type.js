import request from '@/utils/httpRequest'
const prefix = "/mall-admin";

/**
 * 支付方式列表（分页）
 */
export function getPayTypeList(params) {
  return request({
    url: prefix+'/payType/list',
    method: 'get',
    params: params
  })
}

/**
 * 支付方式列表（不分页）
 */
export function getAllPayTypeList(params) {
  return request({
    url: prefix+'/payType/listAll',
    method: 'get',
    params: params
  })
}

/**
 * 根据id查询支付方式
 */
export function getPayTypeById(params) {
  return request({
    url: prefix+'/payType/getPayTypeById',
    method: 'get',
    params: params
  })
}


/**
 * 保存支付方式信息
 */
export function savePayType(data) {
  return request({
    url: prefix+'/payType/save',
    method: 'post',
    data: data
  })
}

/**
 * 修改支付方式信息
 */
export function updatePayType(data) {
  return request({
    url: prefix+'/payType/update',
    method: 'put',
    data: data
  })
}

/**
 * 删除支付方式信息
 */
export function deletePayType(params) {
  return request({
    url: prefix+'/payType/delete',
    method: 'DELETE',
    params: params
  })
}

/**
 * 启用 / 禁用
 */
export function updateEnable(params) {
  return request({
    url: prefix+'/payType/updateEnable',
    method: 'put',
    params: params
  })
}

