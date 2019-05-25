<template>
  <div class="record-content">
    <el-button class="record-edit-btn" :icon="status ? 'edit' : 'document'" @click="type !== 'doc' ? statusChange(true) : statusChange(false)" v-if="type !== 'add'">
      {{status ? '编辑' : '查看'}}
    </el-button>
    <template v-if="status">
      <el-form class="clearfix" ref="form" :model="form" label-width="30%">
        <el-form-item label="连续最高逾期数" prop="conOverCount" :rules="{type: 'number', required: true, message: '请选择连续最高逾期数'}">
          <el-select v-model.number="form.conOverCount" placeholder="请选择">
            <el-option v-for="val,key,index in conOverCount" :label="val" :value="Number(key)" :key="index"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="五年累计逾期" prop="overInFiveYear" :rules="{type: 'number', required: true, message: '请选择五年累计逾期'}">
          <el-select v-model.number="form.overInFiveYear" placeholder="请选择">
            <el-option v-for="val,key,index in overInFiveYear" :label="val" :value="Number(key)" :key="index"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="两年累计逾期" prop="overInTwoYear" :rules="{type: 'number', required: true, message: '请选择累计逾期'}">
          <el-select v-model.number="form.overInTwoYear" placeholder="请选择">
            <el-option v-for="val,key,index in overInTwoYear" :label="val" :value="Number(key)" :key="index"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="一年累计逾期" prop="overInOneYear" :rules="{type: 'number', required: true, message: '请选择一年累计逾期'}">
          <el-select v-model.number="form.overInOneYear" placeholder="请选择">
            <el-option v-for="val,key,index in overInOneYear" :label="val" :value="Number(key)" :key="index"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="半年累计逾期" prop="overInHalfYear" :rules="{type: 'number', required: true, message: '请选择半年累计逾期'}">
          <el-select v-model.number="form.overInHalfYear" placeholder="请选择">
            <el-option v-for="val,key,index in overInHalfYear" :label="val" :value="Number(key)" :key="index"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="近两年征信查询" prop="creditInTwoYear" :rules="{type: 'number', required: true, message: '请选择近两年征信查询'}">
          <el-select v-model.number="form.creditInTwoYear" placeholder="请选择">
            <el-option v-for="val,key,index in creditInTwoYear" :label="val" :value="Number(key)" :key="index"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="近三个月征信查询" prop="creditInThreeMonth" :rules="{type: 'number', required: true, message: '请选择近三个月征信查询'}">
          <el-select v-model.number="form.creditInThreeMonth" placeholder="请选择">
            <el-option v-for="val,key,index in creditInThreeMonth" :label="val" :value="Number(key)" :key="index"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="近一个月征信查询" prop="creditInOneMonth" :rules="{type: 'number', required: true, message: '请选择近一个月征信查询'}">
          <el-select v-model.number="form.creditInOneMonth" placeholder="请选择">
            <el-option v-for="val,key,index in creditInOneMonth" :label="val" :value="Number(key)" :key="index"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div class="record-content-ctrl">
        <!-- <el-button class="cancal__btn">取消</el-button> -->
        <el-button class="confirm__btn" @click="saveHandle">保存</el-button>
      </div>
    </template>
    <div class="el-form__view" v-else>
      <div class="el-form-item">
        <div class="el-form-item__label">连续最高逾期数</div>
        <div class="el-form-item__content">{{conOverCount[form.conOverCount]}}</div>
      </div>
      <div class="el-form-item">
        <div class="el-form-item__label">五年累计逾期</div>
        <div class="el-form-item__content">{{overInFiveYear[form.overInFiveYear]}}</div>
      </div>
      <div class="el-form-item">
        <div class="el-form-item__label">两年累计逾期</div>
        <div class="el-form-item__content">{{overInTwoYear[form.overInTwoYear]}}</div>
      </div>
      <div class="el-form-item">
        <div class="el-form-item__label">一年累计逾期</div>
        <div class="el-form-item__content">{{overInOneYear[form.overInOneYear]}}</div>
      </div>
      <div class="el-form-item">
        <div class="el-form-item__label">半年累计逾期</div>
        <div class="el-form-item__content">{{overInHalfYear[form.overInHalfYear]}}</div>
      </div>
      <div class="el-form-item">
        <div class="el-form-item__label">近两年征信查询</div>
        <div class="el-form-item__content">{{creditInTwoYear[form.creditInTwoYear]}}</div>
      </div>
      <div class="el-form-item">
        <div class="el-form-item__label">近三个月征信查询</div>
        <div class="el-form-item__content">{{creditInThreeMonth[form.creditInThreeMonth]}}</div>
      </div>
      <div class="el-form-item">
        <div class="el-form-item__label">近一个月征信查询</div>
        <div class="el-form-item__content">{{creditInOneMonth[form.creditInOneMonth]}}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'credit-count',
  props: {
    type: String, // add:添加模式 edit:编辑模式 doc:查看模式
    info: Object
  },
  data () {
    return {
      status: this.type !== 'doc', // 非查看模式
      form: {
        conOverCount: '',
        overInFiveYear: '',
        overInTwoYear: '',
        overInOneYear: '',
        overInHalfYear: '',
        creditInTwoYear: '',
        creditInThreeMonth: '',
        creditInOneMonth: ''
      },
      // 连续最高逾期数
      conOverCount: {
        1: '1期',
        2: '2期',
        3: '3期',
        4: '4期',
        5: '5期',
        6: '6期',
        7: '7期'
      },
      // 五年累计逾期
      overInFiveYear: {
        1: '3次以内',
        2: '3-6次',
        3: '6-11次',
        4: '11-25次',
        5: '25次+'
      },
      // 两年累计逾期
      overInTwoYear: {
        1: '3次以内',
        2: '3-6次',
        3: '6-11次',
        4: '11-25次',
        5: '25次+'
      },
      // 一年累计逾期
      overInOneYear: {
        1: '3次以内',
        2: '3-6次',
        3: '6-11次',
        4: '11-25次',
        5: '25次+'
      },
      // 半年累计逾期
      overInHalfYear: {
        1: '3次以内',
        2: '3-6次',
        3: '6-11次',
        4: '11-25次',
        5: '25次+'
      },
      // 近两年征信查询
      creditInTwoYear: {
        1: '10次以内',
        2: '10-20次',
        3: '21-30次',
        4: '31次以上'
      },
      // 近三个月征信查询
      creditInThreeMonth: {
        1: '2次以内',
        2: '3-5次',
        3: '6-10次',
        4: '10次以上'
      },
      // 近一个月征信查询
      creditInOneMonth: {
        1: '2次以内',
        2: '3-4次',
        3: '5-8次',
        4: '9次以上'
      }
    }
  },
  watch: {
    info (obj) {
      this.form = {
        custId: obj['custId'],
        conOverCount: obj['conOverCount'],
        overInFiveYear: obj['overInFiveYear'],
        overInTwoYear: obj['overInTwoYear'],
        overInOneYear: obj['overInOneYear'],
        overInHalfYear: obj['overInHalfYear'],
        creditInTwoYear: obj['creditInTwoYear'],
        creditInThreeMonth: obj['creditInThreeMonth'],
        creditInOneMonth: obj['creditInOneMonth']
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
            url: '/crmsys/account/busi/enterInfo/saveCreditCount',
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
