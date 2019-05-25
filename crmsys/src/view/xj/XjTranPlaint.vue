<template>
  <div class="content-box">
    <div class="header__title">申诉管理</div>
    <div class="header__search clearfix">
      <el-form :model="searchForm">
        <el-form-item label="发起日期-起:">
          <el-date-picker
            v-model="searchForm.startDate"
            type="date"
            editable
            :picker-options="startDateOptions"
            @change="startDateChange"
            placeholder="开始日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="发起日期-止:">
          <el-date-picker
            v-model="searchForm.endDate"
            type="date"
            editable
            :picker-options="endDateOptions"
            @change="endDateChange"
            placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="订单编号:">
          <el-input
            class="kf-search-input"
            v-model="searchForm.orderNo"
            placeholder="订单编号">
          </el-input>
        </el-form-item>
        <el-form-item label="发起人昵称:">
          <el-input
            class="kf-search-input"
            v-model="searchForm.comName"
            placeholder="发起人昵称">
          </el-input>
        </el-form-item>
        <el-form-item label="发起人手机号:">
          <el-input
            class="kf-search-input"
            v-model="searchForm.comTelephone"
            placeholder="发起人手机号">
          </el-input>
        </el-form-item>
        <el-form-item label="受诉人昵称:">
          <el-input
            class="kf-search-input"
            v-model="searchForm.resName"
            placeholder="受诉人昵称">
          </el-input>
        </el-form-item>
        <el-form-item label="受诉人手机号:">
          <el-input
            class="kf-search-input"
            v-model="searchForm.resTelephone"
            placeholder="受诉人手机号">
          </el-input>
        </el-form-item>
        <el-form-item label="申诉状态:">
          <el-select
            v-model="searchForm.complainStatus"
            clearable
            placeholder="请选择申诉状态">
            <el-option
              v-for="val,key,index in complainStatus"
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
        prop="orderNo"
        label="订单编号"
        min-width="180">
      </el-table-column>
      <el-table-column
        label="订单状态"
        min-width="100">
        <template slot-scope="scope">{{tranStatus[scope.row.tranStatus]}}</template>
      </el-table-column>
      <el-table-column prop="tradeImgUrl" label="交易凭证" align="center" min-width="100">
        <template slot-scope="scope">
          <img :src="scope.row.tradeImgUrl" class="gradeImg" v-if="scope.row.tradeImgUrl" @click="alertBigImg(scope.row.tradeImgUrl)">
        </template>
      </el-table-column>
      <el-table-column
        label="申诉类型"
        min-width="100">
        <template slot-scope="scope">{{custType[scope.row.custType]}}</template>
      </el-table-column>
      <el-table-column
        prop="comName"
        label="发起人昵称"
        min-width="100">
      </el-table-column>
      <el-table-column
        prop="comTelephone"
        label="发起人手机号"
        min-width="130">
      </el-table-column>
      <el-table-column
        prop="resName"
        label="受诉人昵称"
        min-width="100">
      </el-table-column>
      <el-table-column
        prop="resTelephone"
        label="受诉人手机号"
        min-width="130">
      </el-table-column>
      <el-table-column
        label="申诉状态"
        min-width="100">
        <template slot-scope="scope">{{complainStatus[scope.row.complainStatus]}}</template>
      </el-table-column>
      <el-table-column
        prop="createTime"
        label="发起时间"
        min-width="170">
      </el-table-column>
      <el-table-column
        label="操作"
        min-width="120">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="lookDtl(scope.row.complainId)">查看详情</el-button>
          <el-button type="text" size="small" @click="editHandle(scope.row)">处理投诉</el-button>
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
    <xjTranPlain-edit v-model="editShow" :custData="custData" @change="editChange" :complainStatus="complainStatus" :tranStatus="tranStatus"/>
    <xjTranPlain-dtl v-model="lookShow" :complainId="curComplainId" @change="lookChange"/>
    <div class="alertImg-wrap" v-if="isBigImg" @click="isBigImg = false">
      <div class="content">
        <img :src="bigImgUrl" alt="" class="big-img">
      </div>
    </div>
  </div>
</template>

