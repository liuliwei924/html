<template>
  <div class="content-box">
    <div class="header__title">短信渠道</div>
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
        prop="channelName"
        label="渠道名称">
      </el-table-column>

      <el-table-column
        prop="channelKey"
        label="渠道类型">
      </el-table-column>

      <el-table-column
       prop="status"
        label="渠道状态">
           <template slot-scope="scope">
          <span v-if ="scope.row.status===1">启用</span>
          <span v-if ="scope.row.status===0">停用</span>
        </template>
      </el-table-column>

      <el-table-column
        fixed="right"
        label="操作"
        width="160">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="editHandle(scope.row)">编辑</el-button>
          <el-button type="text" size="small" @click="delectHandle(scope.row.channelId)">删除</el-button>
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

    <sms-channel-add v-model="addShow" @change="addChange" />
    <sms-channel-edit v-model="editShow" :smsChannelData="smsChannelData" @change="editChange" />
  </div>
</template>

<script>
import SmsChannelAdd from '@/components/sms/SmsChannelAdd'
import SmsChannelEdit from '@/components/sms/SmsChannelEdit'
export default {
  name: 'smsChannel',
  data () {
    return {
      tableData: [],
      currentPage: 1,
      totalRecord: 1,
      smsChannelData: {},
      addShow: false,
      editShow: false
    }
  },
  created () {
    this.searchHandle()
  },
  methods: {
    // 添加
    addHandle () {
      this.addShow = true
    },
    // 添加弹窗监听
    addChange (val) {
      if (val === 'search') {
        this.searchHandle()
        this.addShow = false
      } else {
        this.addShow = val
      }
    },
    // 编辑
    editHandle (row) {
      this.smsChannelData = row
      this.editShow = true
    },
    // 编辑弹窗监听
    editChange (val) {
      if (val === 'search') {
        this.searchHandle()
        this.editShow = false
      } else {
        this.editShow = val
      }
    },
    // 删除
    delectHandle (channelId) {
      this.$alert('您是否确定删除该条记录?', '提示', {
        type: 'warning',
        customClass: 'msg-delete__dialog',
        showCancelButton: true,
        callback: action => {
          if (action === 'confirm') {
            this.$ajax({
              url: '/store/account/sms/smsChannel/deleteSmsChannelInfo',
              data: {
                channelId
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
        url: '/store/account/sms/smsChannel/querySmsChannelList',
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
    SmsChannelAdd,
    SmsChannelEdit
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
