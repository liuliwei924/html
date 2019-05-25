<template>
  <el-dialog class="edit-dialog" title="处理反馈信息" v-model="visible">
    <el-form :model="form" ref="form" label-width="150px">
      <!-- <el-form-item label="显示名称" prop="nickName" :rules="{required: false, message: '显示名称不能为空'}">
        <el-input v-model="form.nickName" disabled placeholder="请输入显示名称"></el-input>
      </el-form-item>
      <el-form-item label="手机号" prop="telephone" :rules="{required: false, message: '手机号不能为空'}">
        <el-input v-model="form.telephone" disabled placeholder="请输入手机号"></el-input>
      </el-form-item>
      <el-form-item label="反馈内容" prop="content" :rules="{required: false, message: '反馈内容不能为空'}">
        <el-input v-model="form.content" disabled type="textarea" :rows="2" placeholder="请输入内容"></el-input>
      </el-form-item> -->
      <el-form-item
        label="反馈状态"
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
      <el-form-item
        label="是否发送消息"
        prop="isSend"
        :rules="{type: 'number', required: true, message: '必填项', trigger: 'blur'}">
        <el-select v-model.number="form.isSend"  placeholder="请选择是否发送消息">
          <el-option
            v-for="val,key,index in isSend"
            :label="val"
            :value="Number(key)"
            :key="index">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="处理描述" prop="auditDesc" :rules="{required: true, message: '处理描述不能为空'}">
        <el-input v-model="form.auditDesc" type="textarea" :rows="2" placeholder="请输入内容"></el-input>
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
  name: 'xjFeedBack-handel',
  props: {
    value: Boolean,
    custData: Object,
    status: Object,
    isSend: Object
  },
  data () {
    return {
      first: true,
      visible: this.value,
      form: {
        feedbackId: '',
        status: '',
        isSend: '',
        auditDesc: '',
        customerId: ''
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
        feedbackId: obj['feedbackId'] || '',
        status: obj['status'] || 0,
        isSend: obj['isSend'] || 0,
        auditDesc: obj['auditDesc'] || '',
        customerId: obj['customerId'] || ''
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
            url: '/store/account/xj/xjFeedBack/handelFeedBack',
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
