<template>
  <el-dialog class="edit-dialog" title="添加门店假期" v-model="visible">
    <el-form :model="form" ref="form" label-width="150px">
      <el-form-item label="门店" prop="orgId"
      :rules="{type: 'number', required: true, message: '门店不能为空',trigger: 'change'}">
        <el-select
          v-model="form.orgId"
          filterable
          clearable
          placeholder="请选择">
          <el-option
            v-for="item,index in userOrgs"
            :label="item.orgNo + '-' + item.orgName"
            :value="item.orgId"
            :key="index">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        label="假期日期"
        prop="myDate"
        :rules="{required: true, message: '假期日期不能为空'}">
        <el-date-picker
          v-model="form.myDate"
          type="date"
          editable
          @change="myDateChange"
          placeholder="请选择">
        </el-date-picker>
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
  name: 'holidayConf-add',
  props: {
    value: Boolean,
    userOrgs: Array
  },
  data () {
    return {
      visible: this.value,
      form: {
        orgId: '',
        userOrgs: [],
        myDate: ''
      }
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
    myDateChange (date) {
      this.form.myDate = date
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
            url: '/store/account/config/holidayConf/addHolidayConf',
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
