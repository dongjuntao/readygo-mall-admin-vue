import request from '@/utils/httpRequest'
const prefix = "/mall-goods";

/**
 * 上传规格绑定图片
 */
export function uploadSpecificationBindImage(data,params) {
  return request({
    url: prefix+'/goods/specificationsImage/upload',
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    data: data,
    params: params
  })
}

/**
 * 删除规格绑定图片
 */
export function deleteSpecificationBindImage(params) {
  return request({
    url: prefix+'/goods/specificationsImage/delete',
    method: 'delete',
    params: params
  })
}
