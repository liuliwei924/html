<template>
  <div class="content-box">
    <div class="header__title">知识库管理列表</div>
    <div class="header__search clearfix">
      <el-form :model="searchForm">
        <el-form-item label="产品名称:">
          <el-input
            class="kf-search-input"
            v-model="searchForm.productName"
            placeholder="请输入产品名称">
          </el-input>
        </el-form-item>
        <el-form-item label="产品类型:">
          <el-input @focus="selectProduct()"
            v-model="searchForm.productTypeName"
            placeholder="请选择产品类型">
          </el-input>
          <el-input
            v-model="searchForm.productType"
            type="hidden"
            placeholder="请选择产品类型">
          </el-input>
        </el-form-item>
        <el-form-item label="门店:">
          <el-select
            v-model="searchForm.orgId"
            filterable
            clearable
            placeholder="请选择门店">
            <el-option
              v-for="item,index in userOrgs"
              :label="item.orgNo + '-' + item.orgName"
              :value="item.orgId"
              :key="index">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="创建日期-起:">
          <el-date-picker
            v-model="searchForm.startDate"
            type="date"
            editable
            :picker-options="startDateOptions"
            @change="startDateChange"
            placeholder="开始日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="创建日期-止:">
          <el-date-picker
            v-model="searchForm.endDate"
            type="date"
            editable
            :picker-options="endDateOptions"
            @change="endDateChange"
            placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
        <el-button @click="searchHandle">查询</el-button>
        <el-button @click="addHandle">添加</el-button>
      </el-form>
    </div>
    <el-table class="content__table" :data="tableData" border>
      <el-table-column
        prop="productName"
        label="产品名称"
        min-width="60">
      </el-table-column>
      <el-table-column
        prop="typeName"
        label="产品类型"
        min-width="60">
      </el-table-column>
      <el-table-column
        prop="orgText"
        label="所属门店"
        min-width="80">
      </el-table-column>
      <el-table-column
        prop="realName"
        label="最后上传人"
        min-width="60">
      </el-table-column>
      <el-table-column
        prop="createTime"
        label="创建时间"
        min-width="100">
      </el-table-column>
      <el-table-column
        prop="updateTime"
        label="更新时间"
        min-width="100">
      </el-table-column>
      <el-table-column
        label="操作"
        width="160">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="editHandle(scope.row)">编辑</el-button>
          <el-button type="text" class="table__danger" size="small" @click="deleteHandle(scope.row.productId)">删除</el-button>
          <el-button type="text" size="small" @click="detailHandle(scope.row)">查看</a></el-button>
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
    <knowType-menu v-model="typeShow" @change="typeChange" />
    <knowBase-add v-model="addShow" @change="addChange" />
    <knowBase-Edit v-model="editShow" @change="editChange" :productData="productData"/>
  </div>
</template>

<script>
import KnowBaseAdd from '@/components/know/KnowBaseAdd'
import KnowBaseEdit from '@/components/know/KnowBaseEdit'
import knowTypeMenu from '@/components/know/knowTypeMenu'
export default {
  name: 'know-manager',
  data () {
     // 缓存查询条件
    let store = this.$getStore('knowManager')
    let userOrgs = JSON.parse(this.$localStorage('userOrgs')) || []
    return {
      tableData: [],
      productData: {},
      totalRecord: 1,
      addShow: false,
      editShow: false,
      typeShow: false,
      searchForm: {
        productName: store['productName'] || '',
        productType: '',
        startDate: store['startDate'] || '',
        endDate: store['endDate'] || '',
        orgId: store['orgId'] || ''
      },
      productMenuData: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      userOrgs, // 门店数据
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
    this.queryProductMenu()
  },
  methods: {
    // 开始时间改变处理
    startDateChange (date) {
      this.searchForm.startDate = date || ''
      this.searchForm.endDate = ''
      this.endDateOptions.disabledDate = time => {
        return time.getTime() < new Date(date).getTime() - 8.64e7
      }
    },
    // 结束时间改变处理
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
    // 类型选择弹窗监听
    typeChange (val) {
      if (val === 'search') {
        this.searchHandle()
        this.typeShow = false
      } else {
        this.typeShow = val
      }
    },
    // 编辑
    editHandle (row) {
      this.productData = row
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
    deleteHandle (productId) {
      this.$alert('您是否确定删除该产品?', '提示', {
        type: 'warning',
        customClass: 'msg-delete__dialog',
        showCancelButton: true,
        callback: action => {
          if (action === 'confirm') {
            this.$ajax({
              url: '/store/account/know/knowManager/delProductInfo',
              data: {
                productId
              },
              success: data => {
                this.$message('删除成功')
                this.searchHandle()
              }
            })
          }
        }
      })
    },
    // 查询菜单树
    queryProductMenu () {
      this.productMenuData = []
       // 缓存查询条件
      this.$ajax({
        url: '/store/account/user/comm/queryProductMenu',
        data: this.searchForm,
        success: data => {
          this.productMenuData = data.attr.proTypeData || []
        }
      })
    },
    // 查询
    searchHandle () {
      this.tableData = []
      // 缓存查询条件
      this.$setStore('knowManager', this.searchForm, ['startDate', 'endDate'])
      this.$ajax({
        url: '/store/account/know/knowManager/queryProductList',
        data: this.searchForm,
        success: data => {
          this.tableData = data.rows || []
          this.totalRecord = data.page.totalRecords
        }
      })
    },
    // 选择文件类型
    selectProduct () {
      this.typeShow = true
    },
    // 查看
    detailHandle (val) {
      this.$router.push({
        path: 'knowDetail',
        // 路由传递参数
        query: {
          fileUrl: val.fileUrl,
          productName: val.productName,
          flag: 1
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
    KnowBaseAdd,
    KnowBaseEdit,
    knowTypeMenu
  }
}
</script>

