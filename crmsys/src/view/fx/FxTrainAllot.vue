  <template>
    <div class="content-box">
      <div class="header__title">客户分配</div>
      <div class="header__search clearfix">
        <el-form :model="searchForm" ref="searchForm">
          <!-- 查询条件 -->
          <el-form-item label="工号" prop="workNo">
            <el-input v-model="searchForm.workNo" placeholder="请输入工号"></el-input>
          </el-form-item>
          <el-form-item label="姓名/手机" prop="realName">
            <el-input v-model="searchForm.realName" placeholder="姓名/手机号"></el-input>
          </el-form-item>
          <el-form-item label="等级" prop="grade">
          <el-select v-model="searchForm.grade" clearable placeholder="等级">
            <el-option label="实习专员" value="1"></el-option>
            <el-option label="专员 " value="2"></el-option>
            <el-option label="经理" value="3"></el-option>
            <el-option label="行长" value="4"></el-option>
          </el-select>
          </el-form-item>
          <el-form-item label="是否已联系" prop="contactFlag">
            <el-select v-model="searchForm.contactFlag" clearable placeholder="是否已联系">
              <el-option label="未联系" value="0"></el-option>
              <el-option label="已联系" value="1"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="是否参加培训" prop="joinFlag">
            <el-select v-model="searchForm.joinFlag" clearable placeholder="是否参加培训">
              <el-option label="未参加" value="0"></el-option>
              <el-option label="已参加" value="1"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="锁粉数" prop="lockNums">
            <el-input v-model="searchForm.lockNums" placeholder="请输入锁粉数"></el-input>
          </el-form-item>
          <el-form-item label="核卡数" prop="succNums">
            <el-input v-model="searchForm.succNums" placeholder="请输入核卡数"></el-input>
          </el-form-item>
          <el-form-item label="分配日期-起:" prop="allotStartTime">
            <el-date-picker
              v-model="searchForm.allotStartTime"
              type="date"
              editable
              :picker-options="startDateOptions"
              @change="startDateChange"
              placeholder="开始日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="分配日期-止:" prop="allotEndTime">
            <el-date-picker
              v-model="searchForm.allotEndTime"
              type="date"
              editable
              :picker-options="endDateOptions"
              @change="endDateChange"
              placeholder="结束日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="短信发送日期-起:" prop="sendStartTime">
            <el-date-picker
              v-model="searchForm.sendStartTime"
              type="date"
              editable
              :picker-options="startDateOptions"
              @change="sendStartChange"
              placeholder="开始日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="短信发送日期-止:" prop="sendEndTime">
            <el-date-picker
              v-model="searchForm.sendEndTime"
              type="date"
              editable
              :picker-options="endDateOptions"
              @change="sendEndChange"
              placeholder="结束日期">
            </el-date-picker>
          </el-form-item>
          <el-button :loading="loading" @click="searchHandle">查询</el-button>
          <el-button @click="resetForm('searchForm')">重置</el-button>
          <!-- <el-button :loading="loading" @click="sendSms">发送短信</el-button> -->
          <el-button @click="excelExportHandle">导出</el-button>
        </el-form>
      </div>
      <el-table class="content__table" :data="tableData" 
        border 
        @selection-change="selectChange"
        @sort-change="sortEvent">
      <el-table-column
        type="selection"
        fixed="left"
        width="55">
      </el-table-column>
      <el-table-column prop="workNo" label="工号" align="center" min-width="50">
      </el-table-column>
      <el-table-column prop="realName" label="姓名" align="center" min-width="50">
      </el-table-column>
      <el-table-column prop="telephone" label="手机号" align="center" min-width="60">
      </el-table-column>
      <el-table-column prop="gradeName" label="等级" align="center" min-width="60">
      </el-table-column>
      <el-table-column prop="trainerName" label="讲师姓名" align="center" min-width="50">
      </el-table-column>
      <el-table-column prop="lockNums" label="锁粉数" 
        align="center" 
        min-width="50"
        sortable
        :render-header="(h, options) => {
        return renderHeader(h, options, '锁粉数')}">
      </el-table-column>
      <el-table-column prop="succNums" label="核卡数" 
        align="center"
        min-width="50"
        sortable
        :render-header="(h, options) => {
        return renderHeader(h, options, '核卡数')}">
      </el-table-column>
      <el-table-column prop="contactFlag" label="是否已联系" align="center">
          <template slot-scope="scope">
            <el-tag v-if ="scope.row.contactFlag===0" type="primary">未联系</el-tag>
            <el-tag v-if ="scope.row.contactFlag===1" type="success">已联系</el-tag>
          </template>
      </el-table-column>
      <el-table-column prop="joinFlag" label="是否参加培训" align="center">
          <template slot-scope="scope">
            <el-tag v-if ="scope.row.joinFlag===0" type="primary">未参加</el-tag>
            <el-tag v-if ="scope.row.joinFlag===1" type="success">已参加</el-tag>
          </template>
      </el-table-column>
      <el-table-column prop="allotTime" label="分配时间" align="center">
      </el-table-column>
      <el-table-column prop="sendTime" label="短信发送时间" align="center">
      </el-table-column>
      <el-table-column prop="joinTime" label="参加培训时间" align="center">
      </el-table-column>
    </el-table>
      <el-pagination class="content__page fr" @current-change="pageHandle" :current-page="currentPage" layout="total, prev, pager, next" :total="totalRecord">
      </el-pagination>
      <form :action="excelExportPath" method="post" id="JS-form-export" target="_blank" style="display:none">
        <input type="text" name="exportParams" v-model="exportParams">
        <input type="text" name="exportTitles" v-model="exportTitles">
        <input type="text" name="signId" v-model="signId">
        <input type="text" name="exportType" value="fxTrain">
      </form>
    </div>
  </template>


