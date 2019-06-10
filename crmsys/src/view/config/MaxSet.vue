<template>
  <div class="content-box">
    <div class="header__title">大类配置</div>
    <div class="kf-box">
      <el-form :inline="true" :model="searchForm" class="header__search clearfix">
        <el-form-item>
          <el-select v-model="searchForm.channelCode" placeholder="请选择代号" clearable filterable>
            <el-option
              v-for="(item,index) in channels"
              :label="item.channelCode"
              :value="item.channelCode" :key="index">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select v-model="searchForm.type" clearable placeholder="请选择渠道类型">
            <el-option
              v-for="(item,index) in types"
              :label="item.label"
              :value="item.value" :key="index">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select v-model="searchForm.teamNo" clearable placeholder="请选择团队">
            <el-option
              v-for="(item,index) in teams"
              :label="item.teamName"
              :value="item.teamNo" :key="index">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select v-model="searchForm.launchPlace" clearable placeholder="请选择投放位置">
            <el-option
              v-for="(item,index) in launchPlaces"
              :label="item.label"
              :value="item.value" :key="index">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select v-model="searchForm.allotGrade" clearable placeholder="请选择分单等级">
            <el-option
              v-for="(item, index) in allotGrades"
              :label="item.label"
              :value="item.value" :key="index">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select v-model="searchForm.isCost" clearable placeholder="请选择是否计算成本">
            <el-option
              v-for="(item,index) in isCosts"
              :label="item.label"
              :value="item.value" :key="index">
            </el-option>
          </el-select>
        </el-form-item>
        <el-button @click="search(1)" :loading="searchLoading">查询</el-button>
        <el-button @click="add" v-if="isEdit">添加</el-button>
      </el-form>
      <table-list
        :data="tableData"
        :columns="listConfig"
        @currentChange="search"
        :currentPage="formCurrentPage"
        :totalRecords="formTotalRecords"/>
  </div>
  <deal-maxset ref="alertMax"></deal-maxset>
