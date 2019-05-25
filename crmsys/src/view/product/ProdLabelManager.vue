<template>
  <div class="content-box">
    <div class="header__title">产品标签管理</div>
    <div class="header__control">
      <el-button icon="plus" @click="addHandle">添加</el-button>
    </div>
    <el-table class="content__table" :data="tableData" border>
      <el-table-column
        prop="index"
        label="序号"
        width="80">
      </el-table-column>
      <el-table-column
        prop="typeName"
        label="标签名称">
      </el-table-column>

      <el-table-column
       prop="status"
        label="标签状态">
           <template slot-scope="scope">
          <span v-if ="scope.row.status===1">启用</span>
          <span v-if ="scope.row.status===0">停用</span>
        </template>
      </el-table-column>

      <el-table-column
        prop="typeIcon"
        label="标签图标">
        <template slot-scope="scope">
          <img :src="scope.row.typeIcon" class="gradeImg" v-if="scope.row.typeIcon">
        </template>
      </el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
        width="160">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="editHandle(scope.row.typeId)">编辑</el-button>
          <el-button type="text" size="small" @click="delectHandle(scope.row.typeId)">删除</el-button>
        </template>
      </el-table-column> 
    </el-table>
    <el-pagination
      class="content__page fr"
      @current-change="pageHandle"
      :current-page="currentPage"
      layout="total, prev, pager, next"
      :total="totalRecord">
    </el-pagination>
  </div>
</template>

<script>
import ProdLabelAdd from '@/components/product/ProdLabelAdd'
export default {
  name: 'prodLabelManage',
  data () {
    return {
      tableData: [],
      currentPage: 1,
      totalRecord: 1,
      addShow: false,
      editShow: false
    }
  },
  created () {
    this.searchHandle()
  },
  methods: {
    addChange (val) {
      this.addShow = val
    },
    // 添加
    addHandle () {
      this.$router.push({path: 'ProdLabelAdd'})
    },
    // 编辑
    editHandle (typeId) {
      this.$router.push({path: 'ProdLabelEdit', query: {typeId}})
    },
    // 删除
    delectHandle (typeId) {
      this.$alert('您是否确定删除该条记录?', '提示', {
        type: 'warning',
        customClass: 'msg-delete__dialog',
        showCancelButton: true,
        callback: action => {
          if (action === 'confirm') {
            this.$ajax({
              url: '/open/account/prod/prodType/deleteProdType',
              data: {
                typeId
              },
              success: data => {
                this.searchHandle()
              }
            })
          }
        }
      })
    },
    // 查询
    searchHandle () {
      this.$ajax({
        url: '/open/account/prod/prodType/queryProdTypeList',
        data: {
          currentPage: this.currentPage
        },
        success: data => {
          this.tableData = data.rows || []
          this.tableData.forEach((item, index) => {
            item.index = 10 * (this.currentPage - 1) + index + 1
          })
          this.totalRecord = data.page.totalRecords
        }
      })
    },
    // 分页
    pageHandle (page) {
      this.currentPage = page
      this.searchHandle()
    }
  },
  components: {
    ProdLabelAdd
  }
}
</script>

<style>
  .gradeImg {
    width: 64px;
    height: 64px;
    padding: 10px 0;
    display: block;
  }
</style>
