<template>
  <div class="content-box">
    <div class="header__title">CFS签单列表</div>
    <!-- 条件搜索栏 -->
    <div class="header__search clearfix">
      <el-form :model="searchForm">
        <el-form-item label="最近获取日期-起:">
          <el-date-picker
            v-model="searchForm.startDate"
            type="date"
            editable
            :picker-options="startDateOptions"
            @change="startDateChange"
            placeholder="开始日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="最近获取日期-止:">
          <el-date-picker
            v-model="searchForm.endDate"
            type="date"
            editable
            :picker-options="endDateOptions"
            @change="endDateChange"
            placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="签约日期-起:">
          <el-date-picker
            v-model="searchForm.startSignDate"
            type="date"
            editable
            :picker-options="startSignDateOptions"
            @change="startSignDateChange"
            placeholder="开始日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="签约日期-止:">
          <el-date-picker
            v-model="searchForm.endSignDate"
            type="date"
            editable
            :picker-options="endSignDateOptions"
            @change="endSignDateChange"
            placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="最近处理日期-起:">
          <el-date-picker
            v-model="searchForm.startHandleDate"
            type="date"
            editable
            :picker-options="startApplyDateOptions"
            @change="startApplyDateChange"
            placeholder="开始日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="最近处理日期-止:">
          <el-date-picker
            v-model="searchForm.endHandleDate"
            type="date"
            editable
            :picker-options="endApplyDateOptions"
            @change="endApplyDateChange"
            placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="客户姓名或者手机号:">
          <el-input
            class="kf-search-input"
            v-model="searchForm.searchKey"
            placeholder="客户姓名或者手机号">
          </el-input>
        </el-form-item>
        <el-form-item label="处理业务员姓名或手机号:">
          <el-input
            class="kf-search-input"
            v-model="searchForm.storeSearchKey"
            placeholder="业务处理员姓名或手机号">
          </el-input>
        </el-form-item>
        <el-form-item label="合同类型:">
          <el-select
            v-model="searchForm.contractType"
            clearable
            placeholder="请选择">
            <el-option
              v-for="val,key,index in contractType"
              :label="val"
              :value="Number(key)"
              :key="index">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="处理状态:">
          <el-select
            v-model="searchForm.status"
            clearable
            placeholder="请选择">
            <el-option
              v-for="val,key,index in status"
              :label="val"
              :value="Number(key)"
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
        <el-form-item label="合同编号:">
          <el-input
            class="kf-search-input"
            v-model="searchForm.reContractId"
            placeholder="合同编号">
          </el-input>
        </el-form-item>
        <el-form-item label="错误信息:">
          <el-input
            class="kf-search-input"
            v-model="searchForm.errorMessage"
            placeholder="错误信息">
          </el-input>
        </el-form-item>
        <el-button :loading="loading" @click="searchHandle">查询</el-button>
        <el-button icon="setting" @click="cfsBackDeal" v-if="isAuth">同步CFS回款</el-button>
      </el-form>
    </div>
    <div class="header__control">
      <el-button icon="setting" @click="batchRelation">批量关联</el-button>
    </div>
    <!-- table表格数据 -->
    <el-table
      class="content__table"
      :data="tableData"
      border
      @selection-change="selectChange">
      <el-table-column
        type="selection"
        fixed="left"
        width="55">
      </el-table-column>
      <el-table-column
        prop="reContractId"
        label="合同编号"
        min-width="150">
      </el-table-column>
      <el-table-column
        prop="applyName"
        label="客户姓名"
        min-width="100">
      </el-table-column>
      <el-table-column
        prop="telephone"
        label="客户手机"
        min-width="130">
      </el-table-column>
      <el-table-column
        prop="customerName"
        label="处理业务员"
        min-width="130">
      </el-table-column>
      <el-table-column
        prop="contractTypeText"
        label="合同类型"
        min-width="100">
      </el-table-column>
      <el-table-column
        prop="feeAmountTotal"
        label="回款总额"
        min-width="100">
      </el-table-column>
      <el-table-column prop="status" label="处理状态" min-width="100">
        <template slot-scope="scope">
           <el-tag v-if="scope.row.status===0" type="primary">未处理</el-tag>
           <el-tag v-if="scope.row.status===1" type="success">处理成功</el-tag>
           <el-tag v-if="scope.row.status===2" type="danger">处理失败</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="queryDate"
        label="最近获取时间"
        min-width="180">
      </el-table-column>
      <el-table-column
        prop="dealDate"
        label="最近处理时间"
        sortable
        min-width="180">
      </el-table-column>
      <el-table-column
        prop="orgName"
        label="处理门店"
        min-width="150">
      </el-table-column>
      <el-table-column
        prop="signDate"
        label="签单时间"
        min-width="120">
      </el-table-column>
      <el-table-column
        prop="errorMessage"
        label="错误信息"
        min-width="180">
      </el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
        width="100">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="relationHandle(scope.row)">关联</el-button>
          <el-button type="text" size="small"  v-if="scope.row.status === 2" @click="addApply(scope.row)">录单</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- table分页区域 -->
    <el-pagination
      class="content__page fr"
      @current-change="pageHandle"
      :current-page="searchForm.currentPage"
      layout="total, prev, pager, next"
      :total="totalRecord">
    </el-pagination>
    <relation-edit v-model="isRelationShow" :signData="signData" @change="relationEditHandle" />
    <cfsBack-deal v-model="isCFSShow" @change="cfsEditHandle" />
  </div>
</template>

