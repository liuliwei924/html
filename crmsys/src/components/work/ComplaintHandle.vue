<template>
  <el-dialog
    class="edit-dialog"
    title="投诉处理"
    :visible.sync="visible">
    <el-form
      :model="form"
      label-width="150px"
      ref="form">
      <el-form-item
        label="内容描述"
        @change.native="changeSmsNotice"
        prop="type"
        :rules="{required: true, message: '内容描述不能为空'}">
        <el-radio-group v-model="form.type">
          <el-radio :label="1">建议</el-radio>
          <el-radio :label="2">投诉</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item
        label="投诉建议"
        prop="detailDesc"
        :rules="{required: true, message: '投诉建议不能为空'}">
        <el-input
          type="textarea"
          v-model.trim="form.detailDesc" placeholder="请输入您的反馈意见(500字以内)">
        </el-input>
      </el-form-item>
      <el-form-item
        label="客户称呼"
        prop="custName"
        :rules="{required: true, message: '姓名不能为空',trigger: 'blur'}">
        <el-input
          v-model="form.custName"
          placeholder="请输入姓名">
        </el-input>
      </el-form-item>
      <el-form-item
        label="手机号码"
        prop="custTelephone"
        :rules="[{type: 'number',required: true, message: '手机号格式有误',trigger: 'blur'}, {validator: (rule, value, callback) => {/^1[34578]\d{9}$/.test(value) ? callback() : callback('手机号码格式不正确')}, trigger: 'blur'}]">
        <el-input
          v-model.number="form.custTelephone"
          placeholder="请输入手机号码" :maxlength="11">
        </el-input>
      </el-form-item>
      <el-form-item
        label="服务经理"
        prop="busiName"
        :rules="{required: true, message: '服务经理不能为空',trigger: 'blur'}">
        <el-input
          v-model="form.busiName"
          placeholder="请输入服务经理名称">
        </el-input>
      </el-form-item>
      <el-form-item
        label="经理手机"
        prop="busiTelephone"
        :rules="[{type: 'number',required: true, message: '手机号格式有误',trigger: 'blur'}, {validator: (rule, value, callback) => {/^1[34578]\d{9}$/.test(value) ? callback() : callback('手机号码格式不正确')}, trigger: 'blur'}]">
        <el-input
          v-model.number="form.busiTelephone"
          placeholder="请输入手机号码" :maxlength="11">
        </el-input>
      </el-form-item> 
      <el-form-item
        label="处理状态"
        prop="status"
        :rules="{type: 'number', required: true, message: '必填项', trigger: 'blur'}">
        <el-select
          v-model.number="form.status"
          filterable
          placeholder="请选择">
          <el-option
            v-for="val,key,index in dealStatus"
            :label="val"
            :value="Number(key)"
            :key="index">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        label="投诉等级"
        prop="complaintGrade"
        :rules="{type: 'number', required: true, message: '必填项', trigger: 'blur'}">
        <el-select
          v-model.number="form.complaintGrade"
          filterable
          placeholder="请选择">
          <el-option
            v-for="val,key,index in complaintList"
            :label="val"
            :value="Number(key)"
            :key="index">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        label="处理描述"
        prop="serviceDesc"
        :rules="{required: true, message: '处理描述不能为空'}">
        <el-input
          type="textarea"
          v-model.trim="form.serviceDesc" placeholder="请输入您的处理描述(500字以内)">
        </el-input>
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button @click="close">取消</el-button>
      <el-button :loading="loading" @click="confirm">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
// 预约上门子组件
export default {
  name: 'complaint-handle',
  props: {
    value: Boolean,
    applyId: [Number, String],
    customerId: [Number, String],
    complaintInfo: Object,
    type: Object,
    status: Object,
    complaintGrade: Object
  },
  data () {
    return {
      visible: this.value,
      loading: false,
      form: {
        applyId: this.applyId,
        customerId: this.customerId,
        recordId: this.recordId,
        type: 1,
        detailDesc: '',
        custName: '',
        custTelephone: '',
        busiName: '',
        busiTelephone: '',
        status: 0,
        complaintGrade: '',
        serviceDesc: ''
      },
      custData: [],
      // 上门时间禁用
      visitTimeOptions: {
        disabledDate (time) {
          return time.getTime() < Date.now() - 3 * 8.64e7 || time.getTime() > Date.now()
        }
      },
      dealStatus: {
        0: '待处理',
        1: '处理中',
        2: '处理完成',
        3: '无法处理'
      },
      complaintList: {
        1: '非投诉',
        2: '一般投诉',
        3: '严重投诉',
        4: '不合理投诉'
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
    customerId (val) {
      this.form.customerId = val
    },
    // 编辑数据变化
    complaintInfo (obj) {
      this.form = {
        applyId: obj['applyId'] || '',
        customerId: obj['customerId'] || '',
        recordId: obj['recordId'] || '',
        type: obj['type'] || '',
        detailDesc: obj['detailDesc'] || '',
        custName: obj['custName'] || '',
        custTelephone: +obj['custTelephone'] || '',
        busiName: obj['busiName'] || '',
        busiTelephone: +obj['busiTelephone'] || '',
        complaintGrade: obj['complaintGrade'] || '',
        status: obj['status'] || 0,
        serviceDesc: obj['serviceDesc'] || ''
      }
    }
  },
  methods: {
    // 时间改变赋值
    visitTimeChange (date) {
      this.form.visitTime = date
    },
    // 关闭
    close () {
      this.visible = false
    },
    // 确定
    confirm () {
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.$ajax({
            url: '/store/account/work/waitDeal/complaintHandel',
            data: this.form,
            loading: true,
            success: data => {
              this.$message('处理投诉成功')
              this.$emit('change', 'search')
            }
          })
        }
      })
    }
  }
}
</script>
