<template>
  <div class="app-container">
    <el-form  ref="queryForm" size="small" :inline="true" >
      <el-form-item label="检查名称" prop="roleName">
        <el-input
         
          placeholder="请输入检查名称"
          clearable
          style="width: 240px"
          
        />
      </el-form-item>
      <el-form-item label="检查类别" prop="roleKey">
        <el-input
        
          placeholder="请输入权限字符"
          clearable
          style="width: 240px"
         
        />
      </el-form-item>
      <el-form-item label="录入状态" prop="status">
        <el-select
          placeholder="选择录入状态"
          clearable
          style="width: 240px"
        >
        
        </el-select>
      </el-form-item>
      <el-form-item label="创建时间">
        <el-date-picker
          v-model="dateRange"
          style="width: 240px"
          value-format="yyyy-MM-dd"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {

}
</script>

<style>

</style>