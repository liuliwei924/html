<template>
  <div class="content-box">
    <div class="config-box">
      <div class="config-item">
        <div class="config-title">新单配置</div>
        <el-form :inline="true" label-position="left" label-width="150px" :model="newAllot" ref="newAllotForm" class="config-form">

          <el-form-item label="没处理再分配(单/分钟)" prop="notHandl" :rules="{type: 'number', required: true, message: '没处理再分配不能为空', trigger: 'blur'}">
            <el-input v-model.number="newAllot.notHandl" placeholder="请输入没处理再分配"></el-input>
          </el-form-item>
          <el-form-item label="没上门再分配(单/天)" prop="notVisitor" :rules="{type: 'number', required: true, message: '没上门再分配不能为空', trigger: 'blur'}">
            <el-input v-model.number="newAllot.notVisitor" placeholder="请输入没上门再分配"></el-input>
          </el-form-item>
          <el-form-item label="没签约再分配(单/天)" prop="notSign" :rules="{type: 'number', required: true, message: '没签约再分配不能为空', trigger: 'blur'}">
            <el-input v-model.number="newAllot.notSign" placeholder="请输入没签再"></el-input>
          </el-form-item>
          <!-- <el-form-item label="再分配类型" prop="againType" :rules="{type: 'number', required: false, message: '再分配类型不能为空', trigger: 'blur'}">
            <el-input v-model.number="newAllot.againType" placeholder="请输入再分配类型"></el-input>
          </el-form-item> -->
        </el-form>
        <div class="config-deal">
          <button class="config-btn" type="button" @click="saveInfo(0)">保存</button>
        </div>
      </div>
      <div class="config-item">
        <div class="config-title">再分配单配置</div>
        <el-form :inline="true" label-position="left" label-width="150px" :model="againAllot" ref="againAllotForm" class="config-form">
          <el-form-item label="没处理再分配(单/分钟)" prop="notHandl" :rules="{type: 'number', required: true, message: '没处理再分配不能为空', trigger: 'blur'}">
            <el-input v-model.number="againAllot.notHandl" placeholder="请输入没处理再分配"></el-input>
          </el-form-item>
          <el-form-item label="没上门再分配(单/天)" prop="notVisitor" :rules="{type: 'number', required: true, message: '没上门再分配不能为空', trigger: 'blur'}">
            <el-input v-model.number="againAllot.notVisitor" placeholder="请输入没上门再分配"></el-input>
          </el-form-item>
          <el-form-item label="没签约再分配(单/天)" prop="notSign" :rules="{type: 'number', required: true, message: '没签约再分配不能为空', trigger: 'blur'}">
            <el-input v-model.number="againAllot.notSign" placeholder="请输入没签再"></el-input>
          </el-form-item>
          <!-- <el-form-item label="再分配类型" prop="againType" :rules="{type: 'number', required: false, message: '再分配类型不能为空', trigger: 'blur'}">
            <el-input v-model.number="againAllot.againType" placeholder="请输入再分配类型"></el-input>
          </el-form-item> -->
        </el-form>
        <div class="config-deal">
          <button class="config-btn" type="button" @click="saveInfo(1)">保存</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'again-conf',
  data () {
    return {
      newAllot: {
        againId: '',
        notHandl: '',
        notVisitor: '',
        notSign: '',
        againType: ''
      },
      againAllot: {
        againId: '',
        notHandl: '',
        notVisitor: '',
        notSign: '',
        againType: ''
      }
    }
  },
  created () {
    this.searchInfo()
  },
  methods: {
    saveInfo (index) {
      if (index === 0) {
        this.$refs['newAllotForm'].validate((valid) => {
          if (!valid) {
            this.$msg('请按提示规则输入')
            return false
          }
          this.isLoading = true
          this.$ajax({
            url: '/store/account/config/againConf/updateNewAlltoInfo',
            data: this.newAllot,
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
      }
      if (index === 1) {
        this.$refs['againAllotForm'].validate((valid) => {
          if (!valid) {
            this.$msg('请按提示规则输入')
            return false
          }
          this.isLoading = true
          this.$ajax({
            url: '/store/account/config/againConf/updateAgainAlltoInfo',
            data: this.againAllot,
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
      }
    },
    searchInfo () {
      this.$ajax({
        url: '/store/account/config/againConf/queryAgainInfo',
        success: data => {
          this.newAllot = data.attr.newAllot
          this.againAllot = data.attr.againAllot
        }
      })
    }
  }
}
</script>
