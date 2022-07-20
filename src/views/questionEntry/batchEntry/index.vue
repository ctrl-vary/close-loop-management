<template>
  <div class="app-container">
     <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button
              type="success"
              plain
              icon="el-icon-edit"
              size="mini"
             
            >修改</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="danger"
              plain
              icon="el-icon-delete"
              size="mini"
           
            >删除</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="info"
              plain
              icon="el-icon-upload2"
              size="mini"
              @click="btnOpenUploadDialog"
            >批量导入</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="success"
              plain
              icon="el-icon-download"
              size="mini"
            >模板下载</el-button>
          </el-col>
        </el-row>
    批量问题录入

     <el-dialog
  title="Excel上传"
  :visible.sync="upLoadDialogVisible"
  width="30%"
 >
 <!-- 文件上传 -->
   <el-upload
  class="upload-demo"
  ref="excelUpload"
  action="#"
  :file-list="fileList"
  drag
  :limit="1"
  :on-exceed="limitHandle"
  :on-remove="handleRemove"
  :on-change="changeUploadHandle"
  :auto-upload="false"
  >
   <i class="el-icon-upload"></i>
  <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
  <div slot="tip" class="el-upload__tip">只能上传.xlxs/.xls文件，且不超过500kb</div>
</el-upload>
  <span slot="footer" class="dialog-footer">
    <el-button @click="upLoadDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="btnConfirmUpload">确 定</el-button>
  </span>
</el-dialog>
  </div>
</template>

<script>
import xlsx from 'xlsx';
export default {
   data(){
    return{
      //上传对话框
       upLoadDialogVisible:false,
       fileList:[]
    }
   },
   created(){

   },
   methods:{
     //导入对话框
    btnOpenUploadDialog(){
          this.upLoadDialogVisible = true
         
    },
    //确认上传
    btnConfirmUpload(){
        alert("上传成功")
    },
    //上传
    changeUploadHandle(file,filelist){
      //判断是否是这个类型的文件
     if(this.RegXlsxFile(file.name)) {
         this.handleTheFile(file.raw)
     }else{
      this.$message({
        type:"error",
        message:"只能传.xls/.xlxs/.csv文件"
       })
       this.$refs.excelUpload.clearFiles()
     }
        
        
    },
    limitHandle(files, fileList){
       this.$message({
        type:"error",
        message:"一次只能传一个Excel表格"
       })
    },
    handleRemove(file, fileList){
         this.$message({
          type:"warning",
          message:"移除成功！"
          
         })
    },
    RegXlsxFile(fileName){
      return /\.(xlsx|xls|csv)$/.test(fileName)
    },

    handleTheFile(file){
    
         //文件解析
      new Promise((resolve,reject)=>{
        let reader = new  FileReader()
        //二进制读取
        reader.readAsBinaryString(file)
        //读取成功后在onload里面执行
        reader.onload = ev =>{
          resolve(ev.target.result)
        }
      }).then((binaryData)=>{
        
        //插件读取二进制数据
        let workbook =  xlsx.read(binaryData,{type:'binary'})
        console.log(workbook)
        //获取指定的表格
        let worksheet = workbook.Sheets[workbook.SheetNames[0]]
        //调用提供的Api转化为Josn数据
        let jsonData = xlsx.utils.sheet_to_json(worksheet)
        console.log(jsonData)
      })
    }

   }
}
</script>

<style>

</style>