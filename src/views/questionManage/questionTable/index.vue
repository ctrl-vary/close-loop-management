<template>
  <!-- 问题面板 -->
  <div class="app-container">
    <el-row :gutter="14" class="mb8">
      <el-col :span="1.5">
        <el-badge :value="hanleQuesNum" :hidden="hanleQuesNum === 0">
          <el-button type="success" plain icon="el-icon-edit" size="mini" @click="btnChangeTable('hanle')">待处理问题
          </el-button>
        </el-badge>
      </el-col>

      <el-col :span="1.5">
        <el-badge :value="closeQuesNum" :hidden="closeQuesNum === 0">
          <el-button type="primary" plain icon="el-icon-refresh-right" size="mini" @click="btnChangeTable('close')">
            待闭环问题</el-button>
        </el-badge>
      </el-col>

    </el-row>
    <el-row class="all-center">
      <h4> {{ tableTitle }} </h4>
    </el-row>
    <!-- 表格 -->
    <result-table :tableData="tableData" v-loading="loading">
      <template slot="tools">
        <el-table-column label="操作" min-width="140" align="center">
          <template slot-scope="scope">
            <div v-if="hanleTableCol">
              <el-button size="mini" type="text" icon="el-icon-check" @click="btnCheckProcess(scope.row.quesId)">流程查看
              </el-button>
            </div>
            <div v-else>
              <el-button size="mini" type="text" icon="el-icon-check" @click="btnCheckEvidence(scope.row.quesId)">证据查看
              </el-button>
              <el-button size="mini" type="text" icon="el-icon-top" @click="btnUploadEvidence(scope.row)">整改提交
              </el-button>
            </div>
          </template>
        </el-table-column>
      </template>
    </result-table>
    <el-dialog title="证据上传" :visible.sync="upLoadDialogVisible" width="35%">
      <el-form label-width="80px">
        <el-row>
          <el-form-item label="措施描述:">
            <el-input size="mini" type="textarea" :rows="2" v-model="inputDescription"></el-input>
          </el-form-item>
        </el-row>

      </el-form>
      <!-- 文件上传 -->
      <el-upload class="upload-demo" ref="picUpload" action="#" :file-list="fileList" :limit="3"
        :on-exceed="limitHandle" :on-remove="handleRemove" :on-change="changeUploadHandle" :auto-upload="false"
        list-type="picture">
        <el-button size="mini" type="primary">点击上传</el-button>
        <div slot="tip" class="el-upload__tip">只能上传"png", "jpg", "jpeg"文件</div>
      </el-upload>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="upLoadDialogVisible = false">取 消</el-button>
        <el-button size="mini" type="primary" @click="btnConfirmUpload">确定上传</el-button>
      </span>
    </el-dialog>

    <el-dialog title="证据查看" :visible.sync="checkEvidenceVisible" width="30%">
      <el-form>
        <el-form-item label="证据查看:"> <span>{{ tempEvidence.description }} </span> </el-form-item>
        <el-form-item v-for="(src, index) in tempEvidence.picurl" :key="index + src" label="照片:"> <img
            style="width:70%;height:120px ;" :src="src" alt=""> </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="checkEvidenceVisible = false">取 消</el-button>
        <el-button size="mini" type="primary" @click="btnChangeEvidence">更改证据</el-button>
      </span>
    </el-dialog>

<el-dialog title="流程查看"  :visible.sync="processVisible" width="50%">
    <el-table :data="processTable">
     <el-table-column label="部门名称" prop="deptName"></el-table-column>
     <el-table-column label="到达部门时间" prop="receiveTimeF"></el-table-column>
     <el-table-column label="部门处理完毕时间" prop="processingTimeF"></el-table-column>
       
    </el-table>


</el-dialog>

  </div>



</template>