</div>
</template>
<script>
import DealMaxset from '../../components/config/DealMaxset.vue'
export default {
  name: 'canal',
  data () {
    return {
      isEdit: true,
      searchForm: {
        channelCode: '',
        type: '',
        launchPlace: '',
        teamNo: '',
        allotGrade: '',
        isCost: ''
      },
      tableData: [],
      channels: [],
      types: [
        {label: '--渠道类型--', value: ''},
        {label: '免费流量', value: '1'},
        {label: '信息流', value: '2'},
        {label: 'API接口', value: '3'},
        {label: '历史数据', value: '4'},
        {label: '贷超', value: '5'},
        {label: '测试数据', value: '6'}
      ],
      show: true,
      launchPlaces: [
        {label: '--投放位置--', value: ''},
        {label: '自有平台', value: '1'},
        {label: '搜索引擎', value: '2'},
        {label: '信息流', value: '3'},
        {label: '广告位', value: '4'}
      ],
      flowTypes: [
        {label: '自然流量', value: '1'},
        {label: '点击付费流量', value: '2'},
        {label: '广告位流量', value: '3'}
      ],
      allotGrades: [
        {label: '普通等级', value: '1'},
        {label: '优先等级一', value: '2'},
        {label: '优先等级二', value: '3'},
        {label: '优先等级三', value: '4'},
        {label: '优先等级四', value: '5'}
      ],
      isCosts: [
        {label: '是', value: '1'},
        {label: '否', value: '2'}
      ],
      isCosts2: ['', '是', '否'],
      multipleSelection: '',
      formTotalRecords: 0,
      formCurrentPage: 1,
      searchLoading: false,
      teams: [],
      typeFlag: ['', '免费流量', '信息流', 'API接口', '历史数据', '贷超', '测试数据'],
      flowTypeFlag: ['', '自然流量', '点击付费流量', '广告位流量'],
      launchPlaceFlag: ['', '自有平台', '搜索引擎', '信息流', '广告位'],
      operations: [],
      listConfig: {}
    }
  },
  created () {
    this.search(1)
    this.into()
  },
  mounted () {
    // 获取权限
    // let menuCode = this.$route.path.split('/')[2]
    // let checkUrl = this.$localStorage('kfCheckMenus')
    // if (checkUrl.indexOf(menuCode) >= 0) {
    //   this.isEdit = true
    // }
    this.operation = [
      {label: '编辑', disabled: this.isEdit, func: this.edit},
      {label: '删除', disabled: this.isEdit, color: 'red', func: this.delet}
    ]
    this.listConfig = {
      multistage: false,
      rows: [
        {label: '代号', prop: 'channelCode', minWidth: 110},
        {label: '渠道名称', prop: 'channelName', minWidth: 110},
        {label: '渠道别名', prop: 'channelNick', minWidth: 110},
        {label: '团队代号', prop: 'teamNo', minWidth: 110},
        {label: '团队名称', prop: 'teamName', minWidth: 110},
        {label: '渠道类型', prop: 'type', minWidth: 120, tags: this.typeFlag, type: 'tag1'},
        {label: '流量类型', prop: 'flowType', minWidth: 120, flags: this.flowTypeFlag, type: 'flag'},
        {label: '是否计算成本', prop: 'isCost', minWidth: 120, flags: this.isCosts2, type: 'flag'},
        {label: '投放位置', prop: 'launchPlace', minWidth: 120, flags: this.launchPlaceFlag, type: 'flag'},
        {label: '渠道商户号', prop: 'merchId', minWidth: 150},
        {label: '录入时间', prop: 'createTime', minWidth: 200},
        {label: '操作', minWidth: 150, operations: this.operation, type: 'handle'}
      ]
    }
  },
  methods: {
    search (page) {
      this.tableData = []
      let obj = this.searchForm
      obj.currentPage = page
      this.formCurrentPage = page
      this.searchLoading = true
      this.$ajax({
        url: '/store/account/spread/channelCode/queryList',
        data: obj,
        success: data => {
          this.searchLoading = false
          this.tableData = data.rows
          this.formTotalRecords = data.page.totalRecords
        }
      })
    },
    delet (row) {
      let channelCode = row.channelCode
      this.$confirm('此操作将删除该条信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$ajax({
          url: '/store/account/spread/channelCode/del ',
          data: {channelCode: channelCode},
          success: data => {
            this.search(this.formCurrentPage)
            this.$message({message: '删除成功', type: 'success'})
          }
        })
      }).catch(() => {
      })
    },
    edit (row) {
      let f = row
      this.$refs.alertMax.form = {
        channelCode: f.channelCode,
        channelName: f.channelName,
        type: f.type + '',
        launchPlace: f.launchPlace + '',
        channelNick: f.channelNick,
        flowType: f.flowType + '',
        merchId: f.merchId,
        teamNo: f.teamNo,
        allotGrade: f.allotGrade + '',
        isCost: f.isCost + ''
      }
      this.$refs.alertMax.isEdit = true
      this.$refs.alertMax.title = '编辑大类'
      this.$refs.alertMax.show = true
    },
    add () {
      this.$refs.alertMax.title = '添加大类'
      this.$refs.alertMax.isEdit = false
      this.$refs.alertMax.form = {
        channelCode: '',
        channelName: '',
        type: '',
        launchPlace: '',
        flowType: '',
        teamNo: '',
        allotGrade: '1',
        isCost: '1'
      }
      this.$refs.alertMax.show = true
    },
    into () {
      this.$ajax({
        url: '/store/user/code/queryAll',
        success: data => {
          this.channels = data.rows
        }
      })
      this.$ajax({
        url: '/store/user/team/queryTeamAll',
        success: data => {
          this.teams = data.rows
        }
      })
    }
  },
  components: {
    DealMaxset
  }
}
</script>
<style media="screen">
  .my-radio{
    width: 20px;
    height: 20px;
    cursor: pointer;
  }
</style>
