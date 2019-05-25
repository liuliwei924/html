<template>
  <div class="record-content input-content col-2">
    <el-button class="record-edit-btn"></el-button>
    <!-- 表单 -->
    <el-form
      class="clearfix"
      :model="form"
      ref="form"
      label-width="40%">
      <el-form-item
        label="姓名"
        prop="applyName"
        :rules="{required: true, message: '申请人姓名不能为空', trigger: 'blur'}">
        <el-input
          v-model="form.applyName"
          :maxlength="20"
          placeholder="请输入申请人姓名">
        </el-input>
      </el-form-item>
      <el-form-item
        label="手机"
        prop="telephone">
        <el-input
          v-model.number="form.telephone"
          placeholder="请输入手机号码" :maxlength="11">
        </el-input>
      </el-form-item>
      <el-form-item
        label="申请城市:"
        prop="cityName"
        :rules="{required: true, message: '申请城市不能为空', trigger: 'change'}">
        <el-select
          v-model="form.cityName"
          clearable
          filterable
          placeholder="请选择">
          <el-option-group
            v-for="group,gIndex in cityList"
            :label="group.provinceName"
            :key="gIndex">
            <el-option
              v-for="item,index in group.citys"
              :label="item.cityName"
              :value="item.cityName"
              :key="index">
            </el-option>
          </el-option-group>
        </el-select>
      </el-form-item>
      <el-form-item
        label="贷款额度"
        prop="loanAmount"
        :rules="{type: 'number',required: true, message: '贷款额度不能为空', trigger: 'blur'}">
        <el-input
          v-model.number="form.loanAmount"
          placeholder="请输入贷款金额">
          <template slot="append">万元</template>
        </el-input>
      </el-form-item>
      <el-form-item
        label="贷款期限"
        prop="loanDeadline"
        :rules="{type: 'number',required: true, message: '贷款期限不能为空', trigger: 'blur'}">
        <el-input
          v-model.number="form.loanDeadline"
          placeholder="请输入贷款期限">
          <template slot="append">个月</template>
        </el-input>
      </el-form-item>
      <el-form-item
        label="贷款用途">
        <el-input
          v-model="form.loanPurpose"
          placeholder="请输入贷款用途">
        </el-input>
      </el-form-item>
      <el-form-item
        label="来源"
        prop="channelCode"
        :rules="{required: true, message: '来源不能为空', trigger: 'change'}">
        <el-select
          v-model.number="form.channelCode"
          placeholder="请选择">
          <el-option
            v-for="val,key,index in channelCodes"
            :label="val"
            :value="String(key)"
            :key="index">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        class="record-desc__item"
        label-width="13.33333%"
        label="描述信息">
        <el-input
          v-model="form.desc"
          placeholder="请输入描述信息">
        </el-input>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
// 主要信息组件
export default {
  name: 'apply-main',
  data () {
    let cityList = JSON.parse(this.$localStorage('cityList')) || []
    let query = this.$route.query
    return {
      loading: false,
      form: {
        applyName: query['applyName'],
        telephone: query['telephone'],
        cityName: '',
        loanAmount: '',
        loanDeadline: '',
        loanPurpose: '',
        channelCode: '',
        desc: ''
      },
      cityList, // 城市数据
      // 来源
      channelCodes: {
        transIn: '转介绍',
        netSale: '电销',
        advert: '广告',
        weixin: '微信',
        ywyld: '业务员',
        other: '其他'
      }
    }
  },
  methods: {
    // 保存
    saveHandle () {
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.$ajax({
            url: '/store/account/work/applyInfo/saveMainInfo',
            data: this.form,
            loading: true,
            success: data => {
              this.$message('操作成功')
              let applyId = data.attr.applyId || ''
              this.$emit('change', applyId)
            }
          })
        }
      })
    }
  }
}
</script>
