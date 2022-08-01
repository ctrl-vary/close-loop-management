<template>
  <div>
    <el-table
      :data="tableData"
      @selection-change="handleSelectionChange"
      :row-class-name="tableRowClassName"
    >
      <slot name="allSelect"></slot>
      <el-table-column type="expand" width="30">
        <template slot-scope="scope">
          <el-form inline class="demo-table-expand" label-position="left">
            <el-form-item label="问题严重程度:">
              {{ scope.row.seriousLevel }}
            </el-form-item>
            <el-form-item label="问题关键词:">
              {{ scope.row.keyWord }}
            </el-form-item>
            <el-form-item label="问题描述:">
              {{ scope.row.quesDesc }}
            </el-form-item>
            <el-form-item label="问题产生原因:">
              {{ scope.row.cause }}
            </el-form-item>
            <el-form-item label="预计整改完成时间:">
              {{ scope.row.planEndTimeF || scope.row.planEndTime }}
            </el-form-item>
            <el-form-item label="判定依据:">
              {{ scope.row.according }}
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column
        label="问题录入时间"
        v-if="startTimeCol"
        prop="startTimeF"
        align="center"
      >
      </el-table-column>
      <el-table-column label="检查名称" prop="checkName" align="center">
      </el-table-column>
      <el-table-column label="检查级别" prop="level" align="center">
      </el-table-column>
      <el-table-column label="检查类别" prop="category" align="center">
      </el-table-column>
      <el-table-column label="问题产生部门" prop="quesDept" align="center" />
      <slot name="tools"></slot>
    </el-table>
  </div>
</template>

<script>
export default {
  props: {
    //必要的数据
    tableData: {
      type: Array,
      require: true,
    },
    //第一行录入的时间是否需要
    startTimeCol: {
      type: Boolean,
      default: true,
    },
  },

  methods: {
    handleSelectionChange(val) {
      this.$emit("selectionChange", val);
    },
    tableRowClassName({ rowIndex }) {
      return rowIndex % 2 == 0 ? "table-even-class" : "table-odd-class";
    },
  },
};
</script>

<style lang="scss" scoped>
.demo-table-expand {
  padding-left: 60px;
  font-size: 0;
}

.demo-table-expand label {
  // margin-left: 100px;
  width: 90px;
  color: #99a9bf;
}

.demo-table-expand .el-form-item {
  // margin-left: 1%;
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}
</style>
