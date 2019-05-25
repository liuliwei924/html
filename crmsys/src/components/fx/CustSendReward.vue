<template>
  <el-dialog class="edit-dialog" title="用户奖励发放" v-model="visible">
    <el-form :model="form" ref="form" label-width="150px">
       <el-form-item label="用户姓名" prop="realName" >
         <el-input v-model="form.realName" placeholder="用户姓名" readonly="readonly" disabled="disabled"></el-input>
       </el-form-item>
       <el-form-item label="用户手机" prop="telephone" >
        <el-input v-model="form.telephone" placeholder="用户手机" readonly="readonly" disabled="disabled"></el-input>
      </el-form-item>
      <el-form-item label="提成类型" prop="rewardType" :rules="{type: 'number',required: true, message: '提成类型不能为空', trigger: 'blur'}">
        <el-select v-model="form.rewardType" clearable placeholder="提成类型">
          <el-option label="管理员发放" :value="0"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="资金类型" prop="fundType" :rules="{required: true, message: '资金类型不能为空', trigger: 'blur'}">
        <el-select v-model="form.fundType" clearable placeholder="资金类型">
          <el-option label="福利" value="welfare"></el-option>
          <el-option label="工资" value="salary"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="发放金额" prop="sendRewardAmt" 
      :rules="{type: 'number', required: true, message: '发放金额不能为空', trigger: 'blur'}">
        <el-input v-model.number="form.sendRewardAmt" placeholder="请输入发放金额"></el-input>
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
  name: 'cust-send-reward',
  props: {
    value: Boolean,
    sendRewardData: Object
  },
  data () {
    return {
      visible: this.value,
      form: {
        rewardType: 0,
        fundType: '',
        sendRewardAmt: ''
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
    sendRewardData (data) {
      this.form = data
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
            url: '/store/account/fx/fxCust/sendReward',
            data: this.form,
            success: data => {
              this.$emit('change', 'search')
              this.$message({
                message: '发放成功！',
                type: 'success'
              })
            }
          })
        }
      })
    }
  }
}
</script>

