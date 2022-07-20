<template>
<!-- 问题面板 -->
  <div class="app-container"> 
         <result-table :tableData="tableData">
                 <template slot="tools">
                  <el-table-column label="操作" min-width="140" align="center">
                     <template slot-scope="scope">
                            <el-button size="mini"  type="text" icon="el-icon-upload" @click="btnCheckEvidence(scope.row.quesId)">证据查看</el-button>
                            <el-button size="mini"  type="text" icon="el-icon-upload" @click="btnUploadEvidence(scope.row)">证据提交</el-button>
                     </template>
                  </el-table-column>
                 </template>
         </result-table>
       <el-dialog
  title="证据上传"
  :visible.sync="upLoadDialogVisible"
  width="35%"
 >
  <el-form label-width="80px" >
    <el-row>
 <el-form-item label="措施描述:"><el-input size="mini" v-model="tempEvidence.description"></el-input> </el-form-item>
    </el-row>
   
  </el-form>
 <!-- 文件上传 -->
   <el-upload
  class="upload-demo"
  ref="picUpload"
  action="#"
  :file-list="fileList"
  :limit="3"
  :on-exceed="limitHandle"
  :on-remove="handleRemove"
  :on-change="changeUploadHandle"
  :auto-upload="false"
  list-type="picture"
  >
    <el-button size="small" type="primary">点击上传</el-button>
  <div slot="tip" class="el-upload__tip">只能上传"png", "jpg", "jpeg"文件</div>
</el-upload>
  <span slot="footer" class="dialog-footer">
    <el-button @click="upLoadDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="btnConfirmUpload">确定上传</el-button>
  </span>
</el-dialog>

  <el-dialog
  title="证据查看"
  :visible.sync="checkEvidenceVisible"
  width="30%"
 >
 <!-- 文件上传 -->
  
  <span slot="footer" class="dialog-footer">
    <el-button @click="checkEvidenceVisible = false">取 消</el-button>
    <el-button type="primary" @click="btnChangeEvidence">更改证据</el-button>
  </span>
</el-dialog>

  </div>



</template>

<script>
import resultTable from '@/views/components/resultTable'
import Cookies from "js-cookie";
import { parseTime } from '@/utils/ruoyi'
import {getDeptQuestion,getEvidence,postChangeEvidence,getUploadEvidence} from '@/api/questionmanage/index'
export default {
  components:{
     resultTable
  },
    data(){
      return{
        tableData:[],
        upLoadDialogVisible:false,
        checkEvidenceVisible:false,
        tempEvidence:{
          tempId:"",
          description:"",
          picurl:[]
        },
        fileList:[],
        tempPicList:[]
      }
    },
    created(){
       this.getMyQuestionList()
    },
    methods:{
       async  getMyQuestionList(){
            console.log(Cookies.get('username'))
            const res = await getDeptQuestion(Cookies.get('username'))
            console.log(res.rows)
            this.tableData = res.rows.map(item=>{
                return {
          ...item,
          startTimeF: parseTime(item.startTime, "{yy}-{mm}-{dd}"),
          planEndTimeF: parseTime(item.planEndTime, "{yy}-{mm}-{dd}"),
          createTimeF: parseTime(item.createTime, "{yy}-{mm}-{dd}"),
        }
            })
        },
    
     RegPicsFile(fileName){
      return /\.(png|jpg|jpeg)$/.test(fileName)
    },
    //证据查看
    async  btnCheckEvidence(quesId){
       this.tempEvidence = []
       this.fileList = []
          //首先轮询 看以前是否传过证据
       const res = await getEvidence(quesId)
       console.log(res)
       this.tempEvidence.tempId = quesId
       //以前没有传过直接打开这个上传
       if (res.data.picurl==null){
        this.upLoadDialogVisible =true
       }else{
        //传过打开接收的对话框
        this.tempEvidence.description = res.data.description
        this.tempEvidence.picurl = [res.data.picurl]
       this.checkEvidenceVisible = true
       }
    },
      //上传
    changeUploadHandle(file,filelist){
     
      //判断是否是这个类型的文件
     if(this.RegPicsFile(file.name)) {
         this.tempPicList.push(file)
     }else{
      this.$message({
        type:"error",
        message:"只能传'png', 'jpg', 'jpeg'文件"
       })
       this.$refs.picUpload.clearFiles()
     }
        
        
    },
    limitHandle(files, fileList){
       this.$message({
        type:"error",
        message:"最多传3个"
       })
    },
    handleRemove(file, fileList){
      this.tempPicList = this.tempPicList.filter(item=>file.name!==item.name)
         this.$message({
          type:"warning",
          message:"移除成功！"
          
         })
    },
    //确定上传
   async btnConfirmUpload(){
      console.log(this.tempPicList)
      let postData = {
        desc:this.tempEvidence.description,
        pics:[],
        quesId:this.tempEvidence.tempId,
        userName:Cookies.get('username')
      }
      this.tempPicList.forEach(item=>{
        postData.pics.push(item.raw)
      })
      const res = await postChangeEvidence(postData)
      console.log(res)
    },
    btnChangeEvidence(){
      console.log("更改证据")
    }
        
    }
}
</script>

<style>

</style>