<template>
  <div class="record-content">
    <el-button class="record-edit-btn" :icon="status ? 'edit' : 'document'" @click="type !== 'doc' ? statusChange(true) : statusChange(false)" v-if="type !== 'add'">
      {{status ? '编辑' : '查看'}}
    </el-button>
    <!-- 编辑 -->
    <template v-if="status">
      <el-form class="clearfix" ref="form" :model="form" label-width="30%">
        <el-form-item label="姓名" prop="name1" :rules="{required: true, message: '请输入姓名', trigger: 'blur'}">
          <el-input v-model="form.name1" placeholder="请填写" :maxlength="4"></el-input>
        </el-form-item>
        <el-form-item label="手机号码" prop="mobile1" :rules="{required: true, message: '请输入手机号码', trigger: 'blur'}">
          <el-input v-model="form.mobile1" placeholder="请填写" :maxlength="11"></el-input>
        </el-form-item>
        <el-form-item label="关系" prop="relation1" :rules="{type: 'number', required: true, message: '关系不能为空且为数字'}">
          <el-radio-group v-model.number="form.relation1">
            <el-radio v-for="val,key,index in relation" :label="Number(key)" :key="index">{{val}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="姓名" prop="name2" :rules="{required: true, message: '请输入姓名', trigger: 'blur'}">
          <el-input v-model="form.name2" placeholder="请填写" :maxlength="4"></el-input>
        </el-form-item>
        <el-form-item label="手机号码" prop="mobile2" :rules="{required: true, message: '请输入手机号码', trigger: 'blur'}">
          <el-input v-model="form.mobile2" placeholder="请填写" :maxlength="11"></el-input>
        </el-form-item>
        <el-form-item label="关系" prop="relation2" :rules="{type: 'number', required: true, message: '关系不能为空且为数字'}">
          <el-radio-group v-model.number="form.relation2">
            <el-radio v-for="val,key,index in relation" :label="Number(key)" :key="index">{{val}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="姓名" prop="name3" :rules="{required: true, message: '请输入姓名', trigger: 'blur'}">
          <el-input v-model="form.name3" placeholder="请填写" :maxlength="4"></el-input>
        </el-form-item>
        <el-form-item label="手机号码" prop="mobile3" :rules="{required: true, message: '请输入手机号码', trigger: 'blur'}">
          <el-input v-model="form.mobile3" placeholder="请填写" :maxlength="11"></el-input>
        </el-form-item>
        <el-form-item label="关系" prop="relation3" :rules="{type: 'number', required: true, message: '关系不能为空且为数字'}">
          <el-radio-group v-model.number="form.relation3">
            <el-radio v-for="val,key,index in relation" :label="Number(key)" :key="index">{{val}}</el-radio>
          </el-radio-group>
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
        <div class="el-form-item__content">{{form.name1}}</div>
      </div>
      <div class="el-form-item">
        <div class="el-form-item__label">手机号码</div>
        <div class="el-form-item__content">{{form.mobile1}}</div>
      </div>
      <div class="el-form-item">
        <div class="el-form-item__label">关系</div>
        <div class="el-form-item__content">{{relation[form.relation1]}}</div>
      </div>
      <div class="el-form-item">
        <div class="el-form-item__label">姓名</div>
        <div class="el-form-item__content">{{form.name2}}</div>
      </div>
      <div class="el-form-item">
        <div class="el-form-item__label">手机号码</div>
        <div class="el-form-item__content">{{form.mobile2}}</div>
      </div>
      <div class="el-form-item">
        <div class="el-form-item__label">关系</div>
        <div class="el-form-item__content">{{relation[form.relation2]}}</div>
      </div>
      <div class="el-form-item">
        <div class="el-form-item__label">姓名</div>
        <div class="el-form-item__content">{{form.name3}}</div>
      </div>
      <div class="el-form-item">
        <div class="el-form-item__label">手机号码</div>
        <div class="el-form-item__content">{{form.mobile3}}</div>
      </div>
      <div class="el-form-item">
        <div class="el-form-item__label">关系</div>
        <div class="el-form-item__content">{{relation[form.relation3]}}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'cust-contact',
  props: {
    type: String, // add:添加模式 edit:编辑模式 doc:查看模式
    custId: [Number, String],
    info: Array
  },
  data () {
    return {
      status: this.type !== 'doc', // 非查看模式
      form: {
        name1: '',
        mobile1: '',
        relation1: '',
        name2: '',
        mobile2: '',
        relation2: '',
        name3: '',
        mobile3: '',
        relation3: ''
      },
      // 关系
      relation: {
        1: '配偶',
        2: '亲属',
        3: '朋友',
        4: '同事'
      }
    }
  },
  watch: {
    info (arr) {
      if (!arr) return
      if (arr.length > 0) {
        let arr1 = arr[0]
        this.form['contactId1'] = arr1['contactId']
        this.form['name1'] = arr1['name']
        this.form['mobile1'] = arr1['mobile']
        this.form['relation1'] = arr1['relation']
      }
      if (arr.length > 1) {
        let arr2 = arr[1]
        this.form['contactId2'] = arr2['contactId']
        this.form['name2'] = arr2['name']
        this.form['mobile2'] = arr2['mobile']
        this.form['relation2'] = arr2['relation']
      }
      if (arr.length > 2) {
        let arr3 = arr[2]
        this.form['contactId3'] = arr3['contactId']
        this.form['name3'] = arr3['name']
        this.form['mobile3'] = arr3['mobile']
        this.form['relation3'] = arr3['relation']
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
          var contacts = [
            {contactId: this.form['contactId1'], name: this.form['name1'], mobile: this.form['mobile1'], relation: this.form['relation1']},
            {contactId: this.form['contactId2'], name: this.form['name2'], mobile: this.form['mobile2'], relation: this.form['relation2']},
            {contactId: this.form['contactId3'], name: this.form['name3'], mobile: this.form['mobile3'], relation: this.form['relation3']}
          ]
          contacts = JSON.stringify(contacts)
          this.$ajax({
            url: '/crmsys/account/busi/enterInfo/saveCustContact',
            data: {
              custId: this.custId,
              contacts
            },
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
