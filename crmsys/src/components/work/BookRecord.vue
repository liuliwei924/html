<template>
  <div class="current-status">
    <div class="status-title">预约记录</div>
    <div class="status-item" v-for="item in bookData" :key="item.applyId">
      <el-form :inline="true" label-position="left">
        <el-form-item label="预约状态：">
          <template v-if="item.status === 1">预约中</template>
          <template v-if="item.status === 2">未上门</template>
          <template v-if="item.status === 3">已上门</template>
        </el-form-item>
        <el-form-item label="预约上门时间：">{{item.bookTime}}</el-form-item>
        <el-form-item label="上门地点：">{{item.address}}</el-form-item>
        <el-form-item label="预约上门描述：">{{item.bookDesc}}</el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
// 预约记录组件
export default {
  name: 'book-record',
  props: {
    bookData: Array
  }
}
</script>
