<template>
  <el-dialog class="edit-dialog" title="链接详情" v-model="visible">
    <el-form :model="form" ref="form" label-width="150px">
      <el-form-item label="链接详情" prop="paramValue" :rules="{required: true, message: '链接详情不能为空', trigger: 'blur'}">
        <el-input :rows="15" :cols="15" type="textarea" v-model="form.paramValue" placeholder="请输入链接详情"></el-input>
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
  name: 'fx-link-info',
  props: {
    value: Boolean,
    linkPreData: Object
  },
  data () {
    return {
      visible: this.value,
      form: {
        paramValue: '',
        paramCode: ''
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
    linkPreData (obj) {
      this.form = {
        paramValue: obj['linkPrefix'] || '',
        paramCode: obj['fxLinkCopyAllPrefix'] || ''
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
          let contentStr = this.form.paramValue
          contentStr = contentStr.replace(/\n/g, '<br>')
          this.form.paramValue = contentStr
          this.$ajax({
            url: '/store/account/fx/fxLinkConf/updateLinkPreInfo',
            data: this.form,
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
