<template>
  <div class="content-box">
    <div class="header__title">访客记录</div>
    <!-- 条件搜索栏 -->
    <div class="header__search clearfix">
      <el-form :model="searchForm">
        <el-form-item label="上门时间-起:">
          <el-date-picker
            v-model="searchForm.startDate"
            type="date"
            editable
            :picker-options="startDateOptions"
            @change="startDateChange"
            placeholder="开始日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="上门时间-止:">
          <el-date-picker
            v-model="searchForm.endDate"
            type="date"
            editable 
            :picker-options="endDateOptions"
            @change="endDateChange"
            placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="客户姓名或者手机号:">
          <el-input
            class="kf-search-input"
            v-model="searchForm.custName"
            placeholder="请输入客户姓名或者手机号">
          </el-input>
        </el-form-item>
        <el-form-item label="接待人姓名或者手机号:">
          <el-input
            class="kf-search-input"
            v-model="searchForm.recName"
            placeholder="请输入接待人姓名或者手机号">
          </el-input>
        </el-form-item>
        <el-form-item label="申请匹配状态:">
          <el-select v-model="searchForm.applyStatus" clearable placeholder="请选择申请匹配状态">
            <el-option label="匹配本人" value="1"></el-option>
            <el-option label="匹配失败" value="2"></el-option>
            <el-option label="匹配非本人" value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="接待门店:">
          <el-select
            v-model="searchForm.orgId"
            filterable
            clearable
            @change="changeOrgHandle"
            placeholder="请选择门店">
            <el-option
              v-for="item,index in userOrgs"
              :label="item.orgNo + '-' + item.orgName"
              :value="item.orgId"
              :key="index">
            </el-option>
          </el-select>
        </el-form-item>
            <el-form-item label="所属组名:">
              <el-select
                v-model="searchForm.groupName"
                clearable
                placeholder="请选择组名">
                <el-option
                  v-for="item,index in groupNameList"
                  :label="item.groupName"
                  :value="item.groupName"
                  :key="index">
                </el-option>
              </el-select>
            </el-form-item>
        <el-form-item label="上传CFS状态:">
          <el-select
            v-model="searchForm.upStatus"
            clearable
            placeholder="请选择">
            <el-option
              v-for="val,key,index in upStatus"
              :label="val"
              :value="Number(key)"
              :key="index">
            </el-option>
          </el-select>
        </el-form-item>
        <el-button
          :loading="loading"
          @click="searchHandle">查询</el-button>
      </el-form>
    </div>
    <!-- table表格数据 -->
    <el-table
      class="content__table"
      :data="tableData"
      border>
      <el-table-column
        prop="recordId"
        label="记录ID"
        min-width="100">
      </el-table-column>
      <el-table-column
        prop="custName"
        label="客户姓名"
        min-width="120">
      </el-table-column>
      <el-table-column
        prop="custTel"
        label="客户手机"
        min-width="130">
      </el-table-column>
      <el-table-column
        prop="orgName"
        label="接待门店"
        min-width="120">
      </el-table-column>
      <el-table-column
        prop="realName"
        label="接待人"
        min-width="120">
      </el-table-column>
      <el-table-column
        prop="receiverTel"
        label="接待手机号"
        min-width="130">
      </el-table-column>
      <el-table-column
        prop="groupName"
        label="所属组名"
        min-width="150">
      </el-table-column>
      <el-table-column
        prop="teamName"
        label="所属队名"
        min-width="150">
      </el-table-column>
      <el-table-column
        prop="visitType"
        label="咨询类型"
        min-width="150">
      </el-table-column>
      <el-table-column
        prop="havApply"
        label="申请匹配状态"
        min-width="130">
      </el-table-column>
      <el-table-column
        prop="telephone"
        label="原始申请手机"
        min-width="130">
      </el-table-column>
      <el-table-column
        prop="visitTime"
        label="上门时间"
        min-width="180">
      </el-table-column>
      <el-table-column
        prop="errorMessage"
        label="上传CFS失败原因"
        min-width="180">
      </el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
        width="200">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="relationlHandle(scope.row)">关联</el-button>
          <el-button type="text" size="small" @click="transHandle(scope.row)">转单</el-button>
          <el-button type="text" size="small" @click="detailHandle(scope.row)">详情</el-button>
          <template v-if="scope.row.orgCFSFlag">
            <el-button type="text" size="small" v-if="scope.row.upStatus === 1" @click="uploadCFS(scope.row)">上传</el-button>
            <el-button type="text" size="small" v-else-if="scope.row.upStatus === 2" style="color: #999;" @click="return false">已上传</el-button>
            <el-button type="text" size="small" v-else-if="scope.row.upStatus === 3" @click="uploadCFS(scope.row)">重新上传</el-button>
          </template>
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
     <!-- 模块组件 -->
    <relation-deal
      v-model="relShow"
      :recordId="recordId"
      @change="relChange" />
  </div>
</template>

