<template>
  <div class="app-container">
    <!-- 搜索操作 -->
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
    <!-- 暂存问题的操作 -->
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="success" plain icon="el-icon-edit" size="mini"
          :disabled="this.selectArr.length === 1 ? false : true" @click="questionEditDialogVisible = true">修改
        </el-button>
      </el-col>
      <!-- <el-col :span="1.5">
        <el-button type="danger" plain icon="el-icon-delete" size="mini">删除</el-button>
      </el-col> -->
      <el-col :span="1.5">
        <el-button type="primary" plain icon="el-icon-upload2" size="mini"
          :disabled="this.selectArr.length > 0 ? false : true" @click="btnBatchPost">批量提交</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="success" icon="el-icon-plus" @click="btnAddInit" size="mini">添加问题
        </el-button>
      </el-col>
      <!-- 标题 -->
      <el-col :span="1.5" :offset="6">

        <el-button type="text">{{ tableTitle }} </el-button>

      </el-col>
      <div class="top-right-btn">

        <el-col :span="1.5" style="margin-right:15px">
          <el-badge type="primary" :value="nowQuestionNum" :hidden="nowQuestionNum == 0">
            <el-button type="primary" plain size="mini" @click="btnChangeTable('ques')"> {{ allTableTitle.quesName }}
            </el-button>
          </el-badge>
        </el-col>

        <el-col :span="1.5" style="margin-right:15px">
          <el-badge type="success" :value="hadCloseNum" :hidden="hadCloseNum == 0">
            <el-button type="success" plain size="mini" @click="btnChangeTable('hadclose')"> {{ allTableTitle.hadClose
            }}
            </el-button>
          </el-badge>
        </el-col>

        <el-col :span="1.5">
          <el-badge type="warning" :value="noCloseNum" :hidden="noCloseNum == 0">
            <el-button size="mini" type="info" @click="btnChangeTable('noclose')"> {{ allTableTitle.noClose }}
            </el-button>
          </el-badge>
        </el-col>
      </div>
    </el-row>
    <!-- 暂存问题展示 -->
    <result-table :tableData="tableData" @selectionChange="handleSelectionChange" v-loading="loading"
      v-if="nowColName == 'ques'">

      <template slot="allSelect">
        <el-table-column :type="nowColName == 'ques' ? 'selection' : ''" width="60"></el-table-column>

      </template>

      <template slot="tools">
        <el-table-column label="操作" align="center" min-width="140">
          <template slot-scope="scope">

            <el-button type="text" icon="el-icon-edit" size="mini" @click="btnEditQues(scope.row)">修改</el-button>
            <el-button type="text" icon="el-icon-delete" size="mini" @click="btnDelete(scope.row.quesId)">删除
            </el-button>
            <el-button type="text" icon="el-icon-top" size="mini" @click="btnSinglePost(scope.row)">提交问题</el-button>
          </template>
        </el-table-column>
      </template>
    </result-table>
    <!-- 闭环问题展示 -->
    <close-table v-else :tableData="tableData" v-loading="loading">
      <template slot="tools">
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">

            <el-button size="mini" type="text" icon="el-icon-check" @click="btnCheckProcess(scope.row.quesId)">流程追踪
            </el-button>

          </template>
        </el-table-column>
      </template>
    </close-table>
    <!-- 分页 -->
    <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
      @pagination="pageChangeEvent" />
    <!-- Excel文件暂时 -->
    <el-row class="all-center  all-margin-top-15" v-if="this.excelTable.length > 0">
      <h4>Excel导入文件预览</h4>
      <div>
        <el-button size="mini" type="primary" icon="el-icon-check" style="margin-left:20px"
          @click="btnConfirmUploadExcel">确定导入</el-button>
      </div>
    </el-row>
    <!-- Excel问题展示 -->
    <excel-table v-if="this.excelTable.length > 0" :tableData="excelTable" :startTimeCol="false">

    </excel-table>

    <!-- 添加问题对话框 -->
    <el-dialog title="问题录入" :visible.sync="questionAddDialogVisible" width="50%">
      <el-tabs v-model="activeName" type="card">
        <el-tab-pane label="单个录入" name="first">
          <singleadd-form @updateList="getAlltempQuesList" :fatherDialogVisible.sync="questionAddDialogVisible">
          </singleadd-form>
        </el-tab-pane>
        <el-tab-pane label="批量录入" name="second" class="all-center">
          <batchadd-form @updateList="getAlltempQuesList" :postExcelTable.sync="excelTable"
            :fatherDialogVisible.sync="questionAddDialogVisible">
          </batchadd-form>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>

    <!-- 修改问题对话框 -->
    <el-dialog title="问题修改" :visible.sync="questionEditDialogVisible" width="50%">
      <el-form label-width="130px">
        <el-form-item label="检查名称：">
          <el-input v-model="tempEditForm.checkName"></el-input>
        </el-form-item>
        <el-form-item label="问题关键词：">
          <el-input v-model="tempEditForm.keyWord"></el-input>
        </el-form-item>
        <el-form-item label="问题产生原因：">
          <el-input v-model="tempEditForm.cause"></el-input>
        </el-form-item>
        <el-form-item label="问题描述：">
          <el-input v-model="tempEditForm.quesDesc"></el-input>
        </el-form-item>
        <el-form-item label="预计整改完成时间:">
          <el-date-picker v-model="tempEditForm.planEndTime" type="date" placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="questionEditDialogVisible = false">取 消</el-button>
        <el-button size="mini" type="primary" @click="btnConfirmEdit">确定修改</el-button>
      </span>

    </el-dialog>

    <!-- 流程查看 -->
    <el-dialog title="流程查看" :visible.sync="processVisible" width="50%">
      <el-table :data="processTable">
        <el-table-column label="部门名称" prop="deptName"></el-table-column>
        <el-table-column label="到达部门时间" prop="receiveTimeF"></el-table-column>
        <el-table-column label="部门处理完毕时间" prop="processingTimeF"></el-table-column>

      </el-table>


    </el-dialog>

  </div>
