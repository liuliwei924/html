<template>
  <div class="record-content">
    <el-button class="record-edit-btn" :icon="status ? 'edit' : 'document'" @click="type !== 'doc' ? statusChange(true) : statusChange(false)" v-if="type !== 'add'">
      {{status ? '编辑' : '查看'}}
    </el-button>
    <template v-if="status">
      <el-form class="clearfix" ref="form" :model="form" label-width="30%">
        <el-form-item label="还款所属分行" prop="payBranchName" :rules="{required: true, message: '还款所属分行不能为空', trigger: 'blur'}">
          <el-input v-model="form.payBranchName" placeholder="请填写"></el-input>
        </el-form-item>
        <el-form-item label="还款户名" prop="payUserName" :rules="{required: true, message: '还款户名不能为空', trigger: 'blur'}">
          <el-input v-model="form.payUserName" placeholder="请填写" :maxlength="20"></el-input>
        </el-form-item>
        <el-form-item label="还款银行卡号" prop="payBankCode" :rules="{required: true, message: '还款银行卡号不能为空', trigger: 'blur'}">
          <el-input v-model="form.payBankCode" placeholder="请填写" :maxlength="19"></el-input>
        </el-form-item>
        <el-form-item label="收款所属分行" prop="acceBranchName" :rules="{required: true, message: '收款所属分行不能为空', trigger: 'blur'}">
          <el-input v-model="form.acceBranchName" placeholder="请填写"></el-input>
        </el-form-item><br>
        <el-form-item label="收款户名" prop="acceUserName" :rules="{required: true, message: '收款户名不能为空', trigger: 'blur'}">
          <el-input v-model="form.acceUserName" placeholder="请填写" :maxlength="20"></el-input>
        </el-form-item>
        <el-form-item label="收款银行卡号" prop="acceBankCode" :rules="{required: true, message: '收款银行卡号不能为空', trigger: 'blur'}">
          <el-input v-model="form.acceBankCode" placeholder="请填写" :maxlength="19"></el-input>
        </el-form-item>
      </el-form>
      <div class="record-content-ctrl">
        <!-- <el-button class="cancal__btn">取消</el-button> -->
        <el-button class="confirm__btn" @click="saveHandle">保存</el-button>
      </div>
    </template>
    <div class="el-form__view" v-else>
      <div class="el-form-item">
        <div class="el-form-item__label">还款所属分行</div>
        <div class="el-form-item__content">{{form.payBranchName}}</div>
      </div>
      <div class="el-form-item">
        <div class="el-form-item__label">还款户名</div>
        <div class="el-form-item__content">{{form.payUserName}}</div>
      </div>
      <div class="el-form-item">
        <div class="el-form-item__label">还款银行卡号</div>
        <div class="el-form-item__content">{{form.payBankCode}}</div>
      </div>
      <div class="el-form-item">
        <div class="el-form-item__label">收款所属分行</div>
        <div class="el-form-item__content">{{form.acceBranchName}}</div>
      </div>
      <div class="el-form-item">
        <div class="el-form-item__label">收款户名</div>
        <div class="el-form-item__content">{{form.acceUserName}}</div>
      </div>
      <div class="el-form-item">
        <div class="el-form-item__label">收款银行卡号</div>
        <div class="el-form-item__content">{{form.acceBankCode}}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'apply-bank',
  props: {
    type: String, // add:添加模式 edit:编辑模式 doc:查看模式
    info: Object
  },
  data () {
    return {
      status: this.type !== 'doc', // 非查看模式
      form: {
        applyId: '',
        payBranchName: '',
        payUserName: '',
        payBankCode: '',
        acceBranchName: '',
        acceUserName: '',
        acceBankCode: ''
      }
    }
  },
  watch: {
    info (obj) {
      this.form = {
        applyId: obj['applyId'],
        payBranchName: obj['payBranchName'],
        payUserName: obj['payUserName'],
        payBankCode: obj['payBankCode'],
        acceBranchName: obj['acceBranchName'],
        acceUserName: obj['acceUserName'],
        acceBankCode: obj['acceBankCode']
      }
    }
  },
  methods: {
    // 状态切换
    statusChange (isChange) {
      if (isChange) {
        this.status = !this.status
      }
    },
    // 保存
    saveHandle () {
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.$ajax({
            url: '/crmsys/account/busi/enterInfo/saveApplyBank',
            data: this.form,
            success: data => {
              if (this.type !== 'add') this.status = false
            }
          })
        }
      })
    }
  }
}
</script>
