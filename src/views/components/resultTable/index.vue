<template>
  <div>
       <el-table  :data="tableData"  @selection-change="handleSelectionChange">
       <slot name="allSelect"></slot>
       <el-table-column type="expand"  >
        <template slot-scope="scope">
           <el-form inline class="demo-table-expand" label-position="left">
                 <el-form-item label="问题关键词:"> {{scope.row.keyWord}} </el-form-item>
                 <el-form-item label="问题描述:"> {{scope.row.quesDesc}} </el-form-item>
                 <el-form-item label="问题产生原因:"> {{scope.row.cause}} </el-form-item>
                  <el-form-item label="整改完成期限:"> {{scope.row.planEndTimeF}} </el-form-item>
           </el-form>
        </template>
       </el-table-column>
         <el-table-column label="问题录入时间" prop="startTimeF" >
         </el-table-column>
          <el-table-column label="问题名称" prop="checkName" >
         </el-table-column>
          <el-table-column label="问题级别" prop="level" >
         </el-table-column>
           <el-table-column label="问题种类" prop="category" >
         </el-table-column>
           <el-table-column label="问题责任部门" prop="quesDept" />
        <slot name="tools"></slot>
    </el-table>
 
  </div>
</template>

<script>
export default {
   props:{
       tableData:Array,
       require:true,
   },
   methods:{
    handleSelectionChange(val){
      this.$emit('selectionChange',val)
    }
   }
}
</script>

<style lang='scss' scoped>


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