</template>

<script>
import {
  postAllTempQuestion, getAllTempQuestion,
  deleteTempQuestion, postChangeTempQuestion,
  getMyHadCloseQues, getMyNoCloseQues,
  postExcelQuesData
} from '@/api/entrymanage/index'
import {
  getProcessInfo  //问题处理结果
} from '@/api/questionmanage/index'
import { parseTime } from '@/utils/ruoyi'
import resultTable from '@/views/components/resultTable'
import excelTable from '@/views/components/resultTable'
import closeTable from '@/views/components/resultTable'
import storageSession from '@/utils/storage'
import singleaddForm from '@/views/questionEntry/singleEntry'
import batchaddForm from '@/views/questionEntry/batchEntry'
export default {
  components: {
    resultTable,
    singleaddForm,
    batchaddForm,
    excelTable,
    closeTable
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
      //子组件传的excle
      excelTable: [],
      quesList: [],
      loading: false,
      tableData: [],
      selectArr: [],
      //问题添加按钮
      questionAddDialogVisible: false,
      //流程窗口
      processVisible: false,
      //流程窗口
      processTable: [],
      //tab标签默认名字
      activeName: 'first',
      //目前暂存问题
      nowQuestionNum: 0,
      //目前已闭环的问题
      hadCloseNum: 0,
      //目前未闭环的问题
      noCloseNum: 0,
      tableTitle: "当前暂存的问题",
      //编辑转化的暂存
      tempEditForm: {
        according: null,
        ancestors: null,
        category: null,
        cause: null,
        checkName: null,
        createTime: null,
        currentDept: null,
        isDuplicate: 0,
        keyWord: null,
        level: null,
        overtime: null,
        planEndTime: null,
        problemState: 0,
        quesDept: null,
        quesDesc: null,
        quesId: null,
        questionState: null,
        seriousLevel: null,
        startTime: null,
        userId: null,
        userName: null,
      },
      //编辑对话框
      questionEditDialogVisible: false,
      //当前操作列名称
      nowColName: 'ques',
      //获取当前登录名字
      userName:"",
      userId: "",
      allTableTitle: {
        quesName: "所有暂存问题",
        hadClose: "已闭环问题",
        noClose: "未闭环问题"
      },
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
      timerValArr: []
    }
  },
  watch: {
    excelTable: {
      handler(val, old) {
        console.log(val)
      }
    }
  },
  created() {
    this.userName = storageSession.getItem('username')
    this.userId = storageSession.getItem('userId')
    this.queryParams.userId = this.userId
    this.getAlltempQuesList()
    this.getAllhadCloseList(false)
    this.getAllNoCloseList(false)
  },
  methods: {
    //获取所有暂存问题
    async getAlltempQuesList() {
      this.loading = true
      const res = await getAllTempQuestion(this.queryParams)
      console.log(res)
      this.nowQuestionNum = res.total
      this.total = res.total

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
    //获取所有已闭环问题()
    async getAllhadCloseList(booleanVal) {
      let res
      if (booleanVal) {
        this.loading = true
        res = await getMyHadCloseQues(this.queryParams)
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
        res = await getMyHadCloseQues(this.queryParams)
      }
      console.log(this.tableData)
      this.hadCloseNum = res.total

      this.loading = false
    },
    //获取未闭环的所有问题
    async getAllNoCloseList(booleanVal) {
      let res
      if (booleanVal) {
        this.loading = true
        res = await getMyNoCloseQues(this.queryParams)
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
        res = await getMyNoCloseQues(this.queryParams)
      }
      console.log(res)
      this.noCloseNum = res.total
      this.loading = false
    },
    // 多选操作的时候
    handleSelectionChange(valArr) {
      this.selectArr = valArr
      if (this.selectArr.length === 1) {
        Object.assign(this.tempEditForm, this.selectArr[0])
      }
    },
    //批量提交
    btnBatchPost() {
      let postData = {
        userName: storageSession.getItem('username'),
        idArr: []
      }
      this.selectArr.forEach(item => {
        postData.idArr.push(item.quesId)
      })

      this.$confirm('确定提交这些问题吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const res = await postAllTempQuestion(postData)
        console.log(res)
        this.getAlltempQuesList()
        this.$message({
          type: "success",
          message: "提交成功"
        })
      }).catch(err => {
        this.$message({
          type: "info",
          message: "取消操作!"
        })
      }).finally(() => this.getAlltempQuesList())
    },
    //单个提交
    btnSinglePost(info) {
      let postData = {
        userName: storageSession.getItem('username'),
        idArr: []
      }
      postData.idArr.push(info.quesId)
      this.$confirm('确定提交这个问题吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const res = await postAllTempQuestion(postData)
        console.log(res)
        this.getAlltempQuesList()
        this.$message({
          type: "success",
          message: "提交成功"
        })
      }).catch(err => {
        this.$message({
          type: "info",
          message: "取消提交!"
        })
      }).finally(() => this.getAlltempQuesList())
    },
    //删除根据id
    btnDelete(quesId) {
      this.$confirm('确定要删除这条问题记录吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const res = await deleteTempQuestion(quesId)
        console.log(res)
        this.$message({
          type: "success",
          message: "删除成功"
        })
      }).catch(err => {
        this.$message({
          type: "info",
          message: "取消删除!"
        })
      }).finally(() => this.getAlltempQuesList())

    },
    //修改问题
    btnEditQues(info) {
      Object.assign(this.tempEditForm, info)
      this.questionEditDialogVisible = true
    },
    //确定修改
    async btnConfirmEdit() {
      const res = await postChangeTempQuestion(this.tempEditForm)
      console.log(res)
      this.$message({
        type: "success",
        message: "编辑成功"
      })
      this.getAlltempQuesList()
      this.questionEditDialogVisible = false

    },
    // 打开的时候先初始化
    btnAddInit() {
      this.excelTable = []
      this.questionAddDialogVisible = true
    },
    //修改表的内容
    btnChangeTable(strName) {
      // console.log(this.nowColName)
      this.resetQueryParams()
      this.selectArr = []
     
      if (strName == "ques") {
        this.tableTitle = this.allTableTitle.quesName
        this.nowColName = 'ques'
        this.getAlltempQuesList()
      } else if (strName == 'hadclose') {
        this.tableTitle = this.allTableTitle.hadClose
        this.nowColName = 'hadclose'
        this.getAllhadCloseList(true)
      } else {
        this.tableTitle = this.allTableTitle.noClose
        this.nowColName = 'noclose'
        this.getAllNoCloseList(true)
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
    //确定导入excel
    async btnConfirmUploadExcel() {
      const res = await postExcelQuesData({
        quesArr: this.excelTable,
        userName: this.userName
      })
      this.excelTable = []
      this.getAlltempQuesList()
      this.$message({
        type: "success",
        message: "上传成功"
      })

    },
    //分页跟着table的不同调用不用的接口
    pageChangeEvent() {
      if (this.nowColName == "ques") {
        this.getAlltempQuesList()
      } else if (this.nowColName == "hadclose") {
        this.getAllhadCloseList(true)
      } else {
        this.getAllNoCloseList(true)
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
     console.log(this.nowColName)
      console.log(this.queryParams)
      switch (this.nowColName) {
        case "ques":
          this.getAlltempQuesList()
          break;
          
       case "hadclose":
        console.log("hadclose")
            this.getAllhadCloseList(true)
          break;
        default:
          this.getAllNoCloseList(true)
          break;
      }
    },
    //重置加搜索
    btnResetSearch(){
      this.resetQueryParams()
      
       switch (this.nowColName) {
        case "ques":
          this.getAlltempQuesList()
          break;
       case "hadclose":
            this.getAllhadCloseList(true)
          break;
        default:
          this.getAllNoCloseList(true)
          break;
      }
    }
  }
}
</script>

<style>
</style>