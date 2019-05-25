<template>
  <div class="content-box">
    <div class="header__title">团队配置</div>
    <div class="kf-box">
      <el-form :inline="true" :model="searchForm" class="header__search clearfix">
        <el-form-item>
          <el-input v-model="searchForm.likeName" placeholder="请输入团队名称"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button class="kf-btn" @click="search(1)">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button  @click="addHandle">添加</el-button>
        </el-form-item>
      </el-form>
      <el-table class="content__table"
        :data="tableData"
        style="width: 100%">
        <el-table-column
          width="120"
          prop="teamNo"
          label="团队编号">
        </el-table-column>
        <el-table-column
          min-width="120"
          prop="teamName"
          label="团队名称">
        </el-table-column>
        <el-table-column
          min-width="180"
          prop="createTime"
          label="创建时间">
        </el-table-column>
        <el-table-column
          min-width="180"
          prop="updateTime"
          label="修改时间">
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          min-width="150">
          <template slot-scope="scope">
            <el-button @click="editHandle(scope.row)" type="text" size="small" v-if="isUpdate">编辑</el-button>
            <el-button type="text" @click="openUpdateForm(scope.row.teamNo)" size="small" v-if="isUpdate">修改渠道号</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="xxjr-page">
        <div class="xxjr-fr">
          <el-pagination
            @current-change="search"
            :current-page="formCurrentPage"
            layout="total, prev, pager, next"
            :total="formTotalRecords">
          </el-pagination>
        </div>
      </div>
  </div>
  <el-dialog class="edit-dialog" :title="title" :visible.sync="isShow">
  <el-form ref="form" :model="form" label-width="150px">
  <el-form-item label="团队编号" prop="teamNo" :rules="{required: true, message: '必选项', trigger: 'blur'}">
      <el-input v-model="form.teamNo" placeholder="请输入团队名称" :disabled="isEdit"></el-input>
  </el-form-item>
  <el-form-item label="团队名称" prop="teamName" :rules="{required: true, message: '必选项', trigger: 'blur'}">
      <el-input v-model="form.teamName" placeholder="请输入团队名称"></el-input>
  </el-form-item>
  <el-form-item class="kf-dialog-btn">
    <el-button @click="save" :disabled="isLoading" :loading="isLoading">
      <span v-if="!isEdit">添加</span>
      <span v-else>修改</span>
    </el-button>
    <el-button @click="closeAlert">取消</el-button>
  </el-form-item>
  </el-form>
</el-dialog>
<el-dialog title="修改渠道团队号" class="width650" :visible.sync="updateShow" :close="closeUpdateForm">
  <el-form>
    <el-form-item label="渠道号" prop="channels">
      <el-select v-model="channels" placeholder="请选择渠道号" filterable clearable multiple>
        <el-option v-for="(item,index) in channelCodes"
        :key="index"
        :label="item.channelCode"
        :value="item.channelCode"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item class="kf-dialog-btn">
      <el-button @click="updateChannels" :disabled="isLoading" :loading="isLoading">
        <span>修改</span>
      </el-button>
      <el-button @click="closeUpdateForm">取消</el-button>
    </el-form-item>
  </el-form>
</el-dialog>
</div>
</template>
<script>
export default {
  name: 'canal',
  data () {
    return {
      isUpdate: true,
      searchForm: {
        pushName: '',
        type: ''
      },
      title: '增加团队',
      form: {
        teamName: '',
        teamNo: ''
      },
      updateShow: false,
      updateFrom: {
        teamNo: '',
        channels: ''
      },
      channels: [],
      channelCodes: [],
      isEdit: false,
      isShow: false,
      tableData: [],
      formTotalRecords: 0,
      formCurrentPage: 1,
      isLoading: false
    }
  },
  created () {
    this.search(1)
    // // 获取权限
    // let menuCode = this.$route.path.split('/')[2]
    // let checkUrl = this.$localStorage('kfCheckMenus')
    // if (checkUrl.indexOf(menuCode) >= 0) {
    //   this.isUpdate = true
    // }
  },
  methods: {
    addHandle () {
      this.resetData()
      this.isShow = true
      this.isEdit = false
    },
    updateChannels () {
      if (this.channels.length === 0) {
        this.$msg.error('至少选择一个渠道')
        return
      }
      let params = Object.assign({}, this.updateFrom)
      params.channels = JSON.stringify(this.channels)
      this.$ajax({
        url: '/store/account/spread/teamCfg/updateChannels',
        data: params,
        success: data => {
          this.$msg('修改成功')
          this.closeUpdateForm()
        }
      })
    },
    openUpdateForm (teamNo) {
      this.updateShow = true
      this.updateFrom.teamNo = teamNo
      this.$ajax({
        url: '/store/account/spread/teamCfg/queryChannels',
        data: {teamNo},
        success: data => {
          this.channels = data.attr.channels || []
        }
      })
      this.$ajax({
        url: '/store/user/code/queryAll',
        success: data => {
          this.channelCodes = data.rows
        }
      })
    },
    closeUpdateForm () {
      this.updateShow = false
      this.updateFrom = {
        teamName: '',
        teamNo: ''
      }
      this.channels = []
    },
    editHandle (row) {
      this.resetData()
      this.isShow = true
      this.isEdit = true
      this.form = {
        teamName: row.teamName,
        teamNo: row.teamNo
      }
    },
    resetData () {
      this.form = {
        teamName: '',
        teamNo: ''
      }
    },
    closeAlert () {
      this.isShow = false
    },
    save () {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          let type = this.isEdit ? 'edit' : 'add'
          this.$ajax({
            url: '/store/account/spread/teamCfg/' + type,
            data: this.form,
            success: data => {
              this.closeAlert()
              this.search(1)
            }
          })
        }
      })
    },
    search (page) {
      this.tableData = []
      let obj = this.searchForm
      obj.currentPage = page
      this.formCurrentPage = page
      this.$ajax({
        url: '/store/account/spread/teamCfg/queryList',
        data: obj,
        success: data => {
          this.tableData = data.rows
          this.formTotalRecords = data.page.totalRecords
        }
      })
    }
  }
}
</script>
