<template>
  <el-dialog
    class="edit-dialog"
    title="编辑"
    v-model="visible">
    <!-- 表单处理 -->
    <el-form
      ref="form"
      :model="form"
      label-width="150px">
      <el-form-item
        label="用户名"
        prop="userName"
        :rules="{required: true, message: '必填项', trigger: 'blur'}">
        <el-input v-model="form.userName"  disabled></el-input>
      </el-form-item>
      <el-form-item
        label="手机号"
        prop="telephone"
        :rules="{required: true, message: '必填项', trigger: 'blur'}">
        <el-input v-model="form.telephone"  disabled></el-input>
      </el-form-item>
      <el-form-item
        label="权限角色"
        prop="roleId"
        :rules="{type: 'number', required: true, message: '必填项', trigger: 'blur'}">
        <el-select
          v-model.number="form.roleId"
          filterable
          disabled
          placeholder="请选择">
          <el-option
            v-for="item,index in roleList"
            :label="item.roleName"
            :value="item.roleId"
            :key="index">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        label="用户角色"
        prop="roleType"
        :rules="{type: 'number', required: true, message: '必填项', trigger: 'blur'}">
        <el-select
          v-model.number="form.roleType"
          filterable
          placeholder="请选择">
          <el-option
            v-for="val,key,index in roleType"
            :label="val"
            :value="Number(key)"
            :key="index">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        label="组名"
        prop="groupName"
        v-if="roleType !== 1">
        <el-input v-model="form.groupName"></el-input>
      </el-form-item>
      <el-form-item
        label="队名"
        prop="teamName"
        v-if="roleType !== 1">
        <el-input v-model="form.teamName"></el-input>
      </el-form-item>
      <el-form-item label="门店">
        <el-select
          v-model="form.orgId"
          disabled
          placeholder="请选择">
          <el-option
            v-for="item,index in userOrgs"
            :label="item.orgNo + '-' + item.orgName"
            :value="item.orgId"
            :key="index">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item class="multiple-form-item" label="管理门店">
        <el-checkbox v-model="isAll" disabled>管理所有门店</el-checkbox>
        <el-select
          v-model="form.userOrgs"
          filterable
          multiple
          disabled
          placeholder="请选择"
          v-if="!isAll">
          <el-option
            v-for="item,index in userOrgs"
            :label="item.orgNo + '-' + item.orgName"
            :value="item.orgId"
            :key="index">
          </el-option>
        </el-select>
      </el-form-item>
      <!-- <el-form-item
        label="能力值"
        prop="totalAbility"
        :rules="{type: 'number', required: true, message: '必填项', trigger: 'blur'}"
        v-if="roleType !== 1">
        <el-input v-model.number="form.totalAbility" disabled></el-input>
      </el-form-item> -->
      <template v-if="roleType !== 1">
        <el-form-item
          label="等级"
          prop="gradeCode"
          :rules="{type: 'number', required: true, message: '必填项', trigger: 'blur'}">
          <el-select v-model.number="form.gradeCode"  placeholder="请选择">
            <el-option
              v-for="val,key,index in gradeCode"
              :label="val"
              :value="Number(key)"
              :key="index">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="是否可分单"
          prop="isAllotOrder"
          :rules="{type: 'number', required: true, message: '必填项', trigger: 'blur'}">
          <el-select v-model.number="form.isAllotOrder"  placeholder="请选择">
            <el-option
              v-for="val,key,index in isAllotOrder"
              :disabled="index === 4 && !userRole"
              :label="val"
              :value="Number(key)"
              :key="index">
            </el-option>
          </el-select>
        </el-form-item>
      </template>
    </el-form>
    <div slot="footer">
      <el-button @click="close">取消</el-button>
      <el-button :loading="loading" @click="saveHandle">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
// 操作员编辑组件
export default {
  name: 'operator-edit',
  // 父组件传递参数
  props: {
    value: Boolean,
    editData: Object,
    roleList: Array,
    userOrgs: Array,
    gradeCode: Object,
    isAllotOrder: Object
  },
  data () {
    let userRole = this.$localStorage('userRole') === '1'
    return {
      userRole,
      visible: this.value, // 弹窗是否显示
      loading: false, // 加载动画
      form: {
        customerId: '',
        userName: '',
        telephone: '',
        roleId: '',
        totalAbility: '',
        groupName: '',
        teamName: '',
        orgId: '',
        userOrgs: [],
        roleType: '',
        gradeCode: 1,
        isAllotOrder: 0
      },
      // 用户角色
      roleType: {
        3: '业务员',
        6: '门店负责人',
        7: '门店经理',
        8: '门店主管',
        9: '门店队长'
      },
      isAll: false
    }
  },
  watch: {
    // 监听父组件传递的参数变化
    value (val) {
      this.visible = val
    },
    // 弹窗显示改变传递给父组件
    visible (val) {
      this.$emit('change', val)
    },
    // 编辑数据变化
    editData (obj) {
      let isAll = obj['userOrgs'] === 'all'
      this.form = {
        customerId: obj['customerId'] || '',
        userName: obj['userName'] || '',
        telephone: obj['telephone'] || '',
        roleId: obj['roleId'] || '',
        totalAbility: obj['totalAbility'] || 0,
        groupName: obj['groupName'] || '',
        teamName: obj['teamName'] || '',
        orgId: obj['orgId'] || '',
        roleType: obj['roleType'] || '',
        userOrgs: (isAll || !obj['userOrgs']) ? [] : obj['userOrgs'].split(',').map(item => Number(item)),
        gradeCode: obj['gradeCode'] || 1,
        isAllotOrder: obj['isAllotOrder'] || 0
      }
      this.isAll = isAll
    },
    // 编辑中门店处理值变化
    'form.orgId' (val, old) {
      // 门店管理添加默认门店
      let userOrgs = new Set(this.form.userOrgs)
      userOrgs.delete(old)
      userOrgs.add(val)
      this.form.userOrgs = Array.from(userOrgs)
    }
  },
  methods: {
    // 弹窗关闭
    close () {
      this.visible = false
    },
    // 保存处理
    saveHandle () {
      this.form.userOrgs = this.isAll ? 'all' : this.form.userOrgs.join(',')
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.$ajax({
            url: '/store/account/config/operator/updateInfo',
            data: this.form,
            loading: true,
            success: data => {
              this.$emit('change', 'search')
              this.visible = false
            }
          })
        }
      })
    }
  }
}
</script>
