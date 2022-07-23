<template>
  <div class="app-container">
    <result-table :tableData="tableData" v-loading="loading">
      <template slot="tools">
        <el-table-column label="操作" min-width="80" align="center">
          <template slot-scope="scope">
            <el-button size="mini" type="text" icon="el-icon-check" @click="btnCheckEvidence(scope.row.quesId)">整改查看
            </el-button>
          </template>
        </el-table-column>
      </template>
    </result-table>

   <el-dialog
  title="证据查看"
  :visible.sync="checkEvidenceVisible"
  width="30%"
 >
  <el-form>
    <el-form-item label="证据查看:"> <span>{{tempEvidence.description}} </span> </el-form-item>
    <el-form-item v-for="(src,index) in tempEvidence.picurl" :key="index+src" label="照片:"> <img style="width:70%;height:120px ;" :src="src" alt=""> </el-form-item>
  </el-form>
  
  <span slot="footer" class="dialog-footer">
    <el-button size="mini" type="danger" @click="btnGiveTheRes(false)">打回整改</el-button>
    <el-button   size="mini"  type="success" @click="btnGiveTheRes(true)">审核通过</el-button>
  </span>
</el-dialog>
  </div>
</template>

<script>
import { getDeptInCheck, getRepulse, getQuesCheck,getEvidence, } from '@/api/questionmanage/index'
import storageSession from '@/utils/storage'
import { parseTime } from '@/utils/ruoyi'
import resultTable from '@/views/components/resultTable'
export default {
  components: {
    resultTable
  },
  data() {
    return {
      loading:false,
      tableData: [],
      upLoadDialogVisible: false,
      checkEvidenceVisible: false,
      inputDescription: "",
      tempEvidence: {
        tempId: "",
        description: "",
        picurl: []
      },
     
    }
  },
  created() {
    this.getDeptInCheckList()
  },
  methods: {
    //获取证据
    async getDeptInCheckList() {
      this.loading = true
      console.log(storageSession.getItem('username'))
      const res = await getDeptInCheck(storageSession.getItem('username'))
      console.log(res.rows)
      this.tableData = res.rows.map(item => {
        return {
          ...item,
          startTimeF: parseTime(item.startTime, "{yy}-{mm}-{dd}"),
          planEndTimeF: parseTime(item.planEndTime, "{yy}-{mm}-{dd}"),
          createTimeF: parseTime(item.createTime, "{yy}-{mm}-{dd}"),
        }
      })
      this.loading = false
    },
    //证据查看
       async  btnCheckEvidence(quesId){
       this.loading = true
       this.tempEvidence = []
       
       //直接调用接口
       const res = await getEvidence(quesId)
       console.log(res)
       this.tempEvidence.tempId = quesId
       this.tempEvidence.description = res.data.description
       this.tempEvidence.picurl = [...res.data.picurl]
       this.checkEvidenceVisible = true
        this.loading = false
    },
   //打回或者通过
    btnGiveTheRes(bolleanVal){
      if(bolleanVal){
   this.$confirm('这个问题将会验收，确定验收吗？', '提示', {
          confirmButtonText: '确定验收',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
      
      const res = await getQuesCheck(this.tempEvidence.tempId)
      console.log(res)
      this.$message({
        type:"success",
        message:"验收成功成功!"
      })
        }).catch(err=>{
         this.$message({
        type:"info",
        message:"取消了操作!"
      })
     
        }).finally(()=>{
            this.getDeptInCheckList()
              this.checkEvidenceVisible = false
        })


      }else{
        //打回操作
       this.$confirm('这个问题将会被打回重新整改？', '提示', {
          confirmButtonText: '确定打回',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
      
      const res = await getRepulse(this.tempEvidence.tempId)
      console.log(res)
      this.$message({
        type:"warning",
        message:"证据打回成功!"
      })
        }).catch(err=>{
         this.$message({
        type:"info",
        message:"取消了操作!"
      })
     
        }).finally(()=>{
            this.getDeptInCheckList()
            this.checkEvidenceVisible = false
        })



      }
    }


  }
}
</script>

<style>
</style>