<template>
 <el-dialog class="edit-dialog double-dialog" title="申请详情信息" v-model="visible">
      <el-form :model="form" ref="form" label-width="150px">
        <el-form-item label="一级奖励人(姓名)：" prop="realName1">
          <span class="sumRed">{{ form.realName1 ? form.realName1 : '无' }}</span>
        </el-form-item>
        <el-form-item label="一级现金奖金：" prop="refererReward">
          <span class="sumRed">{{ form.refererReward ? form.refererReward : '无' }}</span>
        </el-form-item>
        <el-form-item label="一级狗粮奖励：" prop="refererAbilityReward">
          <span class="sumRed">{{ form.refererAbilityReward ? form.refererAbilityReward : '无' }}</span>
        </el-form-item>
         <el-form-item label="二级奖励人(姓名)：" prop="realName2">
          <span class="sumRed">{{ form.realName2 ? form.realName2 : '无' }}</span>
        </el-form-item>
        <el-form-item label="二级现金奖金：" prop="parentRefererReward">
          <span class="sumRed">{{ form.parentRefererReward ? form.parentRefererReward : 0 }}</span>
        </el-form-item>
        <el-form-item label="二级奖励人(姓名)：" prop="parentRefererAbilityReward">
          <span class="sumRed">{{ form.parentRefererAbilityReward ? form.parentRefererAbilityReward : '无' }}</span>
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