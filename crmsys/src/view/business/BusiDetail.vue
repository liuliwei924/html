<template>
  <div class="content-box bgf2">
    <div class="header__title">详情</div>
    <el-tabs class="record-box" v-model="activeTab" @tab-click="tabHandle">
      <el-tab-pane label="录单基本信息" name="first">
        <el-collapse v-model="collapse">
          <el-collapse-item title="申请信息" name="1">
            <apply-info :type="type" :info="custInfo.applyInfo" />
          </el-collapse-item>
          <el-collapse-item title="个人资料" name="2">
            <cust-base :type="type" :info="custInfo.custBase" @change="marryChange" />
          </el-collapse-item>
          <el-collapse-item title="工作信息" name="3">
            <cust-work :type="type" :info="custInfo.custWork" @change="compTypeChange" />
          </el-collapse-item>
          <el-collapse-item title="公司信息" name="4" v-if="compType === 3">
            <cust-company :type="type" :info="custInfo.custCompany" />
          </el-collapse-item>
          <el-collapse-item title="资产信息" name="5">
            <cust-assets :type="type" :info="custInfo.custAssets" />
          </el-collapse-item>
          <el-collapse-item title="家庭情况信息" name="6" v-if="marry === 2 || marry === 6">
            <cust-family :type="type" :info="custInfo.custFamily" />
          </el-collapse-item>
          <el-collapse-item title="联系人资料" name="7">
            <cust-contact :type="type" :custId="custId" :info="custInfo.contacts" />
          </el-collapse-item>
          <el-collapse-item title="负债情况" name="8">
            <credit-count :type="type" :info="custInfo.creditCount" />
          </el-collapse-item>
          <el-collapse-item title="信用情况" name="9">
            <cust-credit :type="type" :info="custInfo.custCredit" />
          </el-collapse-item>
          <el-collapse-item title="银行卡信息" name="10">
            <apply-bank :type="type" :info="custInfo.bankInfo" />
          </el-collapse-item>
        </el-collapse>
      </el-tab-pane>
      <el-tab-pane label="上传资料" name="second">
        <file-material :applyId="applyId" :type="type" />
      </el-tab-pane>
      <el-tab-pane label="银行录像" name="third">
        <info-video :applyId="applyId" />
      </el-tab-pane>
      <el-tab-pane label="个人征信信息" name="fourth">
        <risk-info :info="riskInfo" />
      </el-tab-pane>
      <el-tab-pane label="审核记录" name="reviewList">
        <review-list :applyId="applyId"></review-list>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import ApplyInfo from '@/components/business/ApplyInfo'
import CustBase from '@/components/business/CustBase'
import CustFamily from '@/components/business/CustFamily'
import CustAssets from '@/components/business/CustAssets'
import CustContact from '@/components/business/CustContact'
import CustWork from '@/components/business/CustWork'
import CustCompany from '@/components/business/CustCompany'
import ApplyBank from '@/components/business/ApplyBank'
import CreditCount from '@/components/business/CreditCount'
import CustCredit from '@/components/business/CustCredit'
import FileMaterial from '@/components/business/FileMaterial'
import InfoVideo from '@/components/business/InfoVideo'
import RiskInfo from '@/components/business/RiskInfo'
import ReviewList from '@/components/business/ReviewList'
export default {
  name: 'busi-detail',
  data () {
    let applyId = this.$route.query.applyId
    return {
      applyId,
      activeTab: 'first',
      type: this.$route.query.type || 'doc', // add:添加模式 edit:编辑模式 doc:查看模式
      custId: '',
      tabNames: {
        first: true,
        second: false,
        third: false,
        fourth: false
      },
      compType: 1,
      marry: 1,
      collapse: ['1', '2', '3'],
      fourthCollapse: ['1'],
      custInfo: {
        applyInfo: {},
        custBase: {},
        custFamily: {},
        custAssets: {},
        contacts: [],
        custWork: {},
        custCompany: {},
        creditCount: {},
        custCredit: {},
        bankInfo: {}
      },
      riskInfo: {}
    }
  },
  created () {
    this.queryCustInfo()
  },
  methods: {
    tabHandle (tab) {
      let tabName = tab.name
      if (!this.tabNames[tabName]) {
        if (tabName === 'second') this.queryCustInfo()
        else if (tabName === 'third') this.queryCustInfo()
        else if (tabName === 'fourth') this.queryRiskInfo()
        this.tabNames[tabName] = true
      }
    },
    queryCustInfo () {
      this.$ajax({
        url: '/crmsys/account/user/custInfo/editCustInfo',
        data: {
          applyId: this.applyId
        },
        success: data => {
          let custInfo = data.attr.custInfo || {}
          this.custId = custInfo['custId']
          this.custInfo = {
            applyInfo: custInfo['applyInfo'] || {},
            custBase: custInfo['cust'] || {},
            custFamily: custInfo['custFamily'] || {},
            custAssets: custInfo['custAssets'] || {},
            contacts: custInfo['contacts'] || [],
            custWork: custInfo['custWork'] || {},
            custCompany: custInfo['custCompany'] || {},
            creditCount: custInfo['creditCount'] || {},
            custCredit: custInfo['custCredit'] || {},
            bankInfo: custInfo['bankInfo'] || {}
          }
          this.compType = custInfo['custWork'].compType || 1
          this.marry = custInfo['cust'].marry || 1
        }
      })
    },
    queryRiskInfo () {
      this.$ajax({
        url: '/crmsys/account/user/custInfo/queryRiskInfo',
        data: {
          custId: this.custId
        },
        success: data => {
          this.riskInfo = data.attr || {}
        }
      })
    },
    compTypeChange (val) {
      this.compType = val
    },
    marryChange (val) {
      this.marry = val
    }
  },
  components: {
    ApplyInfo,
    CustBase,
    CustFamily,
    CustAssets,
    CustContact,
    CustWork,
    CustCompany,
    CreditCount,
    CustCredit,
    ApplyBank,
    FileMaterial,
    InfoVideo,
    RiskInfo,
    ReviewList
  }
}
</script>
