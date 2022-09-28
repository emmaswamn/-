import myRequest from './api'

export function getReports() {
  return myRequest.request({
    url: '/reports/type/1'
  })
}