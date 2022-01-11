import request from '@/utils/httpRequest'
const prefix = "/mall-seckill";
/**
 * 秒杀配置列表（分页）
 */
export function getSeckillConfigList(params) {
  return request({
    url: prefix+'/seckillConfig/list',
    method: 'get',
    params: params
  })
}

/**
 * 新增秒杀配置
 */
export function saveSeckillConfig(data) {
  return request({
    url: prefix+'/seckillConfig/save',
    method: 'post',
    data: data
  })
}

/**
 * 修改秒杀配置
 */
export function updateSeckillConfig(data) {
  return request({
    url: prefix+'/seckillConfig/update',
    method: 'put',
    data: data
  })
}
/**
 * 删除秒杀配置
 */
export function deleteSeckillConfig(data) {
  return request({
    url: prefix+'/seckillConfig/delete',
    method: 'delete',
    data: data
  })
}

/**
 * 根据id获取秒杀配置
 */
export function getSeckillConfigById(params) {
  return request({
    url: prefix+'/seckillConfig/getSeckillConfigById',
    method: 'get',
    params: params
  })
}

/**
 * 修改秒杀配置状态
 */
export function updateStatus(params) {
  return request({
    url: prefix+'/seckillConfig/updateStatus',
    method: 'put',
    params: params
  })
}

/**
 * 秒杀配置审核
 */
export function auth(params) {
  return request({
    url: prefix+'/seckillConfig/auth',
    method: 'put',
    params: params
  })
}
