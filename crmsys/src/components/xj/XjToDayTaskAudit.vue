<template>
  <el-dialog class="edit-dialog" title="今日任务截图审核" :visible.sync="visible">
    <el-form :model="form" ref="form" label-width="150px">
      <el-form-item label="审核状态" class="gradeImg-uploader" required>
        <el-form-item class="el-col" prop="auditStatus">
          <el-radio-group v-model="form.auditStatus">
            <el-radio-button :label="1">审核通过</el-radio-button>
            <el-radio-button :label="2">审核失败</el-radio-button>
          </el-radio-group>
        </el-form-item>
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
  name: 'xjToDayTask-audit',
  props: {
    value: Boolean,
    ids: Array
  },
  data () {
    return {
      visible: this.value,
      form: {
        auditStatus: 1
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
    ids (data) {
      this.ids = data
    }
  },
  methods: {
    // 关闭
    close () {
      this.visible = false
    },
    // 确定
    confirm () {
      let params = this.form
      let ids = ''
      for (let i = 0; i < this.ids.length; i++) {
        ids += this.ids[i] + ','
      }
      params.ids = ids
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.$ajax({
            url: '/store/account/xj/xjToDayTask/auditPass',
            data: params,
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
