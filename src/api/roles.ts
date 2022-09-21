import myRequest from './api'

export function getRoles() {
  return myRequest.request({
    url: '/roles',
  })
}

export function addRoles(roleName: string, roleDesc?: string) {
  return myRequest.request({
    url:'/roles',
    method: 'post',
    data:{
      roleName,
      roleDesc
    }
  })
}

export function editRoles(id:number, roleName:string, roleDesc?: string) {
  return myRequest.request({
    url:`/roles/${id}`,
    method:'put',
    data: {
      roleName,
      roleDesc
    }
  })
}

export function deleteRoles(id:number) {
  return myRequest.request({
    url: `roles/${id}`,
    method:'delete',
  })
}

export function deleteRoleRight(roleId:number, rightId: number) {
  return myRequest.request({
    url: `roles/${roleId}/rights/${rightId}`,
    method:'delete',
  })  
}

export function assignRoleRights(roleId: number, rightIds: string) {
  return myRequest.request({
    url: `roles/${roleId}/rights`,
    method:'post',
    data: {
      rids:rightIds
    }
  })  
}