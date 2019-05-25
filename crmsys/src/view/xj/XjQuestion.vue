<template>
  <div class="content-box">
    <div class="header__title">问答配置</div>
    <div class="header__search clearfix">
      <el-form :model="searchForm">
        <el-form-item label="题目:">
          <el-input
            class="kf-search-input"
            v-model="searchForm.likeTitle"
            placeholder="题目">
          </el-input>
        </el-form-item>
        <el-form-item label="问题类型:">
          <el-select
            v-model="searchForm.qtype"
            clearable
            placeholder="问题类型">
            <el-option
              v-for="val,key,index in qtype"
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
        prop="questionId"
        label="问题编号"
        min-width="80">
      </el-table-column>
      <el-table-column
        prop="qtype"
        label="问题类型"
        min-width="80">
        <template slot-scope="scope">{{qtype[scope.row.qtype]}}</template>
      </el-table-column>
      <el-table-column
        prop="questTitle"
        label="题目"
        min-width="130">
      </el-table-column>
      <el-table-column
        label="选题"
        min-width="130">
        <template slot-scope="scope">
          <template v-for="(item, index) in scope.row.contextArray">
            <span>{{item}}</span><br/>
          </template>
        </template>
      </el-table-column>
      <el-table-column
        prop="answer"
        label="答案"
        min-width="130">
      </el-table-column>
      <el-table-column
        prop="createTime"
        label="创建时间"
        min-width="130">
      </el-table-column>
      <el-table-column
        label="操作"
        min-width="120">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="editHandle(scope.row)">编辑</el-button>
          <el-button type="text" class="table__danger" size="small" @click="deleteHandle(scope.row.questionId)">删除</el-button>
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
    <el-dialog class="edit-dialog" :title="cfgTitle" :visible.sync="isShow">
      <el-form :model="form" ref="form" label-width="150px">
        <el-form-item
          label="问题类型"
          prop="qtype"
          :rules="{type: 'number', required: true, message: '必填项', trigger: 'blur'}">
          <el-select
            v-model.number="form.qtype"
            clearable
            placeholder="问题类型">
            <el-option
              v-for="val,key,index in qtype"
              :label="val"
              :value="Number(key)"
              :key="index">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="题目"
          prop="questTitle"
          :rules="{required: true, message: '必填项', trigger: 'blur'}">
          <el-input v-model="form.questTitle"></el-input>
        </el-form-item>
        <el-form-item
          v-for="(domain, index) in form.domains"
          :label="'选题' + (index + 1)"
          :key="index"
          :prop="'domains.' + index + '.value'"
          :rules="{required: true, message: '选题' + (index + 1) + '不能为空', trigger: 'blur'}">
          <el-input v-model="domain.value"></el-input>
          <el-button @click.prevent="addDomain(domain)" v-if="form.domains.length === (index + 1)">增加</el-button>
          <el-button @click.prevent="removeDomain(index)" v-if="form.domains.length > 1">删除</el-button>
        </el-form-item>
        <el-form-item
          label="答案"
          prop="answer"
          :rules="{required: true, message: '必填项', trigger: 'blur'}">
          <el-input v-model="form.answer"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
          <el-button @click="isShow = false">取消</el-button>
          <el-button @click="save()">保存</el-button>
        </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'xj-notify',
  data () {
    return {
      cfgTitle: '添加问答',
      isShow: false,
      tableData: [],
      totalRecord: 1,
      custData: {},
      contexts: [],
      addShow: false,
      isUpdate: false,
      editShow: false,
      searchForm: {
        likeTitle: '',
        qtype: '',
        status: 1 // 只查状态为1的
      },
      form: {
        domains: [{
          value: ''
        }],
        questionId: '',
        qtype: '',
        questTitle: '',
        context: '',
        answer: ''
      },
      qtype: {
        1: '今日任务'
      }
    }
  },
  created () {
    this.searchHandle()
  },
  methods: {
    addHandle () {
      this.resetValue()
      this.isShow = !this.isShow
      this.isUpdate = false
    },
    addDomain () {
      this.form.domains.push({
        value: ''
      })
    },
    removeDomain (index) {
      console.log(index)
      if (index !== -1) {
        this.form.domains.splice(index, 1)
      }
    },
    close () {
      this.isShow = false
    },
    save () {
      let type = 'edit'
      if (!this.isUpdate) {
        type = 'add'
      }
      this.$refs['form'].validate(valid => {
        if (valid) {
          for (let i = 0; i < this.form.domains.length; i++) {
            this.contexts.push(this.form.domains[i].value.trim())
          }
          this.form.context = JSON.stringify(this.contexts)
          this.form.answer = this.form.answer.trim()
          this.form.questTitle = this.form.questTitle.trim()
          this.$ajax({
            url: '/store/account/xj/question/' + type,
            data: this.form,
            success: data => {
              this.close()
              this.searchHandle()
              this.resetValue()
            }
          })
        }
      })
    },
    resetValue () {
      this.contexts = []
      this.form = {
        domains: [{
          value: ''
        }],
        questionId: '',
        qtype: '',
        questTitle: '',
        context: '',
        answer: ''
      }
    },
    editHandle (row) {
      this.resetValue()
      let question = Object.assign({}, row)
      let temp = []
      for (let i = 0; i < question.contextArray.length; i++) {
        temp.push({value: question.contextArray[i]})
      }
      this.form = {
        questionId: question.questionId,
        qtype: question.qtype,
        questTitle: question.questTitle,
        context: question.context,
        answer: question.answer,
        domains: temp
      }
      this.isUpdate = true
      this.isShow = !this.isShow
    },
    // 删除
    deleteHandle (questionId) {
      this.$alert('您是否确定删除该条记录?', '提示', {
        type: 'warning',
        customClass: 'msg-delete__dialog',
        showCancelButton: true,
        callback: action => {
          if (action === 'confirm') {
            this.$ajax({
              url: '/store/account/xj/question/edit',
              data: {
                'questionId': questionId,
                'status': 0
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
      this.$setStore('xjQuestion', this.searchForm)
      this.$ajax({
        url: '/store/account/xj/question/query',
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
  }
}
</script>