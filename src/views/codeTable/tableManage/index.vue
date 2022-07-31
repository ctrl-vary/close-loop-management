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
        <el-table-column label="字典类型" min-width="100" align="center">
          <template slot-scope="scope">
            <el-tag type="" size="small"> {{ scope.row.dictionaryTypeName }} </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="left">
          <template slot-scope="scope">
            <el-button size="mini" type="text" icon="el-icon-edit" @click="btnAddNewCodeItem(scope.row)">新增字典项
            </el-button>
          </template>
        </el-table-column>
        <el-table-column label="字典项" min-width="300" align="left">
          <template slot-scope="scope">
            <div v-for=" (dictitem, index) in scope.row.dictionaryItem " :key="index">
              <div v-if="dictitem.dictionaryItemValue">
                <el-switch v-model="dictitem.status" @change="btnSwitchEvent(dictitem)" active-color="#13ce66" inactive-color="#ff4949" :active-value="0"
                  :inactive-value="1">
                </el-switch>
                 {{ dictitem.dictionaryItemValue }} <el-button size="mini" type="text" icon="el-icon-delete"
                  @click="btnDeleteDicts(dictitem.id, dictitem.dictionaryItemValue)"></el-button>
              </div>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </el-row>



    <el-dialog :title="'当前字典类型:' + addNewCodeItemForm.dictionaryTypeName" :visible.sync="addCodeTableDialogVisible"
      width="40%">
      <el-form label-width="100px">
        <el-form-item label="新增字典项:">
          <el-input v-model="addNewCodeItemForm.dictionaryItemValue"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCodeTableDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="btnAddDictionaryItem">确 定</el-button>
      </span>
    </el-dialog>

  </div>


</template>

<script>
import {getCodeTable,deleteCodeTableById,addCodeTable,changeCodeTableState} from '@/api/tablemanage/getCodeTableInfo'
export default {
  name: 'TableManage',
  dicts: ['sys_normal_disable'],
  data() {
    return {
      //加载
      loading: true,
      //码表数据
      codeTableData: [],
      //对话框
      addCodeTableDialogVisible: false,
      //增加码表项
      addNewCodeItemForm: {
        //字典名
        dictionaryTypeName: "",
        //字典项
        dictionaryItemValue: ""
      },

    }
  },

  created() {
    this.getCodeList()
  },
  methods: {
    // 获取所有码表的信息
    async getCodeList() {
      try {
        this.loading = true
        const res = await getCodeTable()
        console.log(res)
        this.codeTableData = res.data
        this.loading = false
      } catch (error) {
        this.loading = false
      }

    },
    //打开对话框
    btnAddNewCodeItem(rowDictInfo) {
      this.addNewCodeItemForm.dictionaryTypeName = rowDictInfo.dictionaryTypeName
      this.addCodeTableDialogVisible = true
    },
    //增加新的内容
    async btnAddDictionaryItem() {
      console.log(this.addNewCodeItemForm)
      const res = await addCodeTable({
        dictionaryTypeName: this.addNewCodeItemForm.dictionaryTypeName,
        dictionaryItemValue: this.addNewCodeItemForm.dictionaryItemValue
      })
      console.log(res)
      if(res.msg=='success'){
          this.$message({
        type:"success",
        message:res.msg

      })
      }else{
            this.$message({
        type:"warning",
        message:res.msg

      })
      }
      
      this.addNewCodeItemForm.dictionaryItemValue = ""
      this.getCodeList()
      this.addCodeTableDialogVisible = false
    },
    //删除一个字典项
    async btnDeleteDicts(id, rowdictionaryItemValue) {
    
      this.$confirm('此操作将永久删除该字典项, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const res = await deleteCodeTableById(id)
        if (res.code == 200) {
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
        } else {
          this.$message({
            type: "error",
            message: "删除失败！！"
          })
        }

        
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
        
      }).finally(()=>this.getCodeList());

    },
    //修改变化
   async btnSwitchEvent(info){
     console.log(info)
    // let status = info.status==1?0:1
     const res = await changeCodeTableState({
      status:info.status,
      id:info.id
     })
     console.log(res)
     this.getCodeList()
     
    }

  },


}
</script>

<style>
</style>
