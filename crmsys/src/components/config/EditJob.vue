<template lang="html">
  <el-dialog title="任务" :visible.sync="isShow" width="560px" center :show-close="false" :close-on-click-modal="false">
    <el-form :model="form" ref="form" label-width="100px" size="small">
      <el-form-item label="任务代码" prop="typeCode" :rules="{ required: true, message: '任务代码', trigger: 'blur' }">
        <el-input v-model="form.typeCode" :disabled="isEdit"></el-input>
      </el-form-item>
      <el-form-item label="任务名称" prop="jobName" 
        :rules="{ required: true, message: '请输入系统Key', trigger: 'blur' }">
        <el-input v-model="form.jobName"></el-input>
      </el-form-item>
      <el-form-item label="执行方式" prop="executeType" 
        :rules="{type: 'number', required: true, message: '执行方式', trigger: 'blur' }">
         <el-select v-model="form.executeType"
          clearable
          placeholder="请选择">
          <el-option
            v-for="val,key,index in executeType"
            :label="val"
            :value="Number(key)"
            :key="index">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="循环值" prop="recurrentValue" 
        :rules="{ required: true, message: '请输入循环值', trigger: 'blur' }">
        <el-input v-model="form.recurrentValue"></el-input>
      </el-form-item>
      <el-form-item label="结束方式" prop="endType" 
        :rules="{type: 'number', required: true, message: '执行方式', trigger: 'blur' }">
         <el-select v-model="form.endType"
          clearable
          placeholder="请选择">
          <el-option
            v-for="val,key,index in endType"
            :label="val"
            :value="Number(key)"
            :key="index">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="任务描述" prop="jobDesc" 
        :rules="{ required: true, message: '任务描述', trigger: 'blur' }">
        <el-input v-model="form.jobDesc"></el-input>
      </el-form-item>
      <el-form-item label="当前状态" prop="jobStatus" 
        :rules="{type: 'number', required: true, message: '执行方式', trigger: 'blur' }">
         <el-select v-model="form.jobStatus"
          clearable
          placeholder="请选择">
          <el-option
            v-for="val,key,index in jobStatusArr"
            :label="val"
            :value="Number(key)"
            :key="index">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="是否启用" prop="enable" :rules="{type: 'number', required: true, message: '是否启用', trigger: 'blur' }">
         <el-select v-model="form.enable"
          clearable
          placeholder="请选择">
          <el-option
            v-for="val,key,index in enableSelect"
            :label="val"
            :value="Number(key)"
            :key="index">
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="submitForm">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'edit-job',
  props: {
    isShow: Boolean,
    jobInfo: Object,
    isEdit: Boolean
  },
  data () {
    return {
      form: {
        jobName: '',
        executeType: '',
        typeCode: '',
        recurrentValue: '',
        endType: '',
        jobDesc: '',
        jobStatus: '',
        enable: ''
      },
      enableSelect: ['禁用', '启用'],
      executeType: ['立即执行', '定期执行', '定期循环执行'],
      endType: ['无限循环', '设置日期'],
      jobStatusArr: ['等待运行', '运行中', '运行成功', '运行失败', '被取消', '已经过期', '已经完成']
    }
  },
  watch: {
    jobInfo (obj) {
      this.form = obj
    }
  },
  methods: {
    submitForm () {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          if (this.isEdit) {
            this.$ajax({
              url: '/store/account/config/job/update',
              data: this.form,
              success: data => {
                this.$message({message: '保存成功', type: 'success'})
                this.$emit('close', 'refresh')
              }
            })
          } else {
            this.$ajax({
              url: '/store/account/config/job/insert',
              data: Object.assign({}, this.form),
              success: data => {
                this.$message({message: '保存成功', type: 'success'})
                this.$emit('close', 'refresh')
              }
            })
          }
        }
      })
    },
    close () {
      this.$emit('close')
    }
  }
}
</script>
