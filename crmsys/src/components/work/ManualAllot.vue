<template>
  <el-dialog
    class="edit-dialog"
    title="手工分单"
    :visible.sync="visible">
    <el-form
      :model="form"
      ref="form"
      label-width="150px">
      <el-form-item
        label="门店:"
        :rules="{required: true, message: '门店不能为空'}">
        <el-select
          v-model="form.orgId"
          filterable
          clearable
          @change="changeOrgHandle"
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
        label="所属组名">
        <el-select
          v-model="form.groupName"
          clearable
          filterable
          @change="changeCustHandle"
          placeholder="请选择组名">
          <el-option
            v-for="item,index in groupNameList"
            :label="item.groupName"
            :value="item.groupName"
            :key="index">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        label="门店人员:"
        :rules="{required: true, message: '门店人员不能为空'}">
        <el-select
          v-model="form.customerId"
          clearable
          filterable
          placeholder="请选择门店人员">
          <el-option
            v-for="item,index in custInfo"
            :label="item.userName"
            :value="item.customerId"
            :key="index">
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button @click="close">取消</el-button>
      <el-button :loading="loading" @click="confirm">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
// 转信贷经理子组件
export default {
  name: 'manual-allot',
  props: {
    value: Boolean,
    userOrgs: Array,
    orders: Array,
    invalidFlag: String
  },
  data () {
    return {
      visible: this.value,
      loading: false,
      form: {
        orgId: '',
        customerId: '',
        groupName: '',
        orders: ''
      },
      custInfo: [],
      groupNameList: []
    }
  },
  watch: {
    value (val) {
      this.visible = val
    },
    visible (val) {
      this.$emit('change', val)
    },
    orders (val) {
      this.form.orders = JSON.stringify(val)
    }
  },
  methods: {
    // 改变组名
    changeOrgHandle () {
      if (this.form.orgId) {
        this.getGroupList()
        this.getCustList()
      } else {
        this.form.groupName = ''
        this.groupNameList = []
        this.custInfo = []
      }
    },
    // 改变CUSTID
    changeCustHandle () {
      if (this.form.groupName) {
        this.getCustList()
      } else {
        this.custInfo = ''
      }
    },
     // 通过orgId 获得组列
    getGroupList () {
      this.$ajax({
        url: '/store/account/user/comm/queryOrgGroupList',
        data: {
          orgId: this.form.orgId
        },
        success: data => {
          this.groupNameList = data.rows
          this.form.groupName = ''
        }
      })
    },
    // 通过groupname 获得custInfo
    getCustList () {
      this.$ajax({
        url: '/store/account/user/comm/getGroupCustList',
        data: {
          orgId: this.form.orgId,
          groupName: this.form.groupName
        },
        success: data => {
          this.custInfo = data.rows
        }
      })
    },
    // 关闭
    close () {
      this.visible = false
    },
    // 确定
    confirm () {
      this.$refs['form'].validate(valid => {
        var url = '/store/account/work/againAllotPond/checkTransOtherXDJL'
        if (this.invalidFlag) {
          url = '/store/account/work/invalidStorePool/checkTransOtherXDJL'
        }
        if (valid) {
          this.$ajax({
            url: url,
            data: {
              str: JSON.stringify({orders: this.orders}),
              orgId: this.form.orgId,
              customerId: this.form.customerId
            },
            loading: true,
            success: data => {
              this.$message(data.message)
              this.$emit('change', 'search')
            }
          })
        }
      })
    }
  }
}
</script>
