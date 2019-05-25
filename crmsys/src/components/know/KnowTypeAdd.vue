<template>
  <el-dialog class="edit-dialog" title="添加知识库类型" v-model="visible">
    <el-form :model="form" ref="form" label-width="150px">
      <el-form-item
        label="类型名称"
        prop="typeName"
        :rules="{required: true, message: '必填项', trigger: 'blur'}">
        <el-input v-model="form.typeName"></el-input>
      </el-form-item>
      <el-form-item
        label="上一级目录"
        prop="parentId">
        <el-tree :data="productMenuData"
          show-checkbox
          highlight-current
          check-strictly
          ref="tree"
          :props="defaultProps"
          @node-click="handleNodeClick">
        </el-tree>
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
  name: 'knowType-add',
  props: {
    value: Boolean
  },
  data () {
    return {
      visible: this.value,
      productMenuData: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      form: {
        typeName: '',
        level: '',
        parentId: ''
      }
    }
  },
  watch: {
    value (val) {
      this.visible = val
      this.quereyProductMenu()
    },
    visible (val) {
      this.$emit('change', val)
    }
  },
  created () {
    this.quereyProductMenu()
  },
  methods: {
    // 关闭
    close () {
      this.visible = false
    },
    // 查询目录树
    quereyProductMenu () {
      this.productMenuData = []
       // 缓存查询条件
      this.$ajax({
        url: '/store/account/user/comm/queryProductMenu',
        success: data => {
          this.productMenuData = data.attr.proTypeData || []
        }
      })
    },
    handleNodeClick () {
    },
    // 确定
    confirm () {
      // 获取选中的parentId
      let checkLength = this.$refs.tree.getCheckedNodes().length
      if (checkLength > 0) {
        let parentInfo = this.$refs.tree.getCheckedNodes()[checkLength - 1]
        this.form.parentId = parentInfo.typeId
        this.form.level = parentInfo.level + 1
      } else {
        this.form.level = 1
        this.form.parentId = ''
      }
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.$ajax({
            url: '/store/account/know/knowTypeList/addProType',
            data: this.form,
            success: data => {
              this.quereyProductMenu()
              this.$emit('change', 'search')
            }
          })
        }
      })
    }
  }
}
</script>
