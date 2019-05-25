<template>
  <el-dialog class="edit-dialog" title="发送活动消息" v-model="visible">
    <el-form :model="form" ref="form" label-width="150px">
      <el-form-item label="标题" prop="content" :rules="{required: true, message: '标题不能为空', trigger: 'blur'}">
         <el-input v-model="form.content" placeholder="请输入标题"></el-input>
      </el-form-item>
      <el-form-item label="活动内容" prop="activeContent" :rules="{required: true, message: '活动内容不能为空', trigger: 'blur'}">
        <el-input v-model="form.activeContent" :rows="5" :cols="5" type="textarea" placeholder="请输入活动内容"></el-input>
      </el-form-item>
      <el-form-item
        label="开始时间"
        prop="startTime"
        :rules="{required: true, message: '开始时间不能为空', trigger: 'blur'}">
        <el-date-picker
          v-model="form.startTime"
          type="date"
          editable
          @change="startDateChange"
          placeholder="请选择">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input :rows="5" :cols="5" type="textarea"
          v-model="form.remark" placeholder="请输入备注">
        </el-input>
      </el-form-item>
      <el-form-item label="模板示例" prop="tempImg">
        <img :src="this.tempImg" style="width:282px;">
      </el-form-item>
      <el-form-item
        label="提示"
        :rules="{required: true}">
        <div class="el-form-item__content">根据帅选条件发送给关注了小小攒钱的用户</div>
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button @click="close">取消</el-button>
      <el-button @click="confirm" :loading="loading">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'fx-send-active-message',
  props: {
    value: Boolean,
    newSearchForm: Object
  },
  data () {
    return {
      visible: this.value,
      loading: false,
      form: {
        content: '',
        activeContent: '',
        remark: '',
        startTime: ''
      },
      tempImg: 'https://static.xxjr.com/upfile/fxCardImg/3c948cfd-4046-407e-9cf1-36a0459f8e6b.png'
    }
  },
  watch: {
    value (val) {
      this.visible = val
    },
    visible (val) {
      this.$emit('change', val)
    }
  },
  methods: {
     // 时间改变赋值
    startDateChange (date) {
      this.form.startTime = date
    },
    // 关闭
    close () {
      this.visible = false
    },
    // 确定
    confirm () {
      let _this = this
      this.$refs['form'].validate(valid => {
        if (valid) {
          let form = Object.assign(this.form, this.newSearchForm)
          this.loading = true
          this.$ajax({
            url: '/store/account/fx/fxCust/sendActiveMessage',
            data: form,
            success: data => {
              window.setTimeout(() => {
                _this.loading = false
                _this.$emit('change', 'search')
              }, 5000)
            }
          })
        }
      })
    }
  }
}
</script>
