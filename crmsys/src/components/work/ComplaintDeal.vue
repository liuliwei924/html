<template>
  <el-dialog
    class="edit-dialog"
    title="添加投诉记录"
    :visible.sync="visible">
    <el-form
      :model="form"
      label-width="150px"
      ref="form">
      <el-form-item
        label="内容描述"
        @change.native="changeSmsNotice"
        prop="type"
        :rules="{required: true, message: '内容描述不能为空'}">
        <el-radio-group v-model="form.type">
          <el-radio :label="1">建议</el-radio>
          <el-radio :label="2">投诉</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item
        label="投诉建议"
        prop="detailDesc"
        :rules="{required: true, message: '投诉建议不能为空'}">
        <el-input
          type="textarea"
          v-model.trim="form.detailDesc" placeholder="请输入您的反馈意见(500字以内)">
        </el-input>
      </el-form-item>
      <el-form-item
        label="客户姓名"
        prop="custName"
        :rules="{required: true, message: '姓名不能为空',trigger: 'blur'}">
        <el-input
          v-model="form.custName"
          placeholder="请输入姓名">
        </el-input>
      </el-form-item>
      <el-form-item
        label="手机号码"
        prop="custTelephone"
        :rules="[{type: 'number',required: true, message: '手机号格式有误',trigger: 'blur'}, {validator: (rule, value, callback) => {/^1[34578]\d{9}$/.test(value) ? callback() : callback('手机号码格式不正确')}, trigger: 'blur'}]">
        <el-input
          v-model.number="form.custTelephone"
          placeholder="请输入手机号码" :maxlength="11">
        </el-input>
      </el-form-item>
      <el-form-item
        label="服务经理"
        prop="busiName"
        :rules="{required: true, message: '服务经理不能为空',trigger: 'blur'}">
        <el-input
          v-model="form.busiName"
          placeholder="请输入服务经理名称">
        </el-input>
      </el-form-item>
      <el-form-item
        label="经理手机"
        prop="busiTelephone"
        :rules="[{type: 'number',required: true, message: '手机号格式有误',trigger: 'blur'}, {validator: (rule, value, callback) => {/^1[34578]\d{9}$/.test(value) ? callback() : callback('手机号码格式不正确')}, trigger: 'blur'}]">
        <el-input
          v-model.number="form.busiTelephone"
          placeholder="请输入手机号码" :maxlength="11">
        </el-input>
      </el-form-item> 
    </el-form>
    <div slot="footer">
      <el-button @click="close">取消</el-button>
      <el-button :loading="loading" @click="confirm">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
// 预约上门子组件
export default {
  name: 'complaint-deal',
  props: {
    value: Boolean,
    applyId: [Number, String],
    customerId: [Number, String],
    custInfo: Object
  },
  data () {
    return {
      visible: this.value,
      loading: false,
      form: {
        applyId: this.applyId,
        customerId: this.customerId,
        type: 1,
        detailDesc: '',
        custName: '',
        custTelephone: '',
        busiName: '',
        busiTelephone: ''
      },
      custData: [],
      // 上门时间禁用
      visitTimeOptions: {
        disabledDate (time) {
          return time.getTime() < Date.now() - 3 * 8.64e7 || time.getTime() > Date.now()
        }
      }
    }
  },
  watch: {
    value (val) {
      this.visible = val
    },
    visible (val) {
      this.$emit('change', val)
    },
    customerId (val) {
      this.form.customerId = val
    }
  },
  methods: {
    // 时间改变赋值
    visitTimeChange (date) {
      this.form.visitTime = date
    },
    // 关闭
    close () {
      this.visible = false
    },
    // 确定
    confirm () {
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.$ajax({
            url: '/store/account/work/waitDeal/complaintDeal',
            data: this.form,
            loading: true,
            success: data => {
              this.$message('添加投诉记录成功')
              this.$refs['form'].resetFields()
              this.$emit('change', 'search')
            }
          })
        }
      })
    }
  }
}
</script>
