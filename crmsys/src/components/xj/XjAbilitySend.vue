<template>
  <el-dialog class="edit-dialog" title="手动发放狗粮" v-model="visible">
    <el-form :model="form" ref="form" label-width="150px">
      <el-form-item
        label="手机号"
        prop="codeAndtel"
        :rules="{required: true, message: '必填项', trigger: 'blur'}">
        <el-input v-model="form.codeAndtel" placeholder="邀请码或手机号"></el-input>
      </el-form-item>
      <el-form-item
        label="发放类型"
        prop="typeId"
        :rules="{type: 'number', required: true, message: '必填项', trigger: 'blur'}">
        <el-select v-model.number="form.typeId"  placeholder="请选择发放类型">
          <el-option
            v-for="val,key,index in typeNameList"
            :label="val.typeName"
            :value="Number(val.typeId)"
            :key="index">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        label="任务奖励类型"
        prop="taskId"
        :rules="{type: 'number', required: true, message: '必填项', trigger: 'blur'}">
        <el-select v-model.number="form.taskId"  placeholder="请选择奖励类型">
          <el-option
            v-for="val,key,index in taskNameList"
            :label="val.taskName"
            :value="Number(val.taskId)"
            :key="index">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="发放描述" prop="remark" :rules="{required: false, message: '发放描述不能为空'}">
        <el-input v-model="form.remark" type="textarea" :rows="2" placeholder="请输入内容"></el-input>
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
  name: 'xjAbility-send',
  props: {
    value: Boolean
  },
  data () {
    return {
      visible: this.value,
      form: {
        codeAndtel: '',
        typeId: '',
        taskId: '',
        remark: ''
      },
      typeNameList: [],
      taskNameList: []
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
  created () {
    this.getTypeName()
    this.getTaskName()
  },
  methods: {
    getTypeName () {
      this.$ajax({
        url: '/store/account/xj/xjReceive/queryTypeName',
        data: {typeKinds: 1},
        success: data => {
          this.typeNameList = data.attr['typeNameList']
        }
      })
    },
    getTaskName () {
      this.$ajax({
        url: '/store/account/xj/xjCust/queryTaskCfgList',
        success: data => {
          this.taskNameList = data.attr['taskCfgList']
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
            url: '/store/account/xj/xjCust/sendAbility',
            data: this.form,
            success: data => {
              this.$emit('change', 'search')
              this.close()
            }
          })
        }
      })
    }
  }
}
</script>