<script>
import { Notification, MessageBox, Message, Loading } from 'element-ui'
import resultTable from '@/views/components/resultTable'
import storageSession from '@/utils/storage'
import { parseTime } from '@/utils/ruoyi'
import { getDeptQuestion, getEvidence, postChangeEvidence, getUploadEvidence, getDeptCloseQues, getProcessInfo } from '@/api/questionmanage/index'
export default {
  components: {
    resultTable
  },
  data() {
    return {
      loading: false,
      //表格数据
      tableData: [],
      //上传证据对话框
      upLoadDialogVisible: false,
      // 查看证据对话框
      checkEvidenceVisible: false,
      //措施输入的描述
      inputDescription: "",
      //暂时接收证据内容的
      tempEvidence: {
        tempId: "",
        description: "",
        picurl: []
      },
      //待处理的问题
      hanleQuesNum: 0,
      //待闭环的问题
      closeQuesNum: 0,
      //改变table最后一列的操作
      hanleTableCol: false, //false时为 待处理操作  true时为待闭环操作
      //表名
      tableTitle: "待处理问题",
      //文件列表
      fileList: [],
      //暂存上传文件列表
      tempPicList: [],
      //流程Table
      processTable:[],
      //流程对话框
      processVisible:false
    }
  },
  created() {
    this.getMyQuestionList()
    this.getCloseQuesList(false)
  },
  methods: {
    async getCloseQuesList(booleanVal) {
      let res
      if (booleanVal) {
        //如果要加载列表
        this.loading = true
        res = await getDeptCloseQues(storageSession.getItem('username'))
        this.tableData = res.rows.map(item => {
          return {
            ...item,
            startTimeF: parseTime(item.startTime, "{yy}-{mm}-{dd}"),
            planEndTimeF: parseTime(item.planEndTime, "{yy}-{mm}-{dd}"),
            createTimeF: parseTime(item.createTime, "{yy}-{mm}-{dd}"),
          }
        })
      } else {
        //如果不加载列表
        res = await getDeptCloseQues(storageSession.getItem('username'))
      }
      this.closeQuesNum = res.rows.length
      this.loading = false
    },



    async getMyQuestionList() {
      console.log(storageSession.getItem('username'))
      this.loading = true
      const res = await getDeptQuestion(storageSession.getItem('username'))
      this.hanleQuesNum = res.rows.length
      console.log(res.rows.length)
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

    RegPicsFile(fileName) {
      return /\.(png|jpg|jpeg)$/.test(fileName)
    },
    //证据查看
    async btnCheckEvidence(quesId) {
      this.loading = true
      this.inputDescription = ""
      this.tempEvidence = []
      this.fileList = []
      //首先轮询 看以前是否传过证据
      const res = await getEvidence(quesId)
      console.log(res)
      this.tempEvidence.tempId = quesId
      //以前没有传过直接打开这个上传
      if (res.data.picurl == null) {
        this.upLoadDialogVisible = true
      } else {
        //传过打开接收的对话框
        this.tempEvidence.description = res.data.description
        this.tempEvidence.picurl = [...res.data.picurl]
        this.checkEvidenceVisible = true
      }
      this.loading = false
    },
    //上传
    changeUploadHandle(file, filelist) {

      //判断是否是这个类型的文件
      if (this.RegPicsFile(file.name)) {
        this.tempPicList.push(file)
      } else {
        this.$message({
          type: "error",
          message: "只能传'png', 'jpg', 'jpeg'文件"
        })
        this.$refs.picUpload.clearFiles()
      }


    },
    limitHandle(files, fileList) {
      this.$message({
        type: "error",
        message: "最多传3个"
      })
    },
    handleRemove(file, fileList) {
      this.tempPicList = this.tempPicList.filter(item => file.name !== item.name)
      this.$message({
        type: "warning",
        message: "移除成功！"

      })
    },
    //确定上传
    async btnConfirmUpload() {
      let downloadLoadingInstance //开启加载实例
      let postFormData = new FormData()
      postFormData.append("desc", this.inputDescription)
      postFormData.append("quesId", this.tempEvidence.tempId)
      postFormData.append("userName", storageSession.getItem('username'))

      this.tempPicList.forEach(item => {
        postFormData.append("pics", item.raw)
      })
      this.$confirm('确定要更新这证据吗, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        downloadLoadingInstance = Loading.service({ text: "正在上传，请稍候", spinner: "el-icon-loading", background: "rgba(0, 0, 0, 0.7)", })
        const res = await postChangeEvidence(postFormData)
        console.log(res)
        this.$message({
          type: "success",
          message: "证据更新成功!"
        })

      }).catch(err => {
        this.$message({
          type: "info",
          message: "取消了操作!"
        })

      }).finally(() => {
        this.upLoadDialogVisible = false
        this.tempPicList = []
        downloadLoadingInstance.close()
      })
      // const res = await postChangeEvidence(postData)
      console.log(postFormData.get("desc"))
      console.log(postFormData.getAll("pics"))
    },
    //更改证据按钮
    btnChangeEvidence() {
      this.checkEvidenceVisible = false
      this.upLoadDialogVisible = true
    },
    //上传整改信息
    btnUploadEvidence(info) {

      this.$confirm('确定要提交这个整改信息吗, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {

        const res = await getUploadEvidence(info.quesId)
        console.log(res)
        this.$message({
          type: "success",
          message: "证据提交成功!"
        })
      }).catch(err => {
        this.$message({
          type: "info",
          message: "取消了操作!"
        })

      }).finally(() => {
        this.getMyQuestionList()
      })
    },
    //改变table
    btnChangeTable(tableName) {
      if (tableName === "hanle") {
        this.hanleTableCol = false
        this.tableTitle = "待处理问题"
        this.getMyQuestionList()
      } else {
        this.hanleTableCol = true
        this.tableTitle = "待闭环问题"
        this.getCloseQuesList(true)
      }
    },
    //流程查看
    async btnCheckProcess(quesId) {
      const res = await getProcessInfo(quesId)
      console.log(res)
      this.processTable = res.data.map(item=>{
        return{
          ...item,
          receiveTimeF:parseTime(item.receiveTime,"{yy}-{mm}-{dd} {hh}:{ii}:{ss}"),
          processingTimeF:parseTime(item.processingTime,"{yy}-{mm}-{dd} {hh}:{ii}:{ss}")
        }
      })
      this.processVisible = true
    }

  }
}
</script>

<style>
</style>