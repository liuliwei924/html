<template>
<el-dialog class="edit-dialog" :title="title" v-model="show">
  <el-form ref="form" :model="form" label-width="150px">
    <el-form-item label="记录日期" prop="recordDate" :rules=" { required: true, message: '请选择日期', trigger: 'change' }">
      <el-date-picker
      v-model="recordDate"
      type="date"
      :editable="false"
      placeholder="选择日期"
      @change="startTimeHandle($event)"
      :disabled="isEdit">
    </el-date-picker>
    </el-form-item>
    <el-form-item label="代号" prop="channelCode" :rules="{required: true, message: '必选项', trigger: 'blur'}">
      <el-select v-model="form.channelCode" placeholder="请选择代号" :disabled="isEdit" filterable>
        <el-option
          v-for="(item,index) in this.$parent.channels"
          :label="item.channelCode"
          :value="item.channelCode" :key="index">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="花费金额" prop="amount" :rules="{type: 'number', required: true, message: '花费金额必填', trigger: 'blur'}">
      <el-input v-model.number="form.amount"></el-input>
    </el-form-item>
    <el-form-item label="点击次数" prop="browseCount" :rules="{type: 'number', required: true, message: '浏览次数必填', trigger: 'blur'}">
      <el-input v-model.number="form.browseCount"></el-input>
    </el-form-item>
    <el-form-item class="kf-dialog-btn">
      <el-button @click.stop="addBtn" :disabled="isLoading" :loading="isLoading">
        <span v-if="!isEdit">添加</span>
        <span v-else>修改</span>
      </el-button>
      <el-button @click.stop="closeAlert">取消</el-button>
    </el-form-item>
  </el-form>
</el-dialog>
</template>
<script>
let url = '/store/account/spread/cost/add'
export default{
  name: 'deal-minset',
  data () {
    return {
      isLoading: false,
      show: false,
      title: '添加大类',
      isEdit: false,
      form: {
        channelCode: '',
        recordDate: '',
        amount: '',
        browseCount: ''
      },
      recordDate: ''
    }
  },
  methods: {
    closeAlert () {
      this.show = false
    },
    startTimeHandle (start) {
      this.form.recordDate = start || ''
    },
    addBtn () {
      this.$refs['form'].validate((valid) => {
        if (!valid) {
          this.$message({message: '请按提示规则输入', type: 'error'})
          return false
        }
        if (this.isEdit) {
          url = '/store/account/spread/cost/edit'
        } else {
          url = '/store/account/spread/cost/add'
        }
        this.isLoading = true
        this.$ajax({
          url: url,
          data: this.form,
          success: data => {
            this.isLoading = false
            this.show = false
            this.$message({message: '操作成功', type: 'success'})
            this.$parent.search(this.$parent.formCurrentPage)
          },
          err: err => {
            this.$message({message: err.message, type: 'error'})
            this.isLoading = false
            this.$parent.search(1)
          }
        })
      })
    }
  }
}
</script>