<script>
import XjTranPlainEdit from '@/components/xj/XjTranPlainEdit'
import XjTranPlainDtl from '@/components/xj/XjTranPlainDtl'
export default {
  name: 'xj-tranPlain',
  data () {
    let {lastWeekDay} = this.$searchDate()
    // 缓存查询条件
    let store = this.$getStore('xjTranPlain')
    return {
      tableData: [],
      totalRecord: 1,
      custData: {},
      editShow: false,
      lookShow: false,
      isBigImg: false,
      bigImgUrl: '',
      curComplainId: '',
      searchForm: {
        startDate: '' || lastWeekDay,
        endDate: '',
        orderNo: store['orderNo'] || '',
        comName: store['comName'] || '',
        comTelephone: store['comTelephone'] || '',
        resName: store['resName'] || '',
        resTelephone: store['resTelephone'] || '',
        complainStatus: store['complainStatus'] || '',
        currentPage: store['currentPage'] || 1
      },
      // 申诉类型
      custType: {
        0: '买家申诉',
        1: '卖家申诉'
      },
      // 申诉状态
      complainStatus: {
        0: '待处理',
        1: '处理中',
        2: '处理完成'
      },
      // 订单状态
      tranStatus: {
        0: '待付款',
        1: '已付款',
        2: '申诉中',
        3: '已完成',
        4: '已取消',
        5: '系统取消',
        6: '删除订单'
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
    // 查看
    lookDtl (id) {
      console.log(id)
      this.curComplainId = String(id)
      this.lookShow = true
    },
    // 查看弹窗监听
    lookChange (val) {
      this.lookShow = val
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
    // 海报图放大处理
    alertBigImg (url) {
      this.bigImgUrl = url
      this.isBigImg = true
    },
    // 查询
    searchHandle () {
      this.tableData = []
      // 缓存查询条件
      this.$setStore('xjTranPlain', this.searchForm, ['startDate', 'endDate'])
      this.$ajax({
        url: '/store/account/xj/xjTranPlaint/queryPlains',
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
    XjTranPlainEdit,
    XjTranPlainDtl
  }
}
</script>


<style lang="less">
.gradeImg {
    width: 64px;
    height: 64px;
    padding: 10px 0 0 0px;
    display: block;
}
.alertImg-wrap{
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
  background: rgba(0,0,0,0.8);
  z-index: 2000;
  .content{
    width: 1000px;
    height: 600px;
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
    .big-img{
      height: 100%;
    }
  }
}
.input-wrapp{
  padding-left: 20px;
  margin-bottom: 10px;
  input{
    height: 30px;
    width: 200px;
  }
}
.exam-wrap{
  // overflow: hidden;
}
.exam-w{
  float: left;
  width:350px;
  border: 1px solid #dcdcdc;
  margin: 20px;
  position: relative;
  .no-info{
    position: absolute;
    width: 120px;
    top: 120px;
    right: 40px;
  }
  .tit{
    padding-left: 20px;
    color: white;
    line-height: 40px;
  }
  .color1{
    background: #5FBAD1;
  }
  .color2{
    background: #E6986E;
  }
  .color3{
    background: #CBBB92;
  }
  .info{
    overflow: hidden;
  }
  .img-w{
    padding: 10px;
    width: 130px;
    height: 130px;
    float: left;
    overflow: hidden;
    img{
      width: 100%
    }
  }
  .status{
    text-align: center;
    font-size: 20px;
    width: 200px;
    float: right;
    padding-top: 50px;
  }
  .statu0{
    color: #539cd2;
  }
  .statu1{
    color: green;
  }
  .statu2{
    color: #F53C44;
  }
  .p{
    padding-left: 20px;
    margin:10px 0;
  }
  .btn-w{
    margin: 10px 0;
    padding-left: 85px;
    button{
      border:none;
      border-radius: 0;
      color: white;
    }
  }
  .btn-l{
    background: #53BF8A;
  }
  .btn-r{
    background: #F53C44;
  }
}
.three-pic{
  overflow: hidden;
  .pic-w{
    width: 100px;
    float: left;
    margin-left: 10px;
    h3{
      text-align: center;
    }
    img{
      width: 100%;
    }
  }
}
</style>