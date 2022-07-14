<template>
  <div class="app-container">
     <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button
              type="success"
              plain
              icon="el-icon-edit"
              size="mini"
              :disabled="single"
              @click="handleUpdate"
            
            >修改</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="danger"
              plain
              icon="el-icon-delete"
              size="mini"
              :disabled="multiple"
              @click="handleDelete"
             
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
              @click="handleExport"
            >模板下载</el-button>
          </el-col>
          <right-toolbar :showSearch.sync="showSearch" @queryTable="getList" :columns="columns"></right-toolbar>
        </el-row>
    批量问题录入

     <el-dialog
  title="Excel上传"
  :visible.sync="upLoadDialogVisible"
  width="30%"
 >
   <el-upload
  class="upload-demo"
  ref="upload"
  action="#"
  drag
  :limit="1"
  :on-exceed="limitHandle"
  :on-remove="handleRemove"
  :before-upload="beforeUploadHandle"
  :file-list="fileList"
  :auto-upload="false">
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
export default {
   data(){
    return{
      //上传对话框
       upLoadDialogVisible:false
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
        
    },
    //上传
    beforeUploadHandle(file){
          console.log(file)
    },
    limitHandle(files, fileList){
       this.$message({
        type:"error",
        message:"一次只能传一个数值"
       })
    },
    handleRemove(file, fileList){
         this.$message({
          type:"warning",
          message:"移除成功！"
          
         })
    }
   }
}
</script>

<style>

</style>