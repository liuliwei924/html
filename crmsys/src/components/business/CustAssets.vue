<template>
  <div class="record-content">
    <el-button class="record-edit-btn" :icon="status ? 'edit' : 'document'" @click="type !== 'doc' ? statusChange(true) : statusChange(false)" v-if="type !== 'add'">
      {{status ? '编辑' : '查看'}}
    </el-button>
    <!-- 编辑 -->
    <template v-if="status">
      <el-form class="clearfix" ref="form" :model="form" label-width="30%">
        <el-form-item label="房产情况">
          <el-select v-model.number="form.houseType" placeholder="请选择" @change="changeHouseLoan">
            <el-option v-for="val,key,index in houseType" :label="val" :value="Number(key)" :key="index"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="小区名称">
          <el-input v-model="form.cellName" placeholder="请填写"></el-input>
        </el-form-item>
        <el-form-item label="房产估值" v-if="isHouseLoan === true">
          <el-input v-model="form.houseValue" placeholder="请填写" :maxlength="8">
            <template slot="append">元</template>
          </el-input>
        </el-form-item>
        <el-form-item label="房屋贷款金额" v-if="isHouseLoan === true">
          <el-input v-model="form.houseLoanAmount" placeholder="请填写" :maxlength="8">
            <template slot="append">元</template>
          </el-input>
        </el-form-item>
        <el-form-item label="房贷已还期数" v-if="isHouseLoan === true">
          <el-input v-model="form.housePayPeriod" placeholder="请填写"></el-input>
        </el-form-item>
        <!-- <el-form-item label="房贷首次还款日期">
          <el-date-picker v-model="form.houseLoanDate" type="date" ref="houseLoanDate" placeholder="请选择日期"></el-date-picker>
        </el-form-item> -->
        <el-form-item label="房贷月还款金额" v-if="isHouseLoan === true">
          <el-input v-model="form.houseMonthPay" placeholder="请填写" :maxlength="8">
            <template slot="append">元</template>
          </el-input>
        </el-form-item>
        <el-form-item label="房租" v-if="isHouseLoan === false">
          <el-input v-model="form.houseRent" placeholder="请填写" :maxlength="8">
            <template slot="append">元</template>
          </el-input>
        </el-form-item>
        <el-form-item label="车产信息">
          <el-select v-model.number="form.carType" placeholder="请选择" @change="changeCarLoan">
            <el-option v-for="val,key,index in carType" :label="val" :value="Number(key)" :key="index"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="车辆估值" v-if="isCarLoan === false">
          <el-input v-model="form.carValue" placeholder="请填写" :maxlength="8">
            <template slot="append">元</template>
          </el-input>
        </el-form-item>
        <el-form-item label="车辆贷款金额" v-if="isCarLoan === true">
          <el-input v-model="form.carLoanAmount" placeholder="请填写" :maxlength="8">
            <template slot="append">元</template>
          </el-input>
        </el-form-item>
        <el-form-item label="车贷还款期数" v-if="isCarLoan === true">
          <el-input v-model="form.carPayPeriod" placeholder="请填写" :maxlength="8">
          </el-input>
        </el-form-item>
        <!-- <el-form-item label="车贷首次还款日期">
          <el-date-picker v-model="form.carLoanDate" type="date" ref="carLoanDate" placeholder="请选择日期"></el-date-picker>
        </el-form-item> -->
        <el-form-item label="车贷月还款金额" v-if="isCarLoan === true">
          <el-input v-model="form.carMonthPay" placeholder="请填写" :maxlength="8">
            <template slot="append">元</template>
          </el-input>
        </el-form-item>
        <el-form-item label="保单金额">
          <el-input v-model="form.policyAmount" placeholder="请填写" :maxlength="8">
            <template slot="append">元</template>
          </el-input>
          <!-- <el-select v-model.number="form.policyAmount" placeholder="请选择">
            <el-option v-for="val,key,index in policyAmount" :label="val" :value="Number(key)" :key="index"></el-option>
          </el-select> -->
        </el-form-item>
        <el-form-item label="交保年限">
          <el-input v-model="form.policyLife" placeholder="请填写" :maxlength="3"></el-input>
          <!-- <el-select v-model.number="form.policyLife" placeholder="请选择">
            <el-option v-for="val,key,index in policyLife" :label="val" :value="Number(key)" :key="index"></el-option>
          </el-select> -->
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
        <div class="el-form-item__label">房产情况</div>
        <div class="el-form-item__content">{{houseType[form.houseType]}}</div>
      </div>
      <div class="el-form-item">
        <div class="el-form-item__label">小区名称</div>
        <div class="el-form-item__content">{{form.cellName}}</div>
      </div>
      <div class="el-form-item" v-if="isHouseLoan === true">
        <div class="el-form-item__label">房产估值</div>
        <div class="el-form-item__content">{{form.houseValue}}</div>
      </div>
      <div class="el-form-item" v-if="isHouseLoan === true">
        <div class="el-form-item__label">房屋贷款金额</div>
        <div class="el-form-item__content">{{form.houseLoanAmount}}</div>
      </div>
      <div class="el-form-item" v-if="isHouseLoan === true">
        <div class="el-form-item__label">房贷已还期数</div>
        <div class="el-form-item__content">{{form.housePayPeriod}}</div>
      </div>
      <!-- <div class="el-form-item">
        <div class="el-form-item__label">房贷首次还款日期</div>
        <div class="el-form-item__content">{{form.houseLoanDate}}</div>
      </div> -->
      <div class="el-form-item" v-if="isHouseLoan === true">
        <div class="el-form-item__label">房贷月还款金额</div>
        <div class="el-form-item__content">{{form.houseMonthPay}}</div>
      </div>
      <div class="el-form-item" v-if="isHouseLoan === false">
        <div class="el-form-item__label">房租</div>
        <div class="el-form-item__content">{{form.houseRent}}</div>
      </div>
      <div class="el-form-item">
        <div class="el-form-item__label">车产信息</div>
        <div class="el-form-item__content">{{carType[form.carType]}}</div>
      </div>
      <div class="el-form-item" v-if="isCarLoan === false">
        <div class="el-form-item__label">车辆估值</div>
        <div class="el-form-item__content">{{form.carValue}}</div>
      </div>
      <div class="el-form-item" v-if="isCarLoan === true">
        <div class="el-form-item__label">车辆贷款金额</div>
        <div class="el-form-item__content">{{form.carLoanAmount}}</div>
      </div>
      <div class="el-form-item" v-if="isCarLoan === true">
        <div class="el-form-item__label">车贷还款期数</div>
        <div class="el-form-item__content">{{form.carPayPeriod}}</div>
      </div>
      <!-- <div class="el-form-item">
        <div class="el-form-item__label">车贷首次还款日期</div>
        <div class="el-form-item__content">{{form.carLoanDate}}</div>
      </div> -->
      <div class="el-form-item" v-if="isCarLoan === true">
        <div class="el-form-item__label">车贷月还款金额</div>
        <div class="el-form-item__content">{{form.carMonthPay}}</div>
      </div>
      <div class="el-form-item">
        <div class="el-form-item__label">保单金额</div>
        <div class="el-form-item__content">{{form.policyAmount}}</div>
        <!-- <div class="el-form-item__content">{{policyAmount[form.policyAmount]}}</div> -->
      </div>
      <div class="el-form-item">
        <div class="el-form-item__label">交保年限</div>
        <div class="el-form-item__content">{{form.policyLife}}</div>
        <!-- <div class="el-form-item__content">{{policyLife[form.policyLife]}}</div> -->
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'cust-assets',
  props: {
    type: String, // add:添加模式 edit:编辑模式 doc:查看模式
    info: Object
  },
  data () {
    return {
      status: this.type !== 'doc', // 非查看模式
      form: {
        houseType: '',
        cellName: '',
        houseValue: '',
        houseLoanAmount: '',
        housePayPeriod: '',
        // houseLoanDate: '',
        houseMonthPay: '',
        houseRent: '',
        carType: '',
        carValue: '',
        carLoanAmount: '',
        carPayPeriod: '',
        // carLoanDate: '',
        carMonthPay: '',
        policyAmount: '',
        policyLife: ''
      },
      // 房产情况
      houseType: {
        1: '商品房、商住两用房、别墅',
        2: '其他房产',
        3: '无房'
        // 1: '本地按揭',
        // 2: '本地红本',
        // 3: '异地按揭',
        // 4: '异地红本',
        // 5: '其他房产',
        // 6: '租房'
      },
      // 车产信息
      carType: {
        1: '全款车',
        2: '按揭车'
      },
      isCarLoan: true,
      isHouseLoan: true
      // 保单金额
      // policyAmount: {
      //   1: '5千以内',
      //   2: '0.5-1万',
      //   3: '1-2万',
      //   4: '2-3万',
      //   5: '3万+'
      // },
      // 交保年限
      // policyLife: {
      //   1: '2年以内',
      //   2: '2-3年',
      //   3: '3年+'
      // }
    }
  },
  watch: {
    info (obj) {
      this.form = {
        custId: obj['custId'],
        houseType: obj['houseType'],
        cellName: obj['cellName'],
        houseValue: obj['houseValue'],
        houseLoanAmount: obj['houseLoanAmount'],
        housePayPeriod: obj['housePayPeriod'],
        // houseLoanDate: obj['houseLoanDate'],
        houseMonthPay: obj['houseMonthPay'],
        houseRent: obj['houseRent'],
        carType: obj['carType'],
        carValue: obj['carValue'],
        carLoanAmount: obj['carLoanAmount'],
        // carLoanDate: obj['carLoanDate'],
        carPayPeriod: obj['carPayPeriod'],
        carMonthPay: obj['carMonthPay'],
        policyAmount: obj['policyAmount'],
        policyLife: obj['policyLife']
      }
      if (this.form.houseType) {
        this.isHouseLoan = this.form.houseType === 1 || this.form.houseType === 2
      }
      if (this.form.carType) {
        this.isCarLoan = this.form.carType === 2
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
      this.$ajax({
        url: '/crmsys/account/busi/enterInfo/saveCustAssets',
        data: this.form,
        success: data => {
          if (this.type !== 'add') this.status = false
        }
      })
    },
    changeCarLoan (val) {
      this.isCarLoan = val === 2
    },
    changeHouseLoan (val) {
      this.isHouseLoan = val === 1 || val === 2
    }
  }
}
</script>
