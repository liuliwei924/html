<template>
  <el-dialog class="edit-dialog" title="添加黑名单" :visible.sync="visible">
    <el-form :model="form" ref="form" label-width="150px">
      <el-form-item label="姓名" prop="name" :rules="{required: true, message: '姓名不能为空', trigger: 'blur'}">
        <el-input v-model="form.name" placeholder="请输入姓名"></el-input>
      </el-form-item>
      <el-form-item label="身份证" prop="cardNo" :rules="[{required: true, message: '身份证不能为空', trigger: 'blur'},{validator: checkCard, trigger: 'blur'}]">
        <el-input v-model="form.cardNo" :maxlength="18" placeholder="请输入身份证"></el-input>
      </el-form-item>
      <el-form-item label="手机号" prop="telephone" :rules="[{required: true, message: '手机号不能为空', trigger: 'blur'},{validator: checkTel, trigger: 'blur'}]">
        <el-input v-model="form.telephone" :maxlength="11" placeholder="请输入手机号"></el-input>
      </el-form-item>
      <el-form-item label="来源" prop="source" :rules="{required: true, message: '来源不能为空'}">
        <el-select v-model.number="form.source" placeholder="请选择来源">
          <el-option v-for="item,key,index in source" :label="item" :value="Number(key)" :key="index" ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="原因" prop="reason" :rules="{required: true, message: '原因不能为空', trigger: 'blur'}">
        <el-input type="textarea" :rows="3" v-model="form.reason" placeholder="请输入原因"></el-input>
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
  name: 'black-list-edit',
  props: {
    value: Boolean,
    blackData: Object,
    source: Object
  },
  data () {
    return {
      visible: this.value,
      form: {
        listId: '',
        name: '',
        cardNo: '',
        telephone: '',
        reason: '',
        source: ''
      },
      // 身份证号码校验
      checkCard (rule, value, callback) {
        /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/.test(value) ? callback() : callback(new Error('身份证号码格式不正确'))
      },
      // 手机号码校验
      checkTel (rule, value, callback) {
        /^1[34578]\d{9}$/.test(value) ? callback() : callback(new Error('手机号码格式不正确'))
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
    blackData (data) {
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
            url: '/crmsys/account/config/nameList/updateBlack',
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
