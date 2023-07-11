import request from '@/utils/httpRequest'
const prefix = "/mall-admin";

/**
 * 首页统计数据
 */
export function getHomepageStatisticsData(params) {
  return request({
    url: prefix+'/homepage/data/statistics',
    method: 'get',
    params: params
  })
}

/**
 * 饼图数据
 * @param params
 * @returns {*}
 */
export function pieChartData(params) {
  return request({
    url: prefix+'/homepage/data/pieChartData',
    method: 'get',
    params: params
  })
}

/**
 * 柱状图数据
 * @param params
 * @returns {*}
 */
export function barChartData(params) {
  return request({
    url: prefix+'/homepage/data/barChartData',
    method: 'get',
    params: params
  })
}


