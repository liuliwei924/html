<template>
  <el-dialog
    class="edit-dialog"
    title="退单审核"
    v-model="visible">
    <el-form :model="form" ref="form" label-width="150px">
    <!-- 表单处理 -->
      <el-form-item
        label="退单状态"
        prop="backStatus"
        :rules="{type: 'number', required: true, message: '退单状态不能为空',trigger: 'change'}">
        <el-select
          v-model.number="form.backStatus"
          placeholder="请选择退单状态">
          <el-option
            v-for="val,key,index in backStatus"
            :label="val"
            :value="Number(key)"
            :key="index">
          </el-option>
        </el-select>
      </el-form-item>
      <template v-if="form.backStatus === 4">
        <el-form-item
          label="退单失败描述"
          prop="backDesc"
          :rules="{required: true, message: '退单失败描述不能为空'}">
          <el-input
            type="textarea"
            :maxlength="100"
            v-model.trim="form.backDesc">
          </el-input>
        </el-form-item>
        <p style="text-align: right;padding-right: 22px;">剩余字数：{{100 - form.backDesc.length}}</p>
      </template>
    </el-form>
    <div slot="footer">
      <el-button @click="close">取消</el-button>
      <el-button :loading="loading" @click="saveHandle">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
// 操作员编辑组件
export default {
  name: 'back-orderCheck',
  // 父组件传递参数
  props: {
    value: Boolean,
    backOrderData: Object
  },
  data () {
    return {
      visible: this.value, // 弹窗是否显示
      loading: false, // 加载动画
      form: {
        backStatus: 3,
        backDesc: ''
      },
      // 退单状态
      backStatus: {
        3: '退单成功',
        4: '退单失败'
      }
    }
  },
  watch: {
    // 监听父组件传递的参数变化
    value (val) {
      this.visible = val
    },
    // 弹窗显示改变传递给父组件
    visible (val) {
      this.$emit('change', val)
    }
  },
  methods: {
    // 弹窗关闭
    close () {
      this.visible = false
    },
    // 保存处理
    saveHandle () {
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.$ajax({
            url: '/store/account/work/backOrder/batchCheckBackOrder',
            data: {
              backStatus: this.form.backStatus,
              str: this.backOrderData.str,
              backDesc: this.form.backDesc
            },
            success: data => {
              if (data.message) {
                this.$msg(data.message)
              } else {
                this.$message('操作成功')
              }
              this.$emit('change', 'search')
            },
            fail: (error) => {
              this.$msg(error.message)
              this.$emit('change', 'search')
            }
          })
        }
      })
    }
  }
}
</script>
