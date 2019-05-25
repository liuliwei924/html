<template>
  <div class="content-box">
    <div class="config-box">
        <div class="config-title">会员配置</div>
        <el-form :inline="true" label-position="left" label-width="150px" :model="vipConfData" ref="vipConfForm" class="config-form">
          <el-form-item label="1年个人会员费用" prop="oneYearVipFee" :rules="{type: 'number', required: true, message: '1年个人会员费用不能为空', trigger: 'blur'}">
            <el-input v-model.number="vipConfData.oneYearVipFee" placeholder="请输入年个人会员费用"></el-input>
          </el-form-item>
          <el-form-item label="2年个人会员费用" prop="twoYearVipFee" :rules="{type: 'number', required: true, message: '2年个人会员费用不能为空', trigger: 'blur'}">
            <el-input v-model.number="vipConfData.twoYearVipFee" placeholder="请输入2年个人会员费用"></el-input>
          </el-form-item>
          <el-form-item label="企业会员费用" prop="companyVipFee" :rules="{type: 'number', required: true, message: '企业会员费用不能为空', trigger: 'blur'}">
            <el-input v-model.number="vipConfData.companyVipFee" placeholder="请输入企业会员费用"></el-input>
          </el-form-item><br>
          <el-form-item label="1年个人会员原价" prop="oneYearVipOriginal" :rules="{type: 'number', required: true, message: '1年个人会员原价不能为空', trigger: 'blur'}">
            <el-input v-model.number="vipConfData.oneYearVipOriginal" placeholder="请输入1年个人会员原价"></el-input>
          </el-form-item>
          <el-form-item label="2年个人会员原价" prop="twoYearVipOriginal" :rules="{type: 'number', required: true, message: '2年个人会员原价不能为空', trigger: 'blur'}">
            <el-input v-model.number="vipConfData.twoYearVipOriginal" placeholder="请输入2年个人会员原价"></el-input>
          </el-form-item>
          <el-form-item label="企业会员原价" prop="companyVipOriginal" :rules="{type: 'number', required: true, message: '企业会员原价不能为空', trigger: 'blur'}">
            <el-input v-model.number="vipConfData.companyVipOriginal" placeholder="请输入企业会员原价"></el-input>
          </el-form-item>
        </el-form>
        <div class="config-deal">
          <button class="config-btn" type="button" @click="saveInfo()">保存</button>
        </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'wzVip-conf',
  data () {
    return {
      vipConfData: {
        configId: '',
        oneYearVipFee: '',
        twoYearVipFee: '',
        companyVipFee: '',
        oneYearVipOriginal: '',
        twoYearVipOriginal: '',
        companyVipOriginal: ''
      }
    }
  },
  created () {
    this.searchInfo()
  },
  methods: {
    saveInfo () {
      this.$refs['vipConfForm'].validate((valid) => {
        if (!valid) {
          this.$msg('请按提示规则输入')
          return false
        }
        this.isLoading = true
        this.$ajax({
          url: '/store/account/wz/wzVipConf/saveVipConf',
          data: this.vipConfData,
          success: data => {
            this.isLoading = false
            this.$message('操作成功')
            this.searchInfo()
          },
          error: data => {
            this.isLoading = false
            this.$message(data.message)
          }
        })
      })
    },
    searchInfo () {
      this.$ajax({
        url: '/store/account/wz/wzVipConf/queryVipConf',
        success: data => {
          this.vipConfData = data.rows[0] || {}
        }
      })
    }
  }
}
</script>
