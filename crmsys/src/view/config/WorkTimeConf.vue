<template>
  <div class="content-box">
    <div class="header__title">门店工作配置</div>
    <div class="header__search clearfix">
      <el-form :model="searchForm">
        <el-form-item
          label="城市:"
          :rules="{required: false, message: '城市不能为空'}">
          <el-select
            v-model="searchForm.cityName"
            clearable
            filterable
            placeholder="请选择城市">
            <el-option
              v-for="item,index in cityNameList"
              :label="item.cityName"
              :value="item.cityName"
              :key="index">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="门店:">
          <el-select
            v-model="searchForm.orgId"
            filterable
            clearable
            placeholder="请选择门店">
            <el-option
              v-for="item,index in userOrgs"
              :label="item.orgNo + '-' + item.orgName"
              :value="item.orgId"
              :key="index">
            </el-option>
          </el-select>
        </el-form-item>
        <el-button @click="searchHandle">查询</el-button>
        <el-button @click="addHandle">添加</el-button>
      </el-form>
    </div>
    <el-table class="content__table" :data="tableData" border>
      <el-table-column
        prop="cityName"
        label="城市"
        min-width="150">
      </el-table-column>
      <el-table-column
        prop="orgName"
        label="门店"
        min-width="150">
      </el-table-column>
      <el-table-column
        prop="amBeginWorkTime"
        label="上午开始工作时间"
        min-width="150">
      </el-table-column>
      <el-table-column
        prop="amEndWordTime"
        label="上午结束工作时间"
        min-width="150">
      </el-table-column>
      <el-table-column
        prop="pmBeginWorkTime"
        label="下午开始工作时间"
        min-width="150">
      </el-table-column>
      <el-table-column
        prop="pmEndWordTime"
        label="下午结束工作时间"
        min-width="150">
      </el-table-column>
      <el-table-column
        prop="evesBeginWorkTime"
        label="晚上开始工作时间"
        min-width="150">
      </el-table-column>
      <el-table-column
        prop="evesEndWordTime"
        label="晚上结束工作时间"
        min-width="150">
      </el-table-column>
      <el-table-column
        prop="startAllotTime"
        label="开始分单时间"
        min-width="150">
      </el-table-column>
      <el-table-column
        prop="endAllotTime"
        label="结束分单时间"
        min-width="150">
      </el-table-column>
      <el-table-column
        prop="createTime"
        label="创建日期"
        min-width="180">
      </el-table-column>
      <el-table-column
        prop="orgMaxCount"
        label="门店最大分单量"
        min-width="180">
      </el-table-column>
      <el-table-column
        prop="monthMaxCost"
        label="月最大成本单量"
        min-width="180">
      </el-table-column>
      <el-table-column
        label="操作"
        min-width="180">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="editHandle(scope.row)">编辑</el-button>
          <el-button type="text" class="table__danger" size="small" @click="deleteHandle(scope.row.recordId)">删除</el-button>
          <el-button type="text" class="table__danger" size="small" @click="orgCostHandle(scope.row.orgId)">成本维护</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      class="content__page fr"
      @current-change="pageHandle"
      :current-page="searchForm.currentPage"
      :page-sizes="[20]"
      layout="total, sizes, prev, pager, next"
      :total="totalRecord">
    </el-pagination>
    <workTime-add v-model="addShow" @change="addChange" :cityNameList="cityNameList" :userOrgs="userOrgs"/>
    <workTime-edit v-model="editShow" :workTimeData="workTimeData" @change="editChange" :cityNameList="cityNameList" :userOrgs="userOrgs"/>
  </div>
</template>

<script>
import WorkTimeAdd from '@/components/config/WorkTimeAdd'
import WorkTimeEdit from '@/components/config/WorkTimeEdit'
export default {
  name: 'workTime',
  data () {
    let userOrgs = JSON.parse(this.$localStorage('userOrgs')) || []
    // 缓存查询条件
    let store = this.$getStore('workTime')
    return {
      tableData: [],
      totalRecord: 1,
      workTimeData: {},
      addShow: false,
      editShow: false,
      userOrgs, // 门店数据
      searchForm: {
        orgId: store['orgId'] || '',
        cityName: store['cityName'] || '',
        currentPage: 1
      },
      cityNameList: [],
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
    this.getCityName()
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
      this.workTimeData = row
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
              url: '/store/account/config/workTimeConf/deleteWorkTime',
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
    orgCostHandle (orgId) {
      this.$alert('您是否确定进行成本维护，每个月只能维护一次,请谨慎操作?', '提示', {
        type: 'warning',
        customClass: 'msg-delete__dialog',
        showCancelButton: true,
        callback: action => {
          if (action === 'confirm') {
            this.$ajax({
              url: '/store/account/config/workTimeConf/checkOrgOrderCost',
              data: {
                orgId
              },
              success: data => {
                this.$msg('操作成功')
                this.searchHandle()
              },
              fail: (error) => {
                this.$msg(error.message)
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
      this.$setStore('workTime', this.searchForm)
      this.$ajax({
        url: '/store/account/config/workTimeConf/queryWorkTime',
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
    // 获取网销城市
    getCityName () {
      this.$ajax({
        url: '/store/account/user/comm/queryNetCity',
        success: data => {
          this.cityNameList = data.attr['cityNameList']
        }
      })
    }
  },
  components: {
    WorkTimeAdd,
    WorkTimeEdit
  }
}
</script>

