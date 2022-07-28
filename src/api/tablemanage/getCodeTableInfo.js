import request from '@/utils/request'

export function getCodeTable(){
    return request({
        url: `/codetable/getcodetable`,
        method: 'get'
    })
}

export function addCodeTable(data){
  
    return request({
        url: '/codetable/additemvalue',
        method: 'get',
        params:data
    })
}

export function deleteCodeTableById(id){
    return request({
        url: `/codetable/delitemvalue/${id}`,
        method: 'get',
    })
}

export function excelCodeTable(excelData){
    return request({
        url: '/excel/codetable',
        method: 'post',
        data: JSON.stringify(excelData) ,
        responseType: 'blob'  //后端传的数据流，必须加这个
    })
}
//更改码表是否启用
export function changeCodeTableState(data){
    console.log(data)
    return request({
        url:`/codetable/update/${data.status}/${data.id}`,
        method:'get'
    })
}
