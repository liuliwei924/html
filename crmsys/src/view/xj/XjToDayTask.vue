<template>
  <div class="content-box">
    <div class="header__title">今日任务记录</div>
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
        <el-form-item label="审核状态:">
          <el-select
            v-model="searchForm.auditStatus"
            clearable
            placeholder="请选择审核状态">
            <el-option
              v-for="val,key,index in auditStatus"
              :label="val"
              :value="Number(key)"
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
        <el-form-item label="邀请码:">
          <el-input
            class="kf-search-input"
            v-model="searchForm.inviteCode"
            placeholder="邀请码">
          </el-input>
        </el-form-item>
        <el-button @click="searchHandle">查询</el-button>
        <el-button @click="resetForm('searchForm')">重置</el-button>
        <el-button icon="plus" @click="auditHandle()">审核通过</el-button>
      </el-form>
    </div>
    <el-table class="content__table" :data="tableData" border @selection-change="selectChange">
      <el-table-column
        type="selection"
        fixed="left"
        width="55">
      </el-table-column>
      <el-table-column
        prop="recordId"
        label="记录编号"
        min-width="50">
      </el-table-column>
      <el-table-column
        prop="nickName"
        label="用户昵称"
        min-width="80">
      </el-table-column>
      <el-table-column
        prop="inviteCode"
        label="邀请码"
        min-width="80">
      </el-table-column>
      <el-table-column
        prop="recordDate"
        label="记录时间"
        min-width="80">
      </el-table-column>
      <!-- <el-table-column
        prop="customerId"
        label="用户编号"
        min-width="80">
      </el-table-column> -->
      <el-table-column
        prop="taskName"
        label="任务名称"
        min-width="100">
      </el-table-column>
      <el-table-column prop="imgUrl" label="活动截图" align="center" min-width="100">
        <template slot-scope="scope">
          <img :src="scope.row.screenImg" class="gradeImg" v-if="scope.row.screenImg" @click="alertBigImg(scope.row.screenImg)">
        </template>
      </el-table-column>
      <el-table-column
        label="审核状态"
        min-width="80">
        <template slot-scope="scope">{{auditStatus[scope.row.auditStatus]}}</template>
      </el-table-column>
      <el-table-column
        prop="createTime"
        label="创建时间"
        min-width="130">
      </el-table-column>
    </el-table>
    <el-pagination
      class="content__page fr"
      @current-change="pageHandle"
      :current-page="searchForm.currentPage"
      layout="total, prev, pager, next"
      :total="totalRecord">
    </el-pagination>
    <xjToDayTask-audit v-model="auditShow" :ids="ids" @change="auditChange" />
    <div class="alertImg-wrap" v-if="isBigImg" @click="isBigImg = false">
      <div class="content">
        <img :src="bigImgUrl" alt="" class="big-img">
      </div>
    </div>
  </div>
</template>

<script>
import XjToDayTaskAudit from '@/components/xj/XjToDayTaskAudit'
export default {
  name: 'xj-toDayTask',
  data () {
    let {today} = this.$searchDate()
    // 缓存查询条件
    let store = this.$getStore('xjToDayTask')
    return {
      tableData: [],
      totalRecord: 1,
      ids: [],
      recordIds: [],
      custData: {},
      auditShow: false,
      isBigImg: false,
      bigImgUrl: '',
      searchForm: {
        startDate: '' || today,
        endDate: '',
        taskName: store['taskName'] || '',
        auditStatus: store['auditStatus'] || 0,
        nickNameAndTel: store['nickNameAndTel'] || '',
        inviteCode: store['inviteCode'] || '',
        currentPage: store['currentPage'] || 1
      },
      // 状态
      auditStatus: {
        0: '审核中',
        1: '审核通过',
        2: '审核失败'
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
     // table表格选择
    selectChange (arr) {
      let ids = []
      let recordIds = []
      for (let i = 0; i < arr.length; i++) {
        ids.push(arr[i]['recordId'])
        recordIds.push(arr[i]['recordId'])
      }
      this.ids = ids
      this.recordIds = recordIds
    },
    // 审核
    auditHandle (row) {
      if (this.ids.length === 0) {
        this.$msg('请先选择要操作的记录！')
        return
      }
      this.auditShow = true
    },
    // 审核弹窗监听
    auditChange (val) {
      if (val === 'search') {
        this.searchHandle()
        this.auditShow = false
      } else {
        this.auditShow = val
      }
    },
    // 查询
    searchHandle () {
      this.tableData = []
      // 缓存查询条件
      this.$setStore('xjToDayTask', this.searchForm)
      this.$ajax({
        url: '/store/account/xj/xjToDayTask/queryToDayTaskList',
        data: this.searchForm,
        success: data => {
          this.tableData = data.rows || []
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
  },
  components: {
    XjToDayTaskAudit
  }
}
</script>

<style lang="less">
.gradeImg {
    width: 200px;
    height: 300px;
    padding: 0px 0 0 0px;
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