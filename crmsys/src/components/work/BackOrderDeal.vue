<template>
  <el-dialog
    class="edit-dialog"
    title="退单处理"
    v-model="visible">
    <el-form :model="form" ref="form" label-width="150px">
    <!-- 表单处理 -->
        <el-form-item
          label="退单原因描述"
          prop="backReDesc"
          :rules="{required: true, message: '退单原因描述不能为空'}">
          <el-input
            type="textarea"
            :maxlength="50"
            v-model.trim="form.backReDesc">
          </el-input>
        </el-form-item>
        <p style="text-align: right;padding-right: 22px;">剩余字数：{{50 - form.backReDesc.length}}</p>
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
  name: 'backOrderDeal',
  // 父组件传递参数
  props: {
    value: Boolean,
    applyId: [Number, String],
    orderType: [Number, String]
  },
  data () {
    return {
      visible: this.value, // 弹窗是否显示
      loading: false, // 加载动画
      form: {
        backReDesc: ''
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
            url: '/store/account/work/waitDeal/backOrderDeal',
            data: {
              applyId: this.applyId,
              backReDesc: this.form.backReDesc,
              orderType: this.orderType
            },
            success: data => {
              this.$message('操作成功')
              this.$parent.$parent.backStatus = 2
              this.$emit('change', 'search')
            },
            fail: (error) => {
              this.$msg(error.message)
              this.$emit('change', 'search')
            }
          })
        }
      })
    }
  }
}
</script>
