<template>
  <div class="content-box">
    <div class="header__title">查看产品信息</div>
    <div class="product-form">
      <el-form ref="form" :model="form">
        <div class="el-row">
          <label class="el-col el-col-4 el-form-item__label">
            <span>机构名称:</span>
          </label>
          <div class="el-col el-col-8"><span class="view-text">{{orgData[form.orgId] && orgData[form.orgId]['name']}}</span></div>
        </div>
        <div class="el-row">
          <label class="el-col el-col-4 el-form-item__label">
            <span>产品名称:</span>
          </label>
          <div class="el-col el-col-8"><span class="view-text">{{form.prodName}}</span></div>
        </div>
        <div class="el-row">
          <label class="el-col el-col-4 el-form-item__label">
            <span>最小年龄:</span>
          </label>
          <div class="el-col el-col-20">
            <div class="w16"><span class="view-text">{{form.minAge}}</span></div>
            <div class="item-line">—</div>
            <label class="el-form-item__label w110">
              <span>最大年龄:</span>
            </label>
            <div class="w16"><span class="view-text">{{form.maxAge}}</span></div>
            <div class="el-input-group__append">岁</div>
          </div>
        </div>
        <div class="el-row">
          <label class="el-col el-col-4 el-form-item__label">
            <span>最小贷款金额:</span>
          </label>
          <div class="el-col el-col-20">
            <div class="w16"><span class="view-text">{{form.minLoan}}</span></div>
            <div class="item-line">—</div>
            <label class="el-form-item__label w110">
              <span>最大贷款金额:</span>
            </label>
            <div class="w16"><span class="view-text">{{form.maxLoan}}</span></div>
            <div class="el-input-group__append">元</div>
          </div>
        </div>
        <div class="el-row">
          <label class="el-col el-col-4 el-form-item__label">
            <span>还款日设置:</span>
          </label>
          <div class="el-col el-col-20"><span class="view-text">{{{1: '固定日期', 2: '按放款日期'}[form.repayDayType]}}</span></div>
        </div>
        <div class="el-row">
          <label class="el-col el-col-4 el-form-item__label">
            <span>垫资日:</span>
          </label>
          <div class="el-col el-col-20">
            <div class="w16"><span class="view-text">{{form.advanceDay || '&nbsp;'}}</span></div>
            <div class="el-input-group__append">日</div>
          </div>
        </div>
        <div class="el-row">
          <label class="el-col el-col-4 el-form-item__label">
            <span>还款日:</span>
          </label>
          <div class="el-col el-col-20">
            <div class="w16"><span class="view-text">{{form.repayDay || '&nbsp;'}}</span></div>
            <div class="el-input-group__append">日</div>
          </div>
        </div>
        <div class="el-row mt32">
          <label class="el-col el-col-4 el-form-item__label">
            <span>贷款期限:</span>
          </label>
          <div class="el-col el-col-20">
            <div class="w16"><span class="view-text">{{form.loanTerm[0].term || '&nbsp;'}}</span></div>
            <div class="el-input-group__append">个月</div>
            <div class="item-line">&nbsp;</div>
            <div class="w16">&nbsp;</div>
            <label class="el-col-6 el-form-item__label">
              <span>月利率:</span>
            </label>
            <div class="w16"><span class="view-text">{{form.loanTerm[0].rate || '&nbsp;'}}</span></div>
            <div class="el-input-group__append">%</div>
          </div>
        </div>
        <div class="el-row" v-if="form.loanTerm.length > 1">
          <label class="el-col el-col-4">&nbsp;</label>
          <div class="el-col el-col-20">
            <div class="w16"><span class="view-text">{{form.loanTerm[1].term || '&nbsp;'}}</span></div>
            <div class="el-input-group__append">个月</div>
            <div class="item-line">&nbsp;</div>
            <div class="w16">&nbsp;</div>
            <label class="el-col-6">&nbsp;</label>
            <div class="w16"><span class="view-text">{{form.loanTerm[1].rate || '&nbsp;'}}</span></div>
            <div class="el-input-group__append">%</div>
          </div>
        </div>
        <div class="el-row" v-if="form.loanTerm.length > 2">
          <label class="el-col el-col-4">&nbsp;</label>
          <div class="el-col el-col-20">
            <div class="w16"><span class="view-text">{{form.loanTerm[2].term || '&nbsp;'}}</span></div>
            <div class="el-input-group__append">个月</div>
            <div class="item-line">&nbsp;</div>
            <div class="w16">&nbsp;</div>
            <label class="el-col-6">&nbsp;</label>
            <div class="w16"><span class="view-text">{{form.loanTerm[2].rate || '&nbsp;'}}</span></div>
            <div class="el-input-group__append">%</div>
          </div>
        </div>
        <div class="el-row">
          <label class="el-col el-col-4 el-form-item__label">
            <span>逾期罚款设置:</span>
          </label>
          <div class="el-col el-col-20"><span class="view-text">{{{fixed: '固定金额', percent: '百分比'}[form.overDue.type]}}</span></div>
        </div>
        <div class="el-row">
          <label class="el-col el-col-4 el-form-item__label">
            <span>逾期天数:</span>
          </label>
          <div class="el-col el-col-20">
            <div class="w16"><span class="view-text">{{form.overDue.detail[0].minOver || '&nbsp;'}}</span></div>
            <div class="item-line">-</div>
            <div class="w16"><span class="view-text">{{form.overDue.detail[0].maxOver || '&nbsp;'}}</span></div>
            <div class="el-input-group__append">个月</div>
            <label class="el-col-6 el-form-item__label">
              <span>每天逾期罚息金额:</span>
            </label>
            <div class="w16"><span class="view-text">{{form.overDue.detail[0].due || '&nbsp;'}}</span></div>
            <div class="el-input-group__append">{{form.overDue.type === 'fixed' ? '元' : '%'}}</div>
          </div>
        </div>
        <div class="el-row" v-if="form.overDue.detail.length > 1">
          <label class="el-col el-col-4">&nbsp;</label>
          <div class="el-col el-col-20">
            <div class="w16"><span class="view-text">{{form.overDue.detail[1].minOver || '&nbsp;'}}</span></div>
            <div class="item-line">-</div>
            <div class="w16"><span class="view-text">{{form.overDue.detail[1].maxOver || '&nbsp;'}}</span></div>
            <div class="el-input-group__append">个月</div>
            <label class="el-col-6">&nbsp;</label>
            <div class="w16"><span class="view-text">{{form.overDue.detail[1].due || '&nbsp;'}}</span></div>
            <div class="el-input-group__append">{{form.overDue.type === 'fixed' ? '元' : '%'}}</div>
          </div>
        </div>
        <div class="el-row" v-if="form.overDue.detail.length > 2">
          <label class="el-col el-col-4">&nbsp;</label>
          <div class="el-col el-col-20">
            <div class="w16"><span class="view-text">{{form.overDue.detail[2].minOver || '&nbsp;'}}</span></div>
            <div class="item-line">-</div>
            <div class="w16"><span class="view-text">{{form.overDue.detail[2].maxOver || '&nbsp;'}}</span></div>
            <div class="el-input-group__append">个月</div>
            <label class="el-col-6">&nbsp;</label>
            <div class="w16"><span class="view-text">{{form.overDue.detail[2].due || '&nbsp;'}}</span></div>
            <div class="el-input-group__append">{{form.overDue.type === 'fixed' ? '元' : '%'}}</div>
          </div>
        </div>
        <div class="el-row">
          <label class="el-col el-col-4 el-form-item__label">
            <span>费用设置:</span>
          </label>
          <div class="el-col el-col-20"><span class="view-text">{{{fixed: '固定金额', percent: '百分比'}[form.cost.type]}}</span></div>
        </div>
        <div class="el-row">
          <label class="el-col el-col-4 el-form-item__label">
            <span>费用类型:</span>
          </label>
          <div class="el-col el-col-20">
            <div class="w16"><span class="view-text">{{form.cost.detail[0].costName || '&nbsp;'}}</span></div>
            <div class="el-input-group__append">&nbsp;</div>
            <div class="item-line">&nbsp;</div>
            <div class="w16">&nbsp;</div>
            <label class="el-col-6 el-form-item__label">
              <span>月利率:</span>
            </label>
            <div class="w16"><span class="view-text">{{form.cost.detail[0].cost || '&nbsp;'}}</span></div>
            <div class="el-input-group__append">{{form.cost.type === 'fixed' ? '元' : '%'}}</div>
          </div>
        </div>
        <div class="el-row" v-if="form.cost.detail.length > 1">
          <label class="el-col el-col-4">&nbsp;</label>
          <div class="el-col el-col-20">
            <div class="w16"><span class="view-text">{{form.cost.detail[1].costName || '&nbsp;'}}</span></div>
            <div class="el-input-group__append">&nbsp;</div>
            <div class="item-line">&nbsp;</div>
            <div class="w16">&nbsp;</div>
            <label class="el-col-6">&nbsp;</label>
            <div class="w16"><span class="view-text">{{form.cost.detail[1].cost || '&nbsp;'}}</span></div>
            <div class="el-input-group__append">{{form.cost.type === 'fixed' ? '元' : '%'}}</div>
          </div>
        </div>
        <div class="el-row" v-if="form.cost.detail.length > 2">
          <label class="el-col el-col-4">&nbsp;</label>
          <div class="el-col el-col-20">
            <div class="w16"><span class="view-text">{{form.cost.detail[2].costName || '&nbsp;'}}</span></div>
            <div class="el-input-group__append">&nbsp;</div>
            <div class="item-line">&nbsp;</div>
            <div class="w16">&nbsp;</div>
            <label class="el-col-6">&nbsp;</label>
            <div class="w16"><span class="view-text">{{form.cost.detail[2].cost || '&nbsp;'}}</span></div>
            <div class="el-input-group__append">{{form.cost.type === 'fixed' ? '元' : '%'}}</div>
          </div>
        </div>
        <div class="el-row mt32">
          <label class="el-col el-col-4 el-form-item__label">
            <span>配置风控:</span>
          </label>
          <div class="el-col el-col-8"><span class="view-text">{{riskData[form.riskTypeId] && riskData[form.riskTypeId]['typeDesc']}}</span></div>
        </div>
        <div class="el-row">
          <label class="el-col el-col-4 el-form-item__label">
            <span>配置催收:</span>
          </label>
          <div class="el-col el-col-8"><span class="view-text">{{loanData[form.levelId] && loanData[form.levelId]['levelDesc']}}</span></div>
        </div>
        <div class="el-row">
          <label class="el-col el-col-4 el-form-item__label">
            <span>配置自动审核:</span>
          </label>
          <div class="el-col el-col-8"><span class="view-text">{{checkData[form.checkId] && checkData[form.checkId]['typeDesc']}}</span></div>
        </div>
        <div class="el-row">
          <label class="el-col el-col-4 el-form-item__label">
            <span>支持城市:</span>
          </label>
          <div class="el-col el-col-8"><span class="view-text">{{form.supportCity || '&nbsp;'}}</span></div>
        </div>
        <div class="el-row">
          <label class="el-col el-col-4 el-form-item__label">
            <span>第一期还款是否足月:</span>
          </label>
          <div class="el-col el-col-20"><span class="view-text">{{{0: '否', 1: '是'}[form.firstPeriodFull]}}</span></div>
        </div>
        <div class="el-row">
          <label class="el-col el-col-4 el-form-item__label">
            <span>日利息计算:</span>
          </label>
          <div class="el-col el-col-20"><span class="view-text">{{{1: '360', 2: '365', 3: '366'}[form.dayRateFactor]}}</span></div>
        </div>
        <div class="ctrl-row">
          <el-button class="cancal__btn" @click="backHandle">返回</el-button>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'product-detail',
  data () {
    let prodId = this.$route.query.prodId || ''
    return {
      prodId,
      form: {
        orgId: '',
        prodName: '',
        minAge: '',
        maxAge: '',
        minLoan: '',
        maxLoan: '',
        repayDayType: '',
        advanceDay: '',
        repayDay: '',
        loanTerm: [
          {term: '', rate: ''}
        ],
        overDue: {
          type: '',
          detail: [
            {over: [], due: ''}
          ]
        },
        cost: {
          type: '',
          detail: [
            {costName: '', cost: ''}
          ]
        },
        riskTypeId: '',
        levelId: '',
        checkId: '',
        supportCity: '',
        firstPeriodFull: '',
        dayRateFactor: ''
      },
      checkDay (rule, value, callback) {
        (value === undefined || typeof value !== 'number' || value > 31) ? callback(new Error('输入格式不正确')) : callback()
      },
      orgData: [],
      riskData: [],
      loanData: [],
      checkData: []
    }
  },
  created () {
    this.getProduct()
    this.getOrg()
    this.getRisk()
    this.getLoan()
    this.getCheck()
  },
  methods: {
    // 获取产品信息
    getProduct () {
      this.$ajax({
        url: '/crmsys/account/prod/prodInfo/detail',
        data: {
          prodId: this.prodId,
          prodType: 1
        },
        success: data => {
          let form = data.attr || {}
          this.form.orgId = form['orgId'] || ''
          this.form.prodName = form['prodName'] || ''
          this.form.minAge = form['minAge'] || ''
          this.form.maxAge = form['maxAge'] || ''
          this.form.minLoan = form['minLoan'] || ''
          this.form.maxLoan = form['maxLoan'] || ''
          this.form.repayDayType = form['repayDayType'] || ''
          this.form.advanceDay = form['advanceDay'] || ''
          this.form.repayDay = form['repayDay'] || ''
          this.form.loanTerm = JSON.parse(form['loanTerm'] || '[{"term":"","rate":""}]')
          this.form.overDue = JSON.parse(form['overDue'] || '{"type":"","detail":[{"minOver":"","maxOver":"","due":""}]}')
          this.form.cost = JSON.parse(form['cost'] || '{"type":"","detail":[{"costName":"","cost":""}]}')
          this.form.riskTypeId = form['riskTypeId'] || ''
          this.form.levelId = form['levelId'] || ''
          this.form.checkId = form['checkId'] || ''
          this.form.supportCity = form['supportCity'] || ''
          this.form.firstPeriodFull = form['firstPeriodFull'] || ''
          this.form.dayRateFactor = form['dayRateFactor'] || ''
        }
      })
    },
    // 获取机构信息
    getOrg () {
      this.$ajax({
        url: '/crmsys/account/prod/org/queryList',
        success: data => {
          this.orgData = data.rows || []
        }
      })
    },
    // 获取风控信息
    getRisk () {
      this.$ajax({
        url: '/crmsys/account/prod/prodInfo/ruleType',
        success: data => {
          this.riskData = data.rows || []
        }
      })
    },
    // 获取催收信息
    getLoan () {
      this.$ajax({
        url: '/crmsys/account/prod/prodInfo/coll',
        success: data => {
          this.loanData = data.rows || []
        }
      })
    },
    // 获取自动审核信息
    getCheck () {
      this.$ajax({
        url: '/crmsys/account/prod/prodInfo/authCheck',
        success: data => {
          this.checkData = data.rows || []
        }
      })
    },
    // 返回
    backHandle () {
      this.$router.back()
    }
  }
}
</script>