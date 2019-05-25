<template>
  <el-dialog class="edit-dialog double-dialog" title="添加佣金信息" v-model="visible">
    <el-form :model="form" ref="form" label-width="150px" class="clearfix">
      <el-form-item label="产品类型" prop="prodType" :rules="{type: 'number', required: true, message: '产品类型不能为空', trigger: 'blur'}">
        <el-select v-model="form.prodType" clearable placeholder="产品类型">
          <el-option label="信用卡" :value="1">信用卡</el-option>
          <el-option label="保险" :value="2">保险</el-option>
          <el-option label="贷款" :value="3">贷款</el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="用户等级" prop="grade" :rules="{type: 'number', required: true, message: '用户等级不能为空', trigger: 'blur'}">
        <el-select v-model="form.grade" clearable placeholder="用户等级">
          <el-option label="实习专员" :value="1">实习专员</el-option>
          <el-option label="专员" :value="2">专员</el-option>
          <el-option label="经理" :value="3">经理</el-option>
          <el-option label="行长" :value="4">行长</el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="产品编号" 
        prop="prodNo" 
        v-if="form.prodType !== 1" 
        :rules="{required: true, message: '产品编号不能为空', trigger: 'blur'}">
          <el-input v-model.trim="form.prodNo" placeholder="请输入产品编号"></el-input>
      </el-form-item> 
      <el-form-item label="分佣备注" prop="remark">
        <el-input v-model="form.remark" placeholder="请输入分佣备注"></el-input>
      </el-form-item>
      <el-form-item label="一级佣金" prop="gradeRate1" :rules="{type: 'number', required: true, message: '一级佣金不能为空', trigger: 'blur'}">
        <el-input v-model.number="form.gradeRate1" placeholder="请输入一级佣金"></el-input>
      </el-form-item>
       <el-form-item label="二级佣金" prop="gradeRate2">
        <el-input v-model.number="form.gradeRate2" placeholder="请输入二级佣金"></el-input>
      </el-form-item>
       <el-form-item label="三级佣金" prop="gradeRate3">
        <el-input v-model.number="form.gradeRate3" placeholder="请输入三级佣金"></el-input>
      </el-form-item>
      <el-form-item label="四级佣金" prop="gradeRate4">
        <el-input v-model.number="form.gradeRate4" placeholder="请输入四级佣金"></el-input>
      </el-form-item>
      <el-form-item label="是否启用" class="gradeImg-uploader" required>
         <el-form-item class="el-col" prop="enable">
          <el-radio-group v-model="form.enable">
            <el-radio-button label="1">是</el-radio-button>
            <el-radio-button label="0">否</el-radio-button>
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
  name: 'fx-gradecfg-add',
  props: {
    value: Boolean,
    prodList: Array
  },
  data () {
    return {
      visible: this.value,
      form: {
        prodType: 1,
        grade: '',
        gradeName: '',
        prodNo: '',
        gradeRate1: 0,
        gradeRate2: 0,
        gradeRate3: 0,
        gradeRate4: 0,
        remark: '',
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
    // 海报图标处理
    posterBgImgHandle (file, fileList) {
      this.$upload({
        url: '/store/uploadAction/uploadFile',
        data: {
          fileType: 'fxCardImg',
          file: file.raw
        },
        success: data => {
          this.form.posterBgImg = data.fileId
        }
      })
    },
    // 关闭
    close () {
      this.visible = false
    },
    // 确定
    confirm () {
      if (this.form.grade === 1) {
        this.form.gradeName = ' 实习专员'
      } else if (this.form.grade === 2) {
        this.form.gradeName = '专员'
      } else if (this.form.grade === 3) {
        this.form.gradeName = '经理'
      } else if (this.form.grade === 4) {
        this.form.gradeName = '行长'
      }
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.$ajax({
            url: '/store/account/fx/fxReferer/addFxGradeInfo',
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
