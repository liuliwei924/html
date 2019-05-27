<template>
  <el-dialog class="edit-dialog" :title="titleText" :visible.sync="visible" :show-close="false" :close-on-click-modal="false">
    <el-form :model="form" ref="form" label-width="150px">
      <el-form-item
        label="门店编号"
        prop="orgNo">
        <el-input v-model="form.orgNo"></el-input>
      </el-form-item>
      <el-form-item
        label="门店名称"
        prop="orgName">
        <el-input v-model="form.orgName"></el-input>
      </el-form-item>
      <el-form-item
        label="省份:"
        :rules="{required: true, message: '省份不能为空'}">
        <el-select
          v-model="form.province"
          filterable
          @change="changeProvince"
          placeholder="请选择省份">
          <el-option
            v-for="(item,index) in provinceList"
            :label="item.provinceName"
            :value="item.provinceName"
            :key="index">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        label="城市:"
        :rules="{required: true, message: '城市不能为空'}">
        <el-select
          v-model="form.cityName"
          filterable
          placeholder="请选择城市">
          <el-option
            v-for="(item,index) in cityList"
            :label="item.cityName"
            :value="item.cityName"
            :key="index">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        label="详细地址"
        prop="orgName">
        <el-input
          type="textarea"
          :autosize="{ minRows: 2, maxRows: 4}"
          placeholder="请输入内容"
          v-model="form.address">
        </el-input>
      </el-form-item>
      <el-form-item
        label="负责人姓名"
        prop="managerName"
        :rules="{required: true, message: '负责人姓名不能为空'}">
        <el-input v-model="form.managerName"></el-input>
      </el-form-item>
      <el-form-item
        label="负责人联系电话"
        prop="managerTel"
        :rules="{required: true, message: '负责人联系电话不能为空'}">
        <el-input v-model="form.managerTel"></el-input>
      </el-form-item>
      <el-form-item
        label="门店类型:"
        :rules="{required: true, message: '门店类型不能为空'}">
        <el-select
          v-model="form.orgType"
          clearable
          filterable
          placeholder="门店类型">
          <el-option label="业务团队" :value="1"></el-option>
          <el-option label="按揭团队" :value="2"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        label="是否网销门店:"
        :rules="{required: true, message: '是否网销门店不能为空'}">
        <el-select
          v-model="form.isNet"
          clearable
          filterable
          placeholder="是否网销门店">
          <el-option label="否" :value="0"></el-option>
          <el-option label="是" :value="1"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        label="是否统计:"
        :rules="{required: true, message: '是否统计不能为空'}">
        <el-select
          v-model="form.isCount"
          clearable
          filterable
          placeholder="是否统计">
          <el-option label="否" :value="0"></el-option>
          <el-option label="是" :value="1"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        label="门店标识:"
        :rules="{required: true, message: '门店标识不能为空'}">
        <el-select
          v-model="form.orgFlag"
          clearable
          filterable
          placeholder="门店标识">
          <el-option label="对内门店" :value="0"></el-option>
          <el-option label="对外门店" :value="1"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button @click="close">取消</el-button>
      <el-button @click="confirm">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'org-edit',
  props: {
    isEdit: Boolean,
    visible: Boolean,
    orgInfo: Object
  },
  data () {
    return {
      titleText: '新增门店',
      provinceList: JSON.parse(this.$localStorage('cityList')) || [],
      cityList: [],
      form: {
        orgId: '',
        orgName: '',
        orgNo: '',
        province: '',
        cityName: '',
        address: '',
        managerName: '',
        managerTel: '',
        orgType: '',
        isNet: '',
        isCount: '',
        orgFlag: ''
      }
    }
  },
  watch: {
    isEdit (val) {
      if (this.isEdit) {
        this.titleText = '新增门店'
      } else {
        this.titleText = '修改门店'
      }
    },
    // 编辑数据变化
    orgInfo (obj) {
      this.first = true
      this.form = {
        orgId: obj['orgId'] || '',
        orgName: obj['orgName'] || '',
        orgNo: obj['orgNo'] || '',
        province: obj['province'] || '',
        cityName: obj['cityName'] || '',
        address: obj['address'] || '',
        managerName: obj['managerName'] || '',
        managerTel: obj['managerTel'] || '',
        orgType: obj['orgType'] || '',
        isNet: obj['isNet'] || '',
        isCount: obj['isCount'] || '',
        orgFlag: obj['orgFlag'] || ''
      }
      this.changeProvince()
    }
  },
  methods: {
    changeProvince () {
      this.provinceList.forEach(e => {
        if (this.form.province && this.form.province === e.provinceName) {
          this.cityList = e.citys || []
        }
      })
    },
    close () {
      this.$emit('close')
    },
    // 确定
    confirm () {
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (this.isEdit) {
            this.$ajax({
              url: '/store/account/config/orgCfg/update',
              data: this.form,
              success: data => {
                this.$emit('close', 'search')
              }
            })
          } else {
            this.$ajax({
              url: '/store/account/config/orgCfg/add',
              data: this.form,
              success: data => {
                this.$emit('close', 'search')
              }
            })
          }
        }
      })
    }
  }
}
</script>
