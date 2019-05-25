<template>
  <div class="content-box">
    <div class="header__title">竞拍详情列表</div>
    <div class="header__search clearfix">
      <el-form :model="searchForm">
        <!-- <el-form-item label="创建日期-起:">
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
        </el-form-item> -->
        <el-form-item label="手机号码/昵称:">
          <el-input
            class="kf-search-input"
            v-model="searchForm.telephone"
            placeholder="手机号码/昵称">
          </el-input>
        </el-form-item>
        <el-form-item label="邀请码:">
          <el-input
            class="kf-search-input"
            v-model="searchForm.inviteCode"
            placeholder="请输入邀请码">
          </el-input>
        </el-form-item>
        <el-form-item label="物流状态:">
          <el-select
            v-model="searchForm.logisticsStatus"
            clearable
            placeholder="请选择物品状态">
            <el-option
              v-for="val,key,index in logisticsStatus"
              :label="val"
              :value="Number(key)"
              :key="index">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="物品名称:">
          <el-input
            class="kf-search-input"
            v-model="searchForm.auctionName"
            placeholder="物品名称">
          </el-input>
        </el-form-item>
        <el-form-item label="物品状态:">
          <el-select
            v-model="searchForm.status"
            clearable
            placeholder="请选择物品状态">
            <el-option
              v-for="val,key,index in status"
              :label="val"
              :value="Number(key)"
              :key="index">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="竞拍状态:">
          <el-select
            v-model="searchForm.auctionStatus"
            clearable
            placeholder="请选择竞拍状态">
            <el-option
              v-for="val,key,index in auctionStatus"
              :label="val"
              :value="Number(key)"
              :key="index">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="成交状态:">
          <el-select
            v-model="searchForm.ownStatus"
            clearable
            placeholder="请选择成交状态">
            <el-option
              v-for="val,key,index in ownStatus"
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
        prop="ownId"
        label="订单编号"
        min-width="80">
      </el-table-column>
      <el-table-column
        prop="createTime"
        label="创建时间"
        min-width="180">
      </el-table-column>
      <el-table-column
        prop="customerId"
        label="用户ID"
        min-width="80">
      </el-table-column>
      <el-table-column
        prop="nickName"
        label="昵称"
        min-width="80">
      </el-table-column>
      <el-table-column
        prop="userName"
        label="真实姓名"
        min-width="80">
      </el-table-column>
      <el-table-column
        prop="userTelephone"
        label="手机号码"
        min-width="130">
      </el-table-column>
      <el-table-column
        label="成交状态"
        min-width="90">
        <template slot-scope="scope">{{ownStatus[scope.row.ownStatus]}}</template>
      </el-table-column>
      <el-table-column
        prop="auctionName"
        label="物品名称"
        min-width="150">
      </el-table-column>
      <el-table-column
        label="物流状态"
        min-width="80">
        <template slot-scope="scope">{{logisticsStatus[scope.row.logisticsStatus]}}</template>
      </el-table-column>
      <el-table-column
        prop="joinCount"
        label="出价次数"
        min-width="80">
      </el-table-column>
      <el-table-column
        prop="ownHighPrice"
        label="成交价"
        min-width="80">
      </el-table-column>
      <el-table-column prop="imgUrl" label="物品图片" align="center" min-width="100">
        <template slot-scope="scope">
          <img :src="scope.row.imgUrl" class="gradeImg" v-if="scope.row.imgUrl" @click="alertBigImg(scope.row.imgUrl)">
        </template>
      </el-table-column>
      <el-table-column prop="detailImgUrl" label="详情图片" align="center" min-width="100">
        <template slot-scope="scope">
          <img :src="scope.row.detailImgUrl" class="gradeImg" v-if="scope.row.detailImgUrl" @click="alertBigImg(scope.row.detailImgUrl)">
        </template>
      </el-table-column>
      <el-table-column
        label="竞拍状态"
        min-width="80">
        <template slot-scope="scope">{{auctionStatus[scope.row.auctionStatus]}}</template>
      </el-table-column>
      <el-table-column
        label="物品状态"
        min-width="80">
        <template slot-scope="scope">{{status[scope.row.status]}}</template>
      </el-table-column>
      <el-table-column
        prop="startPrice"
        label="起拍价"
        min-width="80">
      </el-table-column>
      <el-table-column
        prop="auctionPrice"
        label="当前价"
        min-width="80">
      </el-table-column>
      <el-table-column
        prop="auctionNum"
        label="竞拍数量"
        min-width="80">
      </el-table-column>
      <!-- <el-table-column
        prop="priceDesc"
        label="当前价描述"
        min-width="120">
      </el-table-column> -->
      <el-table-column
        prop="risesRange"
        label="最多加价"
        min-width="100">
      </el-table-column>
      <el-table-column
        prop="maxOfferCount"
        label="可出价次数"
        min-width="120">
      </el-table-column>
      <el-table-column
        prop="auctionCount"
        label="参与次数"
        min-width="100">
      </el-table-column>
      <el-table-column
        prop="endTime"
        label="截止竞拍时间"
        min-width="180">
      </el-table-column>
      <el-table-column
        label="操作"
        min-width="120">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="editHandle(scope.row)">编辑物流信息</el-button>
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
    <auction-edit v-model="editShow" :custData="custData"  :logisticsStatus="logisticsStatus" @change="editChange"/>
    <div class="alertImg-wrap" v-if="isBigImg" @click="isBigImg = false">
      <div class="content">
        <img :src="bigImgUrl" alt="" class="big-img">
      </div>
    </div>
  </div>
</template>

<script>
import AuctionEdit from '@/components/xj/XjAuctionDetailEdit'
export default {
  name: 'xj-auctionDetail',
  data () {
    // let {today} = this.$searchDate()
    // 缓存查询条件
    let store = this.$getStore('xjAuctionDetail')
    return {
      tableData: [],
      totalRecord: 1,
      custData: {},
      addShow: false,
      editShow: false,
      isBigImg: false,
      bigImgUrl: '',
      searchForm: {
        startDate: '',
        endDate: '',
        telephone: '',
        inviteCode: '',
        logisticsStatus: store['logisticsStatus'] || '',
        auctionName: store['auctionName'] || '',
        status: store['status'] || '',
        auctionStatus: store['auctionStatus'] || '',
        auctionUnit: store['auctionUnit'] || '',
        currentPage: store['currentPage'] || 1
      },
      // 状态
      status: {
        0: '下架',
        1: '上架'
      },
      // 状态
      ownStatus: {
        1: '暂时竞得',
        2: '立即领取',
        3: '已领取',
        4: '未竞得'
      },
      auctionStatus: {
        0: '敬请期待',
        1: '未开拍',
        2: '进行中',
        3: '已结束'
      },
      // 物流状态
      logisticsStatus: {
        1: '待发货',
        2: '待收货',
        3: '已收货',
        4: '换货',
        5: '交易结束'
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
    // 海报图放大处理
    alertBigImg (url) {
      this.bigImgUrl = url
      this.isBigImg = true
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
    // 查询
    searchHandle () {
      this.tableData = []
      // 缓存查询条件
      this.$setStore('xjAuctionDetail', this.searchForm)
      this.$ajax({
        url: '/store/account/xj/xjAuction/queryAuctionDetail',
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
    AuctionEdit
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