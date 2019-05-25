<template>
  <el-dialog class="edit-dialog" title="添加游戏奖励" v-model="visible">
    <el-form :model="form" ref="form" label-width="150px">
      <el-form-item
        label="名次"
        prop="ranking"
        :rules="{required: true, message: '必填项', trigger: 'blur'}">
        <el-input v-model="form.ranking"></el-input>
      </el-form-item>
      <el-form-item
        label="奖励"
        prop="reward"
        :rules="{type: 'number', required: true, message: '必填项', trigger: 'blur'}">
        <el-input v-model.number="form.reward"></el-input>
      </el-form-item>
      <el-form-item
        label="排序"
        prop="indexOrder"
        :rules="{type: 'number', required: true, message: '必填项', trigger: 'blur'}">
        <el-input v-model.number="form.indexOrder"></el-input>
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
  name: 'xjGameRew-add',
  props: {
    value: Boolean
  },
  data () {
    return {
      visible: this.value,
      form: {
        ranking: '',
        reward: '',
        indexOrder: ''
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
            url: '/store/account/xj/xjGameRewCfg/addGameRew',
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