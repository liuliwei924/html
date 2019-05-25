<template>
  <div class="content-box">
    <div class="header__title">添加产品信息</div>
    <div class="product-form t2">
      <div class="clearfix">
        <div class="col-p2">
          <el-form ref="form" :model="form">
            <div class="el-row is-required">
              <label class="el-col el-col-4 el-form-item__label">
                <span>产品类型:</span>
              </label>
              <el-form-item class="el-col w350" prop="prodType">
                <el-select v-model="form.prodType" filterable clearable placeholder="请选择产品类型">
                  <el-option label="信用卡" :value="1"></el-option>
                  <el-option label="保险" :value="2"></el-option>
                  <el-option label="贷款" :value="3"></el-option>
                </el-select>
              </el-form-item>
            </div>
            <div class="el-row is-required">
              <label class="el-col el-col-4 el-form-item__label">
                <span>产品名称:</span>
              </label>
              <el-form-item class="el-col fl w350" prop="prodName">
                <el-input v-model="form.prodName" placeholder="请输入产品名称"></el-input>
              </el-form-item>
            </div>
            <div class="el-row is-required" v-if="form.prodType === 2">
              <label class="el-col el-col-4 el-form-item__label">
                <span>保险类型:</span>
              </label>
              <el-form-item class="el-col w350" prop="insType">
                <el-select v-model="form.insType" filterable clearable placeholder="请选择保险类型">
                  <el-option label="健康险" :value="1"></el-option>
                  <el-option label="意外险" :value="2"></el-option>
                  <el-option label="寿险" :value="3"></el-option>
                  <el-option label="团险" :value="4"></el-option>
                  <el-option label="车险" :value="5"></el-option>
                  <el-option label="财产险" :value="6"></el-option>
                </el-select>
              </el-form-item>
            </div>
            <div class="el-row is-required">
              <label class="el-col el-col-4 el-form-item__label">
                <span>公司名称:</span>
              </label>
              <el-form-item class="el-col fl w350" prop="compName">
                <el-input v-model="form.compName" placeholder="公司名称"></el-input>
              </el-form-item>
            </div>
            <div class="el-row is-required">
              <label class="el-col el-col-4 el-form-item__label">
                <span>信用额度:</span>
              </label>
              <el-form-item class="el-col fl w350" prop="creditAmount">
                <el-input v-model="form.creditAmount" placeholder="请输入信用额度"></el-input>
              </el-form-item>
            </div>
            <div class="el-row is-required">
              <label class="el-col el-col-4 el-form-item__label">
                <span>审核时间:</span>
              </label>
              <el-form-item class="el-col fl w350" prop="auditTime">
                <el-input v-model="form.auditTime" placeholder="请输入审核时间"></el-input>
              </el-form-item>
            </div>
            <div class="el-row is-required">
              <label class="el-col el-col-4 el-form-item__label">
                <span>利息描述:</span>
              </label>
              <el-form-item class="el-col fl w350" prop="rateOffRate">
                <el-input v-model="form.rateOffRate" placeholder="请输入利息"></el-input>
              </el-form-item>
            </div>
            <div class="el-row is-required">
              <label class="el-col el-col-4 el-form-item__label">
                <span>最低利息:</span>
              </label>
              <el-form-item class="el-col w350" prop="rateMin">
                <el-input v-model.number="form.rateMin" placeholder="请输入最低利息"></el-input>
              </el-form-item>
            </div>
            <div class="el-row is-required">
              <label class="el-col el-col-4 el-form-item__label">
                <span>最高利息:</span>
              </label>
              <el-form-item class="el-col w350" prop="rateMax">
                <el-input v-model.number="form.rateMax" placeholder="请输入最高利息"></el-input>
              </el-form-item>
            </div>
            <div class="el-row is-required">
              <label class="el-col el-col-4 el-form-item__label">
                <span>佣金类型:</span>
              </label>
              <el-form-item class="el-col w350" prop="amtType">
                <el-select v-model="form.amtType" filterable clearable placeholder="请选择佣金类型">
                  <el-option label="实际金额" :value="1"></el-option>
                  <el-option label="百分比例" :value="2"></el-option>
                </el-select>
              </el-form-item>
            </div>
            <div class="el-row is-required">
              <label class="el-col el-col-4 el-form-item__label">
                <span>产品总佣金:</span>
              </label>
              <el-form-item class="el-col w350" prop="rewardAmount">
                <el-input v-model.number="form.rewardAmount" placeholder="请输入产品总佣金"></el-input>
              </el-form-item>
            </div>
            <div class="el-row is-required">
              <label class="el-col el-col-4 el-form-item__label">
                <span>信用卡特性</span>
              </label>
              <el-form-item class="el-col fl w350" prop="specialty">
                <el-input v-model="form.specialty" placeholder="请输入信用卡特性"></el-input>
              </el-form-item>
            </div>
            <div class="el-row is-required">
              <label class="el-col el-col-4 el-form-item__label">
                <span>产品申请人数:</span>
              </label>
              <el-form-item class="el-col w350" prop="applyNum">
                <el-input v-model.number="form.applyNum" placeholder="请输入申请人数"></el-input>
              </el-form-item>
            </div>
            <div class="el-row is-required">
              <label class="el-col el-col-4 el-form-item__label">
                <span>产品通过率:</span>
              </label>
              <el-form-item class="el-col w350" prop="passRate">
                <el-input v-model.number="form.passRate" placeholder="请输入通过率"></el-input>
              </el-form-item>
            </div>
            <div class="el-row is-required">
              <label class="el-col el-col-4 el-form-item__label">
                <span>产品页面点击统计ID:</span>
              </label>
              <el-form-item class="el-col w350" prop="btnId">
                <el-input v-model.number="form.btnId" placeholder="请输入产品点击统计ID"></el-input>
              </el-form-item>
            </div>
            <div class="el-row is-required">
              <label class="el-col el-col-4 el-form-item__label">
                <span>产品描述:</span>
              </label>
              <el-form-item class="el-col w350" prop="prodDesc">
                <el-input type="textarea" class="t2-textarea" v-model="form.prodDesc" placeholder="请输入产品描述"></el-input>
              </el-form-item>
            </div>
            <div class="el-row is-required">
              <label class="el-col el-col-4 el-form-item__label">
                <span>奖励描述:</span>
              </label>
              <el-form-item class="el-col w350" prop="rewardDesc">
                <el-input type="textarea" class="t2-textarea" v-model="form.rewardDesc" placeholder="请输入奖励描述"></el-input>
              </el-form-item>
            </div>
             <div class="el-row is-required">
              <label class="el-col el-col-4 el-form-item__label">
                <span>分享标题:</span>
              </label>
              <el-form-item class="el-col w350" prop="shareTitle">
                <el-input type="textarea" class="t2-textarea" v-model="form.shareTitle" placeholder="请输入分享标题"></el-input>
              </el-form-item>
            </div>
            <div class="el-row is-required">
              <label class="el-col el-col-4 el-form-item__label">
                <span>分享描述:</span>
              </label>
              <el-form-item class="el-col w350" prop="shareDesc">
                <el-input type="textarea" class="t2-textarea" v-model="form.shareDesc" placeholder="请输入分享描述"></el-input>
              </el-form-item>
            </div>
            <div class="el-row is-required">
              <label class="el-col el-col-4 el-form-item__label">
                <span>产品标签:</span>
              </label>
              <el-form-item class="el-col w350" prop="prodLabel">
                <el-input type="textarea" class="t2-textarea" v-model="form.prodLabel" placeholder="请输入产品标签"></el-input>
              </el-form-item>
            </div>
            <div class="el-row is-required">
              <label class="el-col el-col-4 el-form-item__label">
                <span>产品结算时间描述:</span>
              </label>
              <el-form-item class="el-col w350" prop="remark">
                <el-input type="textarea" class="t2-textarea" v-model="form.remark" placeholder="请输入产品结算时间描述"></el-input>
              </el-form-item>
            </div>
             <div class="el-row is-required">
              <label class="el-col el-col-4 el-form-item__label">
                <span>banner图描述:</span>
              </label>
              <el-form-item class="el-col w350" prop="bannerDesc">
                <el-input type="textarea" class="t2-textarea" v-model="form.bannerDesc" placeholder="请输入banner图描述"></el-input>
              </el-form-item>
            </div>
            <div class="el-row is-required">
              <label class="el-col el-col-4 el-form-item__label">
                <span>产品跳转url:</span>
              </label>
              <el-form-item class="el-col w350" prop="url">
                <el-input type="textarea" class="t2-textarea" v-model="form.url" placeholder="银行跳转url"></el-input>
              </el-form-item>
            </div>
            <div class="el-row is-required">
              <label class="el-col el-col-4 el-form-item__label">
                <span>查询进度url:</span>
              </label>
              <el-form-item class="el-col w350" prop="progressUrl">
                <el-input type="textarea" class="t2-textarea" v-model="form.progressUrl" placeholder="查询进度url"></el-input>
              </el-form-item>
            </div>
            <div class="el-row is-required">
              <label class="el-col el-col-4 el-form-item__label">
                <span>电子保单url:</span>
              </label>
              <el-form-item class="el-col w350" prop="insNoUrl">
                <el-input type="textarea" class="t2-textarea" v-model="form.insNoUrl" placeholder="电子保单url"></el-input>
              </el-form-item>
            </div>
            <div class="el-row is-required">
              <label class="el-col el-col-4 el-form-item__label">
                <span>产品电话:</span>
              </label>
              <el-form-item class="el-col w350" prop="phone">
                <el-input v-model="form.phone" placeholder="产品电话"></el-input>
              </el-form-item>
            </div>
            <div class="el-row is-required">
              <label class="el-col el-col-4 el-form-item__label">
                <span>银行返回结果匹配关键词:</span>
              </label>
              <el-form-item class="el-col w350" prop="strKey">
                <el-input v-model="form.strKey" type="textarea" class="t2-textarea" :maxlength="150" placeholder="银行返回结果匹配关键词以逗号分隔"></el-input>
              </el-form-item>
            </div>
            <div class="el-row is-required">
              <label class="el-col el-col-4 el-form-item__label">
                <span>最大自动发送金额:</span>
              </label>
              <el-form-item class="el-col w350" prop="maxAmt">
                <el-input v-model.number="form.maxAmt" placeholder="最大自动发送金额"></el-input>
              </el-form-item>
            </div>
            <div class="el-row is-required">
              <label class="el-col el-col-4 el-form-item__label">
                <span>排序号:</span>
              </label>
              <el-form-item class="el-col w350" prop="indexNum">
                <el-input v-model.number="form.indexNum" placeholder="请输入排序号"></el-input>
              </el-form-item>
            </div>
            <div class="el-row is-required">
              <label class="el-col el-col-4 el-form-item__label">
                <span>信用卡图标:</span>
              </label>
              <el-form-item label="" class="gradeImg-uploader" required>
                <el-upload class="avatar-uploader" action="action" :show-file-list="false" :on-change="cardImgHandle" :auto-upload="false">
                  <img v-if="form.cardImg" :src="form.cardImg" class="avatar">
                  <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
              </el-form-item>
            </div>
            <div class="el-row is-required">
              <label class="el-col el-col-4 el-form-item__label">
                <span>产品图标:</span>
              </label>
              <el-form-item label="" class="gradeImg-uploader" required>
                <el-upload class="avatar-uploader" action="action" :show-file-list="false" :on-change="prodImgHandle" :auto-upload="false">
                  <img v-if="form.prodImg" :src="form.prodImg" class="avatar">
                  <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
              </el-form-item>
            </div>
            <div class="el-row is-required">
              <label class="el-col el-col-4 el-form-item__label">
                <span>产品小图标:</span>
              </label>
              <el-form-item label="" class="gradeImg-uploader" required>
                <el-upload class="avatar-uploader" action="action" :show-file-list="false" :on-change="minProdImgHandle" :auto-upload="false">
                  <img v-if="form.minProdImg" :src="form.minProdImg" class="avatar">
                  <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
              </el-form-item>
            </div>
            <div class="el-row is-required">
              <label class="el-col el-col-4 el-form-item__label">
                <span>进度查询:</span>
              </label>
              <el-form-item class="el-col" prop="progressFlag">
                <el-radio-group v-model="form.progressFlag">
                  <el-radio-button label="0">不支持</el-radio-button>
                  <el-radio-button label="1">仅支持查询</el-radio-button>
                  <el-radio-button label="2">支持查询与佣金发放</el-radio-button>
                </el-radio-group>
              </el-form-item>
            </div>
            <div class="el-row is-required">
              <label class="el-col el-col-4 el-form-item__label">
                <span>微信是否显示:</span>
              </label>
              <el-form-item class="el-col" prop="wxFlag">
                <el-radio-group v-model="form.wxFlag">
                  <el-radio-button label="1">是</el-radio-button>
                  <el-radio-button label="0">否</el-radio-button>
                </el-radio-group>
              </el-form-item>
            </div>
            <div class="el-row is-required">
              <label class="el-col el-col-4 el-form-item__label">
                <span>是否启用:</span>
              </label>
              <el-form-item class="el-col" prop="enable">
                <el-radio-group v-model="form.enable">
                  <el-radio-button label="1">是</el-radio-button>
                  <el-radio-button label="0">否</el-radio-button>
                </el-radio-group>
              </el-form-item>
            </div>
          </el-form>
        </div>
        <div class="col-p2">
          <div class="diy-box">
            <div class="diy-op" v-for="item, index in condInfo" :key="index">
              <div class="diy-top">{{item.typeName}}
                <span class="more" @click="addProdHandle(item.typeId)">添加</span>
              </div>
              <div>
                <template v-for="arr in prodOther">
                  <div class="diy-item clearfix" v-if="arr.typeId === item.typeId">
                    <input type="text" class="diy-input" placeholder="请输入名称" v-model.trim="arr.paramKey">
                    <input type="text" class="diy-input" placeholder="请输入对应值" v-model.trim="arr.paramVal">
                    <span class="del" @click="delProdHandle(arr.typeId, arr.paramKey)"></span>
                  </div>
                </template>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="ctrl-row">
        <el-button class="cancal__btn" @click="backHandle">取消</el-button>
        <el-button v-if="this.handleBtn" class="confirm__btn" @click="saveHandle">保存</el-button>
        <el-button v-else class="confirm__btn" @click="editHandle">修改</el-button>
      </div>
    </div>
  </div>
