<template>
  <el-dialog class="edit-dialog" title="添加自动复核模板" :visible.sync="visible">
    <el-form :model="form" ref="form" label-width="150px">
      <el-form-item label="自动复核描述" prop="checkDesc" :rules="{required: true, message: '自动复核描述不能为空', trigger: 'blur'}">
        <el-input v-model="form.checkDesc" placeholder="请输入自动复核描述"></el-input>
      </el-form-item>
      <el-form-item label="最大贷款金额" prop="maxLoanAmount" :rules="{type: 'number', required: true, message: '最大贷款金额不能为空', trigger: 'blur'}">
        <el-input v-model.number="form.maxLoanAmount" placeholder="请输入最大贷款金额">
          <template slot="append">元</template>
        </el-input>
      </el-form-item>
      <el-form-item label="高风险规则命中数" prop="highRiskCount" :rules="{type: 'number', required: true, message: '高风险规则命中数不能为空', trigger: 'blur'}">
        <el-input v-model.number="form.highRiskCount" placeholder="请输入高风险规则命中数">
          <template slot="append">次</template>
        </el-input>
      </el-form-item>
      <el-form-item label="中风险规则命中数" prop="middleRiskCount" :rules="{type: 'number', required: true, message: '中风险规则命中数不能为空', trigger: 'blur'}">
        <el-input v-model.number="form.middleRiskCount" placeholder="请输入中风险规则命中数">
          <template slot="append">次</template>
        </el-input>
      </el-form-item>
      <el-form-item label="低风险规则命中数" prop="lowRiskCount" :rules="{type: 'number', required: true, message: '低风险规则命中数不能为空', trigger: 'blur'}">
        <el-input v-model.number="form.lowRiskCount" placeholder="请输入低风险规则命中数">
          <template slot="append">次</template>
        </el-input>
      </el-form-item>
      <el-form-item label="是否启用评分范围" prop="scoreEnable" :rules="{type: 'number', required: true, message: '是否启用不能为空', trigger: 'blur'}">
        <el-radio-group v-model.number="form.scoreEnable">
          <el-radio :label="1">启用</el-radio>
          <el-radio :label="0">禁用</el-radio>
        </el-radio-group>
      </el-form-item>
      <div class="limit-item clearfix" v-if="form.scoreEnable === 1">
        <label class="el-form-item__label">
          <span>个人评分范围</span>
        </label>
        <el-form-item prop="startScore" class="fl" label-width="0" :rules="{type: 'number', required: true, message: '最小评分不能为空', trigger: 'blur'}">
          <el-input v-model.number="form.startScore" placeholder="请输入最小评分"></el-input>
        </el-form-item>
        <div class="item-line fl">-</div>
        <el-form-item prop="endScore" class="fl" label-width="0" :rules="{type: 'number', required: true, message: '最大评分不能为空', trigger: 'blur'}">
          <el-input v-model.number="form.endScore" placeholder="请输入最大评分"></el-input>
        </el-form-item>
        <div class="el-input-group__append fl">分</div>
      </div>
    </el-form>
    <div slot="footer">
      <el-button @click="close">取消</el-button>
      <el-button @click="confirm">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'auto-review-edit',
  props: {
    value: Boolean,
    riskData: Object
  },
  data () {
    return {
      visible: this.value,
      form: {
        levelId: '',
        levelDesc: '',
        min1Day: '',
        max1Day: '',
        max2Day: '',
        max3Day: '',
        max4Day: '',
        max5Day: ''
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
    riskData (data) {
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
            url: '/crmsys/account/config/authCheck/update',
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
