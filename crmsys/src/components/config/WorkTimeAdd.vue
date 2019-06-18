<template>
  <el-dialog class="edit-dialog" title="添加门店工作配置" v-model="visible">
    <el-form :model="form" ref="form" label-width="150px">
      <el-form-item
        label="城市:"
        :rules="{required: true, message: '城市不能为空'}">
        <el-select
          v-model="form.cityName"
          clearable
          filterable
          placeholder="请选择城市">
          <el-option
            v-for="item,index in cityNameList"
            :label="item.cityName"
            :value="item.cityName"
            :key="index">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        label="门店:"
        :rules="{required: true, message: '门店不能为空'}">
        <el-select
          v-model="form.orgId"
          filterable
          clearable
          @change="orgChange"
          placeholder="请选择门店">
          <el-option
            v-for="item,index in userOrgs"
            :label="item.orgNo + '-' + item.orgName"
            :value="item.orgId"
            :key="index">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="上午开始工作时间" prop="amBeginWorkTime" :rules="{required: true, message: '上午开始工作时间不能为空'}">
        <el-time-select
          v-model="form.amBeginWorkTime"
          :picker-options="{
            start: '07:00',
            step: '00:05',
            end: '10:00'
          }"
          placeholder="选择上午开始工作时间">
        </el-time-select>
      </el-form-item>
      <el-form-item label="上午结束工作时间" prop="amEndWordTime" :rules="{required: true, message: '上午结束工作时间不能为空'}">
        <el-time-select
          v-model="form.amEndWordTime"
          :picker-options="{
            start: '11:00',
            step: '00:05',
            end: '13:00'
          }"
          placeholder="选择上午结束工作时间">
        </el-time-select>
      </el-form-item>
      <el-form-item label="下午开始工作时间" prop="pmBeginWorkTime" :rules="{required: true, message: '下午开始工作时间不能为空'}">
        <el-time-select
          v-model="form.pmBeginWorkTime"
          :picker-options="{
            start: '12:00',
            step: '00:05',
            end: '15:00'
          }"
          placeholder="选择下午开始工作时间">
        </el-time-select>
      </el-form-item>
      <el-form-item label="下午结束工作时间" prop="pmEndWordTime" :rules="{required: true, message: '下午结束工作时间不能为空'}">
        <el-time-select
          v-model="form.pmEndWordTime"
          :picker-options="{
            start: '17:00',
            step: '00:05',
            end: '19:00'
          }"
          placeholder="选择下午结束工作时间">
        </el-time-select>
      </el-form-item>
      <el-form-item label="晚上开始工作时间" prop="evesBeginWorkTime" :rules="{required: false, message: '晚上开始工作时间不能为空'}">
        <el-time-select
          v-model="form.evesBeginWorkTime"
          :picker-options="{
            start: '17:00',
            step: '00:05',
            end: '20:00'
          }"
          placeholder="选择晚上开始工作时间">
        </el-time-select>
      </el-form-item>
      <el-form-item label="晚上结束工作时间" prop="evesEndWordTime" :rules="{required: false, message: '晚上结束工作时间不能为空'}">
        <el-time-select
          v-model="form.evesEndWordTime"
          :picker-options="{
            start: '20:00',
            step: '00:05',
            end: '22:00'
          }"
          placeholder="选择晚上结束工作时间">
        </el-time-select>
      </el-form-item>
      <el-form-item label="开始分单时间" prop="startAllotTime">
        <el-time-select
          v-model="form.startAllotTime"
          :picker-options="{
            start: '07:00',
            step: '00:05',
            end: '10:30'
          }"
          placeholder="选择开始分单时间">
        </el-time-select>
      </el-form-item>
      <el-form-item label="结束分单时间" prop="endAllotTime">
        <el-time-select
          v-model="form.endAllotTime"
          :picker-options="{
            start: '18:00',
            step: '00:05',
            end: '22:00'
          }"
          placeholder="选择结束分单时间">
        </el-time-select>
      </el-form-item>
      <el-form-item
        label="历史数据最大量"
        prop="hisMaxCount">
        <el-input v-model="form.hisMaxCount">
          <template slot="append">条</template>
        </el-input>
      </el-form-item>
      <el-form-item
        label="实时数据最大量"
        prop="realmMxCount">
        <el-input v-model="form.realMaxCount" >
          <template slot="append">条</template>
        </el-input>
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
  name: 'workTime-add',
  props: {
    value: Boolean,
    cityNameList: Array,
    userOrgs: Array
  },
  data () {
    return {
      visible: this.value,
      form: {
        cityName: '',
        orgId: '',
        amBeginWorkTime: '',
        amEndWordTime: '',
        pmBeginWorkTime: '',
        pmEndWordTime: '',
        evesBeginWorkTime: '',
        evesEndWordTime: '',
        startAllotTime: '',
        realMaxCount: '',
        hisMaxCount: '',
        endAllotTime: ''
      },
      custInfo: []
    }
  },
  watch: {
    value (val) {
      this.visible = val
    },
    visible (val) {
      this.$emit('change', val)
    }
  },
  methods: {
    // 门店变化监听
    orgChange (val) {
      this.form.customerId = ''
      this.$ajax({
        url: '/store/account/user/comm/getOrgCustList',
        data: {
          orgId: val
        },
        success: data => {
          this.custInfo = data.rows
        }
      })
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
            url: '/store/account/config/workTimeConf/addWorkTime',
            data: this.form,
            success: data => {
              this.$emit('change', 'search')
            }
          })
        }
      })
    }
  }
}
</script>
