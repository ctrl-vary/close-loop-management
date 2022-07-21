import request from '@/utils/request'

// 获取路由
export const getRouters = () => {
  return request({
    url: '/getRouters',
    method: 'get'
  })
}


//获取本部门所有待验收问题
export function getDeptInCheck(userName){
    return request({
        url: `/problem/Incheck/${userName}`,
        method: 'get'
      })
}
//获取本部门所有待下发问题
export function getDeptInIssue(userName){
    return request({
        url: `/problem/Inissue/${userName}`,
        method: 'get'
      })
}
//获取本部门所有待整改问题
export function getDeptQuestion(userName){
    return request({
        url: `/problem/Inreform/${userName}`,
        method: 'get'
      })
}

//打回问题
export function getRepulse(quesId){
    return request({
        url: `/problem/repulse/${quesId}`,
        method: 'get'
      })
}

//下发问题
export function postQuse(quesId){
    return request({
        url: `/problem/issue/${quesId}`,
        method: 'post'
      })
}
//验收问题 
export function getQuesCheck(quesId){
    return request({
        url: `/problem/check/${quesId}`,
        method: 'get'
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
export function getDeptCloseQues(userName){
  return request({
    url:`/problem/ToClose/${userName}`,
    method:"get"
  })
}
//获取流程信息
export function getProcessInfo(quesId){
  return request({
    url:`/transfer/list/${quesId}`,
    method:"get"
  })
}