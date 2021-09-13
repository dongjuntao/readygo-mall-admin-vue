import request from '@/utils/httpRequest'
const prefix = "/mall-admin";

/**
 * 启用（新增快递设置记录）
 */
export function saveExpressSetting(data) {
  return request({
    url: prefix+'/store/expressSetting/save',
    method: 'post',
    data: data
  })
}

/**
 * 禁用（删除快递设置记录）
 */
export function deleteExpressSetting(params) {
  return request({
    url: prefix+'/store/expressSetting/delete',
    method: 'delete',
    params: params
  })
}

/**
 * 设为默认 / 取消默认
 */
export function updateIsDefault(params) {
  return request({
    url: prefix+'/store/expressSetting/updateIsDefault',
    method: 'put',
    params: params
  })
}
