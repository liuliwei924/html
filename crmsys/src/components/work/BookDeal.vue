<template>
  <el-dialog
    class="edit-dialog"
    title="预约上门"
    :visible.sync="visible">
    <el-form
      :model="form"
      ref="form"
      label-width="150px">
      <el-form-item
        label="预约类型"
        prop="bookType"
        :rules="{type: 'number', required: true, message: '预约类型不能为空',trigger: 'change'}">
        <el-select
          v-model.number="form.bookType"
          placeholder="请选择预约类型">
          <el-option
            v-for="val,key,index in bookType"
            :label="val"
            :value="Number(key)"
            :key="index">
          </el-option>
        </el-select>
      </el-form-item>
      <template v-if="form.bookType === 1">
        <el-form-item
          label="预约上门时间"
          prop="bookTime"
          :rules="{required: true, message: '预约上门时间不能为空'}">
          <el-date-picker
            v-model="form.bookTime"
            type="datetime"
            editable
            :picker-options="bookTimeOptions"
            @change="bookTimeChange"
            placeholder="请选择">
          </el-date-picker>
        </el-form-item>
        <el-form-item
          label="上门地点"
          prop="address"
          :rules="{required: true, message: '上门地点不能为空'}">
          <el-input
            type="textarea"
            v-model.trim="form.address">
          </el-input>
        </el-form-item>
        <el-form-item
          label="预约上门描述"
          prop="bookDesc"
          :rules="{required: true, message: '预约上门描述不能为空'}">
          <el-input
            type="textarea"
            :maxlength="200"
            v-model.trim="form.bookDesc">
          </el-input>
        </el-form-item>
        <p style="text-align: right;padding-right: 22px;">剩余字数：{{200 - form.bookDesc.length}}</p>
      </template>
      <template v-if="form.bookType === 2">
        <el-form-item
          label="预约回访时间"
          prop="bookTime"
          :rules="{required: true, message: '预约回访时间不能为空'}">
          <el-date-picker
            v-model="form.bookTime"
            type="datetime"
            editable
            :picker-options="bookTimeOptions"
            @change="bookTimeChange"
            placeholder="请选择">
          </el-date-picker>
        </el-form-item>
        <el-form-item
          label="预约回访描述"
          prop="bookDesc"
          :rules="{required: true, message: '预约回访描述不能为空'}">
          <el-input
            type="textarea"
            :maxlength="200"
            v-model.trim="form.bookDesc">
          </el-input>
        </el-form-item>
        <p style="text-align: right;padding-right: 22px;">剩余字数：{{200 - form.bookDesc.length}}</p>
      </template>
      <el-form-item
        label="短信通知客户"
        @change.native="changeSmsNotice"
        prop="isSmsNotice"
        :rules="{required: true, message: '短信通知客户不能为空'}">
        <el-radio-group v-model.number="form.isSmsNotice">
          <el-radio
            v-for="val,key,index in isSmsNotice"
            :label="Number(key)"
            :key="index">{{val}}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item
        label="短信内容"
        prop="smsContent"
        :rules="{required: true, message: '短信内容不能为空'}"
        v-if="form.isSmsNotice === 1">
        <el-input
          type="textarea"
          v-model.trim="form.smsContent">
        </el-input>
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button @click="close">取消</el-button>
      <el-button :loading="loading" @click="confirm">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
// 预约上门子组件
export default {
  name: 'book-deal',
  props: {
    value: Boolean,
    applyId: [Number, String],
    customerId: [Number, String],
    custInfo: Object,
    bookInfo: Array
  },
  data () {
    return {
      visible: this.value,
      loading: false,
      form: {
        applyId: this.applyId,
        customerId: this.customerId,
        bookTime: '',
        address: '',
        bookDesc: '',
        isSmsNotice: '',
        bookType: '',
        smsContent: ''
      },
      // 预约类型
      bookType: {
        1: '预约上门',
        2: '预约回访'
      },
      // 预约时间禁用
      bookTimeOptions: {
        disabledDate (time) {
          return time.getTime() < Date.now() - 8.64e7
        }
      },
      isSmsNotice: {
        0: '否'
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
    bookInfo (arr) {
      let obj = arr[0] || {}
      this.form = {
        applyId: this.applyId,
        customerId: this.customerId,
        bookTime: obj['bookTime'] || '',
        address: obj['address'] || '',
        bookDesc: obj['bookDesc'] || '',
        isSmsNotice: obj['isSmsNotice'] || 0,
        bookType: obj['bookType'] || 1,
        smsContent: obj['smsContent'] || ''
      }
    }
  },
  methods: {
    // 时间改变赋值
    bookTimeChange (date) {
      this.form.bookTime = date
    },
    // 改变短信通知客户
    changeSmsNotice () {
      if (this.form.bookType === 1) {
        if (!this.form.bookTime || !this.form.address) {
          this.$message('预约时间和指定地点不能为空!')
        } else {
          this.form.smsContent = `请您于${this.form.bookTime}到${this.form.address}找${this.custInfo.realName}经理,联系电话${this.custInfo.telephone}`
        }
      } else {
        if (!this.form.bookTime || !this.form.bookDesc) {
          this.$message('回访时间和回访描述不能为空!')
        } else {
          this.form.smsContent = `${this.form.bookDesc}找${this.custInfo.realName}经理,联系电话${this.custInfo.telephone}`
        }
      }
    },
    // 关闭
    close () {
      this.visible = false
    },
    // 确定
    confirm () {
      if (Number(+new Date(this.form.bookTime) < Number(+new Date()))) {
        this.$msg('预约时间不能小于今天')
      } else {
        this.$refs['form'].validate(valid => {
          if (valid) {
            this.$ajax({
              url: '/store/account/work/waitDeal/bookDeal',
              data: this.form,
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
}
</script>
