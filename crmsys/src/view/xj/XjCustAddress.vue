<template>
  <div class="content-box">
    <div class="header__title">用户地址列表</div>
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
        <el-form-item label="显示名或手机号:">
          <el-input
            class="kf-search-input"
            v-model="searchForm.nickNameAndTel"
            placeholder="显示名或手机号">
          </el-input>
        </el-form-item>
        <el-form-item label="收件人或手机号:">
          <el-input
            class="kf-search-input"
            v-model="searchForm.realNameAndTel"
            placeholder="收件人或手机号">
          </el-input>
        </el-form-item>
        <el-form-item label="省份:">
          <el-input
            class="kf-search-input"
            v-model="searchForm.province"
            placeholder="请输入省份">
          </el-input>
        </el-form-item>
        <el-form-item label="城市:">
          <el-input
            class="kf-search-input"
            v-model="searchForm.city"
            placeholder="请输入城市">
          </el-input>
        </el-form-item>
        <el-form-item label="地区:">
          <el-input
            class="kf-search-input"
            v-model="searchForm.area"
            placeholder="请输入地区">
          </el-input>
        </el-form-item>
        <el-form-item label="详细地址:">
          <el-input
            class="kf-search-input"
            v-model="searchForm.street"
            placeholder="请输入详细地址">
          </el-input>
        </el-form-item>
        <el-form-item label="默认地址:">
          <el-select
            v-model="searchForm.isDefaultAddress"
            clearable
            placeholder="请选择是或否">
            <el-option
              v-for="val,key,index in isDefaultAddress"
              :label="val"
              :value="Number(key)"
              :key="index">
            </el-option>
          </el-select>
        </el-form-item>
        <el-button @click="searchHandle">查询</el-button>
      </el-form>
    </div>
    <el-table class="content__table" :data="tableData" border>
      <el-table-column
        prop="addressId"
        label="地址编号"
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
        prop="realname"
        label="收件人姓名"
        min-width="80">
      </el-table-column>
      <el-table-column
        prop="telphone1"
        label="联系电话"
        min-width="120">
      </el-table-column>
      <el-table-column
        prop="country"
        label="国家"
        min-width="80">
      </el-table-column>
      <el-table-column
        prop="province"
        label="省份"
        min-width="80">
      </el-table-column>
      <el-table-column
        prop="city"
        label="城市"
        min-width="80">
      </el-table-column>
      <el-table-column
        prop="area"
        label="地区"
        min-width="80">
      </el-table-column>
      <el-table-column
        prop="street"
        label="详细地址"
        min-width="100">
      </el-table-column>
      <el-table-column
        prop="zip"
        label="邮政编码"
        min-width="80">
      </el-table-column>
      <el-table-column
        label="默认地址"
        min-width="100">
        <template slot-scope="scope">{{isDefaultAddress[scope.row.isDefaultAddress]}}</template>
      </el-table-column>
      <el-table-column
        prop="updateTime"
        label="修改时间"
        min-width="150">
      </el-table-column>
      <el-table-column
        prop="createTime"
        label="创建时间"
        min-width="150">
      </el-table-column>
      <!-- <el-table-column
        label="操作"
        min-width="120">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="editHandle(scope.row)">编辑</el-button>
        </template>
      </el-table-column> -->
    </el-table>
    <el-pagination
      class="content__page fr"
      @current-change="pageHandle"
      :current-page="searchForm.currentPage"
      layout="total, prev, pager, next"
      :total="totalRecord">
    </el-pagination>
    <!-- <xjCustAddress-edit  v-model="editShow" :custData="custData" :allAreaInfo="allAreaInfo" @change="editChange" :isDefaultAddress="isDefaultAddress"/> -->
  </div>
</template>

<script>
import XjCustAddressEdit from '@/components/xj/XjCustAddressEdit'
export default {
  name: 'xj-real',
  data () {
    let {today} = this.$searchDate()
    // 缓存查询条件
    let store = this.$getStore('xjCustAddress')
    return {
      tableData: [],
      totalRecord: 1,
      custData: {},
      editShow: false,
      searchForm: {
        startDate: '' || today,
        endDate: '',
        nickNameAndTel: store['nickNameAndTel'] || '',
        realNameAndTel: store['realNameAndTel'] || '',
        province: store['province'] || '',
        city: store['city'] || '',
        area: store['area'] || '',
        street: store['street'] || '',
        isDefaultAddress: store['isDefaultAddress'] || '',
        currentPage: store['currentPage'] || 1
      },
      allAreaInfo: [],
      // 类型
      isDefaultAddress: {
        0: '否',
        1: '是'
      },
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
    // 编辑
    editHandle (row) {
      this.custData = row
      this.editShow = true
      this.getAllAreaInfo(row)
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
    getAllAreaInfo (row) {
      this.$ajax({
        url: 'account/user/comm/allAreaInfo',
        success: data => {
          this.allAreaInfo = data.rows
        }
      })
    },
    // 查询
    searchHandle () {
      this.tableData = []
       // 缓存查询条件
      this.$setStore('xjCustAddress', this.searchForm, ['startDate', 'endDate'])
      this.$ajax({
        url: '/store/account/xj/xjCustAddress/queryCustAddressList',
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
    XjCustAddressEdit
  }
}
</script>

