<template>
  <div class="content-box">
    <div class="header__title">竞拍换货列表</div>
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
        <el-form-item label="邀请码:">
          <el-input
            class="kf-search-input"
            v-model="searchForm.inviteCode"
            placeholder="邀请码">
          </el-input>
        </el-form-item>
        <el-form-item label="物品名称:">
          <el-input
            class="kf-search-input"
            v-model="searchForm.auctionName"
            placeholder="物品名称">
          </el-input>
        </el-form-item>
        <el-form-item label="物流单号:">
          <el-input
            class="kf-search-input"
            v-model="searchForm.expressNo"
            placeholder="物流单号">
          </el-input>
        </el-form-item>
        <el-form-item label="快递公司:">
          <el-input
            class="kf-search-input"
            v-model="searchForm.logisticsName"
            placeholder="快递公司">
          </el-input>
        </el-form-item>
        <el-form-item label="审核人:">
          <el-input
            class="kf-search-input"
            v-model="searchForm.auditBy"
            placeholder="审核人">
          </el-input>
        </el-form-item>
        <el-form-item label="换货状态:">
          <el-select
            v-model="searchForm.status"
            clearable
            placeholder="请选择换货状态">
            <el-option
              v-for="val,key,index in status"
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
        prop="exchangeId"
        label="换货序号"
        min-width="80">
      </el-table-column>
      <el-table-column
        prop="nickName"
        label="显示名"
        min-width="100">
      </el-table-column>
      <el-table-column
        prop="custTelephone"
        label="手机号码"
        min-width="130">
      </el-table-column>
      <el-table-column
        prop="auctionName"
        label="物品名称"
        min-width="100">
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
        label="换货状态"
        min-width="100">
        <template slot-scope="scope">{{status[scope.row.status]}}</template>
      </el-table-column>
      <el-table-column
        prop="expressNo"
        label="快递单号"
        min-width="100">
      </el-table-column>
      <el-table-column
        prop="logisticsName"
        label="物流公司"
        min-width="100">
      </el-table-column>
      <el-table-column
        prop="auditBy"
        label="审核人"
        min-width="150">
      </el-table-column>
      <el-table-column
        prop="auditTime"
        label="审核时间"
        min-width="160">
      </el-table-column>
       <el-table-column
        prop="createTime"
        label="创建时间"
        min-width="160">
      </el-table-column>
      <el-table-column
        label="操作"
        min-width="120">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="editHandle(scope.row)">审核</el-button>
          <el-button type="text" class="table__danger" size="small" @click="deleteHandle(scope.row.exchangeId)">删除</el-button>
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
    <xjExchange-audit v-model="editShow" :custData="custData" @change="editChange" :status="status"> </xjExchange-audit>
  </div>
</template>

<script>
import XjExchangeAudit from '@/components/xj/XjExchangeAudit'
export default {
  name: 'xjExchange',
  data () {
    let {today} = this.$searchDate()
    // 缓存查询条件
    let store = this.$getStore('xjExchange')
    return {
      tableData: [],
      totalRecord: 1,
      custData: {},
      editShow: false,
      isBigImg: false,
      bigImgUrl: '',
      searchForm: {
        startDate: '' || today,
        endDate: '',
        nickNameAndTel: store['nickNameAndTel'] || '',
        inviteCode: store['inviteCode'] || '',
        auctionName: store['auctionName'] || '',
        expressNo: store['expressNo'] || '',
        logisticsName: store['logisticsName'] || '',
        auditBy: store['auditBy'] || '',
        status: store['status'] || '',
        currentPage: store['currentPage'] || 1
      },
      // 反馈状态
      status: {
        0: '未审核',
        1: '待审核',
        2: '已审核',
        3: '商品已寄回',
        4: '商品已发货',
        5: '换货成功',
        6: '换货失败'
      },
      // 海报图放大处理
      alertBigImg (url) {
        this.bigImgUrl = url
        this.isBigImg = true
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
    // 删除
    deleteHandle (exchangeId) {
      this.$alert('您是否确定删除该条记录?', '提示', {
        type: 'warning',
        customClass: 'msg-delete__dialog',
        showCancelButton: true,
        callback: action => {
          if (action === 'confirm') {
            this.$ajax({
              url: '/store/account/xj/xjExchange/deleteExcGoods',
              data: {
                exchangeId
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
      this.$setStore('xjExchange', this.searchForm, ['startDate', 'endDate'])
      this.$ajax({
        url: '/store/account/xj/xjExchange/queryExcGoodsList',
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
    XjExchangeAudit
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