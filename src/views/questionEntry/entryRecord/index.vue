<template>
  <div class="app-container">
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="success" plain icon="el-icon-edit" size="mini"
          :disabled="this.selectArr.length === 1 ? false : true">修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" plain icon="el-icon-delete" size="mini">删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="primary" plain icon="el-icon-upload2" size="mini"
          :disabled="this.selectArr.length > 0 ? false : true" @click="btnBatchPost">批量下发</el-button>
      </el-col>

    </el-row>
    <temp-question :tableData="quesTempTableData" @selectionChange="handleSelectionChange" v-loading="loading">
      <template slot="allSelect">
        <el-table-column type="selection"></el-table-column>
      </template>
      <template slot="tools">
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button type="text" icon="el-icon-edit" size="mini" >修改</el-button>
            <el-button type="text" icon="el-icon-delete" size="mini" @click="btnDelete(scope.row.quesId)">删除</el-button>
            <el-button type="text" icon="el-icon-bottom" size="mini" @click="btnSinglePost(scope.row)">下发</el-button>
          </template>
        </el-table-column>
      </template>
    </temp-question>


  </div>
</template>

<script>
import { postAllTempQuestion, getAllTempQuestion ,deleteTempQuestion} from '@/api/entrymanage/index'
// import Cookies from "js-cookie";
import { parseTime } from '@/utils/ruoyi'
import resultTable from '@/views/components/resultTable'
import storageSession from '@/utils/storage'
export default {
  components: {
    "temp-question": resultTable
  },
  data() {
    return {

      quesList: [],
      loading: false,
      quesTempTableData: [],
      selectArr: [],
    }
  },
  created() {
    this.getAlltempQuesList()
  },
  methods: {
    async getAlltempQuesList() {
       this.loading =true
      const res = await getAllTempQuestion(storageSession.getItem('username'))
      console.log(res.data)
      this.quesTempTableData = res.data.map(item => {
        return {
          ...item,
          startTimeF: parseTime(item.startTime, "{yy}-{mm}-{dd}"),
          planEndTimeF: parseTime(item.planEndTime, "{yy}-{mm}-{dd}"),
          createTimeF: parseTime(item.createTime, "{yy}-{mm}-{dd}"),
        }
      })
      this.loading = false
    },
    handleSelectionChange(valArr) {
      this.selectArr = valArr
    },
    //批量下发
    btnBatchPost() {
      let postData = {
        userName: storageSession.getItem('username'),
        idArr: []
      }
      this.selectArr.forEach(item => {
        postData.idArr.push(item.quesId)
      })

      this.$confirm('确定下发这些问题吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const res = await postAllTempQuestion(postData)
        console.log(res)
        this.getAlltempQuesList()
        this.$message({
          type:"success",
          message:"下发成功"
        })
      }).catch(err => {
         this.$message({
          type:"info",
          message:"取消下发!"
         })
      }).finally(()=>this.getAlltempQuesList())
    },
    //单个下发
    btnSinglePost(info){
       let postData = {
        userName: storageSession.getItem('username'),
        idArr: []
      }
      postData.idArr.push(info.quesId)
       this.$confirm('确定下发这个问题吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const res = await postAllTempQuestion(postData)
        console.log(res)
        this.getAlltempQuesList()
        this.$message({
          type:"success",
          message:"下发成功"
        })
      }).catch(err => {
         this.$message({
          type:"info",
          message:"取消下发!"
         })
      }).finally(()=> this.getAlltempQuesList())
    },
    //删除根据id
    btnDelete(quesId){
        this.$confirm('确定要删除这条问题记录吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const res = await deleteTempQuestion(quesId)
        console.log(res)

        this.$message({
          type:"success",
          message:"删除成功"
        })
      }).catch(err => {
         this.$message({
          type:"info",
          message:"取消删除!"
         })
      }).finally(()=> this.getAlltempQuesList())

    }
  }
}
</script>

<style>
</style>