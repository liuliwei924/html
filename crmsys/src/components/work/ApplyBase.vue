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
        label="年龄">
        <el-input
          v-model="form.age"
          placeholder="请输入年龄">
          <template slot="append">岁</template>
        </el-input>
      </el-form-item>
      <el-form-item
        label="性别">
        <el-radio-group
          v-model.number="form.sex"
          placeholder="请选择性别">
          <el-radio
            v-for="val,key,index in sex"
            :label="Number(key)"
            :key="index">{{val}}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item
        label="身份证"
        prop="identifyNo">
        <el-input
          v-model="form.identifyNo"
          placeholder="请输入身份证号">
        </el-input>
      </el-form-item>
      <el-form-item
        label="户籍类型">
        <el-select
          v-model.number="form.isLocal"
          placeholder="请选择户籍类型">
          <el-option
            v-for="val,key,index in isLocal"
            :label="val"
            :value="Number(key)"
            :key="index">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        label="是否有社保"
        prop="socialType"
        :rules="{type: 'number', required: true, message: '是否有社保不能为空', trigger: 'change'}">
        <el-radio-group
          v-model.number="form.socialType">
          <el-radio
            v-for="val,key,index in socialType"
            :label="Number(key)"
            :key="index">{{val}}</el-radio>
        </el-radio-group>
      </el-form-item>
        <template v-if="form.socialType === 1">
          <el-form-item
            label="社保连续时间"
            prop="socialMonth">
              <el-input
                v-model.number="form.socialMonth"
                placeholder="请输入社保连续时间">
                <template slot="append">月</template>
              </el-input>
            </el-form-item>
        </template>
      <template v-if="form.socialType === 1">
        <el-form-item
          label="每月社保金额"
          prop="socialAmount">
          <el-input
            v-model.number="form.socialAmount"
            placeholder="请输入每月社保金额">
            <template slot="append">元</template>
          </el-input>
        </el-form-item>
      </template>
      <el-form-item
        label="是否有公积金"
        prop="fundType"
        :rules="{type: 'number', required: true, message: '是否有公积金不能为空', trigger: 'change'}">
        <el-radio-group
          v-model.number="form.fundType">
          <el-radio
            v-for="val,key,index in fundType"
            :label="Number(key)"
            :key="index">{{val}}</el-radio>
        </el-radio-group>
      </el-form-item>
      <template v-if="form.fundType === 1">
        <el-form-item
          label="每月公积金金额"
          prop="fundAmount">
          <el-input
            v-model.number="form.fundAmount"
            placeholder="请输入每月公积金金额">
            <template slot="append">元</template>
          </el-input>
        </el-form-item>
        <el-form-item
          label="每月公积金基数"
          prop="fundNum">
          <el-input
            v-model.number="form.fundNum"
            placeholder="请输入每月公积金基数">
          </el-input>
        </el-form-item>
      </template>
      <el-form-item
        label="学历"
        prop="education">
        <el-select
          v-model.number="form.education"
          placeholder="请选择">
          <el-option
            v-for="val,key,index in educationText"
            :label="val"
            :value="String(key)"
            :key="index">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        label="微粒贷额度"
        prop="havePinan">
        <el-select
          v-model.number="form.havePinan"
          placeholder="请选择">
          <el-option
            v-for="val,key,index in havePinan"
            :label="val"
            :value="Number(key)"
            :key="index">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        label="芝麻信用分"
        prop="zimaScore">
        <el-select
          v-model.number="form.zimaScore"
          placeholder="请选择">
          <el-option
            v-for="val,key,index in zimaScore"
            :label="val"
            :value="Number(key)"
            :key="index">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        label="负债金额">
        <el-input
          v-model="form.liabiAmount" placeholder="请输入负债金额">
          <template slot="append">万元</template>
        </el-input>
      </el-form-item>    
      <el-form-item
        label="职业身份"
        prop="workType"
        :rules="{type: 'number', required: true, message: '职业身份不能为空', trigger: 'change'}">
        <el-select
          v-model.number="form.workType"
          placeholder="请选择职业身份">
          <el-option
            v-for="val,key,index in workType"
            :label="val"
            :value="Number(key)"
            :key="index">
          </el-option>
        </el-select>
      </el-form-item>
      <!-- 收入情况 -->
      <el-form-item
        label="工资发放形式"
        prop="wagesType"
        :rules="{type: 'number', required: true, message: '工资发放形式不能为空', trigger: 'blur'}"
        v-if="form.workType === 4">
        <el-select
          v-model.number="form.wagesType"
          placeholder="请选择工资发放形式">
          <el-option
            v-for="val,key,index in wagesType"
            :label="val"
            :value="Number(key)"
            :key="index">
          </el-option>
        </el-select>
      </el-form-item>
        <el-form-item
          label="打卡月收入"
          prop="income"
          :rules="{type: 'number', required: true, message: '打卡月收入不能为空', trigger: 'blur'}"
          v-if="form.workType === 4 && (form.wagesType === 1 || form.wagesType === 3 || form.wagesType === 4)">
          <el-input
            v-model.number="form.income"
            placeholder="请输入打卡月收入">
            <template slot="append">元</template>
          </el-input>
        </el-form-item>
      <el-form-item
        label="现金收入"
        prop="cashMonth"
        v-if="form.workType === 1 || (form.workType === 4 && (form.wagesType === 2 || form.wagesType === 3))">
        <el-select
          v-model.number="form.cashMonth"
          placeholder="请选择现金收入">
          <el-option
            v-for="val,key,index in cashMonth"
            :label="val"
            :value="Number(key)"
            :key="index">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        label="公司性质"
        prop="wagesType"
        v-if="form.workType === 4">
        <el-select
          v-model.number="form.workCmp"
          placeholder="请选择公司性质">
          <el-option
            v-for="val,key,index in workCmp"
            :label="val"
            :value="Number(key)"
            :key="index">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        label="单位工龄"
        prop="jobMonth"
        v-if="form.workType === 4">
        <el-select
          v-model.number="form.jobMonth"
          placeholder="请选择单位工龄">
          <el-option
            v-for="val,key,index in jobMonth"
            :label="val"
            :value="Number(key)"
            :key="index">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        label="营业执照"
        prop="myLicense"
        v-if="form.workType === 2 || form.workType === 3">
        <el-select
          v-model.number="form.hasLicense"
          placeholder="请选择营业执照">
          <el-option
            v-for="val,key,index in hasLicense"
            :label="val"
            :value="Number(key)"
            :key="index">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        label="营业执照是否是本人名下"
        prop="myLicense"
        v-if="(form.workType === 2 || form.workType === 3) && form.hasLicense !== 0">
        <el-select
          v-model.number="form.myLicense"
          placeholder="请选择营业执照">
          <el-option
            v-for="val,key,index in myLicense"
            :label="val"
            :value="Number(key)"
            :key="index">
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
// 基本信息组件
export default {
  name: 'apply-base',
  props: {
    applyId: [String, Number]
  },
  data () {
    return {
      form: {
          // 基本信息
        age: '',
        sex: '',
        identifyNo: '',
        workType: '',
        workCmp: '',
        socialType: '',
        fundType: '',
        fundAmount: '',
        education: '',
        havePinan: '',
        zimaScore: '',
        isLocal: '',
        socialAmount: '',
        socialMonth: '',
        liabiAmount: '',
        myLicense: '',
        hasLicense: '',
        // 收入情况
        jobMonth: '',
        wagesType: '',
        income: '',
        cashMonth: '',
        fundNum: ''
      },
      // 性别
      sex: {
        0: '女',
        1: '男'
      },
      // 职业身份
      workType: {
        1: '自由职业',
        2: '企业主',
        3: '个体户',
        4: '上班族'
      },
       // 公司性质
      workCmp: {
        1: '公务员事业单位',
        2: '国企单位',
        3: '世界500强公司',
        5: '普通企业',
        6: '外企'
      },
      // 是否有社保
      socialType: {
        1: '有',
        2: '无'
      },
      // 是否有公积金
      fundType: {
        1: '有',
        2: '无'
      },
      // 户籍类型
      isLocal: {
        1: '本地户籍',
        2: '外地户籍'
      },
      // 工资发放形式
      wagesType: {
        1: '打卡',
        2: '现金',
        3: '打卡+现金',
        4: '转账'
      },
      // 单位工龄
      jobMonth: {
        1: '不足6个月',
        2: '6-11个月',
        3: '1-3年',
        4: '3年以上'
      },
      // 微粒贷额度
      havePinan: {
        0: '无微粒贷',
        5000: '5千以内',
        8000: '1万以内',
        15000: '1-3万',
        35000: '3-5万',
        55000: '5-10万',
        100000: '10万以上'
      },
       // 来源
      educationText: {
        高中及中专以下: '高中及中专以下',
        大专: '大专',
        本科: '本科',
        研究生及以上: '研究生及以上'
      },
      // 芝麻信用
      zimaScore: {
        0: '无芝麻信用分',
        399: '400分以内',
        499: '400-500分',
        599: '500-600分',
        699: '600-700分',
        799: '700分以上'
      },
      // 营业执照是否是本人名下
      myLicense: {
        0: '否，无营业执照',
        1: '是，本人名下',
        2: '否，别人名下'
      },
      // 营业执照
      hasLicense: {
        0: '无',
        1: '6个月以内',
        2: '6-12个月',
        3: '1-3年',
        4: '3年以上'
      },
      // 现金收入
      cashMonth: {
        1500: '2千以下',
        3000: '2千-4千',
        5000: '4千-8千',
        10000: '8千-1.5万',
        15000: '1.5万以上'
      }
    }
  },
  methods: {
    // 保存
    saveHandle () {
      if (!this.applyId) {
        this.$msg('请先保存主要信息')
        return
      }
      this.$refs['form'].validate(valid => {
        if (valid) {
          Object.assign(this.form, {
            applyId: this.applyId
          })
          this.$ajax({
            url: '/store/account/work/applyInfo/saveBaseAllInfo',
            data: this.form,
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
