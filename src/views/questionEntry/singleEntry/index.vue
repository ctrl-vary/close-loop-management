<template>
  <div class="app-container">
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="resetTable"
          >重置表单</el-button
        >
      </el-col>
    </el-row>
    <el-row>
      <el-table v-loading="loading" :data="codeTableData">
        <el-table-column label="问题字典" min-width="100" align="center">
          <template slot-scope="scope">
            <span >
              {{ scope.row.dictionaryTypeName }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="问题项" min-width="300" align="left">
          <template slot-scope="scope">
            <div v-if="scope.row.isTime"> 
             <el-date-picker
      v-model="scope.row.fillVal"
      type="date"
      placeholder="选择日期">
    </el-date-picker></div>
            <div v-else-if="scope.row.dictionaryItem">
              <el-select v-model="scope.row.fillVal" placeholder="请选择">
                <el-option
                  v-for="(dictitem, index) in scope.row.dictionaryItem"
                  :key="index"
                  :label="dictitem.dictionaryItemValue"
                  :value="dictitem.dictionaryItemValue"
                >
                </el-option>
              </el-select>
            </div>
            <div
             v-else
            >
            <el-input v-model="scope.row.fillVal"></el-input>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </el-row>
    <el-row class="all-margin-top-15 all-center" > <el-button size="mini" @click="questionFormDialogVisible=true"  type="primary">开始录入</el-button> </el-row>
     
 <el-dialog
   title="问题预览"
   :visible.sync="questionFormDialogVisible"
   width="50%"
  
 >
  <el-form  label-width="120px">
    <el-form-item v-for="(item,index) in codeTableData" :label="item.dictionaryTypeName+':'" :key="index"> 
    <el-date-picker
    v-if="item.isTime"
      disabled
      v-model="item.fillVal"
      type="date"
       />
    <el-input v-else disabled v-model="item.fillVal"></el-input>
    
    </el-form-item>
  </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="questionFormDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="btnQuestionFormAdd">提交暂存</el-button>
  </span>
</el-dialog>

     
  </div>
</template>

<script>
import {
  getCodeTable,
} from "@/api/tablemanage/getCodeTableInfo";
import Cookies from "js-cookie";
import getStrName from '@/utils/dataConversion/index.js'
import {parseTime} from '@/utils/ruoyi'
import {addNewProblem,getAllTempQuestion} from '@/api/entrymanage/index'

export default {
  data() {
    return {
      
      //加载
      loading: true,
      //码表数据
      codeTableData: [],
      //对话框
      questionFormDialogVisible: false,
      //增加码表项
      addNewCodeItemForm: {
        //字典名
        dictionaryTypeName: "",
        //字典项
        dictionaryItemValue: "",
      },
      //其他码表数据
      otherCodeTable: [
        {
          dictionaryTypeName: "检查名称",
          
        },
        {
          dictionaryTypeName: "问题关键词",
          
        },
        {
          dictionaryTypeName: "问题描述",
          
        },
        {
          dictionaryTypeName:"期望完成时间",
         
          isTime:true
          
        }
      ],
    };
  },

  created() {
    this.getCodeList();
  },
  activated(){
    this.getCodeList();
  },
  methods: {
    // 获取所有码表的信息
    async getCodeList() {
      try {
        // console.log(Cookies.get('username'))
        this.loading = true;
        const res = await getCodeTable(this.queryParams);
      
         //数据处理去掉null的值 dictionaryItem.dictionaryItemValue=null的情况
        let tempArr = res.data.map(item=>{
         return {
           dictionaryTypeName: item.dictionaryTypeName,
           dictionaryItem:item.dictionaryItem.filter(val=>!!val.dictionaryItemValue),
           
         }
        })
        
        this.codeTableData = this.otherCodeTable
          .concat(tempArr)
          .map((item) => {
            return {
              ...item,
              strName:getStrName(item.dictionaryTypeName),
              fillVal: "", //填入的值
            };
          });
        this.loading = false;
        console.log(this.codeTableData)
      } catch (error) {
        this.loading = false;
      }
    },

    resetTable(){
        this.codeTableData.forEach(item => {
          item.fillVal = ""
        });
    },
    btnQuestionFormAdd(){
      let addForm = {
        userName:Cookies.get('username')
      }
      this.codeTableData.forEach(item=>{
        if(item.isTime){
          addForm[item.strName] = parseTime(item.fillVal,"{yy}-{mm}-{dd}")
        }else{
          addForm[item.strName] = item.fillVal
        }
      })
      addNewProblem(addForm).then(msg=>{
        this.$message({
          type:"success",
          message:"录入成功"
        })
        this.resetTable()
        this.questionFormDialogVisible= false
      },err=>{
        console.log(err)
      })
    }

  },
};
</script>

<style>
</style>