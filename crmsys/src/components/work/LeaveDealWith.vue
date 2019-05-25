<template>
  <el-dialog
    class="edit-dialog"
    title="离职处理"
    :visible.sync="visible">
    <el-form
      :model="form"
      ref="form"
      label-width="150px">
      <el-form-item
        label="离职人:"
        :rules="{required: true}">
        <div class="el-form-item__contents" style="color:red;">
          {{realName}}
        </div>
      </el-form-item>
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
            v-for="item,index in netOrgList"
            :label="item.orgNo + '-' + item.orgName"
            :value="item.orgId"
            :key="index">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item 
        label="所属组名:">
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
      <el-form-item class="multiple-form-item" 
        label="门店人员:"
        :rules="{required: true, message: '门店人员不能为空'}">
        <el-select
          v-model="form.custIds"
          filterable
          multiple
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
// 离职处理子组件
export default {
  name: 'leave-dealWith',
  props: {
    value: Boolean,
    netOrgList: Array,
    realName: String,
    leavelCustId: [Number, String]
  },
  data () {
    return {
      visible: this.value,
      loading: false,
      form: {
        orgId: '',
        custIds: '',
        groupName: ''
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
    form: {
      handler: function (val) {
        if (this.form['custIds'].length > 0) {
          this.custIds = this.form['custIds'].join(',')
        }
      },
      deep: true
    }
  },
  methods: {
    // 改变组列
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
    // 通过groupname 获得custinfo
    getCustList () {
      this.$ajax({
        url: '/store/account/user/comm/getGroupCustList',
        data: {
          orgId: this.form.orgId,
          groupName: this.form.groupName,
          leavelCustId: this.leavelCustId
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
        if (valid) {
          let loadInst = this.$loading({ fullscreen: true, text: '拼命加载中' })
          this.$ajax({
            url: '/store/account/config/allotOrderInfo/leaveDealWith',
            data: {
              orgId: this.form.orgId,
              custIds: this.custIds,
              customerId: this.leavelCustId
            },
            success: data => {
              this.$emit('change', 'search')
              loadInst.close()
            },
            fail: (error) => {
              this.$msg(error.message)
              loadInst.close()
            }
          })
        }
      })
    }
  }
}
</script>
