import request from '@/utils/httpRequest'
const prefix = "/mall-seckill";
/**
 * 秒杀配置列表（分页）
 */
export function getSeckillGoodsSkuList(params) {
  return request({
    url: prefix+'/seckillGoods/sku/list',
    method: 'get',
    params: params
  })
}
