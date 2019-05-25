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
        label="菜单代号"
        prop="menuCode"
        :rules="{required: true, message: '必填项', trigger: 'blur'}">
        <el-input v-model="form.menuCode"></el-input>
      </el-form-item>
      <el-form-item
        label="菜单名称"
        prop="menuName"
        :rules="{required: true, message: '必填项', trigger: 'blur'}">
        <el-input v-model="form.menuName"></el-input>
      </el-form-item>
      <el-form-item
        label="菜单URL"
        prop="menuUrl"
        :rules="{required: true, message: '必填项', trigger: 'blur'}">
        <el-input v-model="form.menuUrl"></el-input>
      </el-form-item>
      <el-form-item
        label="菜单级别"
        prop="level"
        :rules="{type: 'number', required: true, message: '必填项', trigger: 'blur'}">
        <el-select
          v-model.number="form.level"
          filterable
          placeholder="请选择">
          <el-option v-for="val,key,index in level" :label="val" :value="Number(key)" :key="index"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        label="排序号"
        prop="orderNum"
        :rules="{type: 'number', required: true, message: '必填项', trigger: 'blur'}">
        <el-input v-model.number="form.orderNum"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button @click="close">取消</el-button>
      <el-button :loading="loading" @click="saveHandle">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
// 角色列表编辑组件
export default {
  name: 'role-edit',
  // 父组件传递参数
  props: {
    value: Boolean,
    menuData: Object,
    level: Object
  },
  data () {
    return {
      visible: this.value, // 弹窗是否显示
      loading: false, // 加载动画
      form: {
        menuId: '',
        menuCode: '',
        menuName: '',
        menuUrl: '',
        level: '',
        orderNum: ''
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
    },
    // 编辑数据变化
    menuData (obj) {
      this.form = {
        menuId: obj['menuId'] || '',
        menuCode: obj['menuCode'] || '',
        menuName: obj['menuName'] || '',
        menuUrl: obj['menuUrl'] || '',
        level: obj['level'] || '',
        orderNum: obj['orderNum'] || ''
      }
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
            url: '/store/account/config/menu/update',
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
