<template>
  <el-dialog
    class="edit-dialog"
    title="微信变更"
    v-model="visible">
    <!-- 表单处理 -->
    <el-form
      ref="form"
      :model="form"
      label-width="150px">
      <el-form-item
        label="手机号"
        prop="telephone"
        :rules="{type: 'number', required: true, message: '手机号格式有误', trigger: 'blur'}">
        <el-input v-model.number="form.telephone"  placeholder="请输入手机号码" :maxlength="11"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button @click="close">取消</el-button>
      <el-button :loading="loading" @click="saveHandle">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
// 操作员编辑组件
export default {
  name: 'weixin-edit',
  // 父组件传递参数
  props: {
    value: Boolean,
    customerId: [Number, String],
    oldTel: [Number, String]
  },
  data () {
    return {
      visible: this.value, // 弹窗是否显示
      loading: false, // 加载动画
      form: {
        customerId: '',
        telephone: ''
      },
      roleType: '', // 用户角色
      isAll: false
    }
  },
  watch: {
    // 监听父组件传递的参数变化
    value (val) {
      this.visible = val
    },
    // 弹窗显示改变传递给父组件
    visible (val) {
      this.$emit('change', val)
    }
  },
  methods: {
    // 弹窗关闭
    close () {
      this.visible = false
    },
    // 保存处理
    saveHandle () {
      let telephone = String(this.form.telephone)
      if (this.oldTel === telephone) {
        this.$msg('变更号码不能相同')
        return
      }
      this.$refs['form'].validate(valid => {
        if (valid) {
          let params = {}
          Object.assign(params, this.form, {
            customerId: this.customerId
          })
          this.$ajax({
            url: '/store/account/config/operator/updateWexinInfo',
            data: params,
            loading: true,
            success: data => {
              this.$emit('change', 'search')
              this.visible = false
            },
            fail: data => {
              this.$msg(data.message)
            }
          })
        }
      })
    }
  }
}
</script>
