<template>
  <el-dialog class="edit-dialog" title="修改能力值项配置" :visible.sync="visible">
    <el-form :model="form" ref="form" label-width="150px">
      <el-form-item label="能力值项" prop="itemType" :rules="{required: true, message: '能力值项不能为空'}">
        <el-input v-model="form.itemType" placeholder="请输入能力值项"></el-input>
      </el-form-item>
      <el-form-item label="能力值一手奖惩值" prop="rewardFirstVal" :rules="{required: true, message: '能力值一手奖惩值不能为空'}">
        <el-input v-model="form.rewardFirstVal" placeholder="请输入能力值一手奖惩值"></el-input>
      </el-form-item>
      <el-form-item label="能力值再分配奖惩值" prop="rewardNextVal" :rules="{required: true, message: '能力值再分配奖惩值不能为空'}">
        <el-input v-model="form.rewardNextVal" placeholder="请输入能力值再分配奖惩值"></el-input>
      </el-form-item>
      <el-form-item label="描述" prop="detailDesc" :rules="{required: true, message: '描述不能为空'}">
        <el-input v-model="form.detailDesc" placeholder="请输入描述"></el-input>
      </el-form-item>
      <el-form-item
        label="是否禁用"
        prop="enable">
        <el-radio-group v-model="form.enable">
          <el-radio :label="0">禁用</el-radio>
          <el-radio :label="1">启动</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="参数" prop="params" :rules="{required: true, message: '参数不能为空'}">
        <el-input v-model="form.params" placeholder="请输入参数"></el-input>
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
  name: 'ability-item-add',
  props: {
    value: Boolean,
    abilltyData: Object
  },
  data () {
    return {
      visible: this.value,
      form: {
        itemType: '',
        rewardFirstVal: '',
        rewardNextVal: '',
        detailDesc: '',
        enable: 1,
        params: ''
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
    abilltyData (data) {
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
            url: '/store/account/config/abilityItem/updateAbilityItem',
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
