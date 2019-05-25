<template>
  <el-dialog class="edit-dialog" title="编辑游戏奖励" v-model="visible">
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
  name: 'xjGameRew-edit',
  props: {
    value: Boolean,
    custData: Object
  },
  data () {
    return {
      first: true,
      visible: this.value,
      form: {
        id: '',
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
    },
    // 编辑数据变化
    custData (obj) {
      this.first = true
      this.form = {
        id: obj['id'] || '',
        ranking: obj['ranking'] || '',
        reward: obj['reward'] || '',
        indexOrder: obj['indexOrder'] || ''
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
            url: '/store/account/xj/xjGameRewCfg/editGameRew',
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
