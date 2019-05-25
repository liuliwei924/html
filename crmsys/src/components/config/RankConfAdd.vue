<template>
  <el-dialog class="edit-dialog" title="添加等级配置" v-model="visible">
    <el-form :model="form" ref="form" label-width="150px">
      <el-form-item
        label="能力等级编号"
        prop="gradeCode"
        :rules="{required: true, message: '必填项', trigger: 'blur'}">
        <el-input v-model="form.gradeCode"></el-input>
      </el-form-item>
      <el-form-item
        label="能力等级名称"
        prop="gradeName"
        :rules="{required: true, message: '必填项', trigger: 'blur'}">
        <el-input v-model="form.gradeName"></el-input>
      </el-form-item>
      <el-form-item
        label="基本分单数量"
        prop="baseCount"
        :rules="{required: true, message: '必填项', trigger: 'blur'}">
        <el-input v-model="form.baseCount"></el-input>
      </el-form-item>
      <el-form-item
        label="最多分单数量/天"
        prop="maxCount"
        :rules="{required: true, message: '必填项', trigger: 'blur'}">
        <el-input v-model="form.maxCount"></el-input>
      </el-form-item>
       <el-form-item
        label="最多再分配单数量/天"
        prop="maxAgainCount"
        :rules="{required: true, message: '必填项', trigger: 'blur'}">
        <el-input v-model="form.maxAgainCount"></el-input>
      </el-form-item>
      <el-form-item
        label="处理中笔数"
        prop="dealCount"
        :rules="{required: true, message: '必填项', trigger: 'blur'}">
        <el-input v-model="form.dealCount"></el-input>
      </el-form-item>
      <el-form-item
        label="可锁定单量"
        prop="lockCount"
        :rules="{required: true, message: '必填项', trigger: 'blur'}">
        <el-input v-model="form.lockCount"></el-input>
      </el-form-item>
      <el-form-item
        label="已上门单数/天"
        prop="visitCount"
        :rules="{required: true, message: '必填项', trigger: 'blur'}">
        <el-input v-model="form.visitCount"></el-input>
      </el-form-item>
      <el-form-item
        label="成功签单数/天"
        prop="sucCount"
        :rules="{required: true, message: '必填项', trigger: 'blur'}">
        <el-input v-model="form.sucCount"></el-input>
      </el-form-item>
      <el-form-item
        label="回款金额/天"
        prop="backAmount"
        :rules="{required: true, message: '必填项', trigger: 'blur'}">
        <el-input v-model="form.backAmount"></el-input>
      </el-form-item>
      <el-form-item
        label="回款笔数/天"
        prop="backCount"
        :rules="{required: true, message: '必填项', trigger: 'blur'}">
        <el-input v-model="form.backCount"></el-input>
      </el-form-item>
      <el-form-item
        label="分配新单总数"
        prop="allotNewCount"
        :rules="{required: true, message: '必填项', trigger: 'blur'}">
        <el-input v-model="form.allotNewCount"></el-input>
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
  name: 'rankConf-add',
  props: {
    value: Boolean
  },
  data () {
    return {
      visible: this.value,
      form: {
        gradeCode: '',
        gradeName: '',
        baseCount: '',
        maxCount: '',
        maxAgainCount: '',
        dealCount: '',
        lockCount: '',
        visitCount: '',
        sucCount: '',
        backAmount: '',
        backCount: '',
        allotNewCount: ''
      },
      // 能力等级
      gradeCode: {
        1: '试用一级',
        2: '试用二级',
        3: '正式一级',
        4: '正式二级',
        5: '高阶一级',
        6: '高阶二级'
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
            url: '/store/account/config/rankConf/addRankConf',
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
