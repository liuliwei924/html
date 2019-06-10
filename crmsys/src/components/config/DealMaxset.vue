<template>
<el-dialog class="edit-dialog" :title="title" v-model="show">
  <el-form ref="form" :model="form" label-width="150px">
    <el-form-item label="代号" prop="channelCode" :rules="{required: true, message: '代号必填', trigger: 'blur'}">
      <el-input v-model="form.channelCode" :disabled="isEdit"></el-input>
    </el-form-item>
    <el-form-item label="渠道名称" prop="channelName" :rules="{required: true, message: '代号必填', trigger: 'blur'}">
      <el-input v-model="form.channelName"></el-input>
    </el-form-item>
    <el-form-item label="渠道类型" prop="type" :rules="{required: true, message: '必选项', trigger: 'blur'}">
      <el-select v-model="form.type" placeholder="请选择渠道类型">
        <el-option
          v-for="(item,index) in this.$parent.types"
          :label="item.label"
          :value="item.value" :key="index">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="团队代号" prop="teamNo" :rules="{required: true, message: '必选项', trigger: 'blur'}">
      <el-select v-model="form.teamNo" placeholder="请选择团队">
        <el-option
          v-for="(item,index) in this.$parent.teams"
          :label="item.teamName"
          :value="item.teamNo" :key="index">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="流量类型" prop="flowType" :rules="{required: true, message: '必选项', trigger: 'blur'}">
      <el-select v-model="form.flowType" placeholder="请选择流量类型">
        <el-option
          v-for="(item,index) in this.$parent.flowTypes"
          :label="item.label"
          :value="item.value" :key="index">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="投放位置" prop="launchPlace" :rules="{required: true, message: '必选项', trigger: 'blur'}">
      <el-select v-model="form.launchPlace" placeholder="请选择投放位置">
        <el-option
          v-for="(item,index) in this.$parent.launchPlaces"
          :label="item.label"
          :value="item.value" :key="index">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="渠道商户号" prop="merchId">
      <el-input v-model="form.merchId" :maxlength="20"></el-input>
    </el-form-item>
    <el-form-item label="渠道别名" prop="channelNick">
      <el-input v-model="form.channelNick" :maxlength="20"></el-input>
    </el-form-item>
    <el-form-item label="分单等级" prop="allotGrade">
      <el-select v-model="form.allotGrade" placeholder="请选择分单等级">
        <el-option
          v-for="(item, index) in this.$parent.allotGrades"
          :label="item.label"
          :value="item.value" :key="index">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="是否计算成本" prop="isCost">
      <el-select v-model="form.isCost" placeholder="请选择是否计算成本">
        <el-option
          v-for="(item,index) in this.$parent.isCosts"
          :label="item.label"
          :value="item.value" :key="index">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item class="kf-dialog-btn">
      <el-button @click="addBtn" :disabled="isLoading" :loading="isLoading">
        <span v-if="!isEdit">添加</span>
        <span v-else>修改</span>
      </el-button>
      <el-button @click="closeAlert">取消</el-button>
    </el-form-item>
  </el-form>
</el-dialog>
</template>
<script>
let url = '/store/account/channel/code/add'
export default{
  name: 'deal-minset',
  data () {
    return {
      isLoading: false,
      show: false,
      title: '添加大类',
      isEdit: false,
      form: {
        channelCode: '',
        channelName: '',
        type: '',
        launchPlace: '',
        flowType: '',
        channelNick: '',
        merchId: '',
        teamNo: '',
        allotGrade: '',
        isCost: ''
      }
    }
  },
  methods: {
    closeAlert () {
      this.show = false
    },
    addBtn () {
      this.$refs['form'].validate((valid) => {
        if (!valid) {
          this.$message({message: '请按提示规则输入', type: 'error'})
          return false
        }
        if (this.isEdit) {
          url = '/store/account/spread/channelCode/edit'
        } else {
          url = '/store/account/spread/channelCode/add'
        }
        this.isLoading = true
        let form = {
          channelCode: this.form.channelCode || '',
          channelName: this.form.channelName || '',
          type: this.form.type || '',
          launchPlace: this.form.launchPlace || '',
          flowType: this.form.flowType || '',
          merchId: this.form.merchId || '',
          teamNo: this.form.teamNo || '',
          allotGrade: this.form.allotGrade || '',
          channelNick: this.form.channelNick || '',
          isCost: this.form.isCost || ''
        }
        this.$ajax({
          url: url,
          data: form,
          success: data => {
            this.show = false
            this.isLoading = false
            this.$message({message: '操作成功', type: 'success'})
            this.$parent.search(this.$parent.formCurrentPage)
          },
          err: err => {
            this.isLoading = false
            this.$message({message: err.message, type: 'error'})
          }
        })
      })
    }
  }
}
</script>
