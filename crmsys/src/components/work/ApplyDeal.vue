<template>
  <el-dialog
    class="edit-dialog"
    title="申请处理"
    v-model="visible">
    <!-- 表单处理 -->
    <el-form
      ref="form"
      :model="form"
      label-width="150px">
      <el-form-item
        label="原申请手机号"
        prop="menuCode"
        :rules="{required: true, message: '必填项', trigger: 'blur'}">
        <el-input v-model="form.telephone"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button @click="close">取消</el-button>
      <el-button :loading="loading" @click="saveHandle">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
// 申请处理组件
export default {
  name: 'relation-deal',
  // 父组件传递参数
  props: {
    value: Boolean
  },
  data () {
    return {
      visible: this.value, // 弹窗是否显示
      loading: false, // 加载动画
      form: {
        telephone: ''
      }
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
    },
    // 编辑数据变化
    menuData (obj) {
      this.form = {
        menuId: obj['menuId'] || '',
        menuCode: obj['menuCode'] || '',
        menuName: obj['menuName'] || '',
        menuUrl: obj['menuUrl'] || '',
        level: obj['level'] || ''
      }
    }
  },
  methods: {
    // 弹窗关闭
    close () {
      this.visible = false
    },
    // 保存处理
    saveHandle () {
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.$ajax({
            url: '/store/account/config/menu/update',
            data: this.form,
            loading: true,
            success: data => {
              this.$emit('change', 'search')
            }
          })
        }
      })
    }
  }
}
</script>
