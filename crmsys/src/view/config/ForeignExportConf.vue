<template>
  <div class="content-box">
    <div class="header__title">对外导出配置</div>
    <div class="header__search clearfix">
      <el-form :model="searchForm">
        <!-- <el-form-item label="配置日期-起:">
          <el-date-picker
            v-model="searchForm.startDate"
            type="date"
            editable
            :picker-options="startDateOptions"
            @change="startDateChange"
            placeholder="开始日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="配置日期-止:">
          <el-date-picker
            v-model="searchForm.endDate"
            type="date"
            editable
            :picker-options="endDateOptions"
            @change="endDateChange"
            placeholder="结束日期">
          </el-date-picker>
        </el-form-item> -->
        <el-form-item
          label="外部渠道人员:"
          :rules="{required: false, message: '外部渠道人员不能为空'}">
          <el-select
            v-model="searchForm.customerId"
            filterable
            placeholder="请选择外部渠道人员">
            <el-option
              v-for="item,index in externalUser"
              :label="item.realName"
              :value="item.customerId"
              :key="index">
            </el-option>
          </el-select>
        </el-form-item>
        <el-button @click="searchHandle">查询</el-button>
        <el-button @click="addHandle">添加</el-button>
      </el-form>
    </div>
    <el-table class="content__table" :data="tableData" border>
      <!-- <el-table-column
        prop="notifyId"
        label="系统通知ID"
        min-width="110">
      </el-table-column> -->
      <el-table-column
        prop="realName"
        label="外部渠道人员"
        min-width="150">
      </el-table-column>
      <el-table-column
        prop="houseType"
        label="房产情况"
        min-width="150">
      </el-table-column>
      <el-table-column
        prop="carType"
        label="车产情况"
        min-width="150">
      </el-table-column>
      <el-table-column
        prop="insure"
        label="保险情况"
        min-width="150">
      </el-table-column>
      <el-table-column
        prop="loanAmount"
        label="申请金额(万元)"
        min-width="150">
      </el-table-column>
      <el-table-column
        prop="fundType"
        label="公积金"
        min-width="150">
      </el-table-column>
      <el-table-column
        prop="socialType"
        label="社保情况"
        min-width="150">
      </el-table-column>
      <el-table-column
        prop="incomeData"
        label="月收入"
        min-width="150">
      </el-table-column>
      <el-table-column
        prop="wagesType"
        label="工资发放形式"
        min-width="150">
      </el-table-column>
      <el-table-column
        prop="createTime"
        label="创建时间"
        min-width="220">
      </el-table-column>
      <el-table-column
        label="操作"
        width="120">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="editHandle(scope.row)">编辑</el-button>
          <el-button type="text" class="table__danger" size="small" @click="deleteHandle(scope.row.recordId)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      class="content__page fr"
      @current-change="pageHandle"
      :current-page="searchForm.currentPage"
      layout="total, prev, pager, next"
      :total="totalRecord">
    </el-pagination>
    <foreignExport-add v-model="addShow" @change="addChange" :externalUser="externalUser"/>
    <foreignExport-edit v-model="editShow" :foreignExportData="foreignExportData" @change="editChange" :externalUser="externalUser"/>
  </div>
</template>

<script>
import ForeignExportAdd from '@/components/config/ForeignExportAdd'
import ForeignExportEdit from '@/components/config/ForeignExportEdit'
export default {
  name: 'foreign-exportConf',
  data () {
    return {
      tableData: [],
      totalRecord: 1,
      foreignExportData: {},
      addShow: false,
      editShow: false,
      searchForm: {
        customerId: '',
        startDate: '',
        endDate: '',
        currentPage: 1
      },
      externalUser: [], // 外部人员渠道信息
       // 开始时间禁用
      startDateOptions: {
        disabledDate (time) {
          return time.getTime() > Date.now()
        }
      },
      // 结束时间禁用
      endDateOptions: {
        disabledDate (time) {
          return time.getTime() > Date.now()
        }
      }
    }
  },
  created () {
    this.searchHandle()
    this.getExternalUser()
  },
  methods: {
    // 开始时间改变处理
    startDateChange (date) {
      this.searchForm.startDate = date || ''
      this.searchForm.endDate = ''
      this.endDateOptions.disabledDate = time => {
        return time.getTime() < new Date(date).getTime() - 8.64e7
      }
    },
    // 结束时间改变处理
    endDateChange (date) {
      this.searchForm.endDate = date || ''
    },
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
      this.foreignExportData = row
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
    deleteHandle (recordId) {
      this.$alert('您是否确定删除该条记录?', '提示', {
        type: 'warning',
        customClass: 'msg-delete__dialog',
        showCancelButton: true,
        callback: action => {
          if (action === 'confirm') {
            this.$ajax({
              url: '/store/account/config/foreignExportConf/deleteForeginExport',
              data: {
                recordId
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
      this.tableData = []
       // 缓存查询条件
      this.$ajax({
        url: '/store/account/config/foreignExportConf/queryForeginExport',
        data: this.searchForm,
        success: data => {
          this.tableData = data.rows || []
          this.totalRecord = data.page.totalRecords
        }
      })
    },
    // 分页
    pageHandle (page) {
      this.searchForm.currentPage = page
      this.searchHandle()
    },
    // 获取外部渠道人员信息
    getExternalUser () {
      this.$ajax({
        url: '/store/account/user/comm/queryExternalUser',
        success: data => {
          this.externalUser = data.rows || []
        }
      })
    }
  },
  components: {
    ForeignExportAdd,
    ForeignExportEdit
  }
}
</script>

