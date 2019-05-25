<template>
  <div class="content-box">
    <div class="config-box">
        <div class="config-title">全局配置</div>
        <el-form :inline="true" label-position="left" label-width="150px" :model="baseConfig" ref="baseConfigForm" class="config-form">
          <el-form-item label="新单分配成本" prop="allotPrice" :rules="{type: 'number', required: true, message: '新单分配成本不能为空', trigger: 'blur'}">
            <el-input v-model.number="baseConfig.allotPrice" placeholder="请输入新单分配成本"></el-input>
          </el-form-item>
          <el-form-item label="需要分单的城市" prop="allotCitys" :rules="{required: true, message: '需要分单的城市不能为空', trigger: 'blur'}">
            <el-input v-model="baseConfig.allotCitys" type="textarea" :rows="5" :cols="10" placeholder="请输入需要分单的城市"></el-input>
          </el-form-item>
        </el-form>
        <div class="config-deal">
          <button class="config-btn" type="button" @click="saveInfo(0)">保存</button>
        </div>
      </div>
  </div>
</template>

<script>
export default {
  name: 'sepa-conf',
  data () {
    return {
      baseConfig: {
        allotCitys: '',
        allotPrice: ''
      }
    }
  },
  created () {
    this.$ajax({
      url: '/store/account/config/sepaconf/querySepaInfo',
      success: data => {
        this.baseConfig = {
          configId: data.attr.baseConfig.configId,
          allotCitys: data.attr.baseConfig.allotCitys,
          allotPrice: data.attr.baseConfig.allotPrice
        }
      }
    })
  },
  methods: {
    saveInfo (index) {
      if (index === 0) {
        this.$refs['baseConfigForm'].validate((valid) => {
          if (!valid) {
            this.$msg('请按提示规则输入')
            return false
          }
          this.isLoading = true
          this.$ajax({
            url: '/store/account/config/sepaconf/updateBaseInfo',
            data: this.baseConfig,
            success: data => {
              this.isLoading = false
              this.$message('操作成功')
            },
            error: data => {
              this.isLoading = false
              this.$message(data.message)
            }
          })
        })
      }
    }
  }
}
</script>
