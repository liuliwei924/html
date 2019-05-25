<template>
  <el-dialog class="edit-dialog" title="修改知识库类型" v-model="visible">
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
          :default-checked-keys="[this.objParentId]"
          :default-expanded-keys="[this.objParentId]"
          node-key="typeId"
          check-strictly
          ref="tree"
          :props="defaultProps">
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
  name: 'knowType-edit',
  props: {
    value: Boolean,
    knowTypeData: Object
  },
  data () {
    return {
      visible: this.value,
      productMenuData: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      objParentId: '',
      objLevel: '',
      objTypeId: '',
      form: {
        typeName: '',
        level: '',
        typeId: '',
        parentId: ''
      }
    }
  },
  watch: {
    value (val) {
      this.visible = val
      this.queryProductMenu()
    },
    visible (val) {
      this.$emit('change', val)
    },
    objParentId (val) {
      this.objParentId = val
    },
    // 编辑数据变化
    knowTypeData (obj) {
      this.form = {
        typeId: obj['typeId'] || '',
        typeName: obj['typeName'] || '',
        level: obj['level'] || '',
        parentId: obj['parentId'] || ''
      }
      this.objParentId = obj['parentId'] || ''
      this.objLevel = obj['level'] || ''
      this.objTypeId = obj['typeId'] || ''
    }
  },
  created () {
    this.queryProductMenu()
  },
  methods: {
    // 关闭
    close () {
      this.visible = false
    },
    // 查询目录树
    queryProductMenu () {
      this.productMenuData = []
       // 缓存查询条件
      this.$ajax({
        url: '/store/account/user/comm/queryProductMenu',
        success: data => {
          this.productMenuData = data.attr.proTypeData || []
        }
      })
    },
    // 确定
    confirm () {
      let currLevel = this.objLevel
      let curTypeId = this.objTypeId
      let selectLevel = 1
      // 获取选中的parentId
      let checkLength = this.$refs.tree.getCheckedNodes().length
      if (checkLength > 1) {
        this.$msg('请只选择一个目录')
        return
      } else if (checkLength === 1) {
        let parentInfo = this.$refs.tree.getCheckedNodes()[checkLength - 1]
        this.form.parentId = parentInfo.typeId
        this.form.level = parentInfo.level + 1
        selectLevel = parentInfo.level
      } else {
        this.form.level = 1
        this.form.parentId = ''
      }
      if (curTypeId === this.form.parentId) {
        this.$msg('不能选择同一类型目录!')
        return
      }
      if (selectLevel > currLevel) {
        this.$msg('不能选择比当前低级别目录!')
        return
      }
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.$ajax({
            url: '/store/account/know/knowTypeList/updateProType',
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
