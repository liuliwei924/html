<template>
  <div class="content-box">
    <div class="header__title">讲师评价记录</div>
    <div class="header__search clearfix">
      <el-form :model="searchForm" ref="searchForm">
        <!-- 查询条件 -->
        <el-form-item label="讲师姓名或手机号" prop="userName">
          <el-input v-model="searchForm.userName" placeholder="请输入讲师姓名或手机号"></el-input>
        </el-form-item>
        <el-form-item  label="开始时间">
          <el-date-picker
            v-model="startDate"
            type="datetime"
            :editable="true"
            placeholder="开始时间"
            @change="startDateHandle($event)"
            class="kf-search-date">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="结束时间">
          <el-date-picker
            v-model="endDate"
            type="datetime"
            :editable="true"
            placeholder="结束时间"
            @change="endDateHandle($event)"
            :picker-options="endDateOptions"
            class="kf-search-date">
          </el-date-picker>
        </el-form-item>
        <el-button :loading="loading" @click="searchHandle">查询</el-button>
        <el-button @click="excelExportHandle">导出</el-button>
      </el-form>
    </div>

    <el-table class="content__table" :data="tableData" border>
      <el-table-column
        prop="userName"
        label="讲师姓名" align="center">
      </el-table-column>
      <el-table-column
        prop="telephone"
        label="手机号" align="center">
      </el-table-column>
      <el-table-column
        prop="workNo"
        label="工号" align="center">
      </el-table-column>
      <el-table-column prop="grade" label="级别" align="center">
        <template slot-scope="scope">
          <span v-if ="scope.row.grade=== 1">实习专员</span>
          <span v-if ="scope.row.grade=== 2">专员</span>
          <span v-if ="scope.row.grade=== 3">经理</span>
          <span v-if ="scope.row.grade=== 4">行长</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="monthDate"
        label="月份" align="center">
      </el-table-column>
      <el-table-column
        prop="nuclearCardNum"
        label="总核卡数" align="center">
      </el-table-column>
      <el-table-column
        prop="totalLockNum"
        label="总锁粉数" align="center">
      </el-table-column>
    </el-table>
    <el-pagination
      class="content__page fr"
      @current-change="pageHandle"
      :current-page="currentPage"
      layout="total, prev, pager, next"
      :total="totalRecord">
    </el-pagination>
    <form :action="excelExportPath" method="post" id="JS-form-export" target="_blank" style="display:none">
        <input type="text" name="exportParams" v-model="exportParams">
        <input type="text" name="exportTitles" v-model="exportTitles">
        <input type="text" name="signId" v-model="signId">
        <input type="text" name="exportType" value="fxCust">
    </form>
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
      excelExportPath: this.$baseURL + 'store/account/fx/fxDataCount/trainingFeeExport',
      searchForm: {
        userName: '',
        star: '',
        startDate: '',
        endDate: '',
        currentPage: 1
      },
      endDateOptions: '',
      startDate: date,
      endDate: d
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
    startDateHandle (start) {
      // 开始时间选择
      this.searchForm.startDate = start || ''
      this.endDateOptions = {
        disabledDate (time) {
          return time.getTime() < new Date(start).getTime() - 8.64e7
        }
      }
    },
    endDateHandle (end) {
      // 结束时间处理
      this.searchForm.endDate = end || ''
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
    // Excel导出弹框
    excelExportHandle () {
      this.$alert('您是否确定导出数据?', '提示', {
        type: 'warning',
        customClass: 'msg-delete__dialog',
        showCancelButton: true,
        callback: action => {
          if (action === 'confirm') {
            let totalRecord = this.totalRecord
            if (totalRecord > 1000) {
              this.$msg('一次最多导出1000条数据，请重新查询或限制条数!')
              return
            }
            let params = {}
            let roleType = this.$localStorage('userRole')
            Object.assign(params, this.searchForm, {
              roleType
            })
            this.exportParams = JSON.stringify(params)
            let signId = JSON.parse(this.$localStorage('signId')).v
            this.signId = signId
            let title = [
              {'name': 'realName', 'title': '讲师姓名'},
              {'name': 'telephone', 'title': '手机号码'},
              {'name': 'gradeName', 'title': '用户等级'},
              {'name': 'monthDate', 'title': '月份'},
              {'name': 'nuclearCardNum', 'title': '核卡总数'},
              {'name': 'totalLockNum', 'title': '锁粉总数'}
            ]
            this.exportTitles = JSON.stringify(title)
            let formDom = document.getElementById('JS-form-export')
            window.setTimeout(function () {
              formDom.submit()
            }, 100)
          }
        }
      })
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