<script>
import RelationEdit from '@/components/work/RelationEdit'
import CfsBackDeal from '@/components/work/CfsBackDeal'
export default {
  name: 'cfs-sign',
  data () {
    let {lastWeekDay} = this.$searchDate()
    let authRole = this.$localStorage('userRole')
    let isAuth = authRole === '1'
    let userOrgs = JSON.parse(this.$localStorage('userOrgs')) || []
    // 缓存查询条件
    let store = this.$getStore('cfsSign')
    return {
      searchForm: {
        orgId: store['orgId'] || '',
        contractType: store['contractType'] || '',
        status: store['status'] || '',
        // 管理员角色(userRole=1)加上默认的搜索时间
        startDate: isAuth ? lastWeekDay : '',
        endDate: '',
        startHandleDate: store['startHandleDate'] || '',
        endHandleDate: store['endHandleDate'] || '',
        startSignDate: store['startSignDate'] || '',
        endSignDate: store['endSignDate'] || '',
        searchKey: store['searchKey'] || '',
        storeSearchKey: store['storeSearchKey'] || '',
        reContractId: store['reContractId'] || '',
        errorMessage: store['errorMessage'] || '',
        currentPage: store['currentPage'] || 1
      },
      signData: {},
      isAuth,
      isCFSShow: false,
      loading: false,
      tableData: [],
      totalRecord: 1,
      isShow: false, // 弹窗是否显示
      isRelationShow: false, // 关联弹窗是否显示
      userOrgs, // 门店数据
      orders: [], // table选中
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
      },
       // 申请开始时间禁用
      startApplyDateOptions: {
        disabledDate (time) {
          return time.getTime() > Date.now()
        }
      },
      // 申请结束时间禁用
      endApplyDateOptions: {
        disabledDate (time) {
          return time.getTime() > Date.now()
        }
      },
      // 签约开始时间禁用
      startSignDateOptions: {
        disabledDate (time) {
          return time.getTime() > Date.now()
        }
      },
      // 签约结束时间禁用
      endSignDateOptions: {
        disabledDate (time) {
          return time.getTime() > Date.now()
        }
      },
      // 回款状态
      contractType: {
        1: '手动添加',
        2: 'CFS返回'
      },
       // 处理状态
      status: {
        0: '未处理',
        1: '处理成功',
        2: '处理失败'
      }
    }
  },
  created () {
    this.searchHandle()
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
    // 申请开始时间改变处理
    startApplyDateChange (date) {
      this.searchForm.startHandleDate = date || ''
      this.searchForm.endHandleDate = ''
      this.endApplyDateOptions.disabledDate = time => {
        return time.getTime() < new Date(date).getTime() - 8.64e7
      }
    },
    // 申请结束时间改变处理
    endApplyDateChange (date) {
      this.searchForm.endHandleDate = date || ''
    },
    // 签约开始时间改变处理
    startSignDateChange (date) {
      this.searchForm.startSignDate = date || ''
      this.searchForm.endSignDate = ''
      this.endSignDateOptions.disabledDate = time => {
        return time.getTime() < new Date(date).getTime() - 8.64e7
      }
    },
    // 签约结束时间改变处理
    endSignDateChange (date) {
      this.searchForm.endSignDate = date || ''
    },
    // table表格选择
    selectChange (arr) {
      this.orders = []
      arr.forEach(item => {
        this.orders.push({
          applyName: item['applyName'],
          reContractId: item['reContractId'],
          status: item['status'],
          signDate: item['signDate'],
          telephone: item['telephone']
        })
      })
    },
    // 批量关联
    batchRelation () {
      if (this.orders.length === 0) this.$msg('请至少选择一个订单!')
      else {
        this.$alert('批量关联订单', '提示', {
          type: 'warning',
          customClass: 'msg-delete__dialog',
          showCancelButton: true,
          callback: action => {
            if (action === 'confirm') {
              this.$ajax({
                url: '/store/account/work/cfsSign/batchRelation',
                data: {
                  str: JSON.stringify({orders: this.orders})
                },
                success: () => {
                  this.$message('操作成功')
                  this.searchHandle()
                }
              })
            }
          }
        })
      }
    },
    // 同步CFS回款
    cfsBackDeal () {
      this.isCFSShow = true
    },
    // 编辑组件监听
    cfsEditHandle (val) {
      if (val === 'search') {
        this.isCFSShow = false
      } else {
        this.isCFSShow = val
      }
    },
    // 查询处理
    searchHandle () {
      this.tableData = []
      // 缓存查询条件
      this.$setStore('cfsSign', this.searchForm, ['startDate', 'endDate'])
      this.$ajax({
        url: '/store/account/work/cfsSign/queryCfsSignList',
        data: this.searchForm,
        loading: true,
        success: data => {
          this.tableData = data.rows || []
          this.totalRecord = data.page.totalRecords
        }
      })
    },
    relationHandle (obj) {
      this.signData = obj
      this.isRelationShow = true
    },
    addApply (obj) {
      let queryObj = {
        path: 'applyInfo',
        // 路由传递参数
        query: {
          applyId: obj.applyId,
          applyName: obj.applyName,
          telephone: obj.telephone
        }
      }
      let desc = obj.applyName
      if (!obj.applyName) {
        desc = obj.applyId
      }
      this.$emit('addTab', desc + '', queryObj)
      this.$router.push(queryObj)
    },
    // 编辑组件监听
    relationEditHandle (val) {
      if (val === 'search') {
        this.searchHandle()
        this.isRelationShow = false
      } else {
        this.isRelationShow = val
      }
    },
    // 分页处理
    pageHandle (page) {
      this.searchForm.currentPage = page
      this.searchHandle()
    }
  },
  components: {
    RelationEdit,
    CfsBackDeal
  }
}
</script>
