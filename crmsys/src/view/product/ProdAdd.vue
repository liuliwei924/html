<template>
  <div class="content-box">
    <div class="header__title">添加产品信息</div>
    <div class="product-form">
      <el-form ref="form" :model="form">
        <div class="el-row is-required">
          <label class="el-col el-col-4 el-form-item__label">
            <span>机构名称:</span>
          </label>
          <el-form-item class="el-col el-col-8" prop="orgId" :rules="{type: 'number', required: true, message: '机构名称不能为空', trigger: 'blur'}">
            <el-select v-model.number="form.orgId" class="lg-input" placeholder="请选择机构名称">
              <el-option v-for="item,index in orgData" :label="item.name" :value="item.orgId" :key="index"></el-option>
            </el-select>
          </el-form-item>
        </div>
        <div class="el-row is-required">
          <label class="el-col el-col-4 el-form-item__label">
            <span>产品名称:</span>
          </label>
          <el-form-item class="el-col el-col-8" prop="prodName" :rules="{required: true, message: '产品名称不能为空', trigger: 'blur'}">
            <el-input v-model="form.prodName" class="lg-input" placeholder="请输入产品名称"></el-input>
          </el-form-item>
        </div>
        <div class="el-row is-required">
          <label class="el-col el-col-4 el-form-item__label">
            <span>最小年龄:</span>
          </label>
          <div class="el-col el-col-20">
            <el-form-item prop="minAge" class="w16" :rules="{required: true, message: '最小年龄不能为空', trigger: 'blur'}">
              <el-input v-model="form.minAge" placeholder="请输入最小年龄"></el-input>
            </el-form-item>
            <div class="item-line">—</div>
            <label class="el-form-item__label w110">
              <span>最大年龄:</span>
            </label>
            <el-form-item prop="maxAge" class="w16" :rules="{required: true, message: '最大年龄不能为空', trigger: 'blur'}">
              <el-input v-model="form.maxAge" placeholder="请输入最大年龄"></el-input>
            </el-form-item>
            <div class="el-input-group__append">岁</div>
          </div>
        </div>
        <div class="el-row is-required">
          <label class="el-col el-col-4 el-form-item__label">
            <span>最小贷款金额:</span>
          </label>
          <div class="el-col el-col-20">
            <el-form-item prop="minLoan" class="w16" :rules="{required: true, message: '最小贷款金额不能为空', trigger: 'blur'}">
              <el-input v-model="form.minLoan" placeholder="请输入最小贷款金额"></el-input>
            </el-form-item>
            <div class="item-line">—</div>
            <label class="el-form-item__label w110">
              <span>最大贷款金额:</span>
            </label>
            <el-form-item prop="maxLoan" class="w16" :rules="{required: true, message: '最大贷款金额不能为空', trigger: 'blur'}">
              <el-input v-model="form.maxLoan" placeholder="请输入最大贷款金额"></el-input>
            </el-form-item>
            <div class="el-input-group__append">元</div>
          </div>
        </div>
        <div class="el-row is-required">
          <label class="el-col el-col-4 el-form-item__label">
            <span>还款日设置:</span>
          </label>
          <el-form-item class="el-col el-col-20" prop="repayDayType" :rules="{type: 'number', required: true, message: '还款日不能为空', trigger: 'blur'}">
            <el-radio-group v-model.number="form.repayDayType">
              <el-radio :label="1">固定日期</el-radio>
              <el-radio :label="2">按放款日期</el-radio>
            </el-radio-group>
          </el-form-item>
        </div>
        <div class="el-row is-required" v-if="form.repayDayType === 1">
          <label class="el-col el-col-4 el-form-item__label">
            <span>还款日:</span>
          </label>
          <div class="el-col el-col-20">
            <el-form-item class="w16" prop="repayDay" :rules="{type: 'number', min: 1, max: 30, required: true, message: '还款日不能为空', trigger: 'blur'}">
              <el-input v-model.number="form.repayDay" class="lg-input" placeholder="请输入还款日"></el-input>
            </el-form-item>
            <div class="el-input-group__append">日</div>
          </div>
        </div>
        <div class="el-row is-required">
          <label class="el-col el-col-4 el-form-item__label">
            <span>垫资日:</span>
          </label>
          <div class="el-col el-col-20">
            <el-form-item class="w16" prop="advanceDay" :rules="{type: 'number', min: 1, max: 30, required: true, message: '垫资日不能为空', trigger: 'blur'}">
              <el-input v-model.number="form.advanceDay" class="lg-input" placeholder="请输入垫资日"></el-input>
            </el-form-item>
            <div class="el-input-group__append">日</div>
          </div>
        </div>
        <div class="el-row is-required mt32">
          <label class="el-col el-col-4 el-form-item__label">
            <span>贷款期限:</span>
          </label>
          <div class="el-col el-col-20">
            <el-form-item prop="loanTerm[0].term" class="w16" :rules="{required: true, message: '贷款期限不能为空', trigger: 'blur'}">
              <el-input v-model="form.loanTerm[0].term" placeholder="请输入贷款期限"></el-input>
            </el-form-item>
            <div class="el-input-group__append">个月</div>
            <div class="item-line">&nbsp;</div>
            <div class="w16">&nbsp;</div>
            <label class="el-col-6 el-form-item__label">
              <span>月利率:</span>
            </label>
            <el-form-item prop="loanTerm[0].rate" class="w16" :rules="{required: true, message: '月利率不能为空', trigger: 'blur'}">
              <el-input v-model="form.loanTerm[0].rate" placeholder="请输入月利率"></el-input>
            </el-form-item>
            <div class="el-input-group__append">%</div>
            <el-button class="ctrl__btn ml24" icon="plus" @click="addLoadTerm(1)"></el-button>
          </div>
        </div>
        <div class="el-row" v-if="form.loanTerm.length > 1">
          <label class="el-col el-col-4">&nbsp;</label>
          <div class="el-col el-col-20">
            <el-form-item prop="loanTerm[1].term" class="w16" :rules="{required: true, message: '贷款期限不能为空', trigger: 'blur'}">
              <el-input v-model="form.loanTerm[1].term" placeholder="请输入贷款期限"></el-input>
            </el-form-item>
            <div class="el-input-group__append">个月</div>
            <div class="item-line">&nbsp;</div>
            <div class="w16">&nbsp;</div>
            <label class="el-col-6">&nbsp;</label>
            <el-form-item prop="loanTerm[1].rate" class="w16" :rules="{required: true, message: '月利率不能为空', trigger: 'blur'}">
              <el-input v-model="form.loanTerm[1].rate" placeholder="请输入月利率"></el-input>
            </el-form-item>
            <div class="el-input-group__append">%</div>
            <el-button class="ctrl__btn ml24" icon="plus" @click="addLoadTerm(2)"></el-button>
            <el-button class="ctrl__btn ml10" icon="minus" @click="delLoadTerm(1)"></el-button>
          </div>
        </div>
        <div class="el-row" v-if="form.loanTerm.length > 2">
          <label class="el-col el-col-4">&nbsp;</label>
          <div class="el-col el-col-20">
            <el-form-item prop="loanTerm[2].term" class="w16" :rules="{required: true, message: '贷款期限不能为空', trigger: 'blur'}">
              <el-input v-model="form.loanTerm[2].term" placeholder="请输入贷款期限"></el-input>
            </el-form-item>
            <div class="el-input-group__append">个月</div>
            <div class="item-line">&nbsp;</div>
            <div class="w16">&nbsp;</div>
            <label class="el-col-6">&nbsp;</label>
            <el-form-item prop="loanTerm[2].rate" class="w16" :rules="{required: true, message: '月利率不能为空', trigger: 'blur'}">
              <el-input v-model="form.loanTerm[2].rate" placeholder="请输入月利率"></el-input>
            </el-form-item>
            <div class="el-input-group__append">%</div>
            <el-button class="ctrl__btn ml24" icon="plus"></el-button>
            <el-button class="ctrl__btn ml10" icon="minus" @click="delLoadTerm(2)"></el-button>
          </div>
        </div>
        <div class="el-row is-required">
          <label class="el-col el-col-4 el-form-item__label">
            <span>逾期罚款设置:</span>
          </label>
          <el-form-item class="el-col el-col-20" prop="overDue.type" :rules="{required: true, message: '逾期罚款不能为空', trigger: 'blur'}">
            <el-radio-group v-model="form.overDue.type">
              <el-radio label="fixed">固定金额</el-radio>
              <el-radio label="percent">百分比</el-radio>
            </el-radio-group>
          </el-form-item>
        </div>
        <div class="el-row is-required">
          <label class="el-col el-col-4 el-form-item__label">
            <span>逾期天数:</span>
          </label>
          <div class="el-col el-col-20">
            <el-form-item prop="overDue.detail[0].minOver" class="w16">
              <!-- <el-input v-model="form.overDue.detail[0].minOver" placeholder="请输入逾期天数"></el-input> -->
              <span>{{form.overDue.detail[0].minOver}}</span>
            </el-form-item>
            <div class="item-line">-</div>
            <el-form-item prop="overDue.detail[0].maxOver" class="w16" :rules="{required: true, message: '逾期天数不能为空', trigger: 'blur'}">
              <el-input v-model="form.overDue.detail[0].maxOver" placeholder="请输入逾期天数"></el-input>
            </el-form-item>
            <div class="el-input-group__append">天</div>
            <label class="el-col-6 el-form-item__label">
              <span>{{form.overDue.type === 'fixed' ? '逾期罚息金额' : '逾期罚息利率'}}:</span>
            </label>
            <el-form-item prop="overDue.detail[0].due" class="w16" v-show="form.overDue.type === 'percent'" 
            :rules="{required: true, message: '百分比不能为空', trigger: 'blur'}">
              <el-input v-model="form.overDue.detail[0].due" placeholder="请输入百分比"></el-input>
            </el-form-item>
            <el-form-item prop="overDue.detail[0].due" class="w16" v-show="form.overDue.type === 'fixed'"
            :rules="{required: true, message: '金额不能为空', trigger: 'blur'}">
              <el-input v-model="form.overDue.detail[0].due" placeholder="请输入金额"></el-input>
            </el-form-item>
            <div class="el-input-group__append">{{form.overDue.type === 'fixed' ? '元' : '%'}}</div>
            <el-button class="ctrl__btn ml24" icon="plus" @click="addOverDue(1)"></el-button>
          </div>
        </div>
        <div class="el-row" v-if="form.overDue.detail.length > 1">
          <label class="el-col el-col-4">&nbsp;</label>
          <div class="el-col el-col-20">
            <el-form-item prop="overDue.detail[1].minOver" class="w16">
              <!-- <el-input v-model="form.overDue.detail[1].minOver" placeholder="请输入逾期天数"></el-input> -->
              <span>{{form.overDue.detail[0].maxOver || 0}}</span>
            </el-form-item>
            <div class="item-line">-</div>
            <el-form-item prop="overDue.detail[1].maxOver" class="w16" :rules="{required: true, message: '逾期天数不能为空', trigger: 'blur'}">
              <el-input v-model="form.overDue.detail[1].maxOver" placeholder="请输入逾期天数"></el-input>
            </el-form-item>
            <div class="el-input-group__append">天</div>
            <label class="el-col-6">&nbsp;</label>
            <el-form-item prop="overDue.detail[1].due" class="w16" v-show="form.overDue.type === 'percent'" 
            :rules="{required: true, message: '百分比不能为空', trigger: 'blur'}">
              <el-input v-model="form.overDue.detail[1].due" placeholder="请输入百分比"></el-input>
            </el-form-item>
            <el-form-item prop="overDue.detail[1].due" class="w16" v-show="form.overDue.type === 'fixed'"
            :rules="{required: true, message: '金额不能为空', trigger: 'blur'}">
              <el-input v-model="form.overDue.detail[1].due" placeholder="请输入金额"></el-input>
            </el-form-item>
            <div class="el-input-group__append">{{form.overDue.type === 'fixed' ? '元' : '%'}}</div>
            <el-button class="ctrl__btn ml24" icon="plus" @click="addOverDue(2)"></el-button>
            <el-button class="ctrl__btn ml10" icon="minus" @click="delOverDue(1)"></el-button>
          </div>
        </div>
        <div class="el-row" v-if="form.overDue.detail.length > 2">
          <label class="el-col el-col-4">&nbsp;</label>
          <div class="el-col el-col-20">
            <el-form-item prop="overDue.detail[2].minOver" class="w16">
              <!-- <el-input v-model="form.overDue.detail[2].minOver" placeholder="请输入逾期天数"></el-input> -->
              <span>{{form.overDue.detail[1].maxOver || 0}}</span>
            </el-form-item>
            <div class="item-line">&nbsp;</div>
            <el-form-item prop="overDue.detail[2].maxOver" class="w16">
              <!-- <el-input v-model="form.overDue.detail[2].maxOver" placeholder="请输入逾期天数"></el-input> -->
              <div class="el-input-group__append fl">天以上</div>
            </el-form-item>
            <div class="el-input-group__append">&nbsp;</div>
            <label class="el-col-6">&nbsp;</label>
            <el-form-item prop="overDue.detail[2].due" class="w16" v-show="form.overDue.type === 'percent'" 
            :rules="{required: true, message: '百分比不能为空', trigger: 'blur'}">
              <el-input v-model="form.overDue.detail[2].due" placeholder="请输入百分比"></el-input>
            </el-form-item>
            <el-form-item prop="overDue.detail[2].due" class="w16" v-show="form.overDue.type === 'fixed'"
            :rules="{required: true, message: '金额不能为空', trigger: 'blur'}">
              <el-input v-model="form.overDue.detail[2].due" placeholder="请输入金额"></el-input>
            </el-form-item>
            <div class="el-input-group__append">{{form.overDue.type === 'fixed' ? '元' : '%'}}</div>
            <el-button class="ctrl__btn ml24" icon="plus"></el-button>
            <el-button class="ctrl__btn ml10" icon="minus" @click="delOverDue(2)"></el-button>
          </div>
        </div>
        <div class="el-row is-required">
          <label class="el-col el-col-4 el-form-item__label">
            <span>费用设置:</span>
          </label>
          <el-form-item class="el-col el-col-20" prop="cost.type" :rules="{required: true, message: '逾期罚款不能为空', trigger: 'blur'}">
            <el-radio-group v-model="form.cost.type">
              <el-radio label="fixed">固定金额</el-radio>
              <el-radio label="percent">百分比</el-radio>
            </el-radio-group>
          </el-form-item>
        </div>
        <div class="el-row">
          <label class="el-col el-col-4 el-form-item__label">
            <span>费用类型:</span>
          </label>
          <div class="el-col el-col-20">
            <el-form-item prop="cost.detail[0].costName" class="w16" :rules="{required: true, message: '贷款期限不能为空', trigger: 'blur'}">
              <el-input v-model="form.cost.detail[0].costName" placeholder="请输入贷款期限"></el-input>
            </el-form-item>
            <div class="el-input-group__append">&nbsp;</div>
            <div class="item-line">&nbsp;</div>
            <div class="w16">&nbsp;</div>
            <label class="el-col-6 el-form-item__label">
              <span>月利率:</span>
            </label>
            <el-form-item prop="cost.detail[0].cost" class="w16" :rules="{required: true, message: '月利率不能为空', trigger: 'blur'}">
              <el-input v-model="form.cost.detail[0].cost" placeholder="请输入月利率"></el-input>
            </el-form-item>
            <div class="el-input-group__append">{{form.cost.type === 'fixed' ? '元' : '%'}}</div>
            <el-button class="ctrl__btn ml24" icon="plus" @click="addCost(1)"></el-button>
          </div>
        </div>
        <div class="el-row" v-if="form.cost.detail.length > 1">
          <label class="el-col el-col-4">&nbsp;</label>
          <div class="el-col el-col-20">
            <el-form-item prop="cost.detail[1].costName" class="w16" :rules="{required: true, message: '贷款期限不能为空', trigger: 'blur'}">
              <el-input v-model="form.cost.detail[1].costName" placeholder="请输入贷款期限"></el-input>
            </el-form-item>
            <div class="el-input-group__append">&nbsp;</div>
            <div class="item-line">&nbsp;</div>
            <div class="w16">&nbsp;</div>
            <label class="el-col-6">&nbsp;</label>
            <el-form-item prop="cost.detail[1].cost" class="w16" :rules="{required: true, message: '月利率不能为空', trigger: 'blur'}">
              <el-input v-model="form.cost.detail[1].cost" placeholder="请输入月利率"></el-input>
            </el-form-item>
            <div class="el-input-group__append">{{form.cost.type === 'fixed' ? '元' : '%'}}</div>
            <el-button class="ctrl__btn ml24" icon="plus" @click="addCost(2)"></el-button>
            <el-button class="ctrl__btn ml10" icon="minus" @click="delCost(1)"></el-button>
          </div>
        </div>
        <div class="el-row" v-if="form.cost.detail.length > 2">
          <label class="el-col el-col-4">&nbsp;</label>
          <div class="el-col el-col-20">
            <el-form-item prop="cost.detail[2].costName" class="w16" :rules="{required: true, message: '贷款期限不能为空', trigger: 'blur'}">
              <el-input v-model="form.cost.detail[2].costName" placeholder="请输入贷款期限"></el-input>
            </el-form-item>
            <div class="el-input-group__append">&nbsp;</div>
            <div class="item-line">&nbsp;</div>
            <div class="w16">&nbsp;</div>
            <label class="el-col-6">&nbsp;</label>
            <el-form-item prop="cost.detail[2].cost" class="w16" :rules="{required: true, message: '月利率不能为空', trigger: 'blur'}">
              <el-input v-model="form.cost.detail[2].cost" placeholder="请输入月利率"></el-input>
            </el-form-item>
            <div class="el-input-group__append">{{form.cost.type === 'fixed' ? '元' : '%'}}</div>
            <el-button class="ctrl__btn ml24" icon="plus"></el-button>
            <el-button class="ctrl__btn ml10" icon="minus" @click="delCost(2)"></el-button>
          </div>
        </div>
        <div class="el-row is-required mt32">
          <label class="el-col el-col-4 el-form-item__label">
            <span>配置风控:</span>
          </label>
          <el-form-item class="el-col el-col-8" prop="riskTypeId" :rules="{type: 'number', required: true, message: '配置风控不能为空', trigger: 'blur'}">
            <el-select v-model.number="form.riskTypeId" class="lg-input" placeholder="请选择配置风控">
              <el-option v-for="item,index in riskData" :label="item.typeDesc" :value="item.typeId" :key="index"></el-option>
            </el-select>
          </el-form-item>
        </div>
        <div class="el-row is-required">
          <label class="el-col el-col-4 el-form-item__label">
            <span>配置催收:</span>
          </label>
          <el-form-item class="el-col el-col-8" prop="levelId" :rules="{type: 'number', required: true, message: '配置催收不能为空', trigger: 'blur'}">
            <el-select v-model.number="form.levelId" class="lg-input" placeholder="请选择配置催收">
              <el-option v-for="item,index in loanData" :label="item.levelDesc" :value="item.levelId" :key="index"></el-option>
            </el-select>
          </el-form-item>
        </div>
        <div class="el-row is-required">
          <label class="el-col el-col-4 el-form-item__label">
            <span>配置自动审核:</span>
          </label>
          <el-form-item class="el-col el-col-8" prop="checkId" :rules="{type: 'number', required: true, message: '配置自动审核不能为空', trigger: 'blur'}">
            <el-select v-model.number="form.checkId" class="lg-input" placeholder="请选择配置自动审核">
              <el-option v-for="item,index in checkData" :label="item.checkDesc" :value="item.checkId" :key="index"></el-option>
            </el-select>
          </el-form-item>
        </div>
        <div class="el-row is-required">
          <label class="el-col el-col-4 el-form-item__label">
            <span>配置贷款计算公式:</span>
          </label>
          <el-form-item class="el-col el-col-8" prop="checkId" :rules="{type: 'number', required: true, message: '配置自动审核不能为空', trigger: 'blur'}">
            <el-select v-model.number="form.formulaId" class="lg-input" placeholder="请选择配置自动审核">
              <el-option v-for="item,index in formulaData" :label="item.formulaDesc" :value="item.formulaId" :key="index"></el-option>
            </el-select>
          </el-form-item>
        </div>
        <div class="el-row is-required">
          <label class="el-col el-col-4 el-form-item__label">
            <span>支持城市:</span>
          </label>
          <el-form-item class="el-col el-col-8" prop="supportCity" :rules="{required: true, message: '支持城市不能为空', trigger: 'blur'}">
            <el-input v-model="form.supportCity" class="lg-input" placeholder="请输入支持城市"></el-input>
          </el-form-item>
        </div>
        <div class="el-row is-required">
          <label class="el-col el-col-4 el-form-item__label">
            <span>第一期还款是否足月:</span>
          </label>
          <el-form-item class="el-col el-col-20" prop="firstPeriodFull" :rules="{type: 'number', required: true, message: '第一期还款不能为空', trigger: 'blur'}">
            <el-radio-group v-model.number="form.firstPeriodFull">
              <el-radio :label="0">否</el-radio>
              <el-radio :label="1">是</el-radio>
            </el-radio-group>
          </el-form-item>
        </div>
        <div class="el-row is-required">
          <label class="el-col el-col-4 el-form-item__label">
            <span>日利息计算:</span>
          </label>
          <el-form-item class="el-col el-col-20" prop="dayRateFactor" :rules="{type: 'number', required: true, message: '日利息计算不能为空', trigger: 'blur'}">
            <el-radio-group v-model.number="form.dayRateFactor">
              <el-radio :label="1">360</el-radio>
              <el-radio :label="2">365</el-radio>
              <el-radio :label="3">366</el-radio>
            </el-radio-group>
          </el-form-item>
        </div>
        <div class="ctrl-row">
          <el-button class="cancal__btn" @click="backHandle">取消</el-button>
          <el-button class="confirm__btn" @click="saveHandle">保存</el-button>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'product-detail',
  data () {
    return {
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
          type: 'percent',
          detail: [
            {due: '', maxOver: '', minOver: '0'}
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
        formulaId: '',
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
      checkData: [],
      formulaData: []
    }
  },
  created () {
    this.getOrg()
    this.getRisk()
    this.getLoan()
    this.getCheck()
    this.getFormula()
  },
  methods: {
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
    // 获取配置贷款计算公式
    getFormula () {
      this.$ajax({
        url: '/crmsys/account/prod/prodInfo/queryFormula',
        success: data => {
          this.formulaData = data.rows || []
        }
      })
    },
    // 增加贷款期限
    addLoadTerm (index) {
      if (this.form.loanTerm.length === index) this.form.loanTerm.push({term: '', rate: ''})
    },
    // 减少贷款期限
    delLoadTerm (index) {
      this.form.loanTerm.splice(index, 1)
    },
    // 增加逾期天数
    addOverDue (index) {
      if (this.form.overDue.detail.length === index) {
        this.form.overDue.detail.push({due: '', maxOver: '', minOver: '0'})
        this.form.overDue.detail[index].minOver = this.form.overDue.detail[index - 1].maxOver
        if (index === 2) {
          this.form.overDue.detail[index].maxOver = 9999
        }
      }
    },
    // 减少逾期天数
    delOverDue (index) {
      this.form.overDue.detail.splice(index, 1)
    },
    // 增加费用管理
    addCost (index) {
      if (this.form.cost.detail.length === index) this.form.cost.detail.push({costName: '', cost: ''})
    },
    // 减少费用管理
    delCost (index) {
      this.form.cost.detail.splice(index, 1)
    },
    // 保存
    saveHandle () {
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.form.loanTerm = JSON.stringify(this.form.loanTerm)
          /* this.form.overDue.detail.map(item => {
            item['over'] = item['over'].join('-')
          }) */
          this.form.overDue = JSON.stringify(this.form.overDue)
          this.form.cost = JSON.stringify(this.form.cost)
          this.$ajax({
            url: '/crmsys/account/prod/prodInfo/saveLargeProd',
            data: this.form,
            success: data => {
              this.$router.back()
            }
          })
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