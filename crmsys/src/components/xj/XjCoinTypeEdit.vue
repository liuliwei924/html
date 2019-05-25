<template>
  <el-dialog class="edit-dialog" title="编辑狗币类型配置" v-model="visible">
    <el-form :model="form" ref="form" label-width="150px">
      <el-form-item label="类型编号" prop="typeId" :rules="{required: false, message: '类型编号不能为空'}">
        <el-input v-model="form.typeId" disabled placeholder="请输入类型编号"></el-input>
      </el-form-item>
      <el-form-item label="类型名称" prop="typeName" :rules="{required: false, message: '类型名称不能为空'}">
        <el-input v-model="form.typeName" placeholder="请输入类型名称"></el-input>
      </el-form-item>
      <el-form-item
        label="发放类型"
        prop="typeKinds"
        :rules="{type: 'number', required: true, message: '必填项', trigger: 'blur'}">
        <el-select v-model.number="form.typeKinds"  placeholder="请选择发放类型">
          <el-option
            v-for="val,key,index in typeKinds"
            :label="val"
            :value="Number(key)"
            :key="index">
          </el-option>
        </el-select>
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
  name: 'xjCoinTypel-edit',
  props: {
    value: Boolean,
    custData: Object,
    typeKinds: Object
  },
  data () {
    return {
      first: true,
      visible: this.value,
      form: {
        typeId: '',
        typeName: '',
        typeKinds: ''
      }
    }
  },
  watch: {
    value (val) {
      this.visible = val
    },
    visible (val) {
      this.$emit('change', val)
    },
    // 编辑数据变化
    custData (obj) {
      this.first = true
      this.form = {
        typeId: obj['typeId'] || '',
        typeName: obj['typeName'] || '',
        typeKinds: obj['typeKinds'] || 0
      }
    }
  },
  methods: {
    // 关闭
    close () {
      this.visible = false
    },
    // 确定
    confirm () {
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.$ajax({
            url: '/store/account/xj/xjCoinTypeCfg/editCoinType',
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
