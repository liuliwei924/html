<template>
  <div class="content-box">
    <div class="header__title">{{titleText}}产品信息</div>
    <div class="product-form">
      <el-form ref="form" :model="form">
        <div class="el-row is-required">
          <label class="el-col el-col-4 el-form-item__label">
            <span>产品类型:</span>
          </label>
          <el-form-item class="el-col w16" prop="type">
            <el-select
              v-model="form.type"
              filterable
              clearable
              placeholder="产品类型">
              <el-option label="api类型" :value="1"></el-option>
              <el-option label="链接类型" :value="2"></el-option>
            </el-select>
          </el-form-item>
        </div>

      <!--   <div class="el-row is-required">
        <label class="el-col el-col-4 el-form-item__label">
          <span>机构名称:</span>
        </label>
        <el-form-item class="el-col w16" prop="orgName">
          <el-select
            v-model="form.orgId"
            filterable
            clearable
            placeholder="机构名称">
            <el-option v-for="val,key,index in orgNameData" :label="val.orgName" :value="val.orgId" :key="index"></el-option>
          </el-select>
        </el-form-item>
      </div> -->

        <div class="el-row is-required">
          <label class="el-col el-col-4 el-form-item__label">
            <span>产品名称:</span>
          </label>
          <el-form-item class="el-col fl" prop="prodName">
            <el-input v-model="form.prodName" placeholder="请输入产品名称"></el-input>
          </el-form-item>
        </div>

        <div class="el-row is-required">
          <label class="el-col el-col-4 el-form-item__label">
            <span>产品标语:</span>
          </label>
          <el-form-item class="el-col w410" prop="prodDesc">
            <el-input v-model="form.prodDesc" placeholder="请输入产品标语"></el-input>
          </el-form-item>
        </div>
        
        <div class="el-row is-required">
          <label class="el-col el-col-4 el-form-item__label">
            <span>贷款金额:</span>
          </label>
          <el-form-item class="el-col w16" prop="minAmount">
            <el-input v-model.number="form.minAmount" class="lg-input" placeholder="请输入金额"></el-input>
          </el-form-item>
          <div class="item-line el-col-1">—</div>
          <el-form-item class="el-col w16" prop="maxAmount">
            <el-input v-model.number="form.maxAmount" placeholder="请输入金额"></el-input>
          </el-form-item>
        </div>
        <div class="el-row is-required">
          <label class="el-col el-col-4 el-form-item__label">
            <span>金额默认值:</span>
          </label>
          <el-form-item class="el-col w16" prop="defaultAmount">
            <el-input v-model.number="form.defaultAmount" placeholder="请输入金额默认值"></el-input>
          </el-form-item>
        </div>
        <div class="el-row is-required">
          <label class="el-col el-col-4 el-form-item__label">
            <span>金额选项:</span>
          </label>
          <el-form-item class="el-col w16" prop="amountType">
            <el-select
              v-model="form.amountType"
              filterable
              clearable
              placeholder="金额选项">
              <!-- <el-option v-for="val,key,index in level" :label="val" :value="key" :key="index"></el-option> -->
              <el-option value="1" label="手动输入">手动输入</el-option>
              <el-option value="2" label="选择项">选择项</el-option>
              <el-option value="3" label="自动间隔分子">自动间隔分子</el-option>
            </el-select>
          </el-form-item>
          <div class="el-col el-col-1">&nbsp;</div>
          <div v-if="form.amountType==2">
            <el-form-item class="el-col el-col-4" prop="amountParam">
              <el-input v-model="form.amountParam" class="lg-input fl" placeholder="请输入金额项"></el-input>
            </el-form-item>
            <span class="form-tips">参考格式1000,900,800,700,600,500 </span>
          </div>
          <div v-if="form.amountType==3">
            <el-form-item class="el-col el-col-4" prop="amountParam">
              <el-input v-model="form.amountParam" class="lg-input fl" placeholder="请输入金额间隔数"></el-input>
            </el-form-item>
            <span class="form-tips">填写整数</span>
          </div>
        </div>

        <div class="el-row is-required">
          <label class="el-col el-col-4 el-form-item__label">
            <span>贷款期限:</span>
          </label>
          <el-form-item class="el-col w16" prop="minDeadline">
            <el-input v-model.number="form.minDeadline" class="lg-input" placeholder="请输入期限"></el-input>
          </el-form-item>
          <div class="item-line el-col-1">—</div>
          <el-form-item class="el-col w16" prop="maxDeadline">
            <el-input v-model.number="form.maxDeadline" class="lg-input" placeholder="请输入期限"></el-input>
          </el-form-item>
          <label class="el-col el-col-4 el-form-item__label">
            <span>期限单位:</span>
          </label>
          <el-form-item class="el-col el-col-6">
            <el-radio-group v-model="form.deadlineUnit">
              <el-radio :label="1">日</el-radio>
              <el-radio :label="2">月</el-radio>
            </el-radio-group>
          </el-form-item>
        </div>
        <div class="el-row is-required">
          <label class="el-col el-col-4 el-form-item__label">
            <span>期限默认值:</span>
          </label>
          <el-form-item class="el-col w16" prop="defaultDeadline">
            <el-input v-model.number="form.defaultDeadline" placeholder="请输入期限默认值"></el-input>
          </el-form-item>
        </div>
        <div class="el-row is-required">
          <label class="el-col el-col-4 el-form-item__label">
            <span>期限选项:</span>
          </label>
          <el-form-item class="el-col w16" prop="deadlineType">
            <el-select
              v-model="form.deadlineType"
              filterable
              clearable
              placeholder="期限选项">
              <!-- <el-option v-for="val,key,index in level" :label="val" :value="key" :key="index"></el-option> -->
              <el-option label="手动输入" value="1">手动输入</el-option>
              <el-option label="选择项" value="2">选择项</el-option>
              <el-option label="自动间隔分子" value="3">自动间隔分子</el-option>
            </el-select>
          </el-form-item>
          <div class="el-col el-col-1">&nbsp;</div>
          <div v-if="form.deadlineType==2">
            <el-form-item class="el-col el-col-4" prop="deadlineParam">
              <el-input v-model="form.deadlineParam" class="lg-input fl" placeholder="请输入期限项"></el-input>
            </el-form-item>
            <span class="form-tips">参考30,29,28,27,26,25格式</span>
          </div>
          <div v-if="form.deadlineType==3">
            <el-form-item class="el-col el-col-4" prop="deadlineParam">
              <el-input v-model="form.deadlineParam" class="lg-input fl" placeholder="请输入期限间隔数"></el-input>
            </el-form-item>
            <span class="form-tips">填写整数</span>
          </div>
        </div>

        <!-- <div class="el-row">
          <label class="el-col el-col-4 el-form-item__label">
            <span>贷款利息和费用:</span>
          </label>
        </div> -->
        <div class="el-row is-required">
          <label class="el-col el-col-4 el-form-item__label">
            <span>利息:</span>
          </label>
          <el-form-item class="el-col w16" prop="interest">
            <el-input v-model.number="form.interest" placeholder="请输入利息"></el-input>
          </el-form-item>
          <div class="el-input-group__append">%</div>
        </div>
        <div v-for="(item, index) in form.rateCost" :key="index">
          <div class="el-row is-required">
            <label class="el-col el-col-4 el-form-item__label">
              <span>费用名称:</span>
            </label>
            <el-form-item class="w16" :prop="`rateCost[${index}].desc`">
              <el-input v-model="form.rateCost[index].desc" placeholder="请输入费用名称"></el-input>
            </el-form-item>
            <label class="el-col el-col-4 el-form-item__label">
              <span>费用收取类型:</span>
            </label>
            <el-form-item class="el-col el-col-8" :prop="`rateCost[${index}].isPercent`">
              <el-radio-group v-model="form.rateCost[index].isPercent">
                <el-radio :label="false">固定金额</el-radio>
                <el-radio :label="true">百分比</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-button class="ctrl__btn ml24" icon="plus" @click="addCost"></el-button>
            <el-button class="ctrl__btn ml24" icon="minus" @click="delCost(index)" v-if="form.rateCost.length>1"></el-button>
          </div>
          <div class="el-row is-required">
            <label class="el-col el-col-4 el-form-item__label">
              <span>费用:</span>
            </label>
            <el-form-item :prop="`rateCost[${index}].rate`" class="w16">
              <el-input v-model="form.rateCost[index].rate" placeholder="请输入费用"></el-input>
            </el-form-item>
            <label class="el-col el-col-4 el-form-item__label">
              <span>是否提前收取:</span>
            </label>
            <el-form-item class="el-col el-col-4" :prop="`rateCost[${index}].before`">
              <el-checkbox v-model="form.rateCost[index].before">是</el-checkbox>
            </el-form-item>
          </div>
        </div>
        
        <!-- <div class="el-row is-required" v-for="(item, index) in form.prodArray">
          <label class="el-col el-col-4 el-form-item__label">
            <span>认证资料:</span>
          </label>
          <order-change :listData="form.prodArray" class="el-col el-col-20 fl"/>
          <el-form-item class="el-col w16" :prop="`prodArray[${index}].authId`">
            <el-select
              v-model="form.prodArray[index].authId"
              filterable
              clearable
              @change=""
              placeholder="认证资料">
              <el-option v-for="val,key,index in prodAuthData" :label="val.authName" :value="val.authId" :key="index"></el-option>
            </el-select>
          </el-form-item>
          <label class="el-col el-col-4 el-form-item__label">
            <span>序列号:</span>
          </label>
          <el-form-item class="el-col w16 el-col-6" :prop="`prodArray[${index}].indexNum`">
            <el-select
              v-model="form.prodArray[index].indexNum"
              filterable
              clearable
              placeholder="请选择序号">
              <el-option v-for="val,key,index in prodAuthData" :label="key" :value="key" :key="index"></el-option>
            </el-select>
          </el-form-item>
          <div class="el-col el-col-4">&nbsp;</div>
          <el-button class="ctrl__btn ml24" @click="addProd" icon="plus"></el-button>
          <el-button class="ctrl__btn ml24" @click="delProd" icon="minus" v-if="form.prodArray.length>1"></el-button>
        </div> -->
        <div class="el-row is-required">
          <label class="el-col el-col-4 el-form-item__label">
            <span>认证资料:</span>
          </label>
          <prod-transfer :prodAuthData="prodAuthData"
           :prodArray="prodArray"
           @change="prodChange"
           v-model="form.prodAuth">
          </prod-transfer>
        </div>

        <!-- <div class="el-row is-required" v-for="(item, index) in form.OtherArray">
          <label class="el-col el-col-4 el-form-item__label">
            <span>其他信息配置:</span>
          </label>
          <el-form-item class="el-col w16" :prop="`OtherArray[${index}].otherId`">
            <el-select
              v-model="form.OtherArray[index].otherId"
              filterable
              clearable
              placeholder="工作类型">
              <el-option v-for="val,key,index in prodOtherData" :label="val.lable" :value="val.otherId" :key="index"></el-option>
            </el-select>
          </el-form-item>
          <label class="el-col el-col-4 el-form-item__label">
            <span>序列号:</span>
          </label>
          <el-form-item class="el-col w16" :prop="`OtherArray[${index}].indexNum`">
            <el-select
              v-model="form.OtherArray[index].indexNum"
              filterable
              clearable
              placeholder="请选择序号">
              <el-option v-for="val,key,index in prodOtherData" :label="key" :value="key" :key="index"></el-option>
            </el-select>
          </el-form-item>
          <div class="el-col el-col-4">&nbsp;</div>
          <el-button class="ctrl__btn ml24" icon="plus" @click="addOther"></el-button>
          <el-button class="ctrl__btn ml24" icon="minus" @click="delOther(index)" v-if="form.OtherArray.length>1"></el-button>
        </div> -->

        <div class="el-row is-required">
          <label class="el-col el-col-4 el-form-item__label">
            <span>其他信息配置:</span>
          </label>
          <other-transfer :prodOtherData="prodOtherData"
           :OtherArray="OtherArray"
           @change="otherChange"
           v-model="form.prodOther">
          </other-transfer>
        </div>

        <div class="el-row is-required">
          <label class="el-col el-col-4 el-form-item__label">
            <span>最快放款时间:</span>
          </label>
          <el-form-item class="el-col w16" prop="minLoanTime">
            <el-input v-model="form.minLoanTime" placeholder="请输入放款时间"></el-input>
          </el-form-item>
        </div>

        <div class="el-row is-required">
          <label class="el-col el-col-4 el-form-item__label">
            <span>产品标签:</span>
          </label>
          <el-form-item class="el-col w410" prop="prodLabel">
            <el-select
              v-model="form.prodLabel"
              filterable
              clearable
              multiple
              placeholder="产品标签">
              <el-option v-for="val,key,index in prodLabelData" :label="val.labelName" :value="val.labelName" :key="index"></el-option>
            </el-select>
          </el-form-item>
        </div>

        <!-- <div class="el-row is-required">
          <label class="el-col el-col-4 el-form-item__label">
            <span>还款日设置:</span>
          </label>
          <el-form-item class="el-col el-col-20" prop="repayDayType">
            <el-radio-group v-model.number="form.repayDayType">
              <el-radio :label="1">固定日期</el-radio>
              <el-radio :label="2">按放款日期</el-radio>
            </el-radio-group>
          </el-form-item>
        </div> -->

        <!-- <div class="el-row">
          <label class="el-col el-col-4 el-form-item__label">
            <span>产品详情:</span>
          </label>
        </div> -->
        <div class="el-row is-required">
          <label class="el-col el-col-4 el-form-item__label">
            <span>申请条件:</span>
          </label>
          <el-form-item class="el-col w410" prop="prodDetail.condition">
            <el-input v-model="form.prodDetail.condition" type="textarea" resize="none" :rows="2" placeholder="请输入申请条件"></el-input>
          </el-form-item>
        </div>
        <div class="el-row is-required">
          <label class="el-col el-col-4 el-form-item__label">
            <span>所需资料:</span>
          </label>
          <el-form-item class="el-col w410" prop="prodDetail.material">
            <el-input v-model="form.prodDetail.material" type="textarea" resize="none" :rows="2" placeholder="请输入所需资料"></el-input>
          </el-form-item>
        </div>

        <div class="el-row is-required">
          <label class="el-col el-col-4 el-form-item__label">
            <span>是否启用:</span>
          </label>
          <el-form-item class="el-col" prop="status">
            <el-radio-group v-model="form.status">
              <el-radio-button label="1">是</el-radio-button>
              <el-radio-button label="0">否</el-radio-button>
            </el-radio-group>
          </el-form-item>
        </div>
        <div class="ctrl-row">
          <el-button class="cancal__btn" @click="backHandle">取消</el-button>
          <el-button v-if="this.handleBtn" class="confirm__btn" @click="saveHandle">保存</el-button>
          <el-button v-else class="confirm__btn" @click="editHandle">修改</el-button>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
