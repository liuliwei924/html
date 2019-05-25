<template>
  <el-dialog class="edit-dialog" title="添加反馈" :visible.sync="visible">
    <el-form :model="form" ref="form" label-width="150px">
      <el-form-item
        label="反馈内容"
        prop="feedText"
        :rules="{required: true, message: '反馈内容不能为空'}">
        <el-input
          type="textarea"
          v-model="form.feedText">
        </el-input>
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button @click="close">取消</el-button>
      <el-button @click="confirm">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'feed-add',
  props: {
    value: Boolean
  },
  data () {
    return {
      form: {
        feedText: ''
      }
    }
  },
  computed: {
    visible: {
      get () {
        return this.value
      },
      set (val) {
        this.$emit('change', val)
      }
    }
  },
  methods: {
    // 关闭
    close () {
      this.visible = false
    },
    // 确定
    confirm () {
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.$ajax({
            url: '/store/account/user/info/addSysFeedBack',
            data: this.form,
            success: data => {
              this.$parent.getSysFeedback()
              this.visible = false
            }
          })
        }
      })
    }
  }
}
</script>
