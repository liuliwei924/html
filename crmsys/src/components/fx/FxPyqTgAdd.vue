<template>
  <el-dialog class="edit-dialog" title="添加海报大类" v-model="visible">
    <el-form :model="form" ref="form" label-width="150px">
      <el-form-item label="类型名称" prop="typeName" :rules="{required: true, message: '类型名称不能为空', trigger: 'blur'}">
        <el-input v-model="form.typeName" placeholder="请输入类型名称"></el-input>
      </el-form-item>
      <el-form-item label="海报配置类型" 
        prop="postType" 
        :rules="{type: 'number', required: true, message: '海报配置类型不能为空', trigger: 'blur'}">
        <el-select v-model="form.postType" clearable placeholder="海报配置类型">
          <el-option label="朋友圈海报" :value="1">朋友圈海报</el-option>
          <el-option label="早晚安海报" :value="2">早晚安海报</el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="文案" prop="content" :rules="{required: true, message: '文案不能为空', trigger: 'blur'}">
        <el-input :rows="15" :cols="15" type="textarea" :maxlength="200" 
          v-model="form.content" placeholder="请输入文案">
        </el-input>
        <p style="text-align: right;padding-right: 22px;">剩余字数：{{200 - form.content.length}}</p>
      </el-form-item>
      <el-form-item
        label="推广日期"
        prop="tgDate"
        :rules="{required: true, message: '推广日期不能为空', trigger: 'blur'}">
        <el-date-picker
          v-model="form.tgDate"
          type="date"
          editable
          @change="tgDateChange"
          placeholder="请选择">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="是否启用" class="gradeImg-uploader" required>
        <el-form-item class="el-col" prop="enable">
          <el-radio-group v-model="form.enable">
            <el-radio-button label="1">开启</el-radio-button>
            <el-radio-button label="0">禁用</el-radio-button>
          </el-radio-group>
        </el-form-item>
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
  name: 'fx-Pyq-tg-add',
  props: {
    value: Boolean
  },
  data () {
    return {
      visible: this.value,
      form: {
        typeName: '',
        postType: '',
        content: '',
        tgDate: '',
        enable: 1
      }
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
  methods: {
    // 时间改变赋值
    tgDateChange (date) {
      this.form.tgDate = date
    },
    // 关闭
    close () {
      this.visible = false
    },
    // 确定
    confirm () {
      this.$refs['form'].validate(valid => {
        if (valid) {
          let contentStr = this.form.content
          contentStr = contentStr.replace(/\n/g, '<br>')
          this.form.content = contentStr
          this.$ajax({
            url: '/store/account/fx/fxPyqPoster/addTgPosterInfo',
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
