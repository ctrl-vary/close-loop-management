<template>
  <div class="app-container">
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['system:dept:add']"
          >重置表单</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="info"
          plain
          icon="el-icon-sort"
          size="mini"
          @click="toggleExpandAll"
          >展开/折叠</el-button
        >
      </el-col>
      <right-toolbar
        :showSearch.sync="showSearch"
        @queryTable="getList"
      ></right-toolbar>
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
            <div v-if="scope.row.dictionaryItem">
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
    <el-row class="all-margin-top-15 all-center" > <el-button size="mini" type="primary">开始录入</el-button> </el-row>
     
 <el-dialog
   title="表单预览"
   :visible.sync="questionFormDialogVisible"
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
import {
  getCodeTable,
  addCodeTable,
  deleteCodeTable,
} from "@/api/tablemanage/getCodeTableInfo";
export default {
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
      ],
    };
  },

  created() {
    this.getCodeList();
  },
  methods: {
    // 获取所有码表的信息
    async getCodeList() {
      try {
        this.loading = true;
        const res = await getCodeTable(this.queryParams);
        console.log(res);
         //数据处理去掉null的值
        let tempArr = res.data.map(item=>{
         return {
           dictionaryTypeName: item.dictionaryTypeName,
           dictionaryItem:item.dictionaryItem.filter(val=>!!val.dictionaryItemValue)
         }
        })
        console.log(tempArr)
        this.codeTableData = this.otherCodeTable
          .concat(tempArr)
          .map((item) => {
            return {
              ...item,
              fillVal: "",
            };
          });
        this.loading = false;
      } catch (error) {
        this.loading = false;
      }
    },
  },
};
</script>

<style>
</style>