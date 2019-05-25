<template>
  <div class="content-box bgf2">
    <div class="header__title t2">录单</div>
    <div class="record-box">
      <el-collapse v-model="collapse">
        <el-collapse-item title="主要信息" name="1">
          <apply-main @change="mainChange" ref="applyMainRef" />
        </el-collapse-item>
        <el-collapse-item title="基本信息" name="2">
          <apply-base :applyId="applyId" ref="applyBaseRef"/>
        </el-collapse-item>
        <el-collapse-item title="其它信息" name="3">
            <apply-other :applyId="applyId" ref="applyOtherRef" />
        </el-collapse-item>
        <div class="record-content-ctrl">
          <el-button class="confirm__btn" @click="saveHandle">保存</el-button>
        </div>
      </el-collapse>
    </div>
  </div>
</template>

<script>
import ApplyMain from '@/components/work/ApplyMain'
import ApplyBase from '@/components/work/ApplyBase'
import ApplyOther from '@/components/work/ApplyOther'
// 录单页面
export default {
  name: 'apply-info',
  data () {
    return {
      applyId: '',
      collapse: ['1', '2', '3']
    }
  },
  created () {
  },
  methods: {
    // 主要信息组件监听
    mainChange (val) {
      this.applyId = val
    },
    saveHandle () {
      this.$refs.applyMainRef.$refs['form'].validate(valid1 => {
        if (valid1) {
          this.$refs.applyBaseRef.$refs['form'].validate(valid2 => {
            if (valid2) {
              this.$refs.applyOtherRef.$refs['form'].validate(valid3 => {
                if (valid3) {
                  this.$ajax({
                    url: '/store/account/work/applyInfo/saveAllInfo',
                    data: {
                      mainInfo: JSON.stringify(this.$refs.applyMainRef.form),
                      baseInfo: JSON.stringify(this.$refs.applyBaseRef.form),
                      otherInfo: JSON.stringify(this.$refs.applyOtherRef.form)
                    },
                    loading: true,
                    success: data => {
                      this.$message('操作成功')
                    }
                  })
                }
              })
            }
          })
        }
      })
    }
  },
  components: {
    ApplyMain,
    ApplyBase,
    ApplyOther
  }
}
</script>
