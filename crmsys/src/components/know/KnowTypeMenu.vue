<template>
  <el-dialog class="edit-dialog" title="知识库类型" v-model="visible">
    <el-form :model="form" ref="form" label-width="150px">
      <el-form-item
        label="产品类型"
        prop="parentId">
        <el-tree :data="productMenuData"
          show-checkbox
          highlight-current
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
  name: 'knowType-menu',
  props: {
    value: Boolean
  },
  data () {
    return {
      visible: this.value,
      productMenuData: [],
      form: {
      },
      defaultProps: {
        children: 'children',
        label: 'label'
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
      // 获取选中的parentId
      let checkLength = this.$refs.tree.getCheckedNodes().length
      if (checkLength > 1) {
        this.$msg('请只选择一个产品类型目录')
        return
      } else if (checkLength === 1) {
        let parentInfo = this.$refs.tree.getCheckedNodes()[checkLength - 1]
        this.$parent.searchForm.productType = parentInfo.typeId
        this.$parent.searchForm.productTypeName = parentInfo.typeName
      } else {
        this.$parent.searchForm.productType = ''
        this.$parent.searchForm.productTypeName = ''
      }
      this.$emit('change', 'search')
    }
  }
}
</script>
