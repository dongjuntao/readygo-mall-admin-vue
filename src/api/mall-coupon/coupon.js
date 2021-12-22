import request from '@/utils/httpRequest'
const prefix = "/mall-coupon";
/**
 * 优惠券列表（分页）
 */
export function getCouponList(params) {
  return request({
    url: prefix+'/coupon/list',
    method: 'get',
    params: params
  })
}

/**
 * 新增优惠券
 */
export function saveCoupon(data) {
  return request({
    url: prefix+'/coupon/save',
    method: 'post',
    data: data
  })
}

/**
 * 修改优惠券
 */
export function updateCoupon(data) {
  return request({
    url: prefix+'/coupon/update',
    method: 'put',
    data: data
  })
}
/**
 * 删除优惠券
 */
export function deleteCoupon(data) {
  return request({
    url: prefix+'/coupon/delete',
    method: 'delete',
    data: data
  })
}

/**
 * 根据id获取优惠券
 */
export function getCouponById(params) {
  return request({
    url: prefix+'/coupon/getCouponById',
    method: 'get',
    params: params
  })
}

/**
 * 修改优惠券状态
 */
export function updateStatus(params) {
  return request({
    url: prefix+'/coupon/updateStatus',
    method: 'put',
    params: params
  })
}

/**
 * 优惠券审审核
 */
export function auth(params) {
  return request({
    url: prefix+'/coupon/auth',
    method: 'put',
    params: params
  })
}
