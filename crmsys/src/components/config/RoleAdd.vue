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
        label="角色名称"
        prop="roleName"
        :rules="{required: true, message: '必填项', trigger: 'blur'}">
        <el-input v-model="form.roleName"></el-input>
      </el-form-item>
      <el-form-item
        label="是否默认角色"
        prop="isDefault"
        :rules="{type: 'number', required: true, message: '必填项', trigger: 'blur'}">
        <el-radio-group v-model.number="form.isDefault">
          <el-radio
            v-for="val,key,index in isDefault"
            :label="Number(key)"
            :key="index">{{val}}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item
        label="角色类型"
        prop="roleType"
        :rules="{type: 'number', required: true, message: '必填项', trigger: 'blur'}">
        <el-radio-group v-model.number="form.roleType">
          <el-radio
            v-for="val,key,index in roleType"
            :label="Number(key)"
            :key="index">{{val}}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item
        label="角色描述"
        prop="roleDesc"
        :rules="{required: true, message: '必填项', trigger: 'blur'}">
        <el-input type="textarea" v-model="form.roleDesc"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button @click="close">取消</el-button>
      <el-button :loading="loading" @click="saveHandle">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
// 角色列表添加组件
export default {
  name: 'role-add',
  // 父组件传递参数
  props: {
    value: Boolean,
    isDefault: Object,
    roleType: Object
  },
  data () {
    return {
      visible: this.value, // 弹窗是否显示
      loading: false, // 加载动画
      form: {
        roleName: '',
        isDefault: 0,
        roleType: 1,
        roleDesc: ''
      }
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
    }
  },
  methods: {
    // 弹窗关闭
    close () {
      this.visible = false
    },
    // 保存处理
    saveHandle () {
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.$ajax({
            url: '/store/account/config/role/addRole',
            data: this.form,
            loading: true,
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
