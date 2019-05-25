<template>
  <el-dialog
    class="edit-dialog"
    title="关联"
    v-model="visible">
    <el-form :model="form" ref="form" label-width="150px">
    <!-- 表单处理 -->
      <el-form-item
        label="客户手机"
        prop="telephone">
        <el-input v-model="form.telephone" :maxlength="11"></el-input>
      </el-form-item>
      <el-form-item
        label="客户姓名"
        prop="applyName">
        <el-input v-model="form.applyName"></el-input>
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
  name: 'relation-edit',
  // 父组件传递参数
  props: {
    value: Boolean,
    signData: Object
  },
  data () {
    return {
      visible: this.value, // 弹窗是否显示
      loading: false, // 加载动画
      form: {
        applyName: '',
        reContractId: '',
        signDate: '',
        telephone: '',
        status: ''
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
    signData (obj) {
      this.form = {
        reContractId: obj['reContractId'] || '',
        applyName: obj['applyName'] || '',
        signDate: obj['signDate'] || '',
        telephone: obj['telephone'] || '',
        status: obj['status'] || ''
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
      this.$ajax({
        url: '/store/account/work/cfsSign/relationSignInfo',
        data: this.form,
        success: data => {
          this.$emit('change', 'search')
        },
        fail: (error) => {
          this.$message(error.message)
          this.$emit('change', 'search')
        }
      })
      this.close()
    }
  }
}
</script>
