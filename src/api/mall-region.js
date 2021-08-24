import request from '@/utils/httpRequest'
const prefix = "/mall-admin";

/**
 * 所属区域列表
 */
export function getRegionList(params) {
  return request({
    url: prefix+'/system/region/list',
    method: 'get',
    params: params
  })
}

/**
 * 商品信息
 * @param params
 * @returns {*}
 */
export function getRegionsNameByRegions(params) {
  return request({
    url: prefix+'/system/region/getRegionsNameByRegions',
    method: 'get',
    params: params
  })
}
