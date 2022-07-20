import request from '@/utils/request'

//单个问题录入
export function addNewProblem(form){
    console.log(form)
    return request({
        url: '/problem/addOne',
        method: 'post',
        data:JSON.stringify(form),
    })
}

//查询本人所有暂存问题
export function getAllTempQuestion(UserName){
    return request({
        url:`/problem/get/${UserName}`,
        method:'get'
    })
}

//确认提交所有暂存的问题
export function postAllTempQuestion(UserName){
    return request({
        url:`/problem/get/${UserName}`,
        method:'get'
    })
}
