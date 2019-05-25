<template>
  <el-dialog class="edit-dialog" title="添加链接" v-model="visible">
    <el-form :model="form" ref="form" label-width="150px">
      <el-form-item label="链接类型" prop="linkType">
       <el-select v-model="form.linkType" clearable placeholder="链接类型">
          <el-option label="招募代理" :value="1">招募代理</el-option>
          <el-option label="各大银行" :value="2">各大银行</el-option>
          <el-option label="客服精选" :value="3">客服精选</el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="产品名称" prop="prodName" v-if="form.linkType === 2">
        <el-select v-model="form.prodId" clearable filterable placeholder="请选择产品名称" >
        <el-option
          v-for="item, index in prodList"
          :label="item.prodName"
          :value="item.prodId"
          :key="index">
        </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="标签" prop="label" :rules="{required: true, message: '标签不能为空', trigger: 'blur'}">
        <el-input v-model="form.label" placeholder="请输入标签"></el-input>
      </el-form-item>
      <el-form-item label="分享次数" prop="shareNum">
        <el-input v-model.number="form.shareNum" placeholder="请输入分享人数"></el-input>
      </el-form-item>
      <el-form-item label="内容" prop="content" :rules="{required: true, message: '内容不能为空', trigger: 'blur'}">
        <el-input :rows="15" :cols="15" type="textarea" :maxlength="150" 
          v-model="form.content" placeholder="请输入帮助内容">
        </el-input>
        <p style="text-align: right;padding-right: 22px;">剩余字数：{{150 - form.content.length}}</p>
      </el-form-item>
      <el-form-item label="是否有短链接" class="gradeImg-uploader" required>
        <el-form-item class="el-col">
          <el-radio-group v-model="shortLinkFlag">
            <el-radio-button label="1">是</el-radio-button>
            <el-radio-button label="0">否</el-radio-button>
          </el-radio-group>
        </el-form-item>
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
  name: 'fx-linkConf-add',
  props: {
    value: Boolean,
    prodList: Array,
    shortLink: String
  },
  data () {
    return {
      visible: this.value,
      form: {
        linkType: '',
        prodId: '',
        label: '',
        shareNum: 0,
        title: '',
        content: '',
        shortLinkFlag: '0',
        enable: 1
      },
      shortLinkFlag: '0'
    }
  },
  watch: {
    shortLinkFlag (val) {
      this.form.shortLinkFlag = val
      if (Number(val) === 1) {
        this.form['content'] = this.form['content'] + ' ' + this.shortLink
      }
    },
    value (val) {
      this.visible = val
    },
    visible (val) {
      this.$emit('change', val)
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
          let contentStr = this.form.content
          contentStr = contentStr.replace(/\n/g, '<br>')
          this.form.content = contentStr
          this.$ajax({
            url: '/store/account/fx/fxLinkConf/addLinkConfInfo',
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
