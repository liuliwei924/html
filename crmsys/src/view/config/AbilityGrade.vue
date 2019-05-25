<template>
  <div class="content-box">
    <div class="header__title">能力等级配置</div>
    <div class="header__search clearfix">
      <el-form :model="searchForm">
        <el-form-item label="能力等级ID">
          <el-input v-model="searchForm.gradeCode" placeholder="请输入能力等级ID"></el-input>
        </el-form-item>
        <el-button @click="searchHandle(searchForm.gradeCode)">查询</el-button>
        <el-button @click="addHandle">添加</el-button>
      </el-form>
    </div>
    <el-table class="content__table" :data="tableData" border>
      <el-table-column
        prop="gradeCode"
        label="能力等级ID"
        min-width="110">
      </el-table-column>
      <el-table-column
        prop="gradeName"
        label="能力等级名称"
        min-width="150">
      </el-table-column>
      <el-table-column
        prop="gradeImg"
        label="能力等级小图片"
        min-width="150">
        <template slot-scope="scope">
          <img :src="scope.row.gradeImg" class="gradeImg" v-if="scope.row.gradeImg">
        </template>
      </el-table-column>
      <el-table-column
        prop="gradeImg2"
        label="能力等级大图片"
        min-width="150">
        <template slot-scope="scope">
          <img :src="scope.row.gradeImg2" class="gradeImg" v-if="scope.row.gradeImg2">
        </template>
      </el-table-column>
      <el-table-column
        prop="gradeDesc"
        label="能力等级描述"
        min-width="150">
      </el-table-column>
      <el-table-column
        prop="minScore"
        label="最低能力值"
        min-width="110">
      </el-table-column>
      <el-table-column
        prop="maxScore"
        label="最高能力值"
        min-width="110">
      </el-table-column>
      <el-table-column
        prop="successCount"
        label="回款成功笔数"
        min-width="120">
      </el-table-column>
      <el-table-column
        prop="createBy"
        label="创建人"
        min-width="110">
      </el-table-column>
      <el-table-column
        prop="createTime"
        label="创建时间"
        min-width="220">
      </el-table-column>
      <!-- <el-table-column
        prop="updateBy"
        label="修改人"
        min-width="150">
      </el-table-column>
      <el-table-column
        prop="updateTime"
        label="修改时间"
        min-width="220">
      </el-table-column> -->
      <el-table-column
        fixed="right"
        label="操作"
        width="120">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="editHandle(scope.row)">编辑</el-button>
          <el-button type="text" class="table__danger" size="small" @click="deleteHandle(scope.row.gradeCode)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      class="content__page fr"
      @current-change="pageHandle"
      :current-page="searchForm.currentPage"
      layout="total, prev, pager, next"
      :total="totalRecord">
    </el-pagination>
    <abillty-add v-model="addShow" @change="addChange" />
    <abillty-edit v-model="editShow" :abilltyData="abilltyData" @change="editChange" />
  </div>
</template>

<script>
import AbilltyAdd from '@/components/config/AbilltyAdd'
import AbilltyEdit from '@/components/config/AbilltyEdit'
export default {
  name: 'abillty',
  data () {
    return {
      tableData: [],
      totalRecord: 1,
      abilltyData: {},
      addShow: false,
      editShow: false,
      searchForm: {
        gradeCode: '',
        currentPage: 1
      }
    }
  },
  created () {
    this.searchHandle()
  },
  methods: {
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
      this.abilltyData = row
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
    // 删除
    deleteHandle (gradeCode) {
      this.$alert('您是否确定删除该条记录?', '提示', {
        type: 'warning',
        customClass: 'msg-delete__dialog',
        showCancelButton: true,
        callback: action => {
          if (action === 'confirm') {
            this.$ajax({
              url: '/store/account/config/abilityGrade/delete',
              data: {
                gradeCode
              },
              success: data => {
                this.searchHandle()
              }
            })
          }
        }
      })
    },
    // 查询
    searchHandle (gradeCode) {
      this.tableData = []
      this.$ajax({
        url: '/store/account/config/abilityGrade/queryList',
        data: {
          currentPage: this.searchForm.currentPage,
          gradeCode
        },
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
    AbilltyAdd,
    AbilltyEdit
  }
}
</script>

<style>
  .gradeImg {
    width: 64px;
    height: 64px;
    padding: 10px 0;
    display: block;
  }
</style>