</template>




<script>
export default {
  name: 'fx-prod-edit',
  data () {
    let prodId = this.$route.query.prodId || ''
    return {
      prodId,
      titleText: '',
      handleBtn: true,
      form: {
        prodId: this.$route.query.prodId || '',
        prodType: 1,
        prodName: '',
        compName: '',
        insType: '',
        prodDesc: '',
        creditAmount: '',
        auditTime: '',
        rateOffRate: '',
        rateMin: '',
        rateMax: '',
        rewardAmount: '',
        applyNum: '',
        passRate: '',
        btnId: '',
        amtType: 1,
        specialty: '',
        cardImg: '',
        prodImg: '',
        minProdImg: '',
        prodLabel: '',
        remark: '',
        bannerDesc: '',
        url: '',
        progressUrl: '',
        phone: '',
        strKey: '',
        maxAmt: 1000,
        indexNum: '',
        rewardDesc: '',
        shareTitle: '',
        shareDesc: '',
        progressFlag: 0,
        wxFlag: 1,
        enable: 1
      },
      condInfo: [],
      prodOther: []
    }
  },
  created () {
    this.getFxProdDtl()
    this.getHandleType()
    // 获取产品条件类型
    this.$ajax({
      url: '/store/account/fx/fxProd/getConditionType',
      success: data => {
        this.condInfo = data.attr.condInfo
      }
    })
  },
  methods: {
    delProdHandle (typeId, paramKey) {
      for (let i = 0; i < this.prodOther.length; i++) {
        if (this.prodOther[i].typeId === typeId && this.prodOther[i].paramKey === paramKey) {
          this.prodOther.splice(i, 1)
        }
      }
    },
    addProdHandle (typeId) {
      for (let i = 0; i < this.prodOther.length; i++) {
        if (this.prodOther[i].typeId === typeId && !this.prodOther[i].paramKey) {
          this.$msg('请先填写上一个!')
          return
        }
      }
      this.prodOther.push({
        typeId: typeId,
        paramKey: '',
        paramVal: ''
      })
    },
    // 判别操作类型
    getHandleType () {
      if (this.handleType === 'add') {
        this.titleText = '添加'
        this.handleBtn = true
      } else if (this.handleType === 'edit') {
        this.titleText = '编辑'
        this.handleBtn = false
        this.getFxProdDtl()
      }
    },
    // 获取分销款产品详情
    getFxProdDtl () {
      this.$ajax({
        url: '/store/account/fx/fxProd/queryProdDtl',
        data: {
          prodId: this.prodId
        },
        success: data => {
          let form = data.attr.prodDtl || {}
          this.form.prodType = form['prodType'] || ''
          this.form.prodName = form['prodName'] || ''
          this.form.compName = form['compName'] || ''
          this.form.insType = form['insType'] || ''
          this.form.prodDesc = form['prodDesc'] || ''
          this.form.creditAmount = form['creditAmount'] || ''
          this.form.auditTime = form['auditTime'] || ''
          this.form.rateOffRate = form['rateOffRate'] || ''
          this.form.rateMin = form['rateMin'] || ''
          this.form.rateMax = form['rateMax'] || ''
          this.form.rewardAmount = form['rewardAmount'] || ''
          this.form.applyNum = form['applyNum'] || ''
          this.form.passRate = form['passRate'] || ''
          this.form.btnId = form['btnId'] || ''
          this.form.amtType = form['amtType'] || ''
          this.form.specialty = form['specialty'] || ''
          this.form.cardImg = form['cardImg'] || ''
          this.form.prodImg = form['prodImg'] || ''
          this.form.minProdImg = form['minProdImg'] || ''
          this.form.prodLabel = form['prodLabel'] || ''
          this.form.remark = form['remark'] || ''
          this.form.bannerDesc = form['bannerDesc'] || ''
          this.form.url = form['url'] || ''
          this.form.progressUrl = form['progressUrl'] || ''
          this.form.insNoUrl = form['insNoUrl'] || ''
          this.form.phone = form['phone'] || ''
          this.form.strKey = form['strKey'] || ''
          this.form.maxAmt = form['maxAmt'] || ''
          this.form.indexNum = form['indexNum'] || ''
          this.form.rewardDesc = form['rewardDesc'] || ''
          this.form.shareTitle = form['shareTitle'] || ''
          this.form.shareDesc = form['shareDesc'] || ''
          this.form.progressFlag = form['progressFlag']
          this.form.wxFlag = form['wxFlag']
          this.form.enable = form['enable']
          this.prodOther = data.attr.prodDtl.prodOtherList || []
        }
      })
    },
    // 编辑保存
    saveHandle () {
      if (this.form.prodType === '') {
        this.$msg('请选择产品类型！')
        return
      }
      if (this.form.prodName === '') {
        this.$msg('请输入产品名称！')
        return
      }
      if (this.form.prodType === 2 && this.form.insType === '') {
        this.$msg('请选择保险类型！')
        return
      }
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.form.prodOther = JSON.stringify(this.prodOther)
          let form = Object.assign({}, this.form)
          for (let key in form) {
            if (form[key] === '') {
              delete form[key]
            }
          }
          let bannerDescStr = this.form.bannerDesc
          bannerDescStr = bannerDescStr.replace(/\n/g, '<br>')
          this.form.bannerDesc = bannerDescStr
          this.$ajax({
            url: '/store/account/fx/fxProd/updateProdInfo',
            data: this.form,
            success: data => {
              this.$router.back()
            }
          })
        }
      }, true)
    },
    // 信用卡图标处理
    cardImgHandle (file, fileList) {
      this.$upload({
        url: '/store/uploadAction/uploadFile',
        data: {
          fileType: 'fxCardImg',
          file: file.raw
        },
        success: data => {
          this.form.cardImg = data.fileId
        }
      })
    },
    // 产品图标处理
    prodImgHandle (file, fileList) {
      this.$upload({
        url: '/store/uploadAction/uploadFile',
        data: {
          fileType: 'fxProdImg',
          file: file.raw
        },
        success: data => {
          this.form.prodImg = data.fileId
        }
      })
    },
     // 产品小图标处理
    minProdImgHandle (file, fileList) {
      this.$upload({
        url: '/store/uploadAction/uploadFile',
        data: {
          fileType: 'fxProdImg',
          file: file.raw
        },
        success: data => {
          this.form.minProdImg = data.fileId
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