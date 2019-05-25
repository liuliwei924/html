<template>
  <el-dialog class="edit-dialog" title="添加系统通知" v-model="visible">
    <el-form :model="form" ref="form" label-width="150px">
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
      <el-form-item
        label="通知内容"
        prop="notifyText"
        :rules="{required: true, message: '通知内容不能为空'}">
        <el-input
          type="textarea"
          v-model="form.notifyText">
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
  name: 'sys-notify-add',
  props: {
    value: Boolean,
    userOrgs: Array
  },
  data () {
    return {
      visible: this.value,
      form: {
        orgId: '',
        customerId: '',
        notifyDate: '',
        notifyText: ''
      },
      custInfo: []
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
    // 门店变化监听
    orgChange (val) {
      this.form.customerId = ''
      this.$ajax({
        url: '/store/account/user/comm/getOrgCustList',
        data: {
          orgId: val
        },
        success: data => {
          this.custInfo = data.rows
        }
      })
    },
    // 改变放款日期
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
            url: '/store/account/config/sysNotify/addSysNotify',
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
