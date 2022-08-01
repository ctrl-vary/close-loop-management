import request from '@/utils/request'

// 获取路由
export const getRouters = () => {
  return request({
    url: '/getRouters',
    method: 'get'
  })
}


//获取本部门所有待验收问题
export function getDeptInCheck(queryParams){
    return request({
        url: `/problem/Incheck`,
        method: 'get',
        params: queryParams
      })
}
//获取本部门所有待处理或者继续 下发问题 
export function getDeptInIssue(queryParams){
    return request({
        url: `/problem/Inissue`,
        method: 'get',
        params: queryParams
      })
}

//打回问题
export function getRepulse(params){
    return request({
        url: `/problem/repulse`,
        method: 'get',
        params: params
      })
}

//下发问题
export function postQuse(data){
    return request({
        url: `/problem/issue/${data.quesId}/${data.deptName}`,
        method: 'post'
      })
}
//验收问题 
export function getQuesCheck(params){
    return request({
        url: `/problem/check`,
        method: 'get',
        params: params
      })
}
// 本人获取证据接口
export function getEvidence(quesId){
  
  return request({
    url: `/reform/getinfo/${quesId}`,
    method: 'get'
  })
}
//更改证据
export function postChangeEvidence(data){
  return request({
    url: `/reform/update`,
    method: 'post',
    data:data,
    headers:{
      'Content-Type':'multipart/form-data'
    }
  })
}
//提交整改信息
export function getUploadEvidence(quesId){
  return request({
    url: `/reform/Becheck/${quesId}`,
    method: 'get'
  })
}

//获取本部门待闭环问题
export function getDeptCloseQues(queryParams){
  return request({
    url:`/problem/ToClose`,
    method:"get",
    params: queryParams
  })
}
//获取流程信息
export function getProcessInfo(quesId){
  return request({
    url:`/transfer/list/${quesId}`,
    method:"get"
  })
}
