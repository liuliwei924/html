<template lang="html">
  <el-dialog title="任务运行记录" :visible.sync="isShow" width="700px" center :show-close="false" :close-on-click-modal="false">
    <table-list
        :data="tableData"
        :columns="listConfig"
        @currentChange="pageHandle"
        :currentPage="currentPage"
        :totalRecords="totalRecord"/>
    <div slot="footer" class="dialog-footer xx-form">
      <el-button class="xx-form-btn" @click="close">关闭</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'show-list',
  props: {
    isShow: Boolean,
    curJobId: String
  },
  data () {
    return {
      tableData: [],
      listConfig: {},
      currentPage: 1,
      totalRecord: null,
      levelFlag: ['', '运行中', '运行成功', '运行失败', '被取消']
    }
  },
  watch: {
    curJobId (val) {
      if (val) {
        this.getData()
      }
    }
  },
  mounted () {
    this.listConfig = {
      multistage: false,
      rows: [
        {label: '开始时间', prop: 'startTime'},
        {label: '结束时间', prop: 'endTime'},
        {label: '执行状态', prop: 'executeStatus', flags: this.levelFlag, type: 'flag'},
        {label: '执行描述', prop: 'executeDesc'}
      ]
    }
  },
  methods: {
    getData () {
      this.$ajax({
        url: '/store/account/config/job/queryRecord',
        data: {
          jobId: this.curJobId,
          currentPage: this.currentPage
        },
        success: data => {
          this.totalRecord = data.page.totalRecords
          this.tableData = data.rows
        }
      })
    },
    pageHandle (page) {
      this.currentPage = page
      this.getData()
    },
    close () {
      this.$emit('close')
    }
  }
}
</script>
