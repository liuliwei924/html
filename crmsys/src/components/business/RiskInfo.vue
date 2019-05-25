<template>
  <div class="risk-content">
    <div class="risk-head" style="margin-bottom: 20px;">
      <div class="risk-head-item clearfix">
        <div class="risk-head__title fl">最终结果</div>
        <div class="risk-head__text fl">{{decisions[finalDecision]}}</div>
      </div>
    </div>
    <template v-for="item in riskData">
      <div class="risk-head">
        <div class="risk-head-item clearfix">
          <div class="risk-head__title fl">策略名称</div>
          <div class="risk-head__text fl">{{item['strategyName']}}</div>
        </div>
        <div class="risk-head-item clearfix">
          <div class="risk-head__title fl">策略决策结果</div>
          <div class="risk-head__text fl">{{decisions[item['strategyDecision']]}}</div>
        </div>
      </div>
      <div class="risk-body">
        <div class="risk-body-item" v-for="subItem,subIndex in item['hitRules']" :key="subIndex">
          <div class="risk-body-subItem clearfix">
            <div class="risk-item__title fl">规则名称</div>
            <div class="risk-item__text fl">{{subItem['ruleName']}}</div>
          </div>
          <div class="risk-body-subItem clearfix">
            <div class="risk-item__title fl">规则决策结果</div>
            <div class="risk-item__text fl">{{decisions[subItem['decision']]}}</div>
          </div>
          <div class="risk-body-subItem clearfix">
            <div class="risk-item__title fl">描述</div>
            <div class="risk-item__text fl">{{subItem['memo']}}</div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
// 主要信息子组件
export default {
  name: 'risk-info',
  props: {
    info: Object
  },
  data () {
    return {
      finalDecision: '',
      riskData: [],
      decisions: {
        'Accept': '通过,无风险',
        'Reject': '拒绝,风险评估决策为高风险建议拒绝',
        'Review': '审核,风险评估决策为低风险建议人工审核'
      }
    }
  },
  watch: {
    info (obj) {
      this.finalDecision = obj.finalDecision || ''
      this.riskData = obj.strategySet || []
    }
  }
}
</script>
