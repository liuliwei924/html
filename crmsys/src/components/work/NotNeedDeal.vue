<template>
  <el-dialog
    class="edit-dialog"
    title="不需要"
    :visible.sync="visible">
    <el-form
      :model="form"
      ref="form"
      label-width="150px">
      <el-form-item
        label="处理描述"
        prop="selectDesc"
        :rules="{required: true, message: '处理描述不能为空'}">
        <el-select
          v-model="form.selectDesc"
          multiple
          placeholder="请选择处理描述">
          <el-option
            v-for="item,index in selectDesc"
            :value="item"
            :key="index">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="描述">
        <el-input type="textarea" v-model.trim="form.inputDesc"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button @click="close">取消</el-button>
      <el-button :loading="loading" @click="confirm">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
// 不需要子组件
export default {
  name: 'not-need-deal',
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
      selectDesc: ['利息太高', '已经借到钱了', '长期联系不上', '额度太低', '不要了', '非本人申请', '空号', '号码过期']
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
              this.$emit('change', 'back')
            }
          })
        }
      })
    }
  }
}
</script>
