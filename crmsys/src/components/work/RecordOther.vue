<template>
  <div>
    <div class="all-info-header">{{title}}
      <!-- <span class="header-tips">{{saveText}}</span>
      <button type="button" class="header-btn" @click="saveHandle">保存</button> -->
    </div>
    <div class="all-info-content">
      <el-form
        class="clearfix"
        :model="form"
        ref="form"
        label-width="106px">
        <el-form-item
          label="信用情况"
          :rules="{type: 'number', required: true, message: '信用情况不能为空', trigger: 'blur'}">
          <el-select
            v-model.number="form.creditType"
            placeholder="请选择信用情况">
            <el-option
              v-for="val,key,index in creditType"
              :label="val"
              :value="Number(key)"
              :key="index">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="信用卡总额度"
          v-if="form.creditType == 1 || form.creditType == 3 || form.creditType == 4 || form.creditType == 5">
          <el-input
            v-model="form.sumAmount" placeholder="请输入信用卡总额度">
            <template slot="append">万元</template>
          </el-input>
        </el-form-item>
        <el-form-item
          label="信用卡已用额度"
          v-if="form.creditType == 1 || form.creditType == 3 || form.creditType == 4 || form.creditType == 5">
          <el-input
            v-model="form.useAmount" placeholder="请输入信用卡已用额度">
            <template slot="append">万元</template>
          </el-input>
        </el-form-item>
        <el-form-item
          label="逾期次数"
          v-if="form.creditType == 1 || form.creditType == 4 || form.creditType == 5">
          <el-input
            v-model="form.overdueCount" placeholder="请输入逾期次数">
            <template slot="append">次</template>
          </el-input>
        </el-form-item>
        <el-form-item
          label="当前是否有逾期"
          prop="curOverType"
          v-if="form.creditType == 1 || form.creditType == 4 || form.creditType == 5">
          <el-radio-group
            v-model.number="form.curOverType">
            <el-radio
              v-for="val,key,index in curOverType"
              :label="Number(key)"
              :key="index">{{val}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <!-- 房产信息 -->
        <el-form-item
          label="房产类型"
          prop="houseType"
          :rules="{type: 'number', required: true, message: '房产类型不能为空', trigger: 'change'}">
          <el-select
            v-model.number="form.houseType"
            placeholder="请选择房产类型">
            <el-option
              v-for="val,key,index in houseType"
              :label="val"
              :value="Number(key)"
              :key="index">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="房产位置"
          v-if="form.houseType === 1 || form.houseType === 3 || form.houseType === 4">
          <el-select
            v-model.number="form.housePlace"
            placeholder="请选择房产位置">
            <el-option
              v-for="val,key in housePlace"
              :label="val"
              :value="Number(key)"
              :key="key">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="房产估值"
          prop="houseVal"
          v-if="form.houseType === 1 || form.houseType === 3 || form.houseType === 4">
          <el-input
            v-model.number="form.houseVal"
            placeholder="请输入房产估值">
            <template slot="append">万元</template>
          </el-input>
        </el-form-item>
        <el-form-item
          label="是否是主贷人"
          prop="myLoanHouse"
          v-if="form.houseType === 3">
          <el-radio-group
            v-model.number="form.myLoanHouse">
            <el-radio
              v-for="val,key,index in myLoanHouse"
              :label="Number(key)"
              :key="index">{{val}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <template v-if="form.houseType === 3">
          <el-form-item
            label="房产月供时长"
            prop="houseMonth">
            <el-select
              v-model.number="form.houseMonth"
              placeholder="请选择房产月供时长">
              <el-option
                v-for="val,key,index in houseMonth"
                :label="val"
                :value="Number(key)"
                :key="index">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            label="房产月供金额"
            prop="houseMonthPay">
            <el-select
              v-model.number="form.houseMonthPay"
              placeholder="请选择房产月供金额">
              <el-option
                v-for="val,key,index in houseMonthPay"
                :label="val"
                :value="Number(key)"
                :key="index">
              </el-option>
            </el-select>
          </el-form-item>
        </template>
           <!-- 车产信息 -->
        <el-form-item
          label="车产情况"
          prop="carType"
          :rules="{type: 'number', required: true, message: '车产情况不能为空', trigger: 'blur'}">
          <el-select
            v-model.number="form.carType"
            placeholder="请选择车产情况">
            <el-option
              v-for="val,key,index in carType"
              :disabled="index===0|| index===1"
              :label="val"
              :value="Number(key)"
              :key="index">
            </el-option>
          </el-select>
        </el-form-item>
        <template v-if="form.carType === 1 || form.carType === 3 || form.carType === 4">
          <el-form-item
            label="购买价格"
            prop="carPrice">
            <el-input
              v-model.number="form.carPrice"
              placeholder="请输入车辆购买价格">
              <template slot="append">万元</template>
            </el-input>
          </el-form-item>
         <el-form-item
          label="车龄情况">
          <el-input
          v-model="form.carYears"
          placeholder="请输入车龄情况">
          <template slot="append">年</template>
          </el-input>
         </el-form-item>
         <el-form-item
            label="牌照类型">
            <el-select
              v-model.number="form.carLocal"
              placeholder="请选择牌照类型">
              <el-option
                v-for="val,key,index in carLocal"
                :label="val"
                :value="Number(key)"
                :key="index">
              </el-option>
            </el-select>
          </el-form-item>
        </template>
        <template v-if="form.carType === 3 && form.carLocal === 1">
        <el-form-item
          label="车产月供时长">
          <el-select
            v-model.number="form.carMonth"
            placeholder="请选车产月供时长">
            <el-option
              v-for="val,key,index in carMonth"
              :label="val"
              :value="Number(key)"
              :key="index">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="车产月供金额">
          <el-select
            v-model.number="form.carMonthPay"
            placeholder="请选择车产月供金额">
            <el-option
              v-for="val,key,index in carMonthPay"
              :label="val"
              :value="Number(key)"
              :key="index">
            </el-option>
          </el-select>
        </el-form-item>
      </template>
        <!-- 保单信息 -->
        <el-form-item
          label="保险类型"
          prop="insurType"
          :rules="{type: 'number', required: true, message: '保险类型不能为空', trigger: 'blur'}">
          <el-select
            v-model.number="form.insurType"
            placeholder="请选择保险类型">
            <el-option
              v-for="val,key,index in insurType"
              :disabled="index===2"
              :label="val"
              :value="Number(key)"
              :key="index">
            </el-option>
          </el-select>
        </el-form-item>
        <template v-if="form.insurType === 1 || form.insurType === 2">
          <el-form-item
            label="保险公司名称">
            <el-input
              v-model="form.companyName"
              placeholder="请输入保险公司名称">
            </el-input>
          </el-form-item>
          <el-form-item
            label="投保时长"
            prop="insurMonth">
            <el-input
              v-model.number="form.insurMonth"
              placeholder="请输入投保时长">
              <template slot="append">个月</template>
            </el-input>
          </el-form-item>
          <el-form-item
            label="每年保费">
            <el-input
              v-model="form.insurYearAmt"
              placeholder="请输入每年保费">
              <template slot="append">元</template>
            </el-input>
          </el-form-item>
          <el-form-item
            label="是否本人参保">
            <el-radio-group
              v-model="form.insurSelf"
              placeholder="请选择是否本人参保">
              <el-radio
                v-for="val,key,index in insurSelf"
                :label="Number(key)"
                :key="index">{{val}}</el-radio>
            </el-radio-group>
          </el-form-item>
        </template>
      </el-form>
    </div>
  </div>
</template>

<script>
const TIME_COUNT = 60
// 主要信息子组件
export default {
  name: 'record-other',
  props: {
    title: String,
    otherInfo: Object
  },
  data () {
    let cityList = JSON.parse(this.$localStorage('cityList')) || []
    return {
      isSave: false,
      form: {
         // 房产信息
        houseType: '',
        houseVal: '',
        houseMonth: '',
        houseMonthPay: '',
        housePlace: '',
        myLoanHouse: '',
        // 车产信息
        carType: '',
        carYears: '',
        carPrice: '',
        carLocal: '',
        carMonth: '',
        carMonthPay: '',
         // 保单信息
        insurType: '',
        insurMonth: '',
        insurYearAmt: '',
        insurSelf: '',
        companyName: '',
        // 征信信息
        creditType: '',
        sumAmonut: '',
        useAmount: '',
        overdueCount: '',
        curOverType: ''
      },
      cityList, // 城市数据
      // 信用情况
      creditType: {
        1: '信用良好',
        2: '无信用卡,贷款',
        4: '2年内超过3次逾期',
        5: '2年内少于3次逾期'
      },
       // 当前是否逾期
      curOverType: {
        0: '无',
        1: '有逾期'
      },
      // 保险类型
      insurType: {
        '0': '无保险',
        1: '有保险',
        2: '财险'
      },
       // 房产类型
      houseType: {
        1: '其他房产',
        2: '无房产',
        3: '商品房(按揭)',
        4: '商品房(全款)'
      },
       // 是否是主贷人
      myLoanHouse: {
        0: '否',
        1: '是'
      },
      // 房产位置
      housePlace: {
        1: '本地房',
        2: '外地房'
      },
      // 房产月供时长
      houseMonth: {
        6: '半年以下',
        12: '半年-1年',
        24: '1年-3年',
        36: '3年以上'
      },
      // 房产月供金额
      houseMonthPay: {
        1000: '1千以内',
        1999: '1-3千',
        4999: '3-5千',
        6999: '5-1万',
        10000: '1万-2万',
        20000: '2万以上'
      },
      // 车产情况
      carType: {
        '0': '名下无车',
        1: '名下有车',
        2: '无车',
        3: '按揭车',
        4: '全款车'
      },
      // 车龄情况
      carYears: {
        1: '3年以内',
        2: '3-5年',
        3: '5-10年',
        4: '10年以上'
      },
      // 牌照类型
      carLocal: {
        1: '本地',
        2: '外地'
      },
      // 车产月供时长
      carMonth: {
        6: '半年以下',
        12: '半年-1年',
        24: '1年-3年',
        36: '3年以上'
      },
      // 车产月供时长
      carMonthPay: {
        1000: '1千以内',
        1999: '1-2千',
        2999: '2-3千',
        4999: '3-5千',
        6999: '5千-1万',
        10000: '1万以上'
      },
      // 是否本人参保
      insurSelf: {
        0: '否',
        1: '是'
      },
      saveText: TIME_COUNT + '秒后自动保存',
      countdown: TIME_COUNT,
      timer: null
    }
  },
  watch: {
    otherInfo (obj) {
      this.form = {
        creditType: obj['creditType'],
        insurType: obj['insurType'],
        insurMonth: obj['insurMonth'],
        insurYearAmt: obj['insurYearAmt'],
        insurSelf: obj['insurSelf'],
        companyName: obj['companyName'],
        socialAmount: obj['socialAmount'],
        fundAmount: obj['fundAmount'],
        liabiAmount: obj['liabiAmount'],
        sumAmount: obj['sumAmount'],
        useAmount: obj['useAmount'],
        overdueCount: obj['overdueCount'],
        curOverType: obj['curOverType'],
        houseType: obj['houseType'],
        houseVal: obj['houseVal'],
        houseMonth: obj['houseMonth'],
        houseMonthPay: obj['houseMonthPay'],
        housePlace: obj['housePlace'],
        myLoanHouse: obj['myLoanHouse'],
        carType: obj['carType'],
        carYears: obj['carYears'],
        carLocal: obj['carLocal'],
        carPrice: obj['carPrice'],
        carMonth: obj['carMonth'],
        carMonthPay: obj['carMonthPay']
      }
    },
    form: {
      handler: function (val, oldVal) {
        if (this.isSave) {
          this.$emit('change')
        } else {
          this.isSave = true
        }
      },
      deep: true
    }
  },
  created () {
    // this.dealCountDown()
  },
  methods: {
    dealCountDown () {
      if (!this.timer) {
        this.countdown = TIME_COUNT
        this.timer = setInterval(() => {
          if (this.countdown > 0 && this.countdown <= TIME_COUNT) {
            this.saveText = this.countdown + '秒后自动保存'
            this.countdown--
          } else {
            clearInterval(this.timer)
            this.timer = null
            this.saveText = '保存中...'
            if (this.$route.query.applyId) this.form['applyId'] = this.$route.query.applyId
            this.$ajax({
              url: '/store/account/work/applyInfo/saveOtherInfo',
              data: this.form,
              success: data => {
                this.$message('操作成功')
                this.saveText = TIME_COUNT + '秒后自动保存'
                this.dealCountDown()
              },
              fail: data => {
                this.$alt(data.message, () => {
                  this.saveText = TIME_COUNT + '秒后自动保存'
                  this.dealCountDown()
                })
              }
            })
          }
        }, 1000)
      }
    },
    saveHandle () {
      this.countdown = 0
    }
  }
}
</script>
