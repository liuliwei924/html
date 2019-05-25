<template>
  <el-dialog class="edit-dialog" title="编辑奖励类型" v-model="visible">
    <el-form :model="form" ref="form" label-width="150px">
      <el-form-item label="任务名称" prop="taskName" :rules="{required: false, message: '任务名称不能为空'}">
        <el-input v-model="form.taskName" placeholder="请输入类型名称"></el-input>
      </el-form-item>
      <el-form-item label="奖励值" prop="rewardValue" :rules="{required: false, message: '奖励值不能为空'}">
        <el-input v-model="form.rewardValue" placeholder="请输入奖励值"></el-input>
      </el-form-item>
      <el-form-item label="奖励期限(天)" prop="rewardTerm" :rules="{required: false, message: '奖励值不能为空'}">
        <el-input v-model="form.rewardTerm" placeholder="请输入奖励值"></el-input>
      </el-form-item>
      <el-form-item
        label="奖励类型"
        prop="rewardType"
        :rules="{type: 'number', required: false, message: '必填项', trigger: 'blur'}">
        <el-select v-model.number="form.rewardType"  placeholder="请选择奖励类型">
          <el-option
            v-for="val,key,index in rewardType"
            :label="val"
            :value="Number(key)"
            :key="index">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        label="展示类型"
        prop="showType"
        :rules="{type: 'number', required: false, message: '必填项'}">
        <el-select v-model.number="form.showType"  placeholder="请选择展示类型">
          <el-option
            v-for="val,key,index in showType"
            :label="val"
            :value="Number(key)"
            :key="index">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        label="任务类型"
        prop="taskType"
        :rules="{type: 'number', required: false, message: '必填项'}">
        <el-select v-model.number="form.taskType"  placeholder="请选择任务类型">
          <el-option
            v-for="val,key,index in taskType"
            :label="val"
            :value="Number(key)"
            :key="index">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="任务跳转路径" prop="taskUrl" :rules="{required: false, message: '任务跳转路径不能为空'}">
        <el-input v-model="form.taskUrl" type="textarea" :rows="2" placeholder="请输入任务跳转路径"></el-input>
      </el-form-item>
      <el-form-item label="任务描述" prop="taskDesc" :rules="{required: false, message: '任务描述不能为空'}">
        <el-input v-model="form.taskDesc" type="textarea" :rows="3" placeholder="请输入任务描述"></el-input>
      </el-form-item>
      <el-form-item
        label="序号"
        prop="taskIndex"
        :rules="{type: 'number', required: false, message: '必填项', trigger: 'blur'}">
        <el-input v-model.number="form.taskIndex"></el-input>
      </el-form-item>
       <el-form-item label="任务图标" class="gradeImg-uploader">
        <el-upload class="avatar-uploader" action="action" :show-file-list="false" :on-change="imgUrlHandle" :auto-upload="false">
          <img v-if="form.taskImg" :src="form.taskImg" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>
      <el-form-item
        label="是否启用"
        prop="enable"
        :rules="{type: 'number', required: false, message: '必填项', trigger: 'blur'}">
        <el-select v-model.number="form.enable"  placeholder="请选择是否启用">
          <el-option
            v-for="val,key,index in enable"
            :label="val"
            :value="Number(key)"
            :key="index">
          </el-option>
        </el-select>
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
  name: 'xjTaskCfg-edit',
  props: {
    value: Boolean,
    taskData: Object,
    enable: Object,
    rewardType: Object,
    showType: Object,
    taskType: Object
  },
  data () {
    return {
      first: true,
      visible: this.value,
      form: {
        taskId: '',
        taskName: '',
        rewardValue: '',
        rewardTerm: '',
        enable: '',
        rewardType: '',
        showType: '',
        taskType: '',
        taskUrl: '',
        taskDesc: '',
        taskIndex: '',
        taskImg: ''
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
    taskData (obj) {
      this.first = true
      this.form = {
        taskId: obj['taskId'] || '',
        taskName: obj['taskName'] || '',
        rewardValue: obj['rewardValue'] || '',
        rewardTerm: obj['rewardTerm'] || '',
        enable: obj['enable'] || 0,
        rewardType: obj['rewardType'] || 1,
        showType: obj['showType'] || 0,
        taskType: obj['taskType'] || 1,
        taskUrl: obj['taskUrl'] || '',
        taskDesc: obj['taskDesc'] || '',
        taskIndex: obj['taskIndex'] || '',
        taskImg: obj['taskImg'] || ''
      }
    }
  },
  methods: {
    // 项目图标处理
    imgUrlHandle (file, fileList) {
      this.$upload({
        url: '/store/uploadAction/uploadFile',
        data: {
          fileType: 'xjTaskImgUrl',
          file: file.raw
        },
        success: data => {
          this.form.taskImg = data.fileId
        }
      })
    },
    // 关闭
    close () {
      this.visible = false
    },
    // 确定
    confirm () {
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.$ajax({
            url: '/store/account/xj/xjTaskCfg/editTaskType',
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
