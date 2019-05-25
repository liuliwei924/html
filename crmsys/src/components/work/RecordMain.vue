<template>
  <div>
    <!-- <div class="all-info-header">{{title}}
      <span class="header-tips">{{saveText}}</span>
      <button type="button" class="header-btn" @click="saveHandle">保存</button>
    </div> -->
    <div class="all-info-content">
      <el-form
        class="clearfix"
        :model="form"
        ref="form"
        label-width="106px">
        <el-form-item
        label="姓名"
        prop="applyName">
        <el-input
          v-model="form.applyName"
          :maxlength="20"
          placeholder="请输入申请人姓名">
        </el-input>
        </el-form-item>
        <el-form-item
          label="手机">
          <div ref="teldiv" class="el-form-item__contents" @mousemove="telMove" @mouseout="telOut">{{form.telephone}}</div>
          <span class="bg-tel" @click="clickTel(form.telephone)"></span>
        </el-form-item>
        <el-form-item
          label="申请ID">
          <div class="el-form-item__contents">{{form.applyId}}</div>
        </el-form-item>
        <el-form-item
          label="申请时间">
          <div class="el-form-item__contents">{{form.applyTime}}</div>
        </el-form-item>
        <el-form-item
          label="申请城市"
          prop="cityName">
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
          prop="loanAmount">
          <el-input
            v-model.number="form.loanAmount"
            placeholder="请输入贷款金额">
            <template slot="append">万元</template>
          </el-input>
        </el-form-item>
        <el-form-item
          label="贷款期限"
          prop="loanDeadline">
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
          class="record-desc__item"
          label-width="106px"
          label="描述信息">
          <el-input
            type="textarea"
            autosize
            v-model="form.desc"
            placeholder="请输入描述信息">
          </el-input>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
const TIME_COUNT = 60
// 主要信息子组件
export default {
  name: 'record-main',
  props: {
    mainInfo: Object,
    title: String
  },
  data () {
    let cityList = JSON.parse(this.$localStorage('cityList')) || []
    return {
      form: {
        applyName: '',
        telephone: '',
        curTelephone: '',
        noHideMobile: '',
        applyTime: '',
        cityName: '',
        loanAmount: '',
        loanDeadline: '',
        loanPurpose: '',
        applyId: '',
        desc: ''
      },
      cityList, // 城市数据
      saveText: TIME_COUNT + '秒后自动保存',
      countdown: TIME_COUNT,
      timer: null,
      loading: false,
      isSave: false
    }
  },
  watch: {
    mainInfo (obj) {
      this.form = {
        custId: obj['custId'],
        applyName: obj['applyName'],
        telephone: obj['telephone'],
        curTelephone: obj['telephone'],
        noHideMobile: obj['noHideMobile'],
        applyId: obj['applyId'],
        applyTime: obj['applyTime'],
        cityName: obj['cityName'],
        loanAmount: obj['loanAmount'],
        loanDeadline: obj['loanDeadline'],
        loanPurpose: obj['loanPurpose'],
        desc: obj['desc']
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
    telMove () {
      if (this.form.noHideMobile) {
        this.$refs.teldiv.innerText = this.form.noHideMobile
      }
    },
    telOut () {
      this.$refs.teldiv.innerText = this.form.curTelephone
    },
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
              url: '/store/account/work/applyInfo/saveMainInfo',
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
<style>
.all-info-content .record-desc__item {
  height: 100%;
}
.all-info-content .el-textarea__inner {
  resize: none;
}
.bg-tel {
  background: url(../../assets/images/bg_g_tel.png) no-repeat;
  background-size: 28px;
  position: absolute;
  left: 90px;
  top: 5px;
  width: 28px;
  height: 28px;
  cursor: pointer;
}
</style>