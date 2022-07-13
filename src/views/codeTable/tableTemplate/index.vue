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
                           <el-checkbox v-if="dictitem.dictionaryItemValue" style="display:block;" :label="dictitem.dictionaryItemValue"  >{{dictitem.dictionaryItemValue}}</el-checkbox>
                </div>
         </el-checkbox-group>
        
            
       </template>
    </el-table-column>
    </el-table>
      <el-row class="all-margin-top-15  all-center"> <el-button icon="el-icon-download" type="success" @click="handleExport"  size="mini" > 导出Excel</el-button> </el-row>
   </div>
</template>

<script>
import {getCodeTable} from '@/api/tablemanage/getCodeTableInfo'
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
   methods:{
    
    
      // 获取所有码表的信息
    async getCodeList(){
        this.loading = true
        try {
             const res = await getCodeTable()
        this.codeTableData = res.rows.map((item)=>{
            return{
                selectCodeTable:[],
                ...item
            }
        })
        this.loading = false
        } catch (error) {
         this.loading = false
        }
       
    },
     //导出信息
    handleExport(){
        //选择装的数据
        let tempArr = []
        this.codeTableData.forEach(item=>{
            tempArr.push({
                dictionaryTypeName:item.dictionaryTypeName,
                selectCodeTable:[...item.selectCodeTable]
            })
        })
        console.log(tempArr)
        this.getCodeList()
    }

   }

}
</script>

<style>

</style>

