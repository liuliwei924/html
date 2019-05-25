<template>
  <div class="record-content">
    <el-button class="record-edit-btn" :icon="status ? 'edit' : 'document'" @click="type !== 'doc' ? statusChange(true) : statusChange(false)" v-if="type !== 'add'">
      {{status ? '编辑' : '查看'}}
    </el-button>
    <template v-if="status">
      <el-form class="clearfix" ref="form" :model="form" label-width="30%">
        <el-form-item label="公司名称" prop="companyName" :rules="{required: true, message: '请输入公司名称', trigger: 'blur'}">
          <el-input v-model="form.companyName" placeholder="请填写" :maxlength="50"></el-input>
        </el-form-item>
        <el-form-item label="经营年限" prop="companyLife" :rules="{type: 'number', required: true, message: '请输入经营年限且为数字', trigger :'blur'}">
          <el-input v-model.number="form.companyLife" placeholder="请填写" :maxlength="5"></el-input>
          <!-- <el-select v-model.number="form.companyLife" placeholder="请选择">
            <el-option v-for="val,key,index in companyLife" :label="val" :value="Number(key)" :key="index"></el-option>
          </el-select> -->
        </el-form-item>
        <el-form-item label="所属行业" >
          <el-input v-model="form.industry" placeholder="请填写"></el-input>
        </el-form-item>
        <el-form-item label="总经营流水/月" prop="turnover" :rules="{type: 'number', required: true, message: '请输入总经营流水/月且为数字', trigger :'blur'}">
          <el-input v-model.number="form.turnover" placeholder="请填写" :maxlength="8">
            <template slot="append">元</template>
          </el-input>
        </el-form-item>
        <el-form-item label="对公账户经营收入/月" prop="income" :rules="{type: 'number', required: true, message: '请输入对公账户经营收入/月且为数字', trigger :'blur'}">
          <el-input v-model.number="form.income" placeholder="请填写" :maxlength="8">
             <template slot="append">元</template>
          </el-input>
        </el-form-item>
        <el-form-item label="股权比例" prop="equityRatio" :rules="{type: 'number', required: true, message: '请输入股权比例且为数字', trigger :'blur'}">
          <el-input v-model.number="form.equityRatio" placeholder="请填写" :maxlength="3">
             <template slot="append">%</template>
          </el-input>
        </el-form-item>
      </el-form>
      <div class="record-content-ctrl">
        <!-- <el-button class="cancal__btn">取消</el-button> -->
        <el-button class="confirm__btn" @click="saveHandle">保存</el-button>
      </div>
    </template>
    <div class="el-form__view" v-else>
      <div class="el-form-item">
        <div class="el-form-item__label">公司名称</div>
        <div class="el-form-item__content">{{form.companyName}}</div>
      </div>
      <div class="el-form-item">
        <div class="el-form-item__label">经营年限</div>
        <!-- <div class="el-form-item__content">{{companyLife[form.companyLife]}}</div> -->
        <div class="el-form-item__content">{{form.companyLife}}</div>
      </div>
      <div class="el-form-item">
        <div class="el-form-item__label">所属行业</div>
        <div class="el-form-item__content">{{form.industry}}</div>
      </div>
      <div class="el-form-item">
        <div class="el-form-item__label">总经营流水/月</div>
        <div class="el-form-item__content">{{form.turnover}}</div>
      </div>
      <div class="el-form-item">
        <div class="el-form-item__label">对公账户经营收入/月</div>
        <div class="el-form-item__content">{{form.income}}</div>
      </div>
      <div class="el-form-item">
        <div class="el-form-item__label">股权比例</div>
        <div class="el-form-item__content">{{form.equityRatio}}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'cust-company',
  props: {
    type: String, // add:添加模式 edit:编辑模式 doc:查看模式
    info: Object
  },
  data () {
    return {
      status: this.type !== 'doc', // 非查看模式
      form: {
        companyName: '',
        companyLife: '',
        industry: '',
        turnover: '',
        income: '',
        equityRatio: ''
      }
      // 经营年限
      // companyLife: {
      //   1: '1年内',
      //   2: '1-2年',
      //   3: '2-3年',
      //   4: '3年+'
      // }
    }
  },
  watch: {
    info (obj) {
      this.form = {
        custId: obj['custId'],
        companyName: obj['companyName'],
        companyLife: obj['companyLife'],
        industry: obj['industry'],
        turnover: obj['turnover'],
        income: obj['income'],
        equityRatio: obj['equityRatio']
      }
    }
  },
  methods: {
    // 状态切换
    statusChange (isChange) {
      if (isChange) {
        this.status = !this.status
      }
    },
    // 保存
    saveHandle () {
      this.$refs['form'].validate(vali => {
        if (vali) {
          this.$ajax({
            url: '/crmsys/account/busi/enterInfo/saveCustcompany',
            data: this.form,
            success: data => {
              if (this.type !== 'add') this.status = false
            }
          })
        }
      })
    }
  }
}
</script>
