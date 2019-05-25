<template>
  <div class="record-content">
    <!-- 查看 -->
    <div class="el-form__view">
      <el-table
        class="content__table"
        :data="doorInfo"
        border>
        <el-table-column
          prop="visitTime"
          label="上门时间"
          min-width="110">
        </el-table-column>
        <el-table-column
          prop="realName"
          label="接待人"
          min-width="110">
        </el-table-column>
        <el-table-column
          prop="visitTypeText"
          label="类型"
          min-width="110">
        </el-table-column>
        <el-table-column
          prop="createTime"
          label="创建时间"
          min-width="110">
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
// 预约子组件
export default {
  name: 'door-view',
  props: {
    doorInfo: Array
  }
}
</script>