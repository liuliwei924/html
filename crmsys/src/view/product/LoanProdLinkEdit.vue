<template>
  <div class="content-box">
    <div class="header__title">编辑产品信息</div>
    <div class="product-form">
      <el-form ref="form" :model="form">
        <!-- <div class="el-row is-required">
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
        </div> -->
        <!--    <div class="el-row is-required">
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
            <el-select v-model="form.amountType" filterable clearable placeholder="金额选项">
              <!-- <el-option v-for="val,key,index in level" :label="val" :value="key" :key="index"></el-option> -->
              <el-option :value="1" label="手动输入">手动输入</el-option>
              <el-option :value="2" label="选择项">选择项</el-option>
              <el-option :value="3" label="自动间隔分子">自动间隔分子</el-option>
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
            <el-select v-model="form.deadlineType" filterable clearable placeholder="期限选项">
              <!-- <el-option v-for="val,key,index in level" :label="val" :value="key" :key="index"></el-option> -->
              <el-option label="手动输入" :value="1">手动输入</el-option>
              <el-option label="选择项" :value="2">选择项</el-option>
              <el-option label="自动间隔分子" :value="3">自动间隔分子</el-option>
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
        <div class="el-row is-required">
          <label class="el-col el-col-4 el-form-item__label">
            <span>利息描述:</span>
          </label>
          <el-form-item class="el-col w16" prop="interest">
            <el-input v-model.number="form.interest" placeholder="请输入利息"></el-input>
          </el-form-item>
        </div>
        <div v-for="(item, index) in form.rateCost" :key="index" v-if="form.type===1">
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
        <div class="el-row is-required">
          <label class="el-col el-col-4 el-form-item__label">
            <span>认证资料:</span>
          </label>
          <prod-transfer :prodAuthData="prodAuthData" :prodArray="prodArray" @change="prodChange" v-model="form.prodAuth">
          </prod-transfer>
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
            <span>申请总次数:</span>
          </label>
          <el-form-item class="el-col w16" prop="applyCount" :rules="[{ type: 'number', message: '请输入数字值'}]">
            <el-input v-model.number="form.applyCount" placeholder="请输入申请总次数"></el-input>
          </el-form-item>
        </div>
        <div class="el-row is-required">
          <label class="el-col el-col-4 el-form-item__label">
            <span>排序值:</span>
          </label>
          <el-form-item class="el-col w16" prop="indexNum" :rules="[{ type: 'number', message: '请输入数字值'}]">
            <el-input v-model.number="form.indexNum" placeholder="请输入排序值"></el-input>
          </el-form-item>
        </div>
        <div class="el-row is-required">
          <label class="el-col el-col-4 el-form-item__label">
            <span>产品标签:</span>
          </label>
          <el-form-item class="el-col w410" prop="prodLabel">
            <el-select v-model="form.prodLabel" filterable clearable multiple placeholder="产品标签">
              <el-option v-for="val,key,index in prodLabelData" :label="val.labelName" :value="val.labelName" :key="index"></el-option>
            </el-select>
          </el-form-item>
        </div>
        <div class="el-row is-required">
          <label class="el-col el-col-4 el-form-item__label">
            <span>申请条件:</span>
          </label>
          <el-form-item class="el-col w410" prop="prodDetail.condition">
            <el-input v-model="form.prodDetail.condition" type="textarea" :rows="2" placeholder="请输入申请条件"></el-input>
          </el-form-item>
        </div>
        <div class="el-row is-required">
          <label class="el-col el-col-4 el-form-item__label">
            <span>所需资料:</span>
          </label>
          <el-form-item class="el-col w410" prop="prodDetail.material">
            <el-input v-model="form.prodDetail.material" type="textarea" :rows="2" placeholder="请输入所需资料"></el-input>
          </el-form-item>
        </div>
        <div class="el-row is-required">
          <label class="el-col el-col-4 el-form-item__label">
            <span>跳转url:</span>
          </label>
          <el-form-item class="el-col w410" prop="url">
            <el-input v-model="form.url" placeholder="跳转url"></el-input>
          </el-form-item>
        </div>
        <div class="el-row is-required">
          <label class="el-col el-col-4 el-form-item__label">
            <span>显示终端:</span>
          </label>
          <el-form-item class="el-col w410">
            <el-checkbox-group v-model="form.showType">
              <el-checkbox label="WX"></el-checkbox>
              <el-checkbox label="IOS"></el-checkbox>
              <el-checkbox label="Android"></el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </div>
        <div class="el-row is-required">
          <label class="el-col el-col-4 el-form-item__label">
            <span>产品图标:</span>
          </label>
          <el-form-item label="" class="gradeImg-uploader" required>
            <el-upload class="avatar-uploader" action="action" :show-file-list="false" :on-change="changeHandle" :auto-upload="false">
              <img v-if="form.prodIcon" :src="form.prodIcon" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item>
        </div>
        <div class="el-row is-required">
          <label class="el-col el-col-4 el-form-item__label">
            <span>是否推荐:</span>
          </label>
          <el-form-item class="el-col" prop="isRecommend">
            <el-radio-group v-model="form.isRecommend">
              <el-radio-button label="1">推荐</el-radio-button>
              <el-radio-button label="0">不推荐</el-radio-button>
            </el-radio-group>
          </el-form-item>
        </div>
        <div class="el-row is-required">
          <label class="el-col el-col-4 el-form-item__label">
            <span>是否热门:</span>
          </label>
          <el-form-item class="el-col" prop="isHot">
            <el-radio-group v-model="form.isHot">
              <el-radio-button label="1">是</el-radio-button>
              <el-radio-button label="0">否</el-radio-button>
            </el-radio-group>
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
          <el-button class="confirm__btn" @click="editHandle">修改</el-button>
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
    let prodId = this.$route.query.prodId || ''
    let prodType = this.$route.query.prodType || ''
    return {
      prodId,
      handleBtn: true,
      form: {
        showType: [],
        prodId: prodId,
        type: prodType,
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
        amountType: 1,
        amountParam: '',
        deadlineType: 2,
        deadlineParam: '',
        interest: '',
        applyCount: '',
        indexNum: '',
        rateCost: [
          {rate: '', desc: '', isPercent: true, before: true, isEveryTime: false}
        ],
        cost: '',
        prodAuth: [],
        minLoanTime: '',
        prodLabel: [],
        prodDetail: {
          condition: '',
          material: ''
        },
        isRecommend: 1,
        status: 1,
        isHot: 1,
        url: '',
        prodIcon: ''

      },
      prodArray: [],
      OtherArray: [],
      prodflag: false,
      otherflag: false,
      prodAuthData: [],
      orgNameData: [],
      prodLabelData: []
    }
  },
  created () {
    this.getQuickProd()
    this.getOrgName()
    this.getProdAuth()
    this.getProdLabel()
  },
  methods: {
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
          this.form.applyCount = form['applyCount'] || ''
          this.form.indexNum = form['indexNum'] || ''
          this.form.rateCost = JSON.parse(form['cost'] || '[{"rate":"", "desc":"", "isPercent":"true", "before":"true"}]')
          this.prodArray = JSON.parse(form['prodAuth'] || '[]')
          this.form.minLoanTime = form['minLoanTime'] || ''
          this.form.prodLabel = form['prodLabel'].split(',') || []
          this.form.prodDetail = JSON.parse(form['prodDetail'] || '{"condition":"", "material":""}')
          this.form.url = form['url'] || ''
          this.form.showType = form['showType'].split(',') || []
          this.form.prodIcon = form['prodIcon'] || ''
          this.form.isRecommend = form['isRecommend']
          this.form.status = form['status']
          this.form.isHot = form['isHot']
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
    editHandle () {
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
          this.form.prodDetail = JSON.stringify(this.form.prodDetail)
          this.form.prodLabel = this.form.prodLabel.join(',')
          this.form.showType = this.form.showType.join(',')
          this.$ajax({
            url: 'open/account/prod/prodInfo/modifyProdInfo',
            data: this.form,
            success: data => {
              this.$router.back({query: {prodType: this.form.type}})
            }
          })
        }
      }, true)
    },
    // 校验
    /* checkOut (msg, flag) {
      let valiData = [{required: true, message: msg + '不能为空'}]
      if (flag) {
        valiData.push({type: 'number', message: msg + '必须为数字值', trigger: 'change'})
      }
      return valiData
    }, */
    checkOut (msg) {
      return [{type: 'number', message: msg + '必须为数字值', trigger: 'blur'}]
    },
    // 返回
    backHandle () {
      this.$router.push({path: 'quickProdInfo', query: {prodType: this.form.type}})
    },

    changeHandle (file, fileList) {
      this.$upload({
        url: '/store/uploadAction/uploadFile',
        data: {
          fileType: 'prodIcon',
          file: file.raw
        },
        success: data => {
          this.form.prodIcon = data.fileId
        }
      })
    }
  },
  components: {
    ProdTransfer,
    OtherTransfer
  }
}
</script>