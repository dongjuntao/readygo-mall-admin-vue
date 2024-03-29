import request from '@/utils/httpRequest'
const prefix = "/mall-order";

/**
 * 订单列表
 */
export function getOrderList(params) {
  return request({
    url: prefix+'/back/order/getOrderList',
    method: 'GET',
    params: params
  })
}

/**
 * 修改订单状态
 */
export function updateOrderStatus(params) {
  return request({
    url: prefix+'/back/order/updateOrderStatus',
    method: 'POST',
    params: params
  })
}

/**
 * 取消订单
 */
export function cancelOrder(params) {
  return request({
    url: prefix+'/back/order/cancelOrder',
    method: 'PUT',
    params: params
  })
}

/**
 * 删除订单
 */
export function deleteOrder(params) {
  return request({
    url: prefix+'/back/order/deleteOrder',
    method: 'DELETE',
    params: params
  })
}

/**
 * 获取订单信息（包括明细）
 */
export function getOrderAndDetailByParams(params) {
  return request({
    url: prefix+'/back/order/getOrderAndDetailByParams',
    method: 'GET',
    params: params
  })
}

/**
 * 商品发货
 */
export function shipment(data) {
  return request({
    url: prefix+'/back/order/shipment',
    method: 'PUT',
    data: data
  })
}
