<template>
<el-dialog class="edit-dialog" :title="title" v-model="show">
  <el-form ref="form" :model="form" label-width="150px">
    <el-form-item label="渠道代号" prop="channelCode" :rules="{required: true, message: '必填项', trigger: 'blur'}">
      <el-select v-model="form.channelCode" placeholder="请选择渠道代号" filterable clearable :disabled="isEdit">
        <el-option
          v-for="(item,index) in this.$parent.channels"
          :label="item.channelCode"
          :value="item.channelCode" :key="index">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="每天最高接收数量" prop="maxCount" :rules="{type: 'number', required: true, message: '必填项', trigger: 'blur'}">
      <el-input v-model.number="form.maxCount"></el-input>
    </el-form-item>
    <el-form-item label="是否禁用" prop="enable" :rules="{type: 'number', required: true, message: '必选项', trigger: 'blur'}">
      <el-select v-model.number="form.enable" placeholder="请选择是否禁用">
        <el-option label="禁用" :value="0"></el-option>
        <el-option label="启用" :value="1"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="渠道扣量数" prop="deduction" :rules="{type: 'number', required: true, message: '必填项', trigger: 'blur'}">
      <el-input v-model.number="form.deduction">
        <template slot="append">例:填3个，就是每10个成功里面扣3个</template>
      </el-input>
    </el-form-item>
    <el-form-item class="kf-dialog-btn">
      <el-button @click="addBtn" :disabled="isLoading" :loading="isLoading"><span v-if="!isEdit">添加</span><span v-if="isEdit">修改</span></el-button>
      <el-button @click="closeAlert">取消</el-button>
    </el-form-item>
  </el-form>
</el-dialog>
</template>
<script>
let url = '/account/third/cfg/add'
export default{
  name: 'api-cfgEdit',
  data () {
    return {
      isLoading: false,
      show: false,
      title: '第三方配置',
      isEdit: false,
      value1: '',
      detailCode: '',
      form: {
        channelCode: '',
        maxCount: '',
        enable: '',
        deduction: ''
      },
      launchTime: '',
      channels: []
    }
  },
  created () {
    this.$ajax({
      url: '/store/user/code/queryAll',
      success: data => {
        this.channels = data.rows
      }
    })
  },
  methods: {
    startTimeHandle (start) {
      this.form.launchTime = start || ''
    },
    closeAlert () {
      this.show = false
    },
    addBtn () {
      this.$refs['form'].validate((valid) => {
        if (!valid) {
          this.$msg('请按提示规则输入')
          return false
        }
        if (this.isEdit) {
          url = '/store/account/spread/third/edit'
        } else {
          url = '/store/account/spread/third/add'
        }
        if (!this.isEdit) {
          this.isLoading = true
        }
        if (this.form.deduction > 10) {
          this.$msg('渠道扣量不能超过10')
          return false
        }
        this.$ajax({
          url: url,
          data: Object.assign({}, this.form),
          success: data => {
            this.isLoading = false
            this.show = false
            this.$message('操作成功')
            this.$parent.search(this.$parent.formCurrentPage)
          },
          err: err => {
            this.$msg(err.message)
            this.isLoading = false
          }
        })
      })
    }
  }
}
</script>
