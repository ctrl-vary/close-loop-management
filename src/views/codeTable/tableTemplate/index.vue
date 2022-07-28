<template>
   <div class="app-container">
    <el-table v-loading="loading" :data="codeTableData">
    <el-table-column label="字典类型" min-width="100"  align="center"> 
            <template slot-scope="scope">
                 <el-tag type="" size="small" effect="plain"> {{scope.row.dictionaryTypeName}} </el-tag>
            </template>
    </el-table-column>
 
    <el-table-column label="字典项" min-width="300" align="left">
       <template slot-scope="scope">
        
        <el-checkbox-group  v-model="scope.row.selectCodeTable" >
                
                <div  v-for="(dictitem,index) in scope.row.dictionaryItem" :key="index">
                <!-- 0是启用 -->
                           <el-checkbox v-if="dictitem.dictionaryItemValue&&dictitem.status==0" style="display:block;" :label="dictitem.dictionaryItemValue"  >{{dictitem.dictionaryItemValue}}</el-checkbox>
                </div>
         </el-checkbox-group>
       </template>
    </el-table-column>
    </el-table>
         

      <el-row class="all-margin-top-15  all-center"> <el-button icon="el-icon-download" type="success" @click="handleExport"  size="mini" > 导出模板</el-button> </el-row>
   </div>
</template>

<script>
import {getCodeTable,excelCodeTable} from '@/api/tablemanage/getCodeTableInfo'
import {excelTest} from '@/utils/request'
import { tansParams, blobValidate } from "@/utils/ruoyi";
import { type } from 'os';
export default {
   name:'TableManage',
    dicts: ['sys_normal_disable'],
   data(){
    return{
      
      //加载
       loading:true,
      //码表数据
       codeTableData:[],
         
     
    }
   },
   created(){
        this.getCodeList()
       
   },
   //缓存组件的加载
   activated(){
       this.getCodeList()
 console.log("刷新")
   },
   methods:{
      // 获取所有码表的信息
    async getCodeList(){
        this.loading = true
        try {
             const res = await getCodeTable()
             console.log(res)
        this.codeTableData = res.data.map((item)=>{
            return{
                selectCodeTable:this.choseAllFirst(item.dictionaryItem),
                ...item
            }
        })
         
        this.loading = false
        } catch (error) {
         this.loading = false
        }
       
    },
    //筛选status为0的
    choseAllFirst(itemArr){
      let res = []
      res = itemArr.filter(item=>item.status===0).map(item=>item.dictionaryItemValue)
      return res
    },
     //导出信息
   async handleExport(){
     
        //选择装的数据
        let tempArr = []
        this.codeTableData.forEach(item=>{
            tempArr.push({
                dictionaryTypeName:item.dictionaryTypeName,
                selectCodeTable:[...item.selectCodeTable]
            })
        })
  
   const res =   await excelCodeTable({
        sheetName:"表格",
        data:tempArr
   }) 
        const content = res
        
        const blob = new Blob([content])
        const fileName = '模板.xlsx'
        if ('download' in document.createElement('a')) {
          // 非IE下载
          const elink = document.createElement('a')
          elink.download = fileName
          elink.style.display = 'none'
          elink.href = URL.createObjectURL(blob)
          document.body.appendChild(elink)
          elink.click()
          URL.revokeObjectURL(elink.href) // 释放URL 对象
          document.body.removeChild(elink)
        } else {
          // IE10+下载
          navigator.msSaveBlob(blob, fileName)
        }
     //  console.log(res)
    this.getCodeList()
    }

   }

}
</script>

<style>

</style>

