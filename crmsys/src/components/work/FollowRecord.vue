<template>
  <div class="follow-record">
    <el-form
      :model="form"
      :inline="true"
      ref="form"
      label-width="40px">
      <div class="fr-item">
        <el-form-item 
          label="描述">
          <el-input type="textarea" v-model.trim="form.inputDesc" :maxlength="200"></el-input>
        </el-form-item>
        <p style="text-align: right;padding-right: 22px;">剩余字数：{{200 - form.inputDesc.length}}</p>
      </div>
      <div class="fr-item">
        <el-checkbox v-model="isBookTimeChange">添加提醒</el-checkbox>
        <el-form-item
          v-if="isBookTimeChange"
          class="fr-input"
          label="时间"
          prop="bookTime">
          <el-date-picker
            v-model="form.bookTime"
            type="datetime"
            editable
            @change="bookTimeChange"
            placeholder="请选择">
          </el-date-picker>
        </el-form-item>
      </div>
      <el-form-item>
        <el-button class="fr-btn" :loading="loading" @click="confirm">确定</el-button>
      </el-form-item>
    </el-form>
    <div class="fr-tips">
      <span class="tip-word" :class="val && 'cur'" v-for="val, key in selectDescObj" @click="keyHandle(key, val)">{{key}}</span>
    </div>
  </div>
    <!-- <div slot="footer">
      <el-button @click="close">取消</el-button>
      <el-button :loading="loading" @click="confirm">确定</el-button>
    </div> -->
</template>

<script>
// 继续跟进子组件
export default {
  name: 'follow-up-deal',
  props: {
    value: Boolean,
    applyId: [Number, String],
    bookStatus: [Number, String],
    prevOrderStatusVal: [Number, String],
    customerId: [Number, String]
  },
  data () {
    return {
      isBookTimeChange: false,
      visible: this.value,
      loading: false,
      form: {
        bookTime: '',
        bookStatus: '',
        selectDesc: '',
        inputDesc: ''
      },
      selectDesc: ['未接听', '不方便', '犹豫中', '预约其他时间', '空号', '过期', '其他'],
      selectDescObj: {
        '未接听': false,
        '关机': false,
        '拒接': false,
        '空号': false,
        '过期': false,
        '不方便': false,
        '犹豫中': false,
        '预约其他时间': false,
        '异地': false,
        '不需要': false,
        '非本人': false,
        '同行': false,
        '无条件': false,
        '信息不符': false,
        '黑户': false,
        '其他': false
      },
      curSelectDesc: ''
    }
  },
  watch: {
    value (val) {
      this.visible = val
    },
    visible (val) {
      this.$emit('input', val)
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
          if (this.form.selectDesc.indexOf('其他') === -1 &&
            (this.form.inputDesc === '其他,' || this.form.inputDesc === '其他')) {
            this.$msg('其他描述不能为空')
            return
          }
          let handleDesc = `${this.form.inputDesc}`
          if (!handleDesc) {
            this.$msg('描述不能为空')
            return
          }
          this.$ajax({
            url: '/store/account/work/waitDeal/addFollowRecord',
            data: {
              applyId: this.applyId,
              customerId: this.customerId,
              bookTime: this.form.bookTime,
              bookStatus: this.bookStatus,
              handleDesc
            },
            loading: true,
            success: data => {
              this.visible = false
              this.form = {
                bookTime: '',
                bookStatus: '',
                selectDesc: '',
                inputDesc: ''
              }
              this.$emit('change')
            }
          })
        }
      })
    },
    keyHandle (key, val) {
      if (this.curSelectDesc.indexOf(key) > -1) {
        this.curSelectDesc = this.curSelectDesc.replace(key + ',', '')
      } else {
        this.curSelectDesc += key + ','
      }
      this.selectDescObj[key] = !val
      this.form.inputDesc = this.curSelectDesc
    }
  }
}
</script>
