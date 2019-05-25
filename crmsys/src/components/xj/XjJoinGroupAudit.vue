<template>
  <el-dialog class="edit-dialog" title="编辑加群信息" v-model="visible">
    <el-form :model="form" ref="form" label-width="150px">
      <el-form-item label="显示名" prop="nickName" :rules="{required: false, message: '显示名不能为空'}">
        <el-input v-model="form.nickName" disabled placeholder="请输入显示名称"></el-input>
      </el-form-item>
      <el-form-item label="群二维码" prop="qunQrCodeUrl">
        <template slot-scope="scope">
          <img :src="form.qunQrCodeUrl" class="groupChatImg" v-if="form.qunQrCodeUrl" @click="alertBigImg(form.qunQrCodeUrl)">
        </template>
      </el-form-item>
      <el-form-item
        label="配置群"
        prop="configId"
        :rules="{type: 'number', required: true, message: '必填项', trigger: 'blur'}">
        <el-select v-model.number="form.configId"  placeholder="请选择类型">
          <el-option
            v-for="val,key,index in qunTypeList"
            :label="val.qunName"
            :value="Number(val.configId)"
            :key="index">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="群类型:">
          <el-select
            v-model="form.qunType"
            clearable
            disabled
            placeholder="请选择类型">
            <el-option
              v-for="val,key,index in qunType"
              :label="val"
              :value="Number(key)"
              :key="index">
            </el-option>
          </el-select>
        </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button @click="close">取消</el-button>
      <el-button @click="confirm">确定</el-button>
    </div>
    <div class="alertImg-wrap" v-if="isBigImg" @click="isBigImg = false">
      <div class="content">
        <img :src="bigImgUrl" alt="" class="big-img">
      </div>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'xjJoinGroup-audit',
  props: {
    value: Boolean,
    custData: Object,
    qunType: Object,
    qunTypeList: Array
  },
  data () {
    return {
      first: true,
      visible: this.value,
      isBigImg: false,
      bigImgUrl: '',
      form: {
        joinId: '',
        customerId: '',
        qunType: '',
        configId: ''
      }
    }
  },
  watch: {
    value (val) {
      this.visible = val
    },
    visible (val) {
      this.$emit('change', val)
    },
    // 编辑数据变化
    custData (obj) {
      this.first = true
      this.form = {
        joinId: obj['joinId'] || '',
        customerId: obj['customerId'] || '',
        nickName: obj['nickName'] || '',
        qunQrCodeUrl: obj['qunQrCodeUrl'] || '',
        qunType: obj['qunType'] || 0,
        configId: obj['configId'] || ''
      }
    },
    qunTypeList (arr) {
      this.first = true
      this.qunTypeList = arr
    }
  },
  methods: {
    // 海报图放大处理
    alertBigImg (url) {
      this.bigImgUrl = url
      this.isBigImg = true
    },
    // 关闭
    close () {
      this.visible = false
    },
    // 确定
    confirm () {
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.$ajax({
            url: '/store/account/xj/xjJoinGroup/auditJoinGroupInfo',
            data: this.form,
            success: data => {
              this.$emit('change', 'search')
            }
          })
          this.close()
        }
      })
    }
  }
}
</script>
<style lang="less">
.groupChatImg {
    width: 300px;
    height: 300px;
    padding: 10px 0 0 20px;
    display: block;
}
.alertImg-wrap{
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
  background: rgba(0,0,0,0.8);
  z-index: 2000;
  .content{
    width: 1000px;
    height: 600px;
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
    .big-img{
      height: 100%;
    }
  }
}
.input-wrapp{
  padding-left: 20px;
  margin-bottom: 10px;
  input{
    height: 30px;
    width: 200px;
  }
}
.exam-wrap{
  // overflow: hidden;
}
.exam-w{
  float: left;
  width:350px;
  border: 1px solid #dcdcdc;
  margin: 20px;
  position: relative;
  .no-info{
    position: absolute;
    width: 120px;
    top: 120px;
    right: 40px;
  }
  .tit{
    padding-left: 20px;
    color: white;
    line-height: 40px;
  }
  .color1{
    background: #5FBAD1;
  }
  .color2{
    background: #E6986E;
  }
  .color3{
    background: #CBBB92;
  }
  .info{
    overflow: hidden;
  }
  .img-w{
    padding: 10px;
    width: 130px;
    height: 130px;
    float: left;
    overflow: hidden;
    img{
      width: 100%
    }
  }
  .status{
    text-align: center;
    font-size: 20px;
    width: 200px;
    float: right;
    padding-top: 50px;
  }
  .statu0{
    color: #539cd2;
  }
  .statu1{
    color: green;
  }
  .statu2{
    color: #F53C44;
  }
  .p{
    padding-left: 20px;
    margin:10px 0;
  }
  .btn-w{
    margin: 10px 0;
    padding-left: 85px;
    button{
      border:none;
      border-radius: 0;
      color: white;
    }
  }
  .btn-l{
    background: #53BF8A;
  }
  .btn-r{
    background: #F53C44;
  }
}
.three-pic{
  overflow: hidden;
  .pic-w{
    width: 100px;
    float: left;
    margin-left: 10px;
    h3{
      text-align: center;
    }
    img{
      width: 100%;
    }
  }
}
</style>