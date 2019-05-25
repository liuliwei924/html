<template>
  <div class="record-content">
    <el-button class="record-edit-btn" :icon="status ? 'edit' : 'document'" @click="type !== 'doc' ? statusChange(true) : statusChange(false)" v-if="type !== 'add'">
      {{status ? '编辑' : '查看'}}
    </el-button>
    <template v-if="status">
      <el-form class="clearfix" ref="form" :model="form" label-width="30%">
        <el-form-item label="信用情况">
          <el-select v-model.number="form.creditStatus" placeholder="请选择">
            <el-option v-for="val,key,index in creditStatus" :label="val" :value="Number(key)" :key="index"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="信用卡张数" prop="creCardNum" :rules="{type: 'number', required: true, message: '信用卡张数不能为空且为数字', trigger: 'blur'}">
          <el-input v-model.number="form.creCardNum" placeholder="请填写" :maxlength="5"></el-input>
        </el-form-item>
        <el-form-item label="信用卡总授信额度"
          prop="creCardAmount" :rules="{type: 'number', required: true, message: '信用卡总授信额度不能为空且为数字', trigger: 'blur'}">
          <el-input v-model.number="form.creCardAmount" placeholder="请填写" :maxlength="8"></el-input>
        </el-form-item>
        <el-form-item label="最近六个月平均使用额"
          prop="creAvgLastSix" :rules="{type: 'number', required: true, message: '最近六个月平均使用额不能为空且为数字', trigger: 'blur'}">
          <el-input v-model.number="form.creAvgLastSix" placeholder="请填写" :maxlength="8"></el-input>
        </el-form-item>
        <el-form-item label="最近一个月使用额度"
          prop="creLastMonth" :rules="{type: 'number', required: true, message: '最近一个月使用额度不能为空且为数字', trigger: 'blur'}">
          <el-input v-model.number="form.creLastMonth" placeholder="请填写" :maxlength="8"></el-input>
        </el-form-item>
        <el-form-item label="银信贷笔数" prop="bankLoanCount" :rules="{type: 'number', required: true, message: '银信贷笔数不能为空且为数字', trigger: 'blur'}">
          <el-input v-model.number="form.bankLoanCount" placeholder="请填写" :maxlength="5"></el-input>
        </el-form-item>
        <el-form-item label="银信贷总额" prop="bankLoanAmount" :rules="{type: 'number', required: true, message: '银信贷总额不能为空且为数字', trigger: 'blur'}">
          <el-input v-model.number="form.bankLoanAmount" placeholder="请填写" :maxlength="8"></el-input>
        </el-form-item>
        <el-form-item label="银信贷月供" prop="bankLoanMonthPay" :rules="{type: 'number', required: true, message: '银信贷月供不能为空且为数字', trigger: 'blur'}">
          <el-input v-model.number="form.bankLoanMonthPay" placeholder="请填写" :maxlength="8"></el-input>
        </el-form-item>
        <el-form-item label="贷款机构名称" prop="bankName" :rules="{required: true, message: '贷款机构名称不能为空'}">
          <el-input v-model="form.bankName" placeholder="请填写" :maxlength="50"></el-input>
        </el-form-item>
      </el-form>
      <div class="record-content-ctrl">
        <!-- <el-button class="cancal__btn">取消</el-button> -->
        <el-button class="confirm__btn" @click="saveHandle">保存</el-button>
      </div>
    </template>
    <div class="el-form__view" v-else>
      <div class="el-form-item">
        <div class="el-form-item__label">信用情况</div>
        <div class="el-form-item__content">{{creditStatus[form.creditStatus]}}</div>
      </div>
      <div class="el-form-item">
        <div class="el-form-item__label">信用卡张数</div>
        <div class="el-form-item__content">{{form.creCardNum}}</div>
      </div>
      <div class="el-form-item">
        <div class="el-form-item__label">信用卡总授信额度</div>
        <div class="el-form-item__content">{{form.creCardAmount}}</div>
      </div>
      <div class="el-form-item">
        <div class="el-form-item__label">最近六个月平均使用额</div>
        <div class="el-form-item__content">{{form.creAvgLastSix}}</div>
      </div>
      <div class="el-form-item">
        <div class="el-form-item__label">最近一个月使用额度</div>
        <div class="el-form-item__content">{{form.creLastMonth}}</div>
      </div>
      <div class="el-form-item">
        <div class="el-form-item__label">银信贷笔数</div>
        <div class="el-form-item__content">{{form.bankLoanCount}}</div>
      </div>
      <div class="el-form-item">
        <div class="el-form-item__label">银信贷总额</div>
        <div class="el-form-item__content">{{form.bankLoanAmount}}</div>
      </div>
      <div class="el-form-item">
        <div class="el-form-item__label">银信贷月供</div>
        <div class="el-form-item__content">{{form.bankLoanMonthPay}}</div>
      </div>
      <div class="el-form-item">
        <div class="el-form-item__label">贷款机构名称</div>
        <div class="el-form-item__content">{{form.bankName}}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'cust-credit',
  props: {
    type: String, // add:添加模式 edit:编辑模式 doc:查看模式
    info: Object
  },
  data () {
    return {
      status: this.type !== 'doc', // 非查看模式
      form: {
        creditStatus: '',
        creCardNum: '',
        creCardAmount: '',
        creAvgLastSix: '',
        creLastMonth: '',
        bankLoanCount: '',
        bankLoanAmount: '',
        bankLoanMonthPay: '',
        bankName: ''
      },
      // 信用情况
      creditStatus: {
        1: '1年内逾期超过3次或超过90天',
        2: '1年内逾期少于3次且少于90天',
        3: '无信用卡或贷款',
        4: '信用良好，无逾期'
      }
    }
  },
  watch: {
    info (obj) {
      this.form = {
        custId: obj['custId'],
        creditStatus: obj['creditStatus'],
        creCardNum: obj['creCardNum'],
        creCardAmount: obj['creCardAmount'],
        creAvgLastSix: obj['creAvgLastSix'],
        creLastMonth: obj['creLastMonth'],
        bankLoanCount: obj['bankLoanCount'],
        bankLoanAmount: obj['bankLoanAmount'],
        bankLoanMonthPay: obj['bankLoanMonthPay'],
        bankName: obj['bankName']
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
            url: '/crmsys/account/busi/enterInfo/saveCustCredit',
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
