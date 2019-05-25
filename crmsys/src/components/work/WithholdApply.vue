<template>
  <el-dialog
    class="edit-dialog edit-dialog__bank"
    title="代扣申请"
    :visible.sync="visible">
    <el-button class="order-bank__btn" @click="addBank">添加银行卡</el-button>
    <el-form
      :model="form"
      ref="form"
      label-width="150px">
      <el-form-item
        label="真实姓名"
        prop="applyName"
        :rules="{required: true, message: '真实姓名不能为空',trigger: 'blur'}">
        <el-input
          v-model="form.applyName"
          placeholder="请输入真实姓名">
        </el-input>
      </el-form-item>
      <el-form-item
        label="银行卡"
        prop="selectDesc"
        :rules="{required: true, message: '银行卡不能为空'}">
        <el-select
          v-model="form.selectDesc"
          multiple
          placeholder="请选择银行卡">
          <el-option
            v-for="item,index in selectDesc"
            :value="item"
            :key="index">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        label="身份证号"
        prop="cardNo"
        :rules="{required: true, message: '身份证号不能为空',trigger: 'blur'}">
        <el-input
          v-model="form.cardNo"
          placeholder="请输入身份证号">
        </el-input>
      </el-form-item>
      <el-form-item
        label="手机号码"
        prop="telephone"
        :rules="{type: 'number',required: true, message: '手机号格式有误',trigger: 'blur'}">
        <el-input
          v-model.number="form.telephone"
          placeholder="请输入手机号码" :maxlength="11">
        </el-input>
      </el-form-item>
      <el-form-item
        label="金额"
        prop="signAmount"
        :rules="{type: 'number',required: true, message: '金额不能为空',trigger: 'blur'}">
        <el-input
          v-model.number="form.signAmount"
          placeholder="请输入金额">
          <template slot="append">万元</template>
        </el-input>
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button @click="close">取消</el-button>
      <el-button :loading="loading" @click="confirm">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
// 代扣申请子组件
export default {
  name: 'withhold-apply',
  props: {
    value: Boolean,
    applyId: [Number, String],
    customerId: [Number, String]
  },
  data () {
    return {
      visible: this.value,
      loading: false,
      form: {
        selectDesc: [],
        inputDesc: ''
      },
      selectDesc: ['联系不上', '额度太低', '不要了']
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
    addBank () {
      this.$emit('addBank', 'addBank')
    },
    // 关闭
    close () {
      this.visible = false
    },
    // 确定
    confirm () {
      this.$refs['form'].validate(valid => {
        if (valid) {
          let handleDesc = `${this.form.selectDesc.join(',')},${this.form.inputDesc}`
          this.$ajax({
            url: '/store/account/work/waitDeal/notNeedDeal',
            data: {
              applyId: this.applyId,
              customerId: this.customerId,
              handleDesc
            },
            loading: true,
            success: data => {
              this.visible = false
            }
          })
        }
      })
    }
  }
}
</script>
