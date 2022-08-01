<template>
  <!-- 问题面板 -->
  <div class="app-container">
    <el-form ref="queryForm" size="small" :inline="true" label-width="68px">
      <el-form-item label="检查名称" prop="userName">
        <el-input placeholder="请输入检查名称" clearable v-model="queryParams.checkName" style="width: 240px" />
      </el-form-item>
      <el-form-item label="问题关键词" prop="phonenumber" label-width="100px">
        <el-input placeholder="请输入问题关键词" clearable v-model="queryParams.keyWord" style="width: 240px" />
      </el-form-item>
      <el-form-item label="创建时间">
        <el-date-picker style="width: 240px" value-format="yyyy-MM-dd" type="daterange" v-model="timerValArr"
          range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions">
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="btnSearch">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="btnResetSearch">重置</el-button>
      </el-form-item>
    </el-form>
    <el-row :gutter="14" class="mb8">
      <el-col :span="1.5">
        <el-badge :value="hanleQuesNum" :hidden="hanleQuesNum === 0">
          <el-button type="danger" plain icon="el-icon-edit" size="mini" @click="btnChangeTable('handle')">
            {{ allTableTitle.hanleTitle }}
          </el-button>
        </el-badge>
      </el-col>

      <el-col :span="1.5">
        <el-badge :value="closeQuesNum" :hidden="closeQuesNum === 0">
          <el-button type="success" plain icon="el-icon-refresh-right" size="mini" @click="btnChangeTable('close')">
            {{ allTableTitle.closeTitle }}</el-button>
        </el-badge>
      </el-col>
      <el-col :span="1.5">
        <el-badge :value="checkQuesNum" :hidden="checkQuesNum === 0">
          <el-button type="warning" plain icon="el-icon-check" size="mini" @click="btnChangeTable('check')">
            {{ allTableTitle.checkTitle }}</el-button>
        </el-badge>
      </el-col>
      <el-col :span="1.5" :offset="6">
        <el-button plain type="text" size="mini"> {{ tableTitle }} </el-button>
      </el-col>
    </el-row>
    <!-- 问题表格 -->
    <result-table :tableData="tableData" v-loading="loading">
      <template slot="tools">
        <el-table-column label="操作" min-width="140" align="center">
          <template slot-scope="scope">
            <div v-if="hanleTableCol == 'close'">
              <el-button size="mini" type="text" icon="el-icon-check" @click="btnCheckProcess(scope.row.quesId)">流程追踪
              </el-button>
            </div>
            <div v-else-if="hanleTableCol == 'handle'">
              <el-button size="mini" type="text" icon="el-icon-check" @click="btnCheckEvidence(scope.row.quesId)">证据查看
              </el-button>
              <el-button size="mini" type="text" icon="el-icon-top" @click="btnUploadEvidence(scope.row)">整改提交
              </el-button>
              <el-button size="mini" type="text" icon="el-icon-bottom" @click="btnReleaseQues(scope.row.quesId)">继续下发
              </el-button>
            </div>
            <div v-else>

              <el-button size="mini" type="text" icon="el-icon-check" @click="btnOnlyCheckEvidence(scope.row.quesId)">
                整改查看</el-button>

            </div>
          </template>
        </el-table-column>
      </template>
    </result-table>
    <!-- 分页 -->
    <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
      @pagination="pageChangeEvent" />
    <!-- 证据更改 -->
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
    <!-- 处理问题的查看 -->
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
    <!-- 流程查看 -->
    <el-dialog title="流程查看" :visible.sync="processVisible" width="50%">
      <el-table :data="processTable">
        <el-table-column label="部门名称" prop="deptName"></el-table-column>
        <el-table-column label="到达部门时间" prop="receiveTimeF"></el-table-column>
        <el-table-column label="部门处理完毕时间" prop="processingTimeF"></el-table-column>
        <el-table-column label="备注" prop="remarks"></el-table-column>
      </el-table>


    </el-dialog>
    <!-- 审核问题的查看 -->
    <el-dialog title="证据查看" :visible.sync="checkOnlyEvidenceVisible" width="30%">
      <el-form label-width="90px">
        <el-form-item label="证据查看:"> <span>{{ tempEvidence.description }} </span> </el-form-item>
        <el-form-item v-for="(src, index) in tempEvidence.picurl" :key="index + src" label="照片:"> <img
            style="width:70%;height:120px ;" :src="src" alt=""> </el-form-item>
        <el-form-item label="审核备注:" >
          <el-input type="textarea" :rows="2" v-model=" checkParams.remarks"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button size="mini" type="danger" @click="btnGiveTheRes(false)">打回整改</el-button>
        <el-button size="mini" type="success" @click="btnGiveTheRes(true)">审核通过</el-button>
      </span>
    </el-dialog>
    <!-- 继续下发对话框 -->
    <el-dialog title="继续下发" :visible.sync="keepPostVisible" v-if="keepPostVisible" width="25%">
      <el-form label-width="80px">
        <el-form-item label="部门选择">
          <treeselect @select="eventTreeSelect" :options="deptOptions" :show-count="true" placeholder="请选择归属部门" />
        </el-form-item>

      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" type="danger" @click="btnConfirmeKeepPost(true)">确定下发</el-button>
        <el-button size="mini" type="success" @click="btnConfirmeKeepPost(false)">取消</el-button>
      </span>
    </el-dialog>

  </div>