import ProdTransfer from '@/components/product/ProdTransfer'
import OtherTransfer from '@/components/product/OtherTransfer'
export default {
  name: 'product-detail',
  data () {
    let type = this.$route.query.type || ''
    let prodId = this.$route.query.prodId || ''
    return {
      prodId,
      handleType: type,
      titleText: '',
      handleBtn: true,
      form: {
        prodId: this.$route.query.prodId || '',
        type: 1,
        orgId: '',
        prodName: '',
        prodDesc: '',
        defaultAmount: '',
        defaultDeadline: '',
        minAmount: '',
        maxAmount: '',
        minDeadline: '',
        maxDeadline: '',
        deadlineUnit: 1,
        amountType: '',
        amountParam: '',
        deadlineType: '',
        deadlineParam: '',
        interest: '',
        rateCost: [
          {rate: '', desc: '', isPercent: true, before: true, isEveryTime: false}
        ],
        cost: '',
        prodAuth: [],
        prodOther: [],
        minLoanTime: '',
        prodLabel: [],
        prodDetail: {
          condition: '',
          material: ''
        },
        status: 1
      },
      prodArray: [],
      OtherArray: [],
      prodflag: false,
      otherflag: false,
      prodAuthData: [],
      prodOtherData: [],
      orgNameData: [],
      prodLabelData: []
    }
  },
  created () {
    this.getHandleType()
    this.getOrgName()
    this.getProdAuth()
    this.getProdOther()
    this.getProdLabel()
  },
  methods: {
    // 判别操作类型
    getHandleType () {
      if (this.handleType === 'add') {
        this.titleText = '添加'
        this.handleBtn = true
      } else if (this.handleType === 'edit') {
        this.titleText = '编辑'
        this.handleBtn = false
        this.getQuickProd()
      }
    },
    // 获取贷款产品信息
    getQuickProd () {
      this.$ajax({
        url: '/open/account/prod/prodInfo/queryProdDtl',
        data: {
          prodId: this.prodId,
          prodType: 1
        },
        success: data => {
          let form = data.rows[0] || {}
          this.form.type = form['type'] || ''
          this.form.orgId = form['orgId'] || ''
          this.form.prodName = form['prodName'] || ''
          this.form.prodDesc = form['prodDesc'] || ''
          this.form.defaultAmount = form['defaultAmount'] || ''
          this.form.defaultDeadline = form['defaultDeadline'] || ''
          this.form.minAmount = form['minAmount'] || ''
          this.form.maxAmount = form['maxAmount'] || ''
          this.form.minDeadline = form['minDeadline'] || ''
          this.form.maxDeadline = form['maxDeadline'] || ''
          this.form.deadlineUnit = form['deadlineUnit'] || ''

          this.form.amountType = form['amountType'] || ''
          this.form.amountParam = form['amountParam'] || ''
          this.form.deadlineType = form['deadlineType'] || ''
          this.form.deadlineParam = form['deadlineParam'] || ''
          this.form.interest = form['interest'] || ''
          this.form.deadlineUnit = form['deadlineUnit'] || ''
          this.form.rateCost = JSON.parse(form['cost'] || '[{"rate":"", "desc":"", "isPercent":"true", "before":"true"}]')
          this.prodArray = JSON.parse(form['prodAuth'] || '[]')
          this.OtherArray = JSON.parse(form['prodOther'] || '[]')
          this.form.minLoanTime = form['minLoanTime'] || ''
          this.form.prodLabel = form['prodLabel'].split(',') || []
          this.form.prodDetail = JSON.parse(form['prodDetail'] || '{"condition":"", "material":""}')
          this.form.status = form['status'] || ''
        }
      })
    },
    // 获取机构信息
    getOrgName () {
      this.$ajax({
        url: '/open/account/org/orgInfo/queryList',
        success: data => {
          this.orgNameData = data.rows || []
        }
      })
    },
    // 获取认证资料
    getProdAuth () {
      this.$ajax({
        url: '/open/account/prod/prodInfo/queryAuthList',
        success: data => {
          this.prodAuthData = data.rows || []
        }
      })
    },
    // 获取其他信息
    getProdOther () {
      this.$ajax({
        url: '/open/account/prod/prodInfo/queryOtherList',
        success: data => {
          this.prodOtherData = data.rows || []
        }
      })
    },
    // 获取产品标签
    getProdLabel () {
      this.$ajax({
        url: '/open/account/prod/prodInfo/queryProdLabel',
        success: data => {
          this.prodLabelData = data.rows || []
        }
      })
    },
    addCost () {
      this.form.rateCost.push({rate: '', desc: '', isPercent: true, before: true})
    },
    delCost (index) {
      this.form.rateCost.splice(index, 1)
    },
    // 认证资料顺序
    prodChange (value) {
      this.prodflag = value
      if (!value && this.form.prodAuth.length === 0) {
        this.form.prodAuth = this.prodArray.map((item, index) => {
          return {
            indexNum: index,
            authId: item.authId
          }
        })
      }
    },
    // 其他信息顺序
    otherChange (value) {
      this.otherflag = value
      if (!value && this.form.prodOther.length === 0) {
        this.form.prodOther = this.OtherArray.map((item, index) => {
          return {
            indexNum: index,
            otherId: item.otherId
          }
        })
      }
    },
    // 保存
    saveHandle () {
      if (this.prodflag) {
        this.$message('请保存认证资料顺序配置')
        return
      }
      if (this.otherflag) {
        this.$message('请保存认证资料顺序配置')
        return
      }
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.form.cost = JSON.stringify([].concat(this.form.rateCost))
          this.form.prodAuth = JSON.stringify([].concat(this.form.prodAuth))
          this.form.prodOther = JSON.stringify([].concat(this.form.prodOther))
          this.form.prodDetail = JSON.stringify(this.form.prodDetail)
          this.form.prodLabel = this.form.prodLabel.join(',')
          this.$ajax({
            url: '/open/account/prod/prodInfo/saveProdInfo',
            data: this.form,
            success: data => {
              this.$router.back()
            }
          })
        }
      }, true)
    },
    editHandle () {
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.form.cost = JSON.stringify([].concat(this.form.rateCost))
          this.form.prodAuth = JSON.stringify([].concat(this.form.prodAuth))
          this.form.prodOther = JSON.stringify([].concat(this.form.prodOther))
          this.form.prodDetail = JSON.stringify([].concat(this.form.proddesc))
          this.$ajax({
            url: 'open/account/prod/prodInfo/modifyProdInfo',
            data: this.form,
            success: data => {
              this.$router.back()
            }
          })
        }
      }, true)
    },
    // 校验
    checkOut (msg, flag) {
      let valiData = [{required: true, message: msg + '不能为空'}]
      if (flag) {
        valiData.push({type: 'number', message: msg + '必须为数字值', trigger: 'change'})
      }
      return valiData
    },
    // 返回
    backHandle () {
      this.$router.back()
    }
  },
  components: {
    ProdTransfer,
    OtherTransfer
  }
}
</script>