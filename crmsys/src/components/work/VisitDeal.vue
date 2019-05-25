<template>
  <el-dialog
    class="edit-dialog"
    title="添加上门"
    :visible.sync="visible">
    <el-form
      :model="form"
      ref="form"
      label-width="150px">
      <el-form-item
        label="上门时间"
        prop="visitTime"
        :rules="{required: true, message: '上门时间不能为空'}">
        <el-date-picker
          v-model="form.visitTime"
          type="datetime"
          editable
          :picker-options="visitTimeOptions"
          @change="visitTimeChange"
          placeholder="请选择">
        </el-date-picker>
      </el-form-item>
      <el-form-item
        label="上门描述"
        prop="visitDesc"
        :rules="{required: false, message: '上门描述不能为空'}">
        <el-input
          type="textarea"
          :maxlength="200"
          v-model.trim="form.visitDesc">
        </el-input>
      </el-form-item>
      <p style="text-align: right;padding-right: 22px;padding-bottom: 10px;">剩余字数：{{200 - form.visitDesc.length}}</p>
      <el-form-item
        label="接待人"
        prop="recCustId"
        :rules="{required: true, message: '接待人不能为空'}">
        <el-select
          v-model="form.recCustId"
          placeholder="请选择接待人">
          <el-option
            v-for="item,index in custData"
            :label="item['userName']"
            :value="item['customerId']"
            :key="index">
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button @click="close">取消</el-button>
      <el-button :loading="loading" @click="confirm">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
let flag = false
// 预约上门子组件
export default {
  name: 'visit-deal',
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
        recCustId: '',
        visitDesc: '',
        visitTime: ''
      },
      custData: [],
      // 上门时间禁用
      visitTimeOptions: {
        disabledDate (time) {
          return time.getTime() < Date.now() - 3 * 8.64e7 || time.getTime() > Date.now()
        }
      }
    }
  },
  beforeCreate () {
    flag = false
  },
  watch: {
    value (val) {
      this.visible = val
      if (!flag) this.getData()
    },
    visible (val) {
      this.$emit('change', val)
    },
    customerId (val) {
      this.form.customerId = val
    },
    bookInfo (arr) {
      let obj = arr[0] || {}
      this.form = {
        applyId: this.applyId,
        customerId: this.customerId,
        visitDesc: obj['visitDesc'] || '',
        recCustId: obj['recCustId'] || '',
        visitTime: obj['visitTime'] || ''
      }
    }
  },
  methods: {
    // 时间改变赋值
    visitTimeChange (date) {
      this.form.visitTime = date
    },
    // 关闭
    close () {
      this.visible = false
    },
    // 确定
    confirm () {
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.$ajax({
            url: '/store/account/work/waitDeal/visitDeal',
            data: this.form,
            loading: true,
            success: data => {
              this.$emit('change', 'back')
            }
          })
        }
      })
    },
    getData () {
      flag = true
      this.$ajax({
        url: '/store/account/user/comm/getOrgCustList',
        data: {
          orgId: this.custInfo.orgId
        },
        loading: true,
        success: data => {
          this.custData = data.rows || []
        }
      })
    }
  }
}
</script>
