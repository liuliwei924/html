<template>
  <div class="content-box">
    <div class="header__title">门店配置</div>
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
        prop="orgId"
        label="序号"
        min-width="150">
      </el-table-column>
      <el-table-column
        prop="orgNo"
        label="门店编号"
        min-width="150">
      </el-table-column>
      <el-table-column
        prop="orgName"
        label="门店名称"
        min-width="150">
      </el-table-column>
      <el-table-column
        prop="province"
        label="所在省"
        min-width="150">
      </el-table-column>
      <el-table-column
        prop="cityName"
        label="所在城市"
        min-width="150">
      </el-table-column>
      <el-table-column
        prop="address"
        label="门店详细地址"
        min-width="150">
      </el-table-column>
      <el-table-column
        label="是否网销门店"
        min-width="150">
        <template slot-scope="scope">
          <span>{{scope.row.isNet === 1 ? '是' : '否'}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="是否统计"
        min-width="150">
        <template slot-scope="scope">
          <span>{{scope.row.isCount === 1 ? '是' : '否'}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="门店标识"
        min-width="150">
        <template slot-scope="scope">
          <span>{{scope.row.orgFlag === 1 ? '对外门店' : '对内门店'}}</span>  
        </template>
      </el-table-column>
      <el-table-column
        prop="createTime"
        label="创建时间"
        min-width="150">
      </el-table-column>
      <el-table-column
        label="操作"
        min-width="180">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="editHandle(scope.row)">编辑</el-button>
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
    <org-edit :isEdit="isEdit" :visible="visible" :orgInfo="orgInfo" @close="closeEdit"></org-edit>
  </div>
</template>

<script>
import OrgEdit from '@/components/config/OrgEdit'
export default {
  name: 'orgCfg',
  data () {
    let userOrgs = JSON.parse(this.$localStorage('userOrgs')) || []
    // 缓存查询条件
    let store = this.$getStore('orgCfgManager')
    return {
      tableData: [],
      totalRecord: 1,
      isEdit: false,
      orgInfo: {},
      visible: false,
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
      this.isEdit = false
      this.visible = true
    },
    // 编辑
    editHandle (row) {
      this.orgInfo = Object.assign({}, row)
      this.isEdit = true
      this.visible = true
    },
    // 查询
    searchHandle () {
      this.tableData = []
      // 缓存查询条件
      this.$setStore('orgCfgManager', this.searchForm)
      this.$ajax({
        url: '/store/account/config/orgCfg/queryList',
        data: this.searchForm,
        success: data => {
          this.tableData = data.rows || []
          this.totalRecord = data.page.totalRecords
        }
      })
    },
    closeEdit (str) {
      this.visible = false
      this.orgInfo = {}
      if (str) {
        this.searchHandle()
      }
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
    OrgEdit
  }
}
</script>