</template>

<script>
import { Notification, MessageBox, Message, Loading } from 'element-ui'
import resultTable from '@/views/components/resultTable'
import storageSession from '@/utils/storage'
import { parseTime } from '@/utils/ruoyi'
import { treeselect } from "@/api/system/dept";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css"; //在上面联合Treeselect使用
import {
  getDeptQuestion, getEvidence, postChangeEvidence, getUploadEvidence, getDeptCloseQues, getProcessInfo  //问题处理结果
  , getDeptInIssue, postQuse //问题下发接口
  , getDeptInCheck, getRepulse, getQuesCheck,//问题审核接口

} from '@/api/questionmanage/index'
export default {
  components: {
    resultTable,
    Treeselect
  },
  data() {
    return {
      //时间学着帮助器
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
            picker.$emit('pick', [start, end]);
          }
        }]
      },
      loading: false,
      //名字
      allTableTitle: {
        hanleTitle: "待处理问题",
        checkTitle: "待审核问题",
        closeTitle: "经手闭环问题"
      },
      //表格数据
      tableData: [],
      //上传证据对话框
      upLoadDialogVisible: false,
      // 查看证据对话框
      checkEvidenceVisible: false,
      //继续下发对话框
      keepPostVisible: false,
      //措施输入的描述
      inputDescription: "",
      //暂时接收证据内容的
      tempEvidence: {
        tempId: "",
        description: "",
        picurl: [],
        remarks:""
      },
      //待处理的问题
      hanleQuesNum: 0,
      //待闭环的问题
      closeQuesNum: 0,
      //待审核问题:
      checkQuesNum: 0,
      //改变table最后一列的操作
      hanleTableCol: "handle", //false时为 待处理操作  true时为待闭环操作
      //表名
      tableTitle: "待处理问题",
      //文件列表
      fileList: [],
      //暂存上传文件列表
      tempPicList: [],
      //流程Table
      processTable: [],
      //流程对话框
      processVisible: false,
      //待审核区域
      upLoadDialogVisible: false,
      checkOnlyEvidenceVisible: false,
      //部门树
      deptOptions: [],
      //部门树的信息
      selectDeptName: undefined,
      TempQuesId: "",
      total: 2,
      queryParams: {
        pageSize: 10,
        pageNum: 1,
        userId: "",
        keyWord: "",
        checkName: "",
        beginTime: "",
        endTime: ""
      },
      //时间选择
      timerValArr: [],
      userId: "",
      //打回或者审核体
      checkParams: {
        quesId: "",
        remarks: ""
      }



    }
  },
  created() {
    this.userId = storageSession.getItem('userId')
    this.queryParams.userId = this.userId
    this.getTreeselect()
    this.getCloseQuesList(false)
    this.getDeptPostIssueList(true)
    this.getDeptInCheckList(false)

  },
  methods: {

    /** 查询部门下拉树结构 */
    getTreeselect() {
      treeselect().then(response => {
        console.log(response)
        this.deptOptions = response.data;
      });
    },
    eventTreeSelect(node, instanceId) {
      this.selectDeptName = node.label
      console.log(this.selectDeptName)
    },
    //下发操作
    btnConfirmeKeepPost(booleanVal) {
      if (booleanVal) {
        this.$confirm('确定要继续下发这个问题吗, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          console.log("Jiekkk")
          const res = await postQuse({
            quesId: this.TempQuesId,
            deptName: this.selectDeptName
          })
          this.$message({
            type: "success",
            message: "下发成功!"
          })
          console.log(res)
        }).catch(err => {
          this.$message({
            type: "info",
            message: "取消了操作!"
          })
        }).finally(() => {
          this.getDeptPostIssueList(true)
          this.keepPostVisible = false
        })
      } else {
        this.$message({
          type: "info",
          message: "取消了操作!"
        })
        this.keepPostVisible = false
      }
    },
    //经手闭环问题列表
    async getCloseQuesList(booleanVal) {
      let res
      if (booleanVal) {
        //如果要加载列表
        this.loading = true
        res = await getDeptCloseQues(this.queryParams)
        this.total = res.total
        console.log(res)
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
        res = await getDeptCloseQues(this.queryParams)
      }
      this.closeQuesNum = res.total
      this.loading = false
    },
    //待处理问题列表
    //待下发问题列表
    async getDeptPostIssueList(bolleanVal) {
      let res
      if (bolleanVal) {
        this.loading = true
        res = await getDeptInIssue(this.queryParams)
        this.total = res.total
        console.log(res)
        this.tableData = res.rows.map(item => {
          return {
            ...item,
            startTimeF: parseTime(item.startTime, "{yy}-{mm}-{dd}"),
            planEndTimeF: parseTime(item.planEndTime, "{yy}-{mm}-{dd}"),
            createTimeF: parseTime(item.createTime, "{yy}-{mm}-{dd}"),
          }
        })
      } else {
        res = await getDeptInIssue(this.queryParams)
      }
      this.hanleQuesNum = res.total
      this.loading = false
    },
    //继续下发对话框的操作
    async btnReleaseQues(quesId) {
      //保存一些信息和处理一些字段
      this.TempQuesId = quesId
      this.selectDeptName = undefined
      this.keepPostVisible = true
    },
    //待审核列表区域操作
    //获取证据
    async getDeptInCheckList(bolleanVal) {
      let res
      if (bolleanVal) {
        this.loading = true
        console.log(storageSession.getItem('username'))
        res = await getDeptInCheck(this.queryParams)
        this.total = res.total
        this.tableData = res.rows.map(item => {
          return {
            ...item,
            startTimeF: parseTime(item.startTime, "{yy}-{mm}-{dd}"),
            planEndTimeF: parseTime(item.planEndTime, "{yy}-{mm}-{dd}"),
            createTimeF: parseTime(item.createTime, "{yy}-{mm}-{dd}"),
          }
        })
      } else {
        res = await getDeptInCheck(this.queryParams)

      }
      this.checkQuesNum = res.total
      this.loading = false
    },
    //审核证据查看
    async btnOnlyCheckEvidence(quesId) {
      this.loading = true
      this.tempEvidence = []

      //直接调用接口
      const res = await getEvidence(quesId)
      console.log(res)
      this.tempEvidence.tempId = quesId
      this.tempEvidence.description = res.data.description
      this.tempEvidence.picurl = [...res.data.picurl]
      this.checkOnlyEvidenceVisible = true
      this.loading = false
    },
    //打回或者通过
    btnGiveTheRes(bolleanVal) {
      this.checkParams.quesId = this.tempEvidence.tempId
      
      if (bolleanVal) {
        this.$confirm('这个问题将会验收，确定验收吗？', '提示', {
          confirmButtonText: '确定验收',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {

          const res = await getQuesCheck(
            this.checkParams
          )
          console.log(res)
          this.$message({
            type: "success",
            message: "验收成功成功!"
          })
        }).catch(err => {
          this.$message({
            type: "info",
            message: "取消了操作!"
          })

        }).finally(() => {
          this.getDeptInCheckList(true)
          //刷新问题处理标志
          this.getDeptPostIssueList(false)
          this.checkOnlyEvidenceVisible = false
        })


      } else {
        //打回操作
        this.$confirm('这个问题将会被打回重新整改？', '提示', {
          confirmButtonText: '确定打回',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {

          const res = await getRepulse(this.checkParams)
          console.log(res)
          this.$message({
            type: "warning",
            message: "证据打回成功!"
          })
        }).catch(err => {
          this.$message({
            type: "info",
            message: "取消了操作!"
          })

        }).finally(() => {
          this.getDeptInCheckList(true)
          //刷新问题处理标志
          this.getDeptPostIssueList(false)
          this.checkOnlyEvidenceVisible = false
          this.checkParams = {}
        })



      }
    },

    //结束区域
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
        this.tempEvidence.remarks = res.data.remarks
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
    // 限制文件数量
    limitHandle(files, fileList) {
      this.$message({
        type: "error",
        message: "最多传3个"
      })
    },
    //文件移除
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

        this.getDeptPostIssueList(true)
        this.getDeptInCheckList(false)
      })
    },
    //改变table
    btnChangeTable(tableName) {
      this.resetQueryParams()
      if (tableName === "handle") {
        this.hanleTableCol = "handle"
        this.tableTitle = this.allTableTitle.hanleTitle
        this.getDeptPostIssueList(true)
      } else if (tableName === "close") {
        this.hanleTableCol = "close"
        this.tableTitle = this.allTableTitle.closeTitle
        this.getCloseQuesList(true)
      } else {
        this.hanleTableCol = "check"
        this.tableTitle = this.allTableTitle.checkTitle
        this.getDeptInCheckList(true)
      }
    },
    //流程查看
    async btnCheckProcess(quesId) {
      const res = await getProcessInfo(quesId)
      console.log(res)
      this.processTable = res.data.map(item => {
        return {
          ...item,
          receiveTimeF: parseTime(item.receiveTime, "{yy}-{mm}-{dd} {hh}:{ii}:{ss}"),
          processingTimeF: parseTime(item.processingTime, "{yy}-{mm}-{dd} {hh}:{ii}:{ss}")
        }
      })
      this.processVisible = true
    },
    //分页跟着table的不同调用不用的接口
    pageChangeEvent() {
      if (this.hanleTableCol == "handle") {
        this.getDeptPostIssueList(true)
      } else if (this.hanleTableCol == "close") {
        this.getCloseQuesList(true)
      } else {
        this.getDeptInCheckList(true)
      }
    },
    //重置
    resetQueryParams() {
      this.timerValArr = []
      Object.keys(this.queryParams).forEach(key => {
        this.queryParams[key] = ""
      })
      //这些先初始化
      this.queryParams.pageSize = 10
      this.queryParams.pageNum = 1
      this.queryParams.userId = this.userId
    },
    //搜索操作
    btnSearch() {
      this.queryParams.beginTime = this.timerValArr[0]
      this.queryParams.endTime = this.timerValArr[1]
      switch (this.hanleTableCol) {
        case "handle":
          this.getDeptPostIssueList(true)
          break;
        case "close":
          this.getCloseQuesList(true)
          break;
        default:
          this.getDeptInCheckList(true)
          break;
      }
    },
    //重置加搜索
    btnResetSearch() {
      this.resetQueryParams()
      switch (this.hanleTableCol) {
        case "handle":
          this.getDeptPostIssueList(true)
          break;
        case "close":
          this.getCloseQuesList(true)
          break;
        default:
          this.getDeptInCheckList(true)
          break;
      }
    }

  }
}
</script>

<style>
</style>