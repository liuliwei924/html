<template>
  <div class="record-content">
    <el-button class="record-edit-btn" :icon="status ? 'edit' : 'document'" @click="type !== 'doc' ? statusChange(true) : statusChange(false)" v-if="type !== 'add'">
      {{status ? '编辑' : '查看'}}
    </el-button>
    <!-- 编辑 -->
    <template v-if="status">
      <el-form class="clearfix" ref="form" :model="form" label-width="30%">
        <el-form-item label="申请人城市">
          <div class="el-form-item__content">{{form.applyCity}}</div>
        </el-form-item>
        <el-form-item label="申请金额" prop="applyAmount" :rules="{type: 'number', required: true, message: '申请金额不能为空且为数字', trigger: 'blur'}">
          <el-input v-model.number="form.applyAmount" placeholder="请填写" :maxlength="4">
            <template slot="append">万元</template>
          </el-input>
        </el-form-item>
        <el-form-item label="申请期限" prop="deadline" :rules="{type: 'number', required: true, message: '申请期限不能为空且为数字'}">
          <el-select v-model.number="form.deadline" placeholder="请选择">
            <el-option v-for="val,key,index in deadline" :label="val" :value="Number(key)" :key="index"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="还款周期" prop="repayCycle" :rules="{type: 'number', required: true, message: '还款周期不能为空且为数字'}">
          <el-select v-model.number="form.repayCycle" placeholder="请选择">
            <el-option v-for="val,key,index in repayCycle" :label="val" :value="Number(key)" :key="index"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="还款方式" prop="repayType" :rules="{type: 'number', required: true, message: '还款方式不能为空且为数字'}">
          <el-select v-model.number="form.repayType" placeholder="请选择">
            <el-option v-for="val,key,index in repayType" :label="val" :value="Number(key)" :key="index"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="业务类型" prop="busiType" :rules="{type: 'number', required: true, message: '业务类型不能为空且为数字'}">
          <el-select v-model.number="form.busiType" placeholder="请选择">
            <el-option v-for="val,key,index in busiType" :label="val" :value="Number(key)" :key="index"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="贷款用途" prop="loanUse" :rules="{required: true, message: '贷款用途不能为空', trigger: 'blur'}">
         <el-input v-model.number="form.loanUse" placeholder="请填写" :maxlength="50">
          </el-input>
        </el-form-item>
        <el-form-item label="贷款产品">
          <el-select v-model="form.prodId" placeholder="请选择">
            <el-option v-for="val,key,index in loanProd" :label="val" :value="Number(key)" :key="index"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="利率调整方式" prop="rateChangeType" :rules="{type: 'number', required: true, message: '利率调整方式不能为空且为数字'}">
          <el-radio-group v-model.number="form.rateChangeType">
            <el-radio :label="Number(key)" v-for="val,key,index in rateChangeType" :key="index">{{val}}</el-radio>
          </el-radio-group>
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
        <div class="el-form-item__label">申请人城市</div>
        <div class="el-form-item__content">{{form.applyCity}}</div>
      </div>
      <div class="el-form-item">
        <div class="el-form-item__label">申请金额</div>
        <div class="el-form-item__content">{{form.applyAmount}}</div>
      </div>
      <div class="el-form-item">
        <div class="el-form-item__label">申请期限</div>
        <div class="el-form-item__content">{{deadline[form.deadline]}}</div>
      </div>
      <div class="el-form-item">
        <div class="el-form-item__label">还款周期</div>
        <div class="el-form-item__content">{{repayCycle[form.repayCycle]}}</div>
      </div>
      <div class="el-form-item">
        <div class="el-form-item__label">还款方式</div>
        <div class="el-form-item__content">{{repayType[form.repayType]}}</div>
      </div>
      <div class="el-form-item">
        <div class="el-form-item__label">业务类型</div>
        <div class="el-form-item__content">{{busiType[form.busiType]}}</div>
      </div>
      <div class="el-form-item">
        <div class="el-form-item__label">贷款用途</div>
        <div class="el-form-item__content">{{form.loanUse}}</div>
      </div>
      <div class="el-form-item">
        <div class="el-form-item__label">贷款产品</div>
        <div class="el-form-item__content">{{loanProd[form.prodId]}}</div>
      </div>
      <div class="el-form-item">
        <div class="el-form-item__label">利率调整方式</div>
        <div class="el-form-item__content">{{rateChangeType[form.rateChangeType]}}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'apply-info',
  props: {
    type: String, // add:添加模式 edit:编辑模式 doc:查看模式
    info: Object
  },
  data () {
    return {
      status: this.type !== 'doc', // 非查看模式
      form: {
        applyCity: '',
        applyAmount: '',
        deadline: '',
        repayCycle: '',
        repayType: '',
        busiType: '',
        loanUse: '',
        prodId: '',
        rateChangeType: ''
      },
      // 申请期限
      deadline: {
        12: '12个月',
        24: '24个月',
        36: '36个月'
      },
      // 还款周期
      repayCycle: {
        1: '月',
        2: '季',
        3: '半年'
      },
      // 还款方式
      repayType: {
        1: '等额本息',
        2: '等额本金'
      },
      // 业务类型
      busiType: {
        1: '新增贷款',
        2: '借新还旧'
      },
      // 利率调整方式
      rateChangeType: {
        1: '固定',
        2: '按月',
        3: '按季',
        4: '按年'
      },
      // 贷款产品
      loanProd: {}
    }
  },
  watch: {
    info (obj) {
      this.form = {
        custId: obj['custId'],
        applyId: this.$route.query.applyId,
        applyCity: obj['applyCity'],
        applyAmount: obj['applyAmount'],
        deadline: obj['deadline'],
        repayCycle: obj['repayCycle'],
        repayType: obj['repayType'],
        busiType: obj['busiType'],
        loanUse: obj['loanUse'],
        prodId: obj['prodId'],
        rateChangeType: obj['rateChangeType']
      }
      if (this.type !== 'add') this.queryProd()
    }
  },
  methods: {
    // 状态切换
    statusChange (isChange) {
      if (isChange) {
        this.status = !this.status
      }
    },
    // 查询产品
    queryProd () {
      this.$ajax({
        url: '/crmsys/account/user/custInfo/queryProd',
        success: data => {
          let [rows, loanProd] = [data.rows || [], {}]
          rows.map(item => {
            loanProd[item.prodId] = item.prodName
          })
          this.loanProd = loanProd
        }
      })
    },
    // 保存
    saveHandle () {
      if (this.type !== 'add') this.form['applyId'] = this.$route.query.applyId
      this.$refs['form'].validate(vali => {
        if (vali) {
          this.$ajax({
            url: '/crmsys/account/busi/enterInfo/saveApply',
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
