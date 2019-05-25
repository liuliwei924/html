<template>
  <div class="content-box">
    <div class="header__title">{{titleText}}产品信息</div>
    <div class="product-form">
      <el-form ref="form" :model="form">
        <div class="el-row is-required">
          <label class="el-col el-col-4 el-form-item__label">
            <span>产品标签:</span>
          </label>
          <el-form-item class="el-col fl" prop="typeName">
            <el-input v-model="form.typeName" placeholder="请输入产品标签"></el-input>
          </el-form-item>
        </div>

        <div class="el-row is-required">
          <label class="el-col el-col-4 el-form-item__label">
            <span>标签排序:</span>
          </label>
          <el-form-item class="el-col fl" prop="indexNum">
            <el-input v-model="form.indexNum" placeholder="请输入标签排序"></el-input>
          </el-form-item>
        </div>
       
        <div class="el-row is-required">
          <label class="el-col el-col-4 el-form-item__label">
            <span>产品名称:</span>
          </label>
          <prod-type-transfer :prodAuthData="prodAuthData"
           :prodArray="prodArray"
           @change="prodChange"
           v-model="form.prod">
          </prod-type-transfer>
        </div>

        <div class="el-row is-required">
          <label class="el-col el-col-4 el-form-item__label">
            <span>标签图标:</span>
          </label>
          <el-form-item label="" class="gradeImg-uploader" required>
            <el-upload
              class="avatar-uploader"
              action="action"
              :show-file-list="false"
              :on-change="changeHandle"
              :auto-upload="false">
              <img v-if="form.typeIcon" :src="form.typeIcon" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item>
        </div>

        <div class="el-row is-required">
          <label class="el-col el-col-4 el-form-item__label">
            <span>是否启用:</span>
          </label>
          <el-form-item class="el-col" prop="status">
            <el-radio-group v-model="form.status">
              <el-radio-button label="1">启用</el-radio-button>
              <el-radio-button label="0">停用</el-radio-button>
            </el-radio-group>
          </el-form-item>
        </div>

        <div class="ctrl-row">
          <el-button class="cancal__btn" @click="backHandle">取消</el-button>
          <el-button v-if="this.handleBtn" class="confirm__btn" @click="editHandle">修改</el-button>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
import ProdTypeTransfer from '@/components/loanProd/ProdTypeTransfer'
export default {
  name: 'product-detail',
  data () {
    let type = this.$route.query.type || ''
    let typeId = this.$route.query.typeId || ''
    return {
      typeId,
      handleType: type,
      titleText: '',
      handleBtn: true,
      form: {
        typeId: this.$route.query.typeId || '',
        typeName: '',
        typeIcon: '',
        indexNum: '',
        status: '',
        prod: []
      },
      prodArray: [],
      prodflag: false,
      prodAuthData: []
    }
  },
  created () {
    this.getProdInfo()
    this.getProdAuth()
  },
  methods: {
    // 获取产品信息
    getProdInfo () {
      this.$ajax({
        url: '/open/account/prod/prodType/queryProdTypeInfo',
        data: {
          typeId: this.typeId
        },
        success: data => {
          let form = data.rows[0] || {}
          this.form.typeName = form['typeName'] || ''
          this.form.typeIcon = form['typeIcon'] || ''
          this.form.indexNum = form['indexNum'] || ''
          this.form.status = form['status'] || ''
          this.prodArray = form['prodList'] || []
        }
      })
    },
    // 获取产品信息
    getProdAuth () {
      this.$ajax({
        url: '/open/account/prod/prodInfo/queryProdList',
        success: data => {
          this.prodAuthData = data.rows || []
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
      if (!value && this.form.prod.length === 0) {
        this.form.prod = this.prodArray.map((item, index) => {
          return item.prodId
        })
      }
    },
    // 生成图片地址
    changeHandle (file, fileList) {
      this.$upload({
        url: '/store/uploadAction/uploadFile',
        data: {
          fileType: 'prodIcon',
          file: file.raw
        },
        success: data => {
          this.form.typeIcon = data.fileId
        }
      })
    },
    // 保存
    editHandle () {
      if (this.prodflag) {
        this.$message('请保存配置的产品')
        return
      }
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.form.prodId = this.form.prod.join(',')
          this.$ajax({
            url: '/open/account/prod/prodType/modifyProdTypeInfo',
            data: this.form,
            success: data => {
              this.$router.back()
            }
          })
        }
      }, true)
    },
    // 返回
    backHandle () {
      this.$router.back()
    }
  },
  components: {
    ProdTypeTransfer
  }
}
</script>