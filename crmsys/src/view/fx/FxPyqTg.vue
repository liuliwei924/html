  <template>
    <div class="content-box">
      <div class="header__title">海报大类配置</div>
       <!-- 查询条件 -->
      <div class="header__search clearfix">
      <el-form :model="searchForm" ref="searchForm">
        <el-form-item label="类型名称">
          <el-input v-model="searchForm.typeName" 
            placeholder="请输入类型名称">
          </el-input>
        </el-form-item>
        <el-form-item label="海报配置类型" prop="postType">
          <el-select v-model="searchForm.postType" clearable placeholder="海报配置类型">
            <el-option label="朋友圈海报" value="1"></el-option>
            <el-option label="早晚安海报" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否启用:">
          <el-select
            v-model="searchForm.enable"
            clearable
            placeholder="请选择">
            <el-option
              v-for="val,key,index in enable"
              :label="val"
              :value="String(key)"
              :key="index">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="推广日期-起:" prop="startDate">
          <el-date-picker v-model="searchForm.startDate" type="date" editable @change="startDateChange" :picker-options="startDateOptions" placeholder="开始日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="推广日期-止:" prop="endDate">
          <el-date-picker v-model="searchForm.endDate" type="date" editable @change="endDateChange" :picker-options="endDateOptions" placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
        <el-button :loading="loading" @click="searchHandle">查询</el-button>
        <el-button icon="plus" @click="addHandle">添加</el-button>
      </el-form>
     </div>
     <!-- 业务操作区域 -->
     <div class="header__check">
        <el-radio-group v-model="status">
          <el-radio :label="1">海报大类配置</el-radio>
          <el-radio :label="2">海报详情配置</el-radio>
        </el-radio-group>
      </div>
      <el-table class="content__table" :data="tableData" border>
        <el-table-column
        prop="tgId"
        label="类型编号"
         align="center" min-width="30">
        </el-table-column>
        <el-table-column prop="postType" label="海报配置类型" align="center" min-width="50">
          <template slot-scope="scope">
            <span v-if="scope.row.postType===1">朋友圈海报</span>
            <span v-if="scope.row.postType===2">早晚安海报</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="typeName"
          label="类型名称" 
          align="center" min-width="50">
        </el-table-column>
        <el-table-column
          prop="content"
          label="文案" 
          align="center">
        </el-table-column>
        <el-table-column
          prop="enable"
          label="是否启用" 
          align="center" min-width="40">
          <template slot-scope="scope">
              <el-tag v-if ="scope.row.enable===0" type="danger">禁用</el-tag>
              <el-tag v-if ="scope.row.enable===1" type="success">开启</el-tag>
        </template>
        </el-table-column>
        <el-table-column
          prop="tgDate"
          label="推广日期" 
          align="center" min-width="50">
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          min-width="30">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="editHandle(scope.row)">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        class="content__page fr"
        @current-change="pageHandle"
        :current-page="currentPage"
        layout="total, prev, pager, next"
        :total="totalRecord">
      </el-pagination>
      <fx-pyq-tg-add v-model="addShow" @change="addChange"/>
      <fx-pyq-tg-edit v-model="editShow" :fxPyqData="fxPyqData" @change="editChange"/>
    </div>
    </div>
  </template>

<script>
import FxPyqTgAdd from '@/components/fx/FxPyqTgAdd'
import FxPyqTgEdit from '@/components/fx/FxPyqTgEdit'
export default {
  name: 'fx-pyq-tg',
  data () {
    return {
      tableData: [],
      currentPage: 1,
      totalRecord: 1,
      fxPyqData: {},
      addShow: false,
      queryShow: false,
      editShow: false,
      status: 1,
      searchForm: {
        typeName: '',
        postType: '',
        enable: '',
        currentPage: 1
      },
      // 是否启用
      enable: {
        0: '禁用',
        1: '开启'
      },
       // 开始时间禁用
      startDateOptions: {
        disabledDate (time) {
          return time.getTime() > Date.now()
        }
      },
      // 结束时间禁用
      endDateOptions: {
        disabledDate (time) {
          return time.getTime() > Date.now()
        }
      }
    }
  },
  created () {
    this.searchHandle()
  },
  watch: {
    // 处理状态改变监听
    status (val) {
      this.$emit('change', val)
    }
  },
  methods: {
     // 注册时间
    startDateChange (date) {
      this.searchForm.startDate = date || ''
      this.searchForm.endDate = ''
      this.endDateOptions.disabledDate = time => {
        return time.getTime() < new Date(date).getTime() - 8.64e7
      }
    },
    endDateChange (date) {
      this.searchForm.endDate = date || ''
    },
    // 添加
    addHandle () {
      this.addShow = true
    },
    // 添加弹窗监听
    addChange (val) {
      if (val === 'search') {
        this.searchHandle()
        this.addShow = false
      } else {
        this.addShow = val
      }
    },
    // 编辑
    editHandle (row) {
      this.fxPyqData = row
      this.editShow = true
    },
    // 编辑弹窗监听
    editChange (val) {
      if (val === 'search') {
        this.searchHandle()
        this.editShow = false
      } else {
        this.editShow = val
      }
    },
    // 查询
    searchHandle () {
      this.$ajax({
        url: '/store/account/fx/fxPyqPoster/queryTgList',
        data: this.searchForm,
        loading: true,
        success: data => {
          this.tableData = data.rows || []
          this.totalRecord = data.page.totalRecords
        }
      })
    },
    // 分页
    pageHandle (page) {
      this.searchForm.currentPage = page
      this.searchHandle()
    }
  },
  components: {
    FxPyqTgAdd,
    FxPyqTgEdit
  }
}
</script>
