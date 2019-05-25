<template>
  <div class="record-content">
    <el-button class="record-edit-btn" :icon="status ? 'edit' : 'document'" @click="type !== 'doc' ? statusChange(true) : statusChange(false)" v-if="type !== 'add'">
      {{status ? '编辑' : '查看'}}
    </el-button>
    <template v-if="status">
      <el-form class="clearfix" ref="form" :model="form" label-width="30%">
        <el-form-item label="职业类型">
          <el-select v-model.number="form.compType" placeholder="请选择">
            <el-option v-for="val,key,index in compType" :label="val" :value="Number(key)" :key="index"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="单位名称" prop="compName" :rules="{required: true, message: '请输入单位名称', trigger: 'blur'}"
          v-if="form.compType === 1 || form.compType === 2">
          <el-input v-model="form.compName" placeholder="请填写" :maxlength="20"></el-input>
        </el-form-item>
        <el-form-item label="单位地址" prop="compAddress" :rules="{required: true, message: '请输入单位地址', trigger: 'blur'}"
          v-if="form.compType === 1 || form.compType === 2">
          <el-input v-model="form.compAddress" placeholder="请填写" :maxlength="20"></el-input>
        </el-form-item>
        <el-form-item label="工作年限" v-if="form.compType === 1 || form.compType === 2">
          <el-input v-model="form.workAge" placeholder="请填写" :maxlength="2"></el-input>
          <!-- <el-select v-model.number="form.workAge" placeholder="请选择">
            <el-option v-for="val,key,index in workAge" :label="val" :value="Number(key)" :key="index"></el-option>
          </el-select> -->
        </el-form-item>
        <el-form-item label="工资发放形式" v-if="form.compType === 1 || form.compType === 2 || form.compType === 3">
          <el-select v-model.number="form.wagesType" placeholder="请选择">
            <el-option v-for="val,key,index in wagesType" :label="val" :value="Number(key)" :key="index"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="工资打卡收入(月)" prop="bankIncome" :rules="{type: 'number', required: true, message: '工资收入不能为空且为数字', trigger: 'blur'}"
          v-if="(form.compType === 1 || form.compType === 2 || form.compType === 3) && (form.wagesType === 1 || form.wagesType === 3)">
          <el-input v-model.number="form.bankIncome" placeholder="请填写" :maxlength="8">
            <template slot="append">元</template>
          </el-input>
        </el-form-item>
        <el-form-item label="工资现金发放收入" prop="cashIncome" :rules="{type: 'number', required: true, message: '工资发放收入不能为空且为数字', trigger: 'blur'}"
          v-if="(form.compType === 1 || form.compType === 2 || form.compType === 3) && (form.wagesType === 2 || form.wagesType === 3)">
          <el-input v-model.number="form.cashIncome" placeholder="请填写" :maxlength="8">
            <template slot="append">元</template>
          </el-input>
        </el-form-item>
        <el-form-item label="公积金月缴" prop="fundAmount" v-if="form.compType === 1 || form.compType === 2"
          :rules="{type: 'number', required: true, message: '公积金月缴不能为空且为数字', trigger: 'blur'}">
          <el-input v-model.number="form.fundAmount" placeholder="请填写" :maxlength="8">
            <template slot="append">元</template>
          </el-input>
        </el-form-item>
      </el-form>
      <div class="record-content-ctrl">
        <!-- <el-button class="cancal__btn">取消</el-button> -->
        <el-button class="confirm__btn" @click="saveHandle">保存</el-button>
      </div>
    </template>
    <div class="el-form__view" v-else>
      <div class="el-form-item">
        <div class="el-form-item__label">职业类型</div>
        <div class="el-form-item__content">{{compType[form.compType]}}</div>
      </div>
      <div class="el-form-item" v-if="form.compType === 1 || form.compType === 2">
        <div class="el-form-item__label">单位名称</div>
        <div class="el-form-item__content">{{form.compName}}</div>
      </div>
      <div class="el-form-item" v-if="form.compType === 1 || form.compType === 2">
        <div class="el-form-item__label">单位地址</div>
        <div class="el-form-item__content">{{form.compAddress}}</div>
      </div>
      <div class="el-form-item" v-if="form.compType === 1 || form.compType === 2">
        <div class="el-form-item__label">工作年限</div>
        <!-- <div class="el-form-item__content">{{workAge[form.workAge]}}</div> -->
        <div class="el-form-item__content">{{form.workAge}}</div>
      </div>
      <div class="el-form-item" v-if="form.compType === 1 || form.compType === 2 || form.compType === 3">
        <div class="el-form-item__label">工资发放形式</div>
        <div class="el-form-item__content">{{wagesType[form.wagesType]}}</div>
      </div>
      <div class="el-form-item" v-if="(form.compType === 1 || form.compType === 2 || form.compType === 3) && (form.wagesType === 1 || form.wagesType === 3)">
        <div class="el-form-item__label">工资打卡收入(月)</div>
        <div class="el-form-item__content">{{form.bankIncome}}</div>
      </div>
      <div class="el-form-item" v-if="(form.compType === 1 || form.compType === 2 || form.compType === 3) && (form.wagesType === 2 || form.wagesType === 3)">
        <div class="el-form-item__label">工资现金发放收入</div>
        <div class="el-form-item__content">{{form.cashIncome}}</div>
      </div>
      <div class="el-form-item" v-if="form.compType === 1 || form.compType === 2">
        <div class="el-form-item__label">公积金月缴</div>
        <div class="el-form-item__content">{{form.fundAmount}}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'cust-work',
  props: {
    type: String, // add:添加模式 edit:编辑模式 doc:查看模式
    info: Object
  },
  data () {
    return {
      status: this.type !== 'doc', // 非查看模式
      form: {
        compName: '',
        compType: '',
        compAddress: '',
        workAge: '',
        wagesType: '',
        bankIncome: '',
        cashIncome: '',
        fundAmount: ''
      },
      // 职业类型
      compType: {
        1: '标准受薪',
        2: '优良职业(含公务员)',
        3: '自雇人士',
        4: '学生',
        5: '无业'
      },
      // 工作年限
      // workAge: {
      //   1: '6个月内',
      //   2: '6-12个月',
      //   3: '1-2年',
      //   4: '2-5年',
      //   5: '5年+'
      // },
      // 工资发放形式
      wagesType: {
        1: '打卡',
        2: '现金',
        3: '部分打卡部分现金'
      }
    }
  },
  watch: {
    'form.compType' (val) {
      this.$emit('change', val)
    },
    info (obj) {
      this.form = {
        custId: obj['custId'],
        compName: obj['compName'],
        compType: obj['compType'],
        compAddress: obj['compAddress'],
        workAge: obj['workAge'],
        wagesType: obj['wagesType'],
        bankIncome: obj['bankIncome'],
        cashIncome: obj['cashIncome'],
        fundAmount: obj['fundAmount']
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
            url: '/crmsys/account/busi/enterInfo/saveCustWork',
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
