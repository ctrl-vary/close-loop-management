

const questionData = [
     ['检查名称','checkName'],
     ['问题关键词','keyWord'],
     ['问题描述','quesDesc'],
     ['预计整改完成时间','planEndTime'],
     ['检查类别','category'],
     ['问题产生原因','cause'],
     ['检查级别','level'],
     ['问题严重程度','seriousLevel'],
     ['判定依据','according'],
     ['问题产生部门','quesDept'],
]

let strDataMap = new Map(questionData)

export default function(name){
    let handleName = name.trim().replace(/[\n\r]/,"")
    return strDataMap.get(handleName)
}