<script>
import RelationDeal from '@/components/work/RelationDeal'
// 访客记录页面
export default {
  name: 'cust-visit',
  data () {
    let {lastWeekDay} = this.$searchDate()
    let authRole = this.$localStorage('userRole')
    let isAuth = authRole === '1' || authRole === '6' || authRole === '7' || authRole === '8'
    let userOrgs = JSON.parse(this.$localStorage('userOrgs')) || []
    // 缓存查询条件
    let store = this.$getStore('custVisit')
    return {
      searchForm: {
        orgId: store['orgId'] || '',
        // 管理员角色(authRole=1、6、7)加上默认的搜索时间
        startDate: isAuth ? lastWeekDay : '',
        endDate: '',
        custName: store['custName'] || '',
        recName: store['recName'] || '',
        upStatus: store['upStatus'] || '',
        applyStatus: store['applyStatus'],
        currentPage: store['currentPage'] || 1,
        groupName: ''
      },
      groupNameList: [], // 门店组名列表
      recordId: '',
      loading: false,
      tableData: [],
      totalRecord: 1,
      relShow: false, // 弹窗是否显示
      applyShow: false,
      relationData: {},
      applyStatus: ['匹配本人', '匹配失败', '匹配非本人'],
      userOrgs, // 门店数据
      // 开始时间禁用
      startDateOptions: {
        disabledDate (time) {
          return time.getTime() > Date.now()
        }
      },
      // CFS上传状态
      upStatus: {
        1: '未上传',
        2: '已上传',
        3: '上传失败'
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
    // 改变门店的状态
    changeOrgHandle () {
      if (this.searchForm.orgId) {
        this.getGroupList()
      } else {
        this.searchForm.groupName = ''
        this.groupNameList = []
      }
    },
    // 关联处理
    relationlHandle (row) {
      if (row.havApply !== '匹配失败') this.$msg('该单已经关联')
      else {
        this.recordId = row.recordId
        this.relShow = true
      }
    },
    // 关联处理弹窗监听
    relChange (val) {
      if (val === 'search') {
        this.searchHandle()
        this.relShow = false
      } else {
        this.relShow = val
      }
    },
    // 转单处理
    transHandle (row) {
      if (row.havApply === '匹配失败') this.$msg('请先进行关联处理')
      else if (row.havApply === '匹配本人') this.$msg('该单已处理')
      else {
        this.$alert('转单处理将会把单转入该接待人名下，请谨慎处理', '转单处理', {
          type: 'info',
          customClass: 'msg-delete__dialog',
          showCancelButton: true,
          callback: action => {
            if (action === 'confirm') {
              this.$ajax({
                url: '/store/account/work/custVisit/checkTransDeal',
                data: {
                  recordId: row.recordId
                },
                success: () => {
                  this.searchHandle()
                }
              })
            }
          }
        })
      }
    },
    // 查看详情
    detailHandle (obj) {
      if (obj.havApply !== '匹配本人' || obj.applyId === undefined || obj.applyId === '') {
        this.$msg('非匹配本人数据不允许查看详情')
        return
      }
      let queryObj = {
        path: 'workDetail',
        // 路由传递参数
        query: {
          applyId: obj.applyId,
          storeSearchKey: this.searchForm.storeSearchKey
        }
      }
      this.$emit('addTab', obj.custName + '', queryObj)
      this.$router.push(queryObj)
    },
    // 获取组列表
    getGroupList () {
      this.$ajax({
        url: '/store/account/user/comm/queryOrgGroupList',
        data: {
          orgId: this.searchForm.orgId,
          fullLoading: true
        },
        success: data => {
          this.groupNameList = data.rows || []
          this.searchForm.groupName = ''
        }
      })
    },
    // 上传CFS
    uploadCFS (obj) {
      let params = {
        recordId: obj.recordId,
        upStatus: obj.upStatus,
        employeeNo: obj.employeeNo
      }
      if (obj.visitType === '手动添加') {
        params = {
          detailId: obj.recordId,
          upStatus: obj.upStatus
        }
      }
      this.$alert('此操作将进行上传CFS', '提示', {
        type: 'warning',
        customClass: 'msg-delete__dialog',
        showCancelButton: true,
        callback: action => {
          if (action === 'confirm') {
            this.$ajax({
              url: '/store/account/work/custVisit/uploadCFS',
              data: params,
              success: () => {
                this.searchHandle()
                this.$message({
                  type: 'success',
                  message: '上传CFS成功!'
                })
              },
              fail: (error) => {
                this.$msg(error.message)
                this.searchHandle()
              }
            })
          }
        }
      })
    },
    // 查询处理
    searchHandle () {
      this.tableData = []
      // 缓存查询条件
      this.$setStore('custVisit', this.searchForm, ['startDate', 'endDate'])
      this.$ajax({
        url: '/store/account/work/custVisit/queryVisitList',
        data: this.searchForm,
        loading: true,
        success: data => {
          this.tableData = data.rows || []
          this.totalRecord = data.page.totalRecords
        }
      })
    },
    // 分页处理
    pageHandle (page) {
      this.searchForm.currentPage = page
      this.searchHandle()
    }
  },
  components: {
    RelationDeal
  }
}
</script>
