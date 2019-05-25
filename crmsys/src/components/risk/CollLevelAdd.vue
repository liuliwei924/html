<template>
  <el-dialog class="edit-dialog" title="添加白名单" :visible.sync="visible">
    <el-form :model="form" ref="form" label-width="150px">
      <el-form-item label="配置描述" prop="levelDesc" :rules="{required: true, message: '配置描述不能为空', trigger: 'blur'}">
        <el-input v-model="form.levelDesc" placeholder="请输入配置描述"></el-input>
      </el-form-item>
      <div class="limit-item clearfix">
        <label class="el-form-item__label">
          <span>正常(逾期天数)</span>
        </label>
        <!-- <el-form-item prop="min1Day" class="fl" label-width="0" :rules="{required: true, message: '最小逾期天数不能为空', trigger: 'blur'}">
          <el-input v-model="form.min1Day" placeholder="请输入最小逾期"></el-input>
        </el-form-item> -->
        <div class="item-text fl">{{form.min1Day}}</div>
        <div class="item-line fl">—</div>
        <el-form-item prop="max1Day" class="fl" label-width="0" :rules="{type: 'number', required: true, min: 0, max: 9999, message: '最大逾期天数不能为空', trigger: 'blur'}">
          <el-input v-model.number="form.max1Day" :maxlength="4" placeholder="请输入最大逾期"></el-input>
        </el-form-item>
        <div class="el-input-group__append fl">天</div>
      </div>
      <div class="limit-item clearfix">
        <label class="el-form-item__label">
          <span>关注(逾期天数)</span>
        </label>
        <div class="item-text fl">{{form.max1Day || 0}}</div>
        <div class="item-line fl">—</div>
        <el-form-item prop="max2Day" class="fl" label-width="0" :rules="{type: 'number', required: true, min: form.max1Day, max: 9999, message: '最大逾期天数不能为空', trigger: 'blur'}">
          <el-input v-model.number="form.max2Day" :maxlength="4" placeholder="请输入最大逾期"></el-input>
        </el-form-item>
        <div class="el-input-group__append fl">天</div>
      </div>
      <div class="limit-item clearfix">
        <label class="el-form-item__label">
          <span>次级(逾期天数)</span>
        </label>
        <div class="item-text fl">{{form.max2Day || 0}}</div>
        <div class="item-line fl">—</div>
        <el-form-item prop="max3Day" class="fl" label-width="0" :rules="{type: 'number', required: true, min: form.max2Day, max: 9999, message: '最大逾期天数不能为空', trigger: 'blur'}">
          <el-input v-model.number="form.max3Day" :maxlength="4" placeholder="请输入最大逾期"></el-input>
        </el-form-item>
        <div class="el-input-group__append fl">天</div>
      </div>
      <div class="limit-item clearfix">
        <label class="el-form-item__label">
          <span>可疑(逾期天数)</span>
        </label>
        <div class="item-text fl">{{form.max3Day || 0}}</div>
        <div class="item-line fl">—</div>
        <el-form-item prop="max4Day" class="fl" label-width="0" :rules="{type: 'number', required: true, min: form.max3Day, max: 9999, message: '最大逾期天数不能为空', trigger: 'blur'}">
          <el-input v-model.number="form.max4Day" :maxlength="4" placeholder="请输入最大逾期"></el-input>
        </el-form-item>
        <div class="el-input-group__append fl">天</div>
      </div>
      <div class="limit-item clearfix">
        <label class="el-form-item__label">
          <span>损失(逾期天数)</span>
        </label>
        <div class="item-text fl">{{form.max4Day || 0}}</div>
        <!-- <div class="item-line fl">—</div>
        <div class="item-text fl">9999</div> -->
        <div class="el-input-group__append fl">天以上</div>
      </div>
    </el-form>
    <div slot="footer">
      <el-button @click="close">取消</el-button>
      <el-button @click="confirm">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'white-list-add',
  props: {
    value: Boolean
  },
  data () {
    return {
      visible: this.value,
      form: {
        levelDesc: '',
        min1Day: 0,
        max1Day: '',
        max2Day: '',
        max3Day: '',
        max4Day: ''
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
    // 关闭
    close () {
      this.visible = false
    },
    // 确定
    confirm () {
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.$ajax({
            url: '/crmsys/account/config/collLevel/add',
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
