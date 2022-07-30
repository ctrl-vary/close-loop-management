import request from '@/utils/request'

//单个问题录入
export function addNewProblem(data){
    console.log(data)
    return request({
        url: '/problem/addOne',
        method: 'post',
        data:JSON.stringify(data),
    })
}
//查询本人所有暂存问题
export function getAllTempQuestion(queryParams){
    return request({
        url:`/problem/get`,
        method:'get',
        params: queryParams
    })
}

//确认提交所有暂存的问题
export function postAllTempQuestion(data){
    return request({
        url:`/problem/getStatus1/${data.userName}`,
        method:'post',
        data:data.idArr
    })
}

//删除暂存问题
export function deleteTempQuestion(quesId){
    
    return request({
        url:`/problem/del/${quesId}`,
        method:'delete',
    })
}
//更新暂存信息
export function postChangeTempQuestion(data){
    return request({
        url:`/problem/update`,
        method:'post',
        data:data
    })
}
//当前录入的未闭环问题
export function getMyNoCloseQues(queryParams){
 return request({
    url:`/problem/ByUser`,
    method:'get',
    params: queryParams
 })
}

//当前录入的已闭环问题
export function getMyHadCloseQues(queryParams){
    return request({
       url:`/problem/ByUserClosed`,
       method:'get',
       params: queryParams
    })
}
//批量导入问题
export function postExcelQuesData(data){
    return request({
        url:`/problem/addlist/${data.userName}`,
        method:'post',
        data:data.quesArr
    })
}