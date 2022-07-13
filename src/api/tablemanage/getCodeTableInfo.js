import request from '@/utils/request'

export function getCodeTable(){
    return request({
        url: '/codetable/getcodetable',
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

export function deleteCodeTable(data){
    return request({
        url: `/codetable/delitemvalue?dictionaryTypeName=${data.dictionaryTypeName}&dictionaryItemValue=${data.dictionaryItemValue}`,
        method: 'delete',
    })
}