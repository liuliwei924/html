<template>
  <el-dialog class="edit-dialog" title="修改等级配置" v-model="visible">
    <el-form :model="form" ref="form" label-width="150px">
       <el-form-item
        label="能力等级编号"
        prop="gradeCode">
        <el-input v-model="form.gradeCode"></el-input>
      </el-form-item>
      <el-form-item
        label="能力等级名称"
        prop="gradeName">
        <el-input v-model="form.gradeName"></el-input>
      </el-form-item>
      <el-form-item
        label="基本分单数量"
        prop="baseCount">
        <el-input v-model="form.baseCount"></el-input>
      </el-form-item>
      <el-form-item
        label="最多分单数量/天"
        prop="maxCount">
        <el-input v-model="form.maxCount"></el-input>
      </el-form-item>
      <el-form-item
        label="最多再分配单数量/天"
        prop="maxAgainCount">
        <el-input v-model="form.maxAgainCount"></el-input>
      </el-form-item>
      <el-form-item
        label="处理中笔数"
        prop="dealCount">
        <el-input v-model="form.dealCount"></el-input>
      </el-form-item>
      <el-form-item
        label="可锁定单量"
        prop="lockCount">
        <el-input v-model="form.lockCount"></el-input>
      </el-form-item>
      <el-form-item
        label="已上门单数/天"
        prop="visitCount">
        <el-input v-model="form.visitCount"></el-input>
      </el-form-item>
      <el-form-item
        label="成功签单数/天"
        prop="sucCount">
        <el-input v-model="form.sucCount"></el-input>
      </el-form-item>
      <el-form-item
        label="回款金额/天"
        prop="backAmount">
        <el-input v-model="form.backAmount"></el-input>
      </el-form-item>
      <el-form-item
        label="回款笔数/天"
        prop="backCount">
        <el-input v-model="form.backCount"></el-input>
      </el-form-item>
      <el-form-item
        label="分配新单总数"
        prop="allotNewCount">
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
  name: 'rankConf-edit',
  props: {
    value: Boolean,
    rankConfData: Object
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
    rankConfData (obj) {
      this.form = {
        rankId: obj['rankId'] || '',
        gradeCode: obj['gradeCode'] || '',
        gradeName: obj['gradeName'] || '',
        baseCount: obj['baseCount'] || '',
        days: obj['days'] || 0,
        maxCount: obj['maxCount'] || '',
        maxAgainCount: obj['maxAgainCount'] || '',
        dealCount: obj['dealCount'] || '',
        lockCount: obj['lockCount'] || '',
        visitCount: obj['visitCount'] || '',
        sucCount: obj['sucCount'] || '',
        backAmount: obj['backAmount'] || '',
        backCount: obj['backCount'] || '',
        allotNewCount: obj['allotNewCount'] || ''
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
            url: '/store/account/config/rankConf/updateRankConf',
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
