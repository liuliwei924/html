<template>
  <div class="content-box">
    <div class="header__title">能力值项配置</div>
    <div class="header__search clearfix">
      <el-form :model="form">
        <el-form-item label="能力值项">
          <el-input v-model="form.itemType" placeholder="请输入能力值项"></el-input>
        </el-form-item>
        <!-- <el-form-item label="能力值一手奖惩值">
          <el-input v-model="form.rewardFirstVal" placeholder="请输入能力值一手奖惩值"></el-input>
        </el-form-item>
        <el-form-item label="能力值再分配奖惩值">
          <el-input v-model="form.rewardNextVal" placeholder="请输入能力值再分配奖惩值"></el-input>
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="form.detailDesc" placeholder="请输入描述"></el-input>
        </el-form-item> -->
        <el-form-item label="是否禁用">
          <el-select v-model="form.enable" clearable placeholder="是否禁用">
            <el-option label="禁用" value="0"></el-option>
            <el-option label="启动" value="1"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <el-button @click="addHandle">添加</el-button>
      <el-button :loading="loading" @click="searchHandle">查询</el-button>
    </div>
    <el-table class="content__table" :data="tableData" border>
      <el-table-column
        prop="itemType"
        label="能力值项"
        min-width="120">
      </el-table-column>
      <el-table-column
        label="能力值一手奖惩值"
        min-width="150"
        prop="rewardFirstVal">
      </el-table-column>
      <el-table-column
        prop="rewardNextVal"
        label="能力值再分配奖惩值"
        min-width="150">
      </el-table-column>
      <el-table-column
        prop="detailDesc"
        label="描述"
        min-width="220">
      </el-table-column>
      <el-table-column
        label="是否启用"
        min-width="110"
        prop="enable">
        <template slot-scope="scope">
          <span v-if="scope.row.enable === 0" type="primary">禁用</span>
          <span v-if="scope.row.enable === 1" type="danger">启用</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="params"
        label="参数"
        min-width="120">
      </el-table-column>
      <el-table-column
        prop="createTime"
        label="创建时间"
        min-width="220">
      </el-table-column>
      <el-table-column
        prop="updateTime"
        label="修改时间"
        min-width="220">
      </el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
        min-width="120">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="editHandle(scope.row)">编辑</el-button>
          <el-button type="text" size="small" @click="deletHandle(scope.row.itemType)">删除</el-button>
        </template> 
      </el-table-column>
    </el-table>
    <el-pagination
      class="content__page fr"
      @current-change="pageHandle"
      :current-page="form.currentPage"
      layout="total, prev, pager, next"
      :total="totalRecord">
    </el-pagination>
    <ability-item-add v-model="addShow" @change="addChange"></ability-item-add>
    <ability-item-edit v-model="editShow" @change="editChange" :abilltyData="abilltyData"></ability-item-edit>
  </div>
</template>

<script>
import AbilityItemAdd from '@/components/config/AbilityItemAdd'
import AbilityItemEdit from '@/components/config/AbilityItemEdit'
export default {
  name: 'ability-item',
  data () {
    return {
      form: {
        itemType: '',
        rewardFirstVal: '',
        rewardNextVal: '',
        detailDesc: '',
        enable: '',
        params: '',
        currentPage: 1
      },
      tableData: [],
      totalRecord: 1,
      abilltyData: {},
      addShow: false,
      editShow: false,
      loading: false
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
    // 编辑
    editHandle (row) {
      this.abilltyData = row
      this.editShow = true
    },
    // 删除
    deletHandle (itemType) {
      this.$confirm('此操作将删除该条信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$ajax({
          url: '/store/account/config/abilityItem/deleteAbilityItem',
          data: {itemType},
          success: data => {
            this.searchHandle()
          }
        })
      }).catch(() => {
      })
    },
    // 查询
    searchHandle () {
      this.tableData = []
      this.$ajax({
        url: '/store/account/config/abilityItem/queryAbilityItemInfo',
        data: this.form,
        success: data => {
          this.tableData = data.rows || []
          this.totalRecord = data.page.totalRecords
        }
      })
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
    // 添加弹窗监听
    addChange (val) {
      if (val === 'search') {
        this.searchHandle()
        this.addShow = false
      } else {
        this.addShow = val
      }
    },
    pageHandle (page) {
      this.form.currentPage = page
      this.searchHandle()
    }
  },
  components: {
    AbilityItemAdd,
    AbilityItemEdit
  }
}
</script>
