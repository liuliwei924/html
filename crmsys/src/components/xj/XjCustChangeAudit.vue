<template>
  <el-dialog class="edit-dialog" title="审核兑换记录" v-model="visible">
    <el-form :model="form" ref="form" label-width="150px">
      <el-form-item
        label="兑换状态"
        prop="status"
        :rules="{type: 'number', required: true, message: '必填项', trigger: 'blur'}">
        <el-select v-model.number="form.status"  placeholder="请选择状态">
          <el-option
            v-for="val,key,index in status"
            :label="val"
            :value="Number(key)"
            :key="index">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="审核描述" prop="checkDesc" :rules="{required: false, message: '审核描述不能为空'}">
        <el-input v-model="form.checkDesc" type="textarea" :rows="2" placeholder="请输入内容"></el-input>
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
  name: 'xjCustChange-audit',
  props: {
    value: Boolean,
    custData: Object,
    status: Object
  },
  data () {
    return {
      first: true,
      visible: this.value,
      form: {
        recordId: '',
        status: '',
        changeUnit: '',
        checkDesc: ''
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
    // 编辑数据变化
    custData (obj) {
      this.first = true
      this.form = {
        recordId: obj['recordId'] || '',
        status: obj['status'] || 0,
        changeUnit: obj['changeUnit'] || 1,
        checkDesc: obj['checkDesc'] || ''
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
            url: '/store/account/xj/xjCustChange/audiCustChange',
            data: this.form,
            success: data => {
              this.$emit('change', 'search')
            }
          })
          this.close()
        }
      })
    }
  }
}
</script>
