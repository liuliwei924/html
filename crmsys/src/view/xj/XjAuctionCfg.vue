<template>
  <div class="content-box">
    <div class="header__title">竞拍物品配置</div>
    <div class="header__search clearfix">
      <el-form :model="searchForm">
        <el-form-item label="竞拍日期-起:">
          <el-date-picker
            v-model="searchForm.startDate"
            type="date"
            editable
            :picker-options="startDateOptions"
            @change="startDateChange"
            placeholder="开始日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="竞拍日期-止:">
          <el-date-picker
            v-model="searchForm.endDate"
            type="date"
            editable
            :picker-options="endDateOptions"
            @change="endDateChange"
            placeholder="结束日期">
          </el-date-picker>
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
        <el-form-item label="单位:">
          <el-select
            v-model="searchForm.auctionUnit"
            clearable
            placeholder="请选择单位">
            <el-option
              v-for="val,key,index in auctionUnit"
              :label="val"
              :value="Number(key)"
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
        prop="auctionId"
        label="竞拍编号"
        min-width="80">
      </el-table-column>
      <el-table-column
        prop="auctionName"
        label="物品名称"
        min-width="150">
      </el-table-column>
      <el-table-column
        prop="inventoryId"
        label="库存ID"
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
      <el-table-column
        prop="priceDesc"
        label="当前价描述"
        min-width="120">
      </el-table-column>
      <el-table-column
        label="单位"
        min-width="100">
        <template slot-scope="scope">{{auctionUnit[scope.row.auctionUnit]}}</template>
      </el-table-column>
      <el-table-column
        prop="risesRange"
        label="最多加价"
        min-width="100">
      </el-table-column>
       <el-table-column
        label="竞拍状态"
        min-width="100">
        <template slot-scope="scope">{{auctionStatus[scope.row.auctionStatus]}}</template>
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
        prop="preheatTime"
        label="距离开拍时间"
        min-width="180">
      </el-table-column>
      <el-table-column
        prop="preheatHour"
        label="预热小时"
        min-width="100">
      </el-table-column>
      <el-table-column
        prop="startTime"
        label="开拍竞拍时间"
        min-width="180">
      </el-table-column>
      <el-table-column
        prop="continuedHour"
        label="持续小时"
        min-width="100">
      </el-table-column>
      <el-table-column
        prop="endTime"
        label="截止竞拍时间"
        min-width="180">
      </el-table-column>
      <el-table-column
        label="物品状态"
        min-width="100">
        <template slot-scope="scope">{{status[scope.row.status]}}</template>
      </el-table-column>
      <el-table-column
        label="核算状态"
        min-width="100">
        <template slot-scope="scope">{{checkStatus[scope.row.checkStatus]}}</template>
      </el-table-column>
      <el-table-column
        prop="createTime"
        label="创建时间"
        min-width="180">
      </el-table-column>
      <el-table-column
        label="操作"
        min-width="120">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="editHandle(scope.row)">编辑</el-button>
           <el-button type="text" class="table__danger" size="small" @click="deleteHandle(scope.row.auctionId)">删除</el-button>
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
    <xjAuction-add v-model="addShow" @change="addChange" :status="status" :auctionUnit="auctionUnit" :auctionStatus="auctionStatus"/>
    <xjAuction-edit v-model="editShow" :custData="custData" @change="editChange" :status="status" :auctionUnit="auctionUnit" :auctionStatus="auctionStatus"/>
    <div class="alertImg-wrap" v-if="isBigImg" @click="isBigImg = false">
      <div class="content">
        <img :src="bigImgUrl" alt="" class="big-img">
      </div>
    </div>
  </div>
</template>

<script>
import XjAuctionAdd from '@/components/xj/XjAuctionAdd'
import XjAuctionEdit from '@/components/xj/XjAuctionEdit'
export default {
  name: 'xj-auctionCfg',
  data () {
    let {today} = this.$searchDate()
    // 缓存查询条件
    let store = this.$getStore('xjAuctionCfg')
    return {
      tableData: [],
      totalRecord: 1,
      custData: {},
      addShow: false,
      editShow: false,
      isBigImg: false,
      bigImgUrl: '',
      searchForm: {
        startDate: '' || today,
        endDate: '',
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
      // 核算状态
      checkStatus: {
        0: '未核算',
        1: '已核算'
      },
      // 状态
      auctionStatus: {
        0: '进行中',
        1: '未开拍',
        2: '敬请期待',
        3: '已结束'
      },
      // 单位
      auctionUnit: {
        0: '天狗币',
        1: '其他'
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
          return time.getTime() < Date.now()
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
    deleteHandle (auctionId) {
      this.$alert('您是否确定删除该条记录?', '提示', {
        type: 'warning',
        customClass: 'msg-delete__dialog',
        showCancelButton: true,
        callback: action => {
          if (action === 'confirm') {
            this.$ajax({
              url: '/store/account/xj/xjAuctionCfg/deleteAuctionInfo',
              data: {
                auctionId
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
      this.$setStore('xjAuctionCfg', this.searchForm)
      this.$ajax({
        url: '/store/account/xj/xjAuctionCfg/queryAuctionList',
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
    XjAuctionAdd,
    XjAuctionEdit
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