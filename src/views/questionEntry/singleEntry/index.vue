<template>
  <div class="app-container">
    <el-row>
      <el-table v-loading="loading" :data="codeTableData">
        <el-table-column label="问题字典" min-width="100" align="center">
          <template slot-scope="scope">
            <span>
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
                placeholder="选择日期"
              >
              </el-date-picker>
            </div>
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
            <div v-else>
              <el-input v-model="scope.row.fillVal"></el-input>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </el-row>
    <el-row class="all-margin-top-15 all-center">
      <el-button @click="btnCancelDialog" size="mini">取消</el-button>
      <el-button size="mini" @click="btnIsFillAll" type="primary"
        >开始录入</el-button
      >
      <el-button
        type="primary"
        plain
        icon="el-icon-plus"
        size="mini"
        @click="resetTable"
        >重置表单</el-button
      >
    </el-row>
  </div>
</template>

<script>
import { getCodeTable } from "@/api/tablemanage/getCodeTableInfo";
import storageSession from "@/utils/storage";
import getStrName from "@/utils/dataConversion/index.js";
import { parseTime } from "@/utils/ruoyi";
import { addNewProblem, getAllTempQuestion } from "@/api/entrymanage/index";

export default {
  data() {
    return {
      //加载
      loading: true,
      //码表数据
      codeTableData: [],
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
          dictionaryTypeName: "预计整改完成时间",

          isTime: true,
        },
      ],
    };
  },

  created() {
    this.getCodeList();
  },
  activated() {
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
        let tempArr = res.data.map((item) => {
          return {
            dictionaryTypeName: item.dictionaryTypeName,
            dictionaryItem: item.dictionaryItem.filter(
              (val) => !!val.dictionaryItemValue
            ),
          };
        });

        this.codeTableData = this.otherCodeTable.concat(tempArr).map((item) => {
          return {
            ...item,
            strName: getStrName(item.dictionaryTypeName),
            fillVal: "", //填入的值
          };
        });
        this.loading = false;
        console.log(this.codeTableData);
      } catch (error) {
        this.loading = false;
      }
    },
    //重置码表
    resetTable() {
      this.codeTableData.forEach((item) => {
        item.fillVal = "";
      });
    },
    //问题提交缓存
    btnQuestionFormAdd() {
      let addForm = {
        userName: storageSession.getItem("username"),
      };

      this.codeTableData.forEach((item) => {
        if (item.isTime) {
          addForm[item.strName] = parseTime(item.fillVal, "{yy}-{mm}-{dd}");
        } else {
          addForm[item.strName] = item.fillVal;
        }
      });

      addNewProblem(addForm)
        .then(
          (msg) => {
            this.$message({
              type: "success",
              message: "录入成功",
            });
          },
          (err) => {
            console.log(err);
          }
        )
        .finally(() => {
          this.resetTable();
          this.$emit("updateList");
          this.btnCancelDialog();
        });
    },
    //检查是否填完
    btnIsFillAll() {
      let isFill = false;
      this.codeTableData.forEach((item) => {
        if (item.fillVal == "") {
          isFill = true;
        }
      });
      if (isFill) {
        return this.$message({
          type: "warning",
          message: "您还有内容没填完整!!",
        });
      }
      this.btnQuestionFormAdd();
    },
    //取消父组件对话框
    btnCancelDialog() {
      this.$emit("update:fatherDialogVisible", false);
    },
  },
};
</script>

<style></style>
