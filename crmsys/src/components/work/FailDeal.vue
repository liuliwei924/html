<template>
  <el-dialog
    class="edit-dialog"
    title="不能做"
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
// 不能做子组件
export default {
  name: 'fail-deal',
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
      selectDesc: ['黑名单用户', '三无人员', '暂无条件', '征信查询次数过多', '年龄不够', '区域错误', '负债太高']
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
            url: '/store/account/work/waitDeal/failDeal',
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
