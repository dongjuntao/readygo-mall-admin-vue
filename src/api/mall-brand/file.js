import request from '@/utils/httpRequest'
const prefix = "/mall-brand";

/**
 * 上传logo
 */
export function uploadLogo(data,params) {
  return request({
    url: prefix+'/brand/logo/upload',
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    data: data,
    params: params
  })
}

/**
 * 删除logo
 */
export function deleteLogo(params) {
  return request({
    url: prefix+'/brand/logo/delete',
    method: 'delete',
    params: params
  })
}