<script>
export default {
  name: 'reward-data',
  data () {
    let signId = JSON.parse(this.$localStorage('signId')).v
    return {
      tableData: [],
      currentPage: 1,
      totalRecord: 1,
      allotIds: [],
      searchForm: {
        workNo: '',
        realName: '',
        grade: '',
        contactFlag: '',
        joinFlag: '',
        lockNums: '',
        succNums: '',
        allotStartTime: '',
        allotEndTime: '',
        currentPage: 1
      },
      signId: '',
      exportParams: '',
      exportTitles: '',
      excelExportPath: this.$baseURL + 'store/account/fx/fxDataCount/fxDataExport',
      excelForm: {
        signId: signId
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
      },
      loading: false,
      addShow: false,
      editShow: false
    }
  },
  created () {
    this.searchHandle()
  },
  methods: {
    // 分配时间处理
    startDateChange (date) {
      this.searchForm.allotStartTime = date || ''
      this.searchForm.allotEndTime = ''
      this.endDateOptions.disabledDate = time => {
        return time.getTime() < new Date(date).getTime() - 8.64e7
      }
    },
    endDateChange (date) {
      this.searchForm.allotEndTime = date || ''
    },
    // 短信发送时间
    sendStartChange (date) {
      this.searchForm.sendStartTime = date || ''
      this.searchForm.sendEndTime = ''
      this.endDateOptions.disabledDate = time => {
        return time.getTime() < new Date(date).getTime() - 8.64e7
      }
    },
    sendEndChange (date) {
      this.searchForm.sendStartTime = date || ''
    },
    // 排序值
    sortEvent (column) {
      if (column.prop === null) {
        if (this.searchForm.hasOwnProperty('orderBy')) { delete this.searchForm['orderBy'] }
        if (this.searchForm.hasOwnProperty('orderValue')) { delete this.searchForm['orderValue'] }
      } else {
        this.searchForm.orderBy = column.prop
        this.searchForm.orderValue = column.order === 'ascending' ? 'ASC' : 'DESC'
      }
      this.searchHandle()
    },
    renderHeader (h, options, text) {
      let label = options.column.label
      return h('el-tooltip', {props: {content: text, placement: 'top'}}, [h('span', label)])
    },
    // table表格选择
    selectChange (arr) {
      let allotIds = []
      for (let i = 0; i < arr.length; i++) {
        allotIds.push(arr[i]['allotId'])
      }
      this.allotIds = allotIds
    },
    // // 发送短信
    // sendSms () {
    //   if (this.allotIds.length === 0) {
    //     this.$msg('请先选择要发送的记录！')
    //     return
    //   }
    //   let params = {}
    //   let allotIds = ''
    //   for (let i = 0; i < this.allotIds.length; i++) {
    //     allotIds += this.allotIds[i] + ','
    //   }
    //   params.allotIds = allotIds
    //   this.$ajax({
    //     url: '/store/account/fx/fxTrainAllot/sendSms',
    //     data: params,
    //     loading: true,
    //     success: data => {
    //       this.searchHandle()
    //     }
    //   })
    // },
    // 查询
    searchHandle () {
      this.$ajax({
        url: '/store/account/fx/fxTrainAllot/queryAllotList',
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
              {'name': 'realName', 'title': '姓名'},
              {'name': 'telephone', 'title': '手机号'},
              {'name': 'contactFlagName', 'title': '是否已联系'},
              {'name': 'joinFlagName', 'title': '是否参加培训'}
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
