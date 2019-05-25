<template>
  <el-dialog
    class="edit-dialog"
    title="继续跟进"
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
      <el-form-item
        label="跟进提醒时间"
        prop="bookTime">
        <el-date-picker
          v-model="form.bookTime"
          type="datetime"
          editable
          @change="bookTimeChange"
          placeholder="请选择">
      </el-date-picker>
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
// 继续跟进子组件
export default {
  name: 'follow-up-deal',
  props: {
    value: Boolean,
    applyId: [Number, String],
    bookStatus: [Number, String],
    customerId: [Number, String]
  },
  data () {
    return {
      visible: this.value,
      loading: false,
      form: {
        bookTime: '',
        bookStatus: '',
        selectDesc: [],
        inputDesc: ''
      },
      selectDesc: ['继续跟进', '未接听', '联系来不方便', '犹豫中', '预约其他时间', '空号', '过期']
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
    // 时间改变赋值
    bookTimeChange (date) {
      this.form.bookTime = date
    },
    // 确定
    confirm () {
      this.$refs['form'].validate(valid => {
        if (valid) {
          let handleDesc = `${this.form.selectDesc.join(',')},${this.form.inputDesc}`
          this.$ajax({
            url: '/store/account/work/waitDeal/followUpDeal',
            data: {
              applyId: this.applyId,
              customerId: this.customerId,
              bookTime: this.form.bookTime,
              bookStatus: this.bookStatus,
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
