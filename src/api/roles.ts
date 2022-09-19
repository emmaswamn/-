import myRequest from './api'

export function getRoles() {
  return myRequest.request({
    url: '/roles',
  })
}