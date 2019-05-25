<template>
  <el-dialog class="edit-dialog" title="手动发放天狗币" v-model="visible">
    <el-form :model="form" ref="form" label-width="150px">
      <el-form-item
        label="手机号"
        prop="codeAndtel"
        :rules="{required: true, message: '必填项', trigger: 'blur'}">
        <el-input v-model="form.codeAndtel" placeholder="邀请码或手机号"></el-input>
      </el-form-item>
      <el-form-item
        label="数量"
        prop="abilityValue"
        :rules="{required: true, message: '必填项', trigger: 'blur'}">
        <el-input v-model="form.abilityValue"></el-input>
      </el-form-item>
      <el-form-item
        label="发放类型"
        prop="typeId"
        :rules="{type: 'number', required: true, message: '必填项', trigger: 'blur'}">
        <el-select v-model.number="form.typeId"  placeholder="请选择发放类型">
          <el-option
            v-for="val,key,index in typeNameList"
            :label="val.typeName"
            :value="Number(val.typeId)"
            :key="index">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="发放描述" prop="remark" :rules="{required: false, message: '发放描述不能为空'}">
        <el-input v-model="form.remark" type="textarea" :rows="2" placeholder="请输入内容"></el-input>
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
  name: 'xjCoin-send',
  props: {
    value: Boolean
  },
  data () {
    return {
      visible: this.value,
      form: {
        codeAndtel: '',
        abilityValue: '',
        typeId: '',
        remark: ''
      },
      typeNameList: []
    }
  },
  watch: {
    value (val) {
      this.visible = val
    },
    visible (val) {
      this.$emit('change', val)
    },
    typeNameList (arr) {
      this.first = true
      this.typeNameList = arr
    }
  },
  created () {
    this.getTypeName()
  },
  methods: {
    getTypeName () {
      this.$ajax({
        url: '/store/account/xj/xjReceive/queryTypeName',
        data: {typeKinds: 2},
        success: data => {
          this.typeNameList = data.attr['typeNameList']
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
          this.$ajax({
            url: '/store/account/xj/xjCust/sendCoin',
            data: this.form,
            success: data => {
              this.$emit('change', 'search')
              this.close()
            }
          })
        }
      })
    }
  }
}
</script>