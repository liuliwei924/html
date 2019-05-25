<template>
  <el-dialog class="edit-dialog" title="修改系统通知" v-model="visible">
    <el-form :model="form" ref="form" label-width="150px">
      <el-form-item
        label="通知状态"
        prop="status"
        :rules="{type: 'number', required: true, message: '必填项', trigger: 'blur'}">
        <el-select
          v-model.number="form.status"
          filterable
          placeholder="请选择">
          <el-option v-for="val,key,index in status" :label="val" :value="Number(key)" :key="index"></el-option>
        </el-select>
      </el-form-item>
       <el-form-item
        label="是否滚动"
        prop="isScroll"
        :rules="{type: 'number', required: true, message: '必填项', trigger: 'blur'}">
        <el-select
          v-model.number="form.isScroll"
          filterable
          placeholder="请选择">
          <el-option v-for="val,key,index in isScroll" :label="val" :value="Number(key)" :key="index"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        label="门店:"
        :rules="{required: false, message: '门店不能为空'}">
        <el-select
          v-model="form.orgId"
          filterable
          clearable
          @change="orgChange"
          placeholder="请选择门店">
          <el-option
            v-for="item,index in userOrgs"
            :label="item.orgNo + '-' + item.orgName"
            :value="item.orgId"
            :key="index">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        label="门店人员:"
        :rules="{required: false, message: '门店人员不能为空'}">
        <el-select
          v-model="form.customerId"
          clearable
          placeholder="请选择门店人员">
          <el-option
            v-for="item,index in custInfo"
            :label="item.userName"
            :value="item.customerId"
            :key="index">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        label="通知日期"
        prop="notifyDate"
        :rules="{required: true, message: '通知日期不能为空'}">
        <el-date-picker
          v-model="form.notifyDate"
          type="date"
          editable
          @change="notifyDateChange"
          placeholder="请选择">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="通知内容" prop="notifyText" :rules="{required: true, message: '通知内容不能为空'}">
        <el-input  type="textarea" v-model="form.notifyText" placeholder="请输入通知内容"></el-input>
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
  name: 'sys-notify-edit',
  props: {
    value: Boolean,
    sysNotifyData: Object,
    status: Object,
    isScroll: Object,
    userOrgs: Array
  },
  data () {
    return {
      fitstTime: true,
      first: true,
      loading: false,
      visible: this.value,
      form: {
        notifyId: '',
        status: '',
        isScroll: '',
        notifyDate: '',
        notifyText: '',
        orgId: '',
        customerId: ''
      },
      custInfo: [],
      notifyDateOptions: {
        disabledDate (time) {
          return time.getTime() < Date.now()
        }
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
    sysNotifyData (obj) {
      this.first = true
      this.form = {
        notifyId: obj['notifyId'] || '',
        status: obj['status'] || '',
        isScroll: obj['isScroll'] || '',
        notifyDate: obj['notifyDate'] || '',
        notifyText: obj['notifyText'] || '',
        orgId: obj['orgId'] || '',
        customerId: obj['customerId'] || ''
      }
      if (this.fitstTime) {
        this.orgChange(this.form.orgId)
      }
    }
  },
  methods: {
    // 门店变化监听
    orgChange (val) {
      if (this.first) {
        this.first = false
        this.fitstTime = false
      } else {
        this.form.customerId = ''
      }
      if (val) {
        this.$ajax({
          url: '/store/account/user/comm/getOrgCustList',
          data: {
            orgId: val
          },
          success: data => {
            this.custInfo = data.rows
          }
        })
      }
    },
    // 改变日期
    notifyDateChange (date) {
      this.form.notifyDate = date
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
            url: '/store/account/config/sysNotify/updateSysNotify',
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
