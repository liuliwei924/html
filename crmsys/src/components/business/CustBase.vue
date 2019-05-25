<template>
  <div class="record-content">
    <el-button class="record-edit-btn" :icon="status ? 'edit' : 'document'" @click="type !== 'doc' ? statusChange(true) : statusChange(false)" v-if="type !== 'add'">
      {{status ? '编辑' : '查看'}}
    </el-button>
    <!-- 编辑 -->
    <template v-if="status">
      <el-form class="clearfix" ref="form" :model="form" label-width="30%">
        <el-form-item label="姓名" prop="name" :rules="{required: true, message: '请输入姓名', trigger: 'blur'}">
          <el-input v-model="form.name" placeholder="请填写" :maxlength="4"></el-input>
        </el-form-item>
        <el-form-item label="身份证号码" prop="cardNo" :rules="{required: true, message: '请输入身份证号码', trigger: 'blur'}">
          <el-input v-model="form.cardNo" placeholder="请填写" :maxlength="18"></el-input>
        </el-form-item>
        <el-form-item label="手机号码" prop="telephone" :rules="{required: true, message: '请输入手机号码', trigger: 'blur'}">
          <el-input v-model="form.telephone" placeholder="请填写" :maxlength="11"></el-input>
        </el-form-item>
        <el-form-item label="学历" prop="education" :rules="{type: 'number', required: true, message: '学历不能为空且为数字', trigger: 'blur'}">
          <el-select v-model.number="form.education" placeholder="请选择">
            <el-option v-for="val,key,index in education" :label="val" :value="Number(key)" :key="index"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="婚姻状态" prop="marry" :rules="{type: 'number', required: true, message: '婚姻状态不能为空且为数字', trigger: 'blur'}">
          <el-select v-model.number="form.marry" placeholder="请选择">
            <el-option v-for="val,key,index in marry" :label="val" :value="Number(key)" :key="index"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="省份" prop="province" :rules="{required: true, message: '省份不能为空', trigger: 'blur'}">
          <el-input v-model="form.province" placeholder="请填写" :maxlength="20"></el-input>
        </el-form-item>
        <el-form-item label="城市" prop="cityName" :rules="{required: true, message: '城市不能为空', trigger: 'blur'}">
          <el-input v-model="form.cityName" placeholder="请填写" :maxlength="50"></el-input>
        </el-form-item>
        <el-form-item label="居住详细地址" prop="address" :rules="{required: true, message: '居住详细地址不能为空', trigger: 'blur'}">
          <el-input v-model="form.address" placeholder="请填写" :maxlength="100"></el-input>
        </el-form-item>
      </el-form>
      <div class="record-content-ctrl">
        <!-- <el-button class="cancal__btn">取消</el-button> -->
        <el-button class="confirm__btn" @click="saveHandle">保存</el-button>
      </div>
    </template>
    <!-- 查看 -->
    <div class="el-form__view" v-else>
      <div class="el-form-item">
        <div class="el-form-item__label">姓名</div>
        <div class="el-form-item__content">{{form.name}}</div>
      </div>
      <div class="el-form-item">
        <div class="el-form-item__label">身份证号码</div>
        <div class="el-form-item__content">{{form.cardNo}}</div>
      </div>
      <div class="el-form-item">
        <div class="el-form-item__label">手机号码</div>
        <div class="el-form-item__content">{{form.telephone}}</div>
      </div>
      <div class="el-form-item">
        <div class="el-form-item__label">学历</div>
        <div class="el-form-item__content">{{education[form.education]}}</div>
      </div>
      <div class="el-form-item">
        <div class="el-form-item__label">婚姻状态</div>
        <div class="el-form-item__content">{{marry[form.marry]}}</div>
      </div>
      <div class="el-form-item">
        <div class="el-form-item__label">省份</div>
        <div class="el-form-item__content">{{form.province}}</div>
      </div>
      <div class="el-form-item">
        <div class="el-form-item__label">城市</div>
        <div class="el-form-item__content">{{form.cityName}}</div>
      </div>
      <div class="el-form-item">
        <div class="el-form-item__label">居住详细地址</div>
        <div class="el-form-item__content">{{form.address}}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'cust-base',
  props: {
    type: String, // add:添加模式 edit:编辑模式 doc:查看模式
    info: Object
  },
  data () {
    return {
      status: this.type !== 'doc', // 非查看模式
      form: {
        name: '',
        cardNo: '',
        telephone: '',
        education: '',
        marry: '',
        province: '',
        cityName: '',
        address: ''
      },
      // 学历
      education: {
        1: '博士及以上',
        2: '硕士',
        3: '本科',
        4: '大专',
        5: '高中专',
        6: '初中及以下'
      },
      // 婚姻状态
      marry: {
        1: '未婚',
        2: '已婚',
        3: '离婚',
        4: '分居',
        5: '丧偶',
        6: '再婚'
      }
    }
  },
  watch: {
    'form.marry' (val) {
      this.$emit('change', val)
    },
    info (obj) {
      this.form = {
        custId: obj['custId'],
        name: obj['name'],
        cardNo: obj['cardNo'],
        telephone: obj['telephone'],
        education: obj['education'],
        marry: obj['marry'],
        province: obj['province'],
        cityName: obj['cityName'],
        address: obj['address']
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
            url: '/crmsys/account/busi/enterInfo/saveCustBase',
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
