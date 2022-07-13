<template>
   <div class="app-container">
    <!-- <el-form  ref="queryForm" size="small" :inline="true"  label-width="68px">
      <el-form-item label="字典类型" prop="dictType">
        <el-input
          v-model="queryParams.dictType"
          placeholder="请输入字典类型"
          clearable
          style="width: 240px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form> -->
<el-row>
    <el-table v-loading="loading" :data="codeTableData">
    <el-table-column label="字典类型" min-width="100"  align="center"> 
            <template slot-scope="scope">
                 <el-tag type="" size="small"> {{scope.row.dictionaryTypeName}} </el-tag>
            </template>
    </el-table-column>
    <el-table-column label="操作" align="left">
      <template slot-scope="scope">
            <el-button
                size="mini"
                type="text"
                icon="el-icon-edit"
                @click="btnAddNewCodeItem(scope.row)"
              >新增字典项</el-button>
      </template>
    </el-table-column>
    <el-table-column label="字典项" min-width="300" align="left">
       <template slot-scope="scope">
          <div v-for=" (dictitem,index) in scope.row.dictionaryItem " :key="index" >
          <div v-if="dictitem.dictionaryItemValue">
                  <el-button size="mini" type="text" icon="el-icon-delete" @click="btnDeleteDicts(scope.row,dictitem.dictionaryItemValue)"></el-button> {{dictitem.dictionaryItemValue}}
          </div>
          </div>
       </template>
    </el-table-column>
    </el-table>
      </el-row>

    
<el-dialog
  :title="'当前字典类型:'+addNewCodeItemForm.dictionaryTypeName"
  :visible.sync="addCodeTableDialogVisible"
  width="30%"
 >
  <el-form>
    <el-form-item label="新增字典项:"> <el-input v-model="addNewCodeItemForm.dictionaryItemValue"></el-input> </el-form-item>
  </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="addCodeTableDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="btnAddDictionaryItem">确 定</el-button>
  </span>
</el-dialog>

   </div>


</template>

<script>
import {getCodeTable ,addCodeTable,deleteCodeTable} from '@/api/tablemanage/getCodeTableInfo'

export default {
   name:'TableManage',
    dicts: ['sys_normal_disable'],
   data(){
    return{
      //加载
       loading:true,
       //码表数据
       codeTableData:[],
      //对话框
      addCodeTableDialogVisible:false,
      //增加码表项
      addNewCodeItemForm:{
         //字典名
        dictionaryTypeName:"",
        //字典项
        dictionaryItemValue:""
      }
    }
   },

   created(){
     this.getCodeList()
   },
   methods:{
    // 获取所有码表的信息
  async  getCodeList(){
     try {
      this.loading = true
      const res = await getCodeTable()
        console.log(res)
        this.codeTableData = res.rows
        this.loading = false 
     } catch (error) {
      this.loading = false 
     }
        
    },
     //打开对话框
    btnAddNewCodeItem(rowDictInfo){
          this.addNewCodeItemForm.dictionaryTypeName = rowDictInfo.dictionaryTypeName
          this.addCodeTableDialogVisible = true
    },
    //增加新的内容
   async btnAddDictionaryItem(){
      console.log(this.addNewCodeItemForm)
      const res = await addCodeTable({
        dictionaryTypeName:this.addNewCodeItemForm.dictionaryTypeName,
        dictionaryItemValue:this.addNewCodeItemForm.dictionaryItemValue
      })
      this.getCodeList()
       this.addCodeTableDialogVisible = false
    },
    //删除一个字典项
  async  btnDeleteDicts(rowDictInfo,rowdictionaryItemValue){
    this.$confirm('此操作将永久删除该字典项, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
      const res = await deleteCodeTable({
          dictionaryTypeName:rowDictInfo.dictionaryTypeName,
          dictionaryItemValue:rowdictionaryItemValue
     })
         if(res.code==200){
           this.$message({
            type: 'success',
            message: '删除成功!'
          });
         }else{
          this.$message({
            type:"error",
            message:"删除失败！！"
          })
         }
        
           this.getCodeList()
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          }); 
          this.getCodeList()         
        });
      
    }

   },


}
</script>

<style>

</style>
