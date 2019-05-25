<template>
  <div class="content-box">
    <div class="header__title">讲师评价记录</div>
    <div class="header__search clearfix">
      <el-form :model="searchForm" ref="searchForm">
        <!-- 查询条件 -->
        <el-form-item label="讲师姓名或手机号" prop="userName">
          <el-input v-model="searchForm.userName" placeholder="请输入讲师姓名或手机号"></el-input>
        </el-form-item>
        <el-form-item label="星级类型" prop="star">
          <el-select v-model="searchForm.star" clearable placeholder="请选择星级">
            <el-option label="1星" value="1"></el-option>
            <el-option label="2星" value="2"></el-option>
            <el-option label="3星" value="3"></el-option>
            <el-option label="4星" value="4"></el-option>
            <el-option label="5星" value="5"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item  label="开始时间">
          <el-date-picker
            v-model="startTime"
            type="datetime"
            :editable="true"
            placeholder="开始时间"
            @change="startTimeHandle($event)"
            class="kf-search-date">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="结束时间">
          <el-date-picker
            v-model="endTime"
            type="datetime"
            :editable="true"
            placeholder="结束时间"
            @change="endTimeHandle($event)"
            :picker-options="endTimeOptions"
            class="kf-search-date">
          </el-date-picker>
        </el-form-item>
        <el-button :loading="loading" @click="searchHandle">查询</el-button>
        <el-button @click="resetForm('searchForm')">重置</el-button>
      </el-form>
    </div>

    <el-table class="content__table"
     :data="tableData"
     @sort-change="sortEvent"
      border>
      <el-table-column
        prop="userName"
        label="用户姓名" align="center">
      </el-table-column>
      <el-table-column
        prop="telephone"
        label="用户手机号" align="center">
      </el-table-column>
      <el-table-column
        prop="workNo"
        sortable
        label="用户工号" align="center">
      </el-table-column>
      <el-table-column prop="grade" sortable label="用户等级" align="center">
        <template slot-scope="scope">
          <span v-if ="scope.row.grade=== 1">实习专员</span>
          <span v-if ="scope.row.grade=== 2">专员</span>
          <span v-if ="scope.row.grade=== 3">经理</span>
          <span v-if ="scope.row.grade=== 4">行长</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="trainerName"
        label="讲师姓名" align="center">
      </el-table-column>
      <el-table-column prop="star" sortable label="星级" align="center">
        <template slot-scope="scope">
          <span v-if ="scope.row.star==='1'">1星</span>
          <span v-if ="scope.row.star==='2'">2星</span>
          <span v-if ="scope.row.star==='3'">3星</span>
          <span v-if ="scope.row.star==='4'">4星</span>
          <span v-if ="scope.row.star==='5'">5星</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="opinion"
        label="意见" align="center">
      </el-table-column>
      <el-table-column prop="image1 />" label="图片1" align="center">
        <template slot-scope="scope">
          <img :src="scope.row.image1" class="gradeImg" v-if="scope.row.image1" @click="alertBigImg(scope.row.image1)">
        </template>
      </el-table-column>
      <el-table-column prop="image2 />" label="图片2" align="center">
        <template slot-scope="scope">
          <img :src="scope.row.image2" class="gradeImg" v-if="scope.row.image2" @click="alertBigImg(scope.row.image2)">
        </template>
      </el-table-column>
      <el-table-column prop="image3 />" label="图片3" align="center">
        <template slot-scope="scope">
          <img :src="scope.row.image3" class="gradeImg" v-if="scope.row.image3" @click="alertBigImg(scope.row.image3)">
        </template>
      </el-table-column>
      <el-table-column
        prop="createTime"
        label="评价时间" sortable align="center">
      </el-table-column>
    </el-table>
    <el-pagination
      class="content__page fr"
      @current-change="pageHandle"
      :current-page="currentPage"
      layout="total, prev, pager, next"
      :total="totalRecord">
    </el-pagination>
    <div class="alertImg-wrap" v-if="isBigImg" @click="isBigImg = false">
    <div class="content">
      <img :src="bigImgUrl" alt="" class="big-img">
    </div>
  </div>
  </div>
</template>

<script>
let d = new Date()
let msec = ((d.getHours() * 3600) + (d.getMinutes() * 60) + d.getSeconds()) * 1000
let date = new Date(Date.now() - 7 * 8.64e7 - msec)
export default {
  name: 'rechargeData',
  data () {
    return {
      tableData: [],
      currentPage: 1,
      totalRecord: 1,
      rechargeData: {},
      addShow: false,
      editShow: false,
      isBigImg: false,
      bigImgUrl: '',
      searchForm: {
        orderBy: 'createTime',
        orderValue: 'desc',
        userName: '',
        star: '',
        startTime: '',
        endTime: '',
        currentPage: 1
      },
      endTimeOptions: '',
      startTime: date,
      endTime: d
    }
  },
  created () {
    this.searchHandle()
  },
  methods: {
    alertBigImg (url) {
      this.bigImgUrl = url
      this.isBigImg = true
    },
    startTimeHandle (start) {
      // 开始时间选择
      this.searchForm.startTime = start || ''
      this.endTimeOptions = {
        disabledDate (time) {
          return time.getTime() < new Date(start).getTime() - 8.64e7
        }
      }
    },
    endTimeHandle (end) {
      // 结束时间处理
      this.searchForm.endTime = end || ''
    },
    sortEvent (column) {
      if (column.prop === null) {
        if (this.searchForm.hasOwnProperty('orderBy')) { delete this.searchForm['orderBy'] }
        if (this.searchForm.hasOwnProperty('orderValue')) { delete this.searchForm['orderValue'] }
      } else {
        this.searchForm.orderBy = column.prop
        this.searchForm.orderValue = column.order === 'ascending' ? 'asc' : 'desc'
      }
      this.searchHandle()
    },
    // 查询
    searchHandle () {
      this.$ajax({
        url: '/store/account/fx/fxEval/evalData',
        data: this.searchForm,
        loading: true,
        success: data => {
          this.tableData = data.rows || []
          this.tableData.forEach((item, index) => {
            item.index = 10 * (this.currentPage - 1) + index + 1
          })
          this.totalRecord = data.page.totalRecords
        }
      })
    },
    resetForm (formName) {
      this.$refs[formName].resetFields()
    },
    // 分页
    pageHandle (page) {
      this.searchForm.currentPage = page
      this.searchHandle()
    }
  }
}
</script>

<style>
  .gradeImg {
    width: 64px;
    height: 64px;
    padding: 10px 0;
    display: block;
  }
</style>
<style lang="less">
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
.exam-w{
  float: left;
  width:350px;
  border: 1px solid #dcdcdc;
  margin: 20px;
  position: relative;
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
}
</style>
