<template>
  <div class="content-box">
    <div class="header__title">海报配置</div>
    <div class="header__search clearfix">
      <el-form :model="searchForm">
        <el-form-item label="海报名称:">
          <el-input
            v-model="searchForm.posterName"
            placeholder="请输入海报名称">
          </el-input>
        </el-form-item>
        <el-form-item label="是否启用:">
          <el-select
            v-model="searchForm.enable"
            clearable
            placeholder="请选择">
            <el-option
              v-for="val,key,index in enable"
              :label="val"
              :value="Number(key)"
              :key="index">
            </el-option>
          </el-select>
        </el-form-item>
        <el-button
          :loading="loading"
          @click="searchHandle">查询</el-button>
      </el-form>
    </div>
    <!-- 业务操作区域 -->
    <div class="header__control">
      <el-button @click="addHandle">添加海报</el-button>
    </div>
    <el-table class="content__table" :data="tableData" border>
      <el-table-column
        prop="postCode"
        label="海报编号"
        min-width="100">
      </el-table-column>
      <el-table-column
        prop="posterName"
        label="海报名称"
        min-width="120">
      </el-table-column>
      <el-table-column 
        prop="posterBgImg" 
        label="海报背景图"
        align="center"
        min-width="200">
        <template slot-scope="scope">
          <img :src="scope.row.posterBgImg" 
          class="gradeImg" 
          v-if="scope.row.posterBgImg" 
          @click="alertBigImg(scope.row.posterBgImg)">
        </template>
      </el-table-column>
      <el-table-column
        prop="qrcodeMarLeft"
        label="二维码左边距"
        min-width="120">
      </el-table-column>
      <el-table-column
        prop="qrcodeMarTop"
        label="二维码上边距"
        min-width="120">
      </el-table-column>
      <el-table-column
        prop="qrcodeSize"
        label="二维码大小"
        min-width="120">
      </el-table-column>
      <el-table-column
        prop="headImgMarLeft"
        label="头像左边距"
        min-width="120">
      </el-table-column>
      </el-table-column>
      <el-table-column
        prop="headImgMarTop"
        label="头像上边距"
        min-width="120">
      </el-table-column>
      <el-table-column
        prop="headImgSize"
        label="头像大小"
        min-width="100">
      </el-table-column>
      <el-table-column
        prop="nameMarLeft"
        label="姓名左边距"
        min-width="120">
      </el-table-column>
      <el-table-column
        prop="nameMarTop"
        label="姓名上边距"
        min-width="120">
      </el-table-column>
      <el-table-column
        prop="nameSize"
        label="姓名大小"
        min-width="100">
      </el-table-column>
      <el-table-column
        prop="enable"
        label="是否启用"
        min-width="100">
        <template slot-scope="scope">{{enable[scope.row.enable]}}</template>
      </el-table-column>
      <el-table-column
        label="字体颜色"
        prop="nameColor"
        min-width="100">
      </el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
        width="120">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="editHandle(scope.row)">编辑</el-button>
          <el-button type="text" class="table__danger" size="small" @click="deleteHandle(scope.row.configId)">删除</el-button>
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
    <wzPostConf-add v-model="addShow" @change="addChange" />
    <wzPostConf-edit v-model="editShow" :wzPostData="wzPostData" @change="editChange" />
    <div class="alertImg-wrap" v-if="isBigImg" @click="isBigImg = false">
    <div class="content">
      <img :src="bigImgUrl" alt="" class="big-img">
    </div>
  </div>
  </div>
</template>

<script>
import WzPostConfAdd from '@/components/wz/WzPostConfAdd'
import WzPostConfEdit from '@/components/wz/WzPostConfEdit'
export default {
  name: 'wzPost-conf',
  data () {
    return {
      tableData: [],
      totalRecord: 1,
      wzPostData: {},
      addShow: false,
      editShow: false,
      loading: false,
      isBigImg: false,
      bigImgUrl: '',
      searchForm: {
        posterName: '',
        currentPage: 1
      },
      // 是否启用
      enable: {
        1: '是',
        2: '否'
      }
    }
  },
  created () {
    this.searchHandle()
  },
  methods: {
    // 海报图放大处理
    alertBigImg (url) {
      this.bigImgUrl = url
      this.isBigImg = true
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
      this.wzPostData = row
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
    deleteHandle (configId) {
      this.$alert('您是否确定删除该条记录?', '提示', {
        type: 'warning',
        customClass: 'msg-delete__dialog',
        showCancelButton: true,
        callback: action => {
          if (action === 'confirm') {
            this.$ajax({
              url: '/store/account/wz/wzPostConf/deletePosterConf',
              data: {
                configId
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
    searchHandle () {
      this.tableData = []
       // 缓存查询条件
      this.$ajax({
        url: '/store/account/wz/wzPostConf/queryPosterConf',
        data: this.searchForm,
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
    WzPostConfAdd,
    WzPostConfEdit
  }
}
</script>
<style>
  .gradeImg {
    width: 64px;
    height: 64px;
    padding: 10px 0 0 50px;
    display: block;
  }
</style>
<style lang="less">
.alertImg-wrap{
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
  background: rgba(0,0,0,0.8);
  z-index: 2000;
  .content{
    width: 1000px;
    height: 600px;
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
    .big-img{
      height: 100%;
    }
  }
}
</style>
