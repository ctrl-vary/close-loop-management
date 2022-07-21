<template>
  <div class="app-container"> 
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="el-icon-bottom" size="mini" disabled
          >批量下发</el-button>
      </el-col>
    </el-row>
    

   <result-table :tableData="tableData"  v-loading="loading">
     <template slot="tools">
       <el-table-column label="操作">
           <template slot-scope="scope">
             <el-button type="text" icon="el-icon-bottom" size="mini" @click="btnReleaseQues(scope.row.quesId)" >下发</el-button>
           </template>
       </el-table-column>
      </template>
     
   </result-table>
  </div>



</template>

<script>
import resultTable from '@/views/components/resultTable'
import storageSession from '@/utils/storage'
import { parseTime } from '@/utils/ruoyi'
import {getDeptQuestion,getDeptInIssue,postQuse} from '@/api/questionmanage/index'
export default {
  components:{
     resultTable
  },
    data(){
      return{
        loading:false,
        tableData:[]
      }
    },
    created(){
       this.getDeptInIssueList()
    },
    methods:{
        //获取待下发的问题
       async getDeptInIssueList(){
        this.loading =true
        console.log(storageSession.getItem('username'))
        const res = await getDeptInIssue(storageSession.getItem('username'))
        console.log(res)
          this.tableData = res.rows.map(item=>{
             return {
          ...item,
          startTimeF: parseTime(item.startTime, "{yy}-{mm}-{dd}"),
          planEndTimeF: parseTime(item.planEndTime, "{yy}-{mm}-{dd}"),
          createTimeF: parseTime(item.createTime, "{yy}-{mm}-{dd}"),
        }
        
          })
          this.loading =false
       },
       //获取id
     async  btnReleaseQues(quesId){
        
        this.$confirm('这个问题将会发给下一级！', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const res = await postQuse(quesId)
        console.log(res)
        this.getDeptInIssueList()
        this.$message({
          type:"success",
          message:"下发成功"
        })
      }).catch(err => {
         this.$message({
          type:"info",
          message:"取消下发!"
         })
      }).finally(()=>this.getDeptInIssueList())
       }
    }
}
</script>

<style>

</style>