<template>
  <div class="content-box">
    <div class="header__title">用户管理</div>
    <div class="header__search clearfix">
      <el-form :model="searchForm">
        <el-form-item label="注册日期-起:">
          <el-date-picker
            v-model="searchForm.startDate"
            type="date"
            editable
            :picker-options="startDateOptions"
            @change="startDateChange"
            placeholder="开始日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="注册日期-止:">
          <el-date-picker
            v-model="searchForm.endDate"
            type="date"
            editable
            :picker-options="endDateOptions"
            @change="endDateChange"
            placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="显示名或手机号:">
          <el-input
            class="kf-search-input"
            v-model="searchForm.nickNameAndTel"
            placeholder="显示名或手机号">
          </el-input>
        </el-form-item>
        <el-form-item label="用户状态:">
          <el-select
            v-model="searchForm.status"
            clearable
            placeholder="请选择处理状态">
            <el-option
              v-for="item,key,index in custStatusArr"
              :label="item.name"
              :value="item.val"
              :key="index">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="实名状态:">
          <el-select
            v-model="searchForm.identifyStatus"
            clearable
            placeholder="请选择实名状态">
            <el-option
              v-for="val,key,index in identifyStatus"
              :label="val"
              :value="Number(key)"
              :key="index">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="发币状态:">
          <el-select
            v-model="searchForm.sendStatus"
            clearable
            placeholder="请选择发币状态">
            <el-option
              v-for="val,key,index in sendStatus"
              :label="val"
              :value="Number(key)"
              :key="index">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="邀请码:">
          <el-input
            class="kf-search-input"
            v-model="searchForm.inviteCode"
            placeholder="邀请码">
          </el-input>
        </el-form-item>
         <el-form-item label="推荐码:">
          <el-input
            class="kf-search-input"
            v-model="searchForm.referCode"
            placeholder="推荐码">
          </el-input>
        </el-form-item>
         <el-form-item label="二级推荐码:">
          <el-input
            class="kf-search-input"
            v-model="searchForm.parentReferCode"
            placeholder="二级推荐码">
          </el-input>
        </el-form-item>
        <el-button @click="searchHandle">查询</el-button>
        <el-button @click="refCoin">刷新天狗币排行榜</el-button>
        <el-button @click="refAbility">刷新狗粮排行榜</el-button>
        <el-button @click="refInvite">刷新活动邀请排行榜</el-button>
        <!-- <el-button @click="sendCoin">手动发放狗币</el-button> -->
        <!-- <el-button @click="sendAbility">手动发放狗粮</el-button> -->
      </el-form>
    </div>
    <el-table class="content__table" :data="tableData" border>
      <el-table-column
        prop="customerId"
        label="客户编号"
        min-width="100">
      </el-table-column>
      <el-table-column
        prop="nickName"
        label="客户昵称"
        min-width="100">
      </el-table-column>
      <el-table-column
        prop="telephone"
        label="手机号码"
        min-width="130">
      </el-table-column>
      <el-table-column
        prop="xjCoinCount"
        label="天狗币"
        min-width="100">
      </el-table-column>
      <el-table-column
        prop="abilityValue"
        label="狗粮"
        min-width="100">
      </el-table-column>
      <el-table-column
        prop="rewardCoin"
        label="奖励天狗币"
        min-width="120">
      </el-table-column>
      <el-table-column
        prop="frozenCoin"
        label="冻结天狗币"
        min-width="120">
      </el-table-column>
      <el-table-column
        prop="luckCoinCount"
        label="幸运币"
        min-width="100">
      </el-table-column>
      <el-table-column
        prop="custStatusText"
        label="用户状态"
        min-width="80">
      </el-table-column>
      <el-table-column
        label="实名状态"
        min-width="100">
        <template slot-scope="scope">{{identifyStatus[scope.row.identifyStatus]}}</template>
      </el-table-column>
      <el-table-column
        label="发币状态"
        min-width="100">
        <template slot-scope="scope">{{sendStatus[scope.row.sendStatus]}}</template>
      </el-table-column>
      <el-table-column
        prop="getLastTime"
        label="最近获币时间"
        min-width="170">
      </el-table-column>
      <el-table-column
        prop="registerTime"
        label="注册时间"
        min-width="170">
      </el-table-column>
      <el-table-column
        prop="firstCoinTime"
        label="首次获币时间"
        min-width="170">
      </el-table-column>
      <el-table-column
        prop="inviteCode"
        label="邀请码"
        min-width="100">
      </el-table-column>
      <el-table-column
        prop="referCode"
        label="推荐码"
        min-width="100">
      </el-table-column>
      <el-table-column
        prop="parentReferCode"
        label="二级推荐码"
        min-width="100">
      </el-table-column>
      <el-table-column
        prop="lastLoginTime"
        label="最近登录时间"
        min-width="170">
      </el-table-column>
      <el-table-column
        prop="lastLoginIp"
        label="最近登录IP"
        min-width="150">
      </el-table-column>
      <el-table-column
        label="操作"
        min-width="120">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="editHandle(scope.row)">编辑</el-button>
        <!--   <el-button type="text" class="table__danger" size="small" @click="deleteHandle(scope.row.customerId)">删除</el-button> -->
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
    <xjCust-edit v-model="editShow" :custData="custData" @change="editChange" :custStatusArr="custStatusArr"/>
    <xjAbility-send v-model="abilitShow" :custData="custData" @change="abilitChange"/>
    <xjCoin-send v-model="coinShow" :custData="custData" @change="coinChange"/>
  </div>
