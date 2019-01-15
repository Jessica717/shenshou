import request from '@/utils/index'

export function fetchList(query) {
  return request({
    url: '/article/list',
    method: 'get'
  })
}
