<template>
 <el-dialog class="edit-dialog double-dialog" title="申请详情信息" v-model="visible">
      <el-form :model="form" ref="form" label-width="150px">
        <el-form-item label="一级奖励人(姓名)：" prop="userName1">
          <span class="sumRed">{{ form.userName1 ? form.userName1 : '无' }}</span>
        </el-form-item>
        <el-form-item label="一级奖励人(手机号)：" prop="telephone1">
          <span class="sumRed">{{ form.telephone1 ? form.telephone1 : '无' }}</span>
        </el-form-item>
        <el-form-item label="一级奖励人(工号)：" prop="workNo1">
          <span class="sumRed">{{ form.workNo1 ? form.workNo1 : '无' }}</span>
        </el-form-item>
        <el-form-item label="一级奖金：" prop="refererAmt1">
          <span class="sumRed">{{ form.refererAmt1 ? form.refererAmt1 : 0 }}</span>
        </el-form-item>
        <el-form-item label="二级奖励人(姓名)：" prop="userName2">
          <span class="sumRed">{{ form.userName2 ? form.userName2 : '无' }}</span>
        </el-form-item>
        <el-form-item label="二级奖励人(手机号)：" prop="telephone2">
          <span class="sumRed">{{ form.telephone2 ? form.telephone2 : '无' }}</span>
        </el-form-item>
        <el-form-item label="二级奖励人(工号)：" prop="workNo2">
          <span class="sumRed">{{ form.workNo2 ? form.workNo2 : '无' }}</span>
        </el-form-item>
        <el-form-item label="二级奖金：" prop="refererAmt2">
          <span class="sumRed">{{ form.refererAmt2 ? form.refererAmt2 : 0 }}</span>
        </el-form-item>
        <el-form-item label="三级奖励人(姓名)：" prop="userName3">
          <span class="sumRed">{{ form.userName3 ? form.userName3 : '无' }}</span>
        </el-form-item>
        <el-form-item label="三级奖励人(手机号)：" prop="telephone3">
          <span class="sumRed">{{ form.telephone3 ? form.telephone3 : '无' }}</span>
        </el-form-item>
        <el-form-item label="三级奖励人(工号)：" prop="workNo3">
          <span class="sumRed">{{ form.workNo3 ? form.workNo3 : '无' }}</span>
        </el-form-item>
         <el-form-item label="三级奖金：" prop="refererAmt3">
          <span class="sumRed">{{ form.refererAmt3 ? form.refererAmt3 : 0 }}</span>
        </el-form-item>
        <el-form-item label="四级奖励人(姓名)：" prop="userName4">
          <span class="sumRed">{{ form.userName4 ? form.userName4 : '无' }}</span>
        </el-form-item>
        <el-form-item label="四级奖励人(手机号)：" prop="telephone4">
          <span class="sumRed">{{ form.telephone4 ? form.telephone4 : '无' }}</span>
        </el-form-item>
        <el-form-item label="四级奖励人(工号)：" prop="workNo4">
          <span class="sumRed">{{ form.workNo4 ? form.workNo4 : '无' }}</span>
        </el-form-item>
         <el-form-item label="四级奖金：" prop="refererAmt4">
          <span class="sumRed">{{ form.refererAmt4 ? form.refererAmt4 : 0 }}</span>
        </el-form-item>
      </el-form>
    </div>
</el-dialog>
</template>

<script>
export default {
  name: 'fx-apply-dtl',
  props: {
    value: Boolean,
    fxApplyDtlData: Object
  },
  data () {
    return {
      visible: this.value,
      form: {
        title: '',
        grade: '',
        enable: 1
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
    fxApplyDtlData (data) {
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
      // this.$refs['form'].validate(valid => {
      //   if (valid) {
      //     let contentStr = this.form.content
      //     contentStr = contentStr.replace(/\n/g, '<br>')
      //     this.form.content = contentStr
      //     this.$ajax({
      //       url: '/store/account/fx/fxHelp/updateHelpInfo1',
      //       data: this.form,
      //       success: data => {
      //         this.$emit('change', 'search')
      //       }
      //     })
      //   }
      // })
    }
  }
}
</script>

<style>
  .sumRed {
    color: red;
  }
</style>