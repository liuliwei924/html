<template>
  <div class="content-box">
    <div class="header__title">推广配置>渠道配置>花费配置</div>
    <div class="kf-box">
      <el-form :inline="true" :model="searchForm" class="header__search clearfix">
        <el-form-item>
          <el-date-picker
            v-model="startsTime"
            type="date"
            :editable="true"
            placeholder="开始日期"
            @change="startTimeHandle($event)"
            class="kf-search-date">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-date-picker
            v-model="endTime"
            type="date"
            :editable="true"
            placeholder="结束日期"
            @change="endTimeHandle($event)"
            :picker-options="endTimeOptions"
            class="kf-search-date">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-select v-model="searchForm.channelCode" filterable clearable placeholder="请选择代号">
            <el-option
              v-for="(item,index) in channels"
              :label="item.channelCode"
              :value="item.channelCode" :key="index">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
            <el-date-picker
              v-model="startDate"
              type="date"
              :editable="false"
              placeholder="同步时间"
              @change="startDateHandle($event)"
              class="kf-search-date">
            </el-date-picker>
          </el-form-item>
        <el-button @click="search(1)" :loading="searchLoading">查询</el-button>
        <el-button  @click="add" >添加</el-button>
        <el-button @click="editHandle" >批量编辑</el-button>
        <el-button @click="costHandle" >同步统计花费</el-button>
        <!-- <el-upload
          :action="excelPath"
          accept="xlsx"
          :data="excelForm"
          :show-file-list="false"
          :before-upload="beforeUp"
          :on-success="upSuccess">
          <el-button size="small" icon="upload" type="primary" class="excelBtn" :loading="loading" @click.stop="uploadBtn" :disabled="loading">批量数据导入</el-button>
        </el-upload> -->
      </el-form>
      <el-table class="content__table"
        :data="tableData"
        style="width: 100%">
        <el-table-column
          min-width="110"
          prop="channelCode"
          label="代号">
        </el-table-column>
        <el-table-column
          min-width="200"
          prop="recordDate"
          label="记录日期">
        </el-table-column>
        <el-table-column
          min-width="200"
          prop="amount"
          label="总消费">
        </el-table-column>
        <el-table-column
          min-width="200"
          prop="browseCount"
          label="流量次数/点击量">
        </el-table-column>
        <el-table-column
          min-width="200"
          prop="createTime"
          label="录入时间">
        </el-table-column>
        <el-table-column
          min-width="100"
          prop="createBy"
          label="录入人">
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
            <el-button @click="edit(scope.row)" type="text" size="small" v-if="isEdit">编辑</el-button>
            <el-button @click="delet(scope.row)" type="text" size="small" style="color:red" v-if="isEdit">删除</el-button>
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
  <deal-costset ref="alertCost"></deal-costset>
  <cost-calendar v-model="visible" ref="calendar"></cost-calendar>
</div>
</template>
<script>
import DealCostset from '../../components/config/DealCostset.vue'
import CostCalendar from '@/components/config/CostCalendar'
let d = new Date()
let dateNow = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate()
export default {
  name: 'pay-set',
  data () {
    return {
      isEdit: true,
      searchForm: {
        startTime: dateNow,
        endTime: '',
        channelCode: ''
      },
      startsTime: dateNow,
      endTime: '',
      endTimeOptions: {},
      tableData: [],
      channels: [],
      startDate: '',
      startTime: '',
      excelPath: this.$baseURL + '/account/spread/cost/batchImportData',
      excelForm: {
        signId: this.$localStorage('sign')
      },
      loading: false,
      types: [
        {label: '自有平台', value: '1'},
        {label: '推广渠道', value: '2'},
        {label: '卡牛固定值', value: '3'}
      ],
      show: true,
      launchPlaces: [
        {label: '自有平台', value: '1'},
        {label: '搜索引擎', value: '2'},
        {label: '信息流', value: '3'},
        {label: '广告位', value: '4'}
      ],
      flowTypes: [
        {label: '自然流量', value: '1'},
        {label: '点击付费流量', value: '2'},
        {label: '广告位流量', value: '3'}
      ],
      formTotalRecords: 0,
      formCurrentPage: 1,
      visible: false,
      searchLoading: false
    }
  },
  created () {
    this.$ajax({
      url: '/store/user/code/queryAll',
      data: this.searchForm,
      success: data => {
        this.channels = data.rows
        this.$refs['calendar'].channels = data.rows
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
    search (page) {
      this.tableData = []
      let obj = this.searchForm
      obj.currentPage = page
      this.formCurrentPage = page
      this.searchLoading = true
      this.$ajax({
        url: '/store/account/spread/cost/queryList',
        data: obj,
        success: data => {
          this.searchLoading = false
          this.tableData = data.rows
          this.formTotalRecords = data.page.totalRecords
        }
      })
    },
    startTimeHandle (start) {
      // 开始时间选择
      this.searchForm.startTime = start || ''
      this.endTimeOptions = {
        disabledDate (time) {
          return time.getTime() < new Date(start).getTime() - 8.64e7
        }
      }
    },
    endTimeHandle (end) {
      // 结束时间处理
      this.searchForm.endTime = end || ''
    },
    delet (row) {
      this.$confirm('此操作将删除该条信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$ajax({
          url: '/store/account/spread/cost/del ',
          data: {channelCode: row.channelCode, recordDate: row.recordDate},
          success: data => {
            this.$message({message: '删除成功', type: 'success'})
            this.search(this.formTotalRecords)
          }
        })
      }).catch(() => {
      })
    },
    edit (row) {
      let f = row
      this.$refs.alertCost.form = {
        channelCode: f.channelCode,
        recordDate: f.recordDate,
        amount: f.amount,
        browseCount: f.browseCount
      }
      this.$refs.alertCost.recordDate = f.recordDate
      this.$refs.alertCost.isEdit = true
      this.$refs.alertCost.title = '编辑花费配置'
      this.$refs.alertCost.show = true
    },
    add () {
      this.$refs.alertCost.title = '添加花费配置'
      this.$refs.alertCost.isEdit = false
      this.$refs.alertCost.form = {
        channelCode: '',
        recordDate: '',
        amount: '',
        browseCount: ''
      }
      this.$refs.alertCost.show = true
    },
    startDateHandle (start) {
      this.startTime = start || ''
    },
    costHandle () {
      if (!this.startTime) {
        this.$message({message: '请选择同步时间', type: 'error'})
        return
      }
      this.$ajax({
        url: '/store/account/spread/cost/updateCostAmt',
        data: {optDate: this.startTime},
        success: data => {
          this.$message({message: '同步成功', type: 'success'})
        }
      })
    },
    editHandle () {
      this.visible = true
    },
    // 文件上传之前处理
    beforeUp () {
      this.loading = true
    },
    // 文件上传成功处理
    upSuccess (res) {
      this.loading = false
      if (res.success) {
        if (res.message) {
          this.$msg(res.message)
        } else {
          this.$msg('导入成功！', 'success')
        }
        this.searchHandle()
      } else {
        this.$msg(res.message, 'error')
      }
    },
    // 文件上传处理
    uploadBtn () {
      let fileBtn = document.getElementsByClassName('el-upload__input')
      fileBtn[0].click()
    }
  },
  components: {
    DealCostset,
    CostCalendar
  }
}
</script>
