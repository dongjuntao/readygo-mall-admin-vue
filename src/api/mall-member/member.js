import request from '@/utils/httpRequest'
const prefix = "/mall-member";

/**
 * 会员列表（分页）
 */
export function getMemberList(params) {
  return request({
    url: prefix+'/back/member/list',
    method: 'get',
    params: params
  })
}


/**
 * 用户注册
 */
export function register(data) {
  return request({
    url: prefix+'/back/member/register',
    method: 'POST',
    data: data
  })
}


/**
 * 修改会员信息
 */
export function updateMember(data) {
  return request({
    url: prefix+'/back/member/update',
    method: 'PUT',
    data: data
  })
}

/**
 * 删除用户
 */
export function deleteMember(data) {
  return request({
    url: prefix+'/back/member/delete',
    method: 'DELETE',
    data: data
  })
}

/**
 * 根据主键id获取用户实体
 */
export function getMemberById(params) {
  return request({
    url: prefix+'/back/member/getMemberById',
    method: 'GET',
    params: params
  })
}
