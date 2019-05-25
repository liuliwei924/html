<template>
  <div>
    <div class="kf-pane-box">
      <div class="kf-pane-head kf-pane-head1 ph2">基本信息</div>
      <div class="pane-item clearfix">
        <div class="label">工号</div>
        <div class="text">{{custInfo.workNo}}</div>
      </div>
      <div class="pane-item clearfix">
        <div class="label">姓名</div>
        <div class="text">{{custInfo.realName}}</div>
      </div>
      <div class="pane-item clearfix">
        <div class="label">手机号码</div>
        <div class="text">{{custInfo.telephone}}</div>
      </div>
      <div class="pane-item clearfix">
        <div class="label">身份证号</div>
        <div class="text">{{custInfo.cardNo}}</div>
      </div>
      <div class="pane-item clearfix">
        <div class="label">用户等级</div>
        <div class="text">{{custInfo.gradeName1}}</div>
      </div>
      <div class="pane-item clearfix">
        <div class="label">注册时间</div>
        <div class="text">{{custInfo.registerTime}}</div>
      </div>
      <div class="pane-item clearfix">
        <div class="label">绑卡银行</div>
        <div class="text">{{custInfo.bankName}}</div>
      </div>
      <div class="pane-item clearfix">
        <div class="label">银行卡号</div>
        <div class="text">{{custInfo.bankCardNo}}</div>
      </div>
      <div class="pane-item clearfix">
        <div class="label">累计收入</div>
        <div class="text">{{custInfo.rewardAmount}}</div>
      </div>
      <div class="pane-item clearfix">
        <div class="label">可提现</div>
        <div class="text">{{custInfo.usableAmount}}</div>
      </div>
    </div>
    <div class="kf-pane-box">
     <div class="kf-pane-head kf-pane-head1 ph2">用户相关信息</div>
     <div class="pane-item clearfix">
        <div class="label">锁粉数</div>
        <div class="text">{{custInfo.lockNums}}</div>
      </div>
      <div class="pane-item clearfix" style="background-color: #EEEEEE">
        <div class="label">批卡数</div>
        <div class="text">{{custInfo.succNums}}</div>
      </div>
      <div class="pane-item clearfix">
        <div class="label">推荐申请数</div>
        <div class="text">{{custInfo.refererApplyNum}}</div>
      </div>
      <div class="pane-item  clearfix" style="background-color: #FFFFFF">
        <div class="label">一级推荐人(姓名)</div>
        <div class="text">{{custInfo.userName2 ? custInfo.userName2 : '无'}}</div>
      </div>
      <div class="pane-item clearfix" style="background-color: #FFFFFF">
        <div class="label">一级推荐人(工号)</div>
        <div class="text">{{ custInfo.workNo2 ? custInfo.workNo2 : '无' }}</div>
      </div>
      <div class="pane-item clearfix">
        <div class="label">一级推荐人(等级)</div>
        <div class="text">{{ custInfo.gradeName2 ? custInfo.gradeName2 : '无' }}</div>
      </div>
      <div class="pane-item clearfix">
        <div class="label">二级推荐人(姓名)</div>
        <div class="text">{{ custInfo.userName3 ? custInfo.userName3 : '无' }}</div>
      </div>
      <div class="pane-item clearfix" style="background-color: #EEEEEE">
        <div class="label">二级推荐人(工号)</div>
        <div class="text">{{ custInfo.workNo3 ? custInfo.workNo3 : '无' }}</div>
      </div>
      <div class="pane-item clearfix">
        <div class="label">二级推荐人(等级)</div>
        <div class="text">{{ custInfo.gradeName3 ? custInfo.gradeName3 : '无' }}</div>
      </div>
      <div class="pane-item clearfix">
        <div class="label">三级推荐人(姓名)</div>
        <div class="text">{{ custInfo.userName4 ? custInfo.userName4 : '无' }}</div>
      </div>
        <div class="pane-item clearfix" style="background-color: #FFFFFF">
        <div class="label">三级推荐人(工号)</div>
        <div class="text">{{ custInfo.workNo4 ? custInfo.workNo4 : '无' }}</div>
      </div>
      <div class="pane-item clearfix">
        <div class="label">三级推荐人(等级)</div>
        <div class="text">{{ custInfo.gradeName4 ? custInfo.gradeName4 : '无' }}</div>
      </div>
    </div>
    <div class="kf-pane-box">
      <div class="kf-pane-head kf-pane-head1 ph2">升级记录</div>
      <div class="kf-record-box">
        <div class="clearfix" v-for="(list,index) in updateRecord" :key="index">
          <div class="pane-item clearfix" :class="{'grayBg': (index%2 === 0)}">
            <div class="label">用户等级</div>
            <div class="text">{{list.gradeName}}</div>
            <div class="label">升级时间</div>
            <div class="text">{{list.createTime}}</div>
            <div class="label">升级描述</div>
            <div class="text">{{list.gradeDESC}}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'fxBase-info',
  data () {
    let custId = this.$route.query['custId'] || ''
    let channelCustFlag = this.$route.query['channelCustFlag'] || ''
    return {
      custId,
      channelCustFlag,
      custInfo: {},
      updateRecord: []
    }
  },
  created () {
    this.queryRelation()
    this.queryRecord()
  },
  methods: {
    queryRelation () {
      let url = '/store/account/fx/fxCust/queryFxCustDtl'
      if (this.channelCustFlag) {
        url = '/store/account/fx/fxChannelCust/queryFxCustDtl'
      }
      this.$ajax({
        url: url,
        data: {
          custId: this.custId
        },
        loading: true,
        success: data => {
          this.custInfo = data.attr.custInfo || {}
        }
      })
    },
    queryRecord () {
      let url = '/store/account/fx/fxCust/queryCustUpdateRecord'
      if (this.channelCustFlag) {
        url = '/store/account/fx/fxChannelCust/queryCustUpdateRecord'
      }
      this.$ajax({
        url: url,
        data: {
          custId: this.custId
        },
        loading: true,
        success: data => {
          this.updateRecord = data.rows
        }
      })
    }
  }
}
</script>
<style>
  .grayBg{
    background: #ededed;
  }
</style>