</template>

<script>
import XjCustEdit from '@/components/xj/XjCustEdit'
import XjAbilitySend from '@/components/xj/XjAbilitySend'
import XjCoinSend from '@/components/xj/XjCoinSend'
export default {
  name: 'xj-cust',
  data () {
    let {lastWeekDay} = this.$searchDate()
    // 缓存查询条件
    let store = this.$getStore('xjCust')
    return {
      tableData: [],
      totalRecord: 1,
      custData: {},
      editShow: false,
      coinShow: false,
      abilitShow: false,
      searchForm: {
        startDate: '' || lastWeekDay,
        endDate: '',
        nickNameAndTel: store['nickNameAndTel'] || '',
        status: store['status'] || '',
        identifyStatus: store['identifyStatus'] || '',
        sendStatus: store['sendStatus'] || '',
        currentPage: store['currentPage'] || 1
      },
      // 用户状态
      custStatusArr: [
        {val: -1, name: '未下载APP'},
        {val: 0, name: '未激活'},
        {val: 1, name: '正常用户'},
        {val: 2, name: '锁定'},
        {val: 3, name: '失效'},
        {val: 4, name: '永久锁定'},
        {val: 5, name: '广告'},
        {val: 6, name: '刷单'},
        {val: 7, name: '传播负能量'}
      ],
      // 发币状态
      sendStatus: {
        0: '未发放',
        1: '已发放'
      },
      // 实名状态
      identifyStatus: {
        0: '待审核',
        1: '正确',
        2: '不正确'
      },
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
    this.getTaskName()
  },
  methods: {
    // 发放狗币
    sendCoin () {
      this.coinShow = true
    },
    // 发放狗粮
    sendAbility () {
      this.abilitShow = true
    },
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
    // 编辑
    editHandle (row) {
      this.custData = row
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
    // 编辑弹窗监听
    coinChange (val) {
      if (val === 'search') {
        this.searchHandle()
        this.coinShow = false
      } else {
        this.coinShow = val
      }
    },
    // 编辑弹窗监听
    abilitChange (val) {
      if (val === 'search') {
        this.searchHandle()
        this.abilitShow = false
      } else {
        this.abilitShow = val
      }
    },
    // 查询
    searchHandle () {
      this.tableData = []
      // 缓存查询条件
      this.$setStore('xjCust', this.searchForm, ['startDate', 'endDate'])
      this.$ajax({
        url: '/store/account/xj/xjCust/queryCust',
        data: this.searchForm,
        success: data => {
          this.tableData = data.rows || []
          this.totalRecord = data.page.totalRecords
        }
      })
    },
    // 刷新天狗币排行榜
    refCoin () {
      this.$ajax({
        url: '/store/account/xj/xjCust/refCoinRanking',
        success: data => {
          this.$message({
            message: data.message,
            type: 'success'
          })
        }
      })
    },
    // 刷新狗粮排行榜
    refAbility () {
      this.$ajax({
        url: '/store/account/xj/xjCust/refAbilityRanking',
        success: data => {
          this.$message({
            message: data.message,
            type: 'success'
          })
        }
      })
    },
    // 刷新活动邀请排行榜
    refInvite () {
      this.$ajax({
        url: '/store/account/xj/xjCust/refInviteRanking',
        success: data => {
          this.$message({
            message: data.message,
            type: 'success'
          })
        }
      })
    },
    // 分页
    pageHandle (page) {
      this.searchForm.currentPage = page
      this.searchHandle()
    }
  },
  components: {
    XjCustEdit,
    XjAbilitySend,
    XjCoinSend
  }
}
</script>

