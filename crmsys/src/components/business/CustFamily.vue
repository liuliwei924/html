<template>
  <div class="record-content">
    <el-button class="record-edit-btn" :icon="status ? 'edit' : 'document'" @click="type !== 'doc' ? statusChange(true) : statusChange(false)" v-if="type !== 'add'">
      {{status ? '编辑' : '查看'}}
    </el-button>
    <!-- 编辑 -->
    <template v-if="status">
      <el-form class="clearfix" ref="form" :model="form" label-width="30%">
        <el-form-item label="户口情况">
          <el-select v-model.number="form.sourceType" placeholder="请选择">
            <el-option v-for="val,key,index in sourceType" :label="val" :value="Number(key)" :key="index"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="配偶名称" prop="spouseName" :rules="{required: true, message: '请输入配偶名称', trigger: 'blur'}">
          <el-input v-model="form.spouseName" placeholder="请填写" :maxlength="4"></el-input>
        </el-form-item>
        <el-form-item label="配偶身份证号" prop="spouseCardNo" :rules="{required: true, message: '请输入配偶身份证号', trigger: 'blur'}">
          <el-input v-model="form.spouseCardNo" placeholder="请填写" :maxlength="18"></el-input>
        </el-form-item>
        <el-form-item label="配偶手机号码" prop="spouseTel" :rules="{required: true, message: '请输入配偶手机号码', trigger: 'blur'}">
          <el-input v-model="form.spouseTel" placeholder="请填写" :maxlength="11"></el-input>
        </el-form-item>
      </el-form>
      <div class="record-content-ctrl">
        <!-- <el-button class="cancal__btn">取消</el-button> -->
        <el-button class="confirm__btn" @click="saveHandle">保存</el-button>
      </div>
    </template>
    <!-- 查看 -->
    <div class="el-form__view" v-else>
      <div class="el-form-item">
        <div class="el-form-item__label">户口情况</div>
        <div class="el-form-item__content">{{sourceType[form.sourceType]}}</div>
      </div>
      <div class="el-form-item">
        <div class="el-form-item__label">配偶名称</div>
        <div class="el-form-item__content">{{form.spouseName}}</div>
      </div>
      <div class="el-form-item">
        <div class="el-form-item__label">配偶身份证号</div>
        <div class="el-form-item__content">{{form.spouseCardNo}}</div>
      </div>
      <div class="el-form-item">
        <div class="el-form-item__label">配偶手机号码</div>
        <div class="el-form-item__content">{{form.spouseTel}}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'cust-family',
  props: {
    type: String, // add:添加模式 edit:编辑模式 doc:查看模式
    info: Object
  },
  data () {
    return {
      status: this.type !== 'doc', // 非查看模式
      form: {
        sourceType: '',
        spouseName: '',
        spouseCardNo: '',
        spouseTel: ''
      },
      // 户口情况
      sourceType: {
        1: '本地户口',
        2: '异地城市',
        3: '异地农村'
      }
    }
  },
  watch: {
    info (obj) {
      this.form = {
        custId: obj['custId'],
        sourceType: obj['sourceType'],
        spouseName: obj['spouseName'],
        spouseCardNo: obj['spouseCardNo'],
        spouseTel: obj['spouseTel']
      }
    }
  },
  methods: {
    // 状态切换
    statusChange (isChange) {
      if (isChange) {
        this.status = !this.status
      }
    },
    // 保存
    saveHandle () {
      this.$refs['form'].validate(vali => {
        if (vali) {
          this.$ajax({
            url: '/crmsys/account/busi/enterInfo/saveCustFamily',
            data: this.form,
            success: data => {
              if (this.type !== 'add') this.status = false
            }
          })
        }
      })
    }
  }
}
</script>
