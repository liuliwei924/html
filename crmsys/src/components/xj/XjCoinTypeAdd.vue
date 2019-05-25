<template>
  <el-dialog class="edit-dialog" title="添加狗币类型配置" v-model="visible">
    <el-form :model="form" ref="form" label-width="150px">
      <el-form-item
        label="类型编号"
        prop="typeId"
        :rules="{required: true, message: '必填项', trigger: 'blur'}">
        <el-input v-model="form.typeId"></el-input>
      </el-form-item>
      <el-form-item
        label="类型名称"
        prop="typeName"
        :rules="{required: true, message: '必填项', trigger: 'blur'}">
        <el-input v-model="form.typeName"></el-input>
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
  name: 'xjCoinType-add',
  props: {
    value: Boolean,
    typeKinds: Object
  },
  data () {
    return {
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
            url: '/store/account/xj/xjCoinTypeCfg/addCoinType',
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