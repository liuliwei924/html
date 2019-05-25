<template>
  <div class="content-box">
    <div class="header__title">api渠道配置</div>
    <div class="kf-box">
      <el-form :inline="true" :model="searchForm" class="header__search clearfix">
        <el-form-item>
          <el-select v-model="searchForm.channelCode" clearable filterable placeholder="请选择渠道代号">
            <el-option
              v-for="(item,index) in channels"
              :label="item.channelCode"
              :value="item.channelCode" :key="index">
            </el-option>
          </el-select>
        </el-form-item>
          <el-button @click="search(1)">查询</el-button>
          <el-button @click="addHandle" v-if="isEdit">添加</el-button>
      </el-form>
      <el-table class="content__table"
        :data="tableData"
        style="width: 100%">
        <el-table-column
          width="120"
          prop="channelCode"
          label="渠道代号">
        </el-table-column>
        <el-table-column
          min-width="110"
          prop="maxCount"
          label="每天最高接收数量">
        </el-table-column>
        <el-table-column
          min-width="110"
          prop="enable"
          label="是否禁用">
          <template slot-scope="scope">{{enable[scope.row.enable]}}</template>
        </el-table-column>
        <el-table-column
          min-width="110"
          prop="deduction"
          label="渠道扣量">
        </el-table-column>
        <el-table-column
          min-width="200"
          prop="createTime"
          label="创建时间">
        </el-table-column>
        <el-table-column
          min-width="200"
          prop="updateTime"
          label="修改时间">
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          width="150">
          <template slot-scope="scope">
            <el-button @click="editHandle(scope.row)" type="text" size="small" v-if="isEdit">编辑</el-button>
            <el-button @click="del(scope.row.channelCode)" type="text" size="small" style="color:red" v-if="isEdit">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="xxjr-page">
        <div class="xxjr-fr">
          <el-pagination
            @current-change="search"
            :current-page="formCurrentPage"
            layout="total, prev, pager, next"
            :total="formTotalRecords">
          </el-pagination>
        </div>
      </div>
  </div>
  <api-cfgEdit ref="alertApi"></api-cfgEdit>
</div>
</template>
<script>
import ApiCfgEdit from '../../components/config/ApiCfgEdit.vue'
export default {
  name: 'canal',
  data () {
    return {
      isEdit: true,
      searchForm: {
        channelCode: ''
      },
      tableData: [],
      formTotalRecords: 0,
      formCurrentPage: 1,
      channels: [],
      enable: {
        0: '禁用',
        1: '启用'
      }
    }
  },
  created () {
    this.$ajax({
      url: '/store/user/code/queryAll',
      success: data => {
        this.channels = data.rows
      }
    })
    this.search(1)
    // 获取权限
    // let menuCode = this.$route.path.split('/')[2]
    // let checkUrl = this.$localStorage('kfCheckMenus')
    // if (checkUrl.indexOf(menuCode) >= 0) {
    //   this.isEdit = true
    // }
  },
  methods: {
    addHandle () {
      this.$refs.alertApi.form = {
        channelCode: '',
        maxCount: '',
        enable: '',
        deduction: ''
      }
      this.$refs.alertApi.isEdit = false
      this.$refs.alertApi.show = true
    },
    editHandle (row) {
      let f = Object.assign({}, row)
      this.$refs.alertApi.form = {
        channelCode: f.channelCode,
        maxCount: f.maxCount,
        enable: f.enable,
        deduction: f.deduction
      }
      this.$refs.alertApi.isEdit = true
      this.$refs.alertApi.show = true
    },
    search (page) {
      this.tableData = []
      let obj = Object.assign({}, this.searchForm)
      obj.currentPage = page
      this.formCurrentPage = page
      this.$ajax({
        url: '/store/account/spread/third/queryList',
        data: obj,
        success: data => {
          this.tableData = data.rows
          this.formTotalRecords = data.page.totalRecords
        }
      })
    },
    del (channelCode) {
      this.$confirm('此操作将删除该条信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$ajax({
          url: '/store/account/spread/third/del',
          data: {channelCode: channelCode},
          success: data => {
            this.$message('删除成功')
            this.search(this.formCurrentPage)
          }
        })
      }).catch(() => {
      })
    }
  },
  components: {
    ApiCfgEdit
  }
}
</script>
