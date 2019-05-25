<template>
  <div class="content-box">
    <div class="header__title">狗粮领取记录</div>
    <div class="header__search clearfix">
      <el-form :model="searchForm">
        <el-form-item label="创建日期-起:">
          <el-date-picker
            v-model="searchForm.startDate"
            type="date"
            editable
            :picker-options="startDateOptions"
            @change="startDateChange"
            placeholder="开始日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="创建日期-止:">
          <el-date-picker
            v-model="searchForm.endDate"
            type="date"
            editable
            :picker-options="endDateOptions"
            @change="endDateChange"
            placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="发放类型:">
          <el-select
            v-model="searchForm.typeId"
            clearable
            placeholder="请选择类型">
            <el-option
              v-for="val,key,index in typeNameList"
              :label="val.typeName"
              :value="Number(val.typeId)"
              :key="index">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="显示名或手机号:">
          <el-input
            class="kf-search-input"
            v-model="searchForm.nickNameAndTel"
            placeholder="显示名或手机号">
          </el-input>
        </el-form-item>
        <el-button @click="searchHandle">查询</el-button>
        <!-- <el-button @click="sendHandle">手工发放狗粮</el-button> -->
      </el-form>
    </div>
    <el-table class="content__table" :data="tableData" border>
      <el-table-column
        prop="recordId"
        label="记录编号"
        min-width="80">
      </el-table-column>
      <el-table-column
        prop="nickName"
        label="显示名称"
        min-width="80">
      </el-table-column>
      <el-table-column
        prop="telephone"
        label="手机号码"
        min-width="80">
      </el-table-column>
      <el-table-column
        prop="typeName"
        label="类型"
        min-width="80">
      </el-table-column>
      <el-table-column
        prop="abilityValue"
        label="狗粮"
        min-width="130">
      </el-table-column>
      <el-table-column
        label="领取标签"
        min-width="100">
        <template slot-scope="scope">{{flag[scope.row.flag]}}</template>
      </el-table-column>
      <el-table-column
        prop="recoveryTime"
        label="回收时间"
        min-width="150">
      </el-table-column>
      <el-table-column
        label="回收状态"
        min-width="100">
        <template slot-scope="scope">{{recoveryStatus[scope.row.recoveryStatus]}}</template>
      </el-table-column>
      <el-table-column
        label="狗粮类型"
        min-width="100">
        <template slot-scope="scope">{{abilityType[scope.row.abilityType]}}</template>
      </el-table-column>
      <el-table-column
        prop="createTime"
        label="创建时间"
        min-width="150">
      </el-table-column>
      <el-table-column
        prop="remark"
        label="备注"
        min-width="100">
      </el-table-column>
    </el-table>
    <el-pagination
      class="content__page fr"
      @current-change="pageHandle"
      :current-page="searchForm.currentPage"
      layout="total, prev, pager, next"
      :total="totalRecord">
    </el-pagination>
    <xjAbility-send v-model="editShow" :custData="custData" @change="editChange" :typeNameList="typeNameList"/>
  </div>
</template>


<script>
import XjAbilitySend from '@/components/xj/XjAbilitySend'
export default {
  name: 'xj-avilty',
  data () {
    let {today} = this.$searchDate()
    // 缓存查询条件
    let store = this.$getStore('xjAbility')
    return {
      tableData: [],
      totalRecord: 1,
      custData: {},
      editShow: false,
      searchForm: {
        startDate: '' || today,
        endDate: '',
        typeId: store['typeId'] || '',
        nickNameAndTel: store['nickNameAndTel'] || '',
        currentPage: store['currentPage'] || 1
      },
      typeNameList: [],
      // 标签
      flag: {
        '+': '收入',
        '-': '支出'
      },
      recoveryStatus: {
        '0': '未回收',
        '1': '已回收'
      },
      abilityType: {
        '1': '长期狗粮',
        '2': '魔法狗粮'
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
    this.getTypeName()
  },
  methods: {
    // 发放
    sendHandle () {
      this.editShow = true
    },
    // 编辑
    editHandle (row) {
      this.custData = row
      this.editShow = true
    },
    // 编辑弹窗监听
    editChange (val) {
      console.log(111)
      if (val === 'search') {
        this.searchHandle()
        this.editShow = false
      } else {
        this.editShow = val
      }
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
    getTypeName () {
      this.$ajax({
        url: '/store/account/xj/xjReceive/queryTypeName',
        success: data => {
          this.typeNameList = data.attr['typeNameList']
        }
      })
    },
    // 查询
    searchHandle () {
      this.tableData = []
      // 缓存查询条件
      this.$setStore('xjAbility', this.searchForm, ['startDate', 'endDate'])
      this.$ajax({
        url: '/store/account/xj/xjAbility/queryAbilityReceiveRecord',
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
    }
  },
  components: {
    XjAbilitySend
  }
}
</script>