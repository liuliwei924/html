<template>
  <div class="content-box">
    <div class="header__title">加群信息配置</div>
    <div class="header__search clearfix">
      <el-form :model="searchForm">
        <el-form-item label="群类型:">
          <el-select
            v-model="searchForm.qunType"
            clearable
            placeholder="请选择类型">
            <el-option
              v-for="val,key,index in qunType"
              :label="val"
              :value="Number(key)"
              :key="index">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态:">
          <el-select
            v-model="searchForm.status"
            clearable
            placeholder="请选择状态">
            <el-option
              v-for="val,key,index in status"
              :label="val"
              :value="Number(key)"
              :key="index">
            </el-option>
          </el-select>
        </el-form-item>
        <el-button @click="searchHandle">查询</el-button>
        <el-button @click="addHandle">添加</el-button>
      </el-form>
    </div>
    <el-table class="content__table" :data="tableData" border>
      <el-table-column
        prop="configId"
        label="项目编号"
        min-width="80">
      </el-table-column>
      <el-table-column
        prop="qunName"
        label="群名称"
        min-width="80">
      </el-table-column>
      <el-table-column
        label="群类型"
        min-width="100">
        <template slot-scope="scope">{{qunType[scope.row.qunType]}}</template>
      </el-table-column>
      <el-table-column prop="qunQrCodeUrl" label="群二维码" align="center" min-width="100">
        <template slot-scope="scope">
          <img :src="scope.row.qunQrCodeUrl" class="gradeImg" v-if="scope.row.qunQrCodeUrl" @click="alertBigImg(scope.row.qunQrCodeUrl)">
        </template>
      </el-table-column>
      <el-table-column
        prop="qunUrl"
        label="群路径"
        min-width="80">
      </el-table-column>
      <el-table-column
        prop="activeCode"
        label="激活码"
        min-width="100">
      </el-table-column>
      <el-table-column
        label="状态"
        min-width="80">
        <template slot-scope="scope">{{status[scope.row.status]}}</template>
      </el-table-column>
      <el-table-column
        prop="updateBy"
        label="修改人"
        min-width="80">
      </el-table-column>
      <el-table-column
        prop="updateTime"
        label="修改时间"
        min-width="150">
      </el-table-column>
      <el-table-column
        prop="createTime"
        label="创建时间"
        min-width="150">
      </el-table-column>
      <el-table-column
        label="操作"
        min-width="120">
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
    <xjJoinQun-add v-model="addShow" @change="addChange" :status="status" :qunType="qunType"/>
    <xjJoinQun-edit v-model="editShow" :custData="custData" @change="editChange" :status="status" :qunType="qunType"/>
    <div class="alertImg-wrap" v-if="isBigImg" @click="isBigImg = false">
      <div class="content">
        <img :src="bigImgUrl" alt="" class="big-img">
      </div>
    </div>
  </div>
</template>

<script>
import XjJoinQunAdd from '@/components/xj/XjJoinQunAdd'
import XjJoinQunEdit from '@/components/xj/XjJoinQunEdit'
export default {
  name: 'xj-joinQunCfg',
  data () {
    // 缓存查询条件
    let store = this.$getStore('xjJoinQunCfg')
    return {
      tableData: [],
      totalRecord: 1,
      custData: {},
      addShow: false,
      editShow: false,
      isBigImg: false,
      bigImgUrl: '',
      searchForm: {
        status: store['status'] || '',
        changeUnit: store['qunType'] || '',
        currentPage: store['currentPage'] || 1
      },
      // 状态
      status: {
        0: '禁用',
        1: '正常'
      },
      // 类型
      qunType: {
        0: '微信群',
        1: 'QQ群',
        2: '币用群'
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
      this.custData = row
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
              url: '/store/account/xj/xjJoinQunCfg/deleteJoinQunInfo',
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
      this.$setStore('xjJoinQunCfg', this.searchForm)
      this.$ajax({
        url: '/store/account/xj/xjJoinQunCfg/queryJonQunList',
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
    XjJoinQunAdd,
    XjJoinQunEdit
  }
}
</script>

<style lang="less">
.gradeImg {
    width: 64px;
    height: 64px;
    padding: 10px 0 0 20px;
    display: block;
}
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
.input-wrapp{
  padding-left: 20px;
  margin-bottom: 10px;
  input{
    height: 30px;
    width: 200px;
  }
}
.exam-wrap{
  // overflow: hidden;
}
.exam-w{
  float: left;
  width:350px;
  border: 1px solid #dcdcdc;
  margin: 20px;
  position: relative;
  .no-info{
    position: absolute;
    width: 120px;
    top: 120px;
    right: 40px;
  }
  .tit{
    padding-left: 20px;
    color: white;
    line-height: 40px;
  }
  .color1{
    background: #5FBAD1;
  }
  .color2{
    background: #E6986E;
  }
  .color3{
    background: #CBBB92;
  }
  .info{
    overflow: hidden;
  }
  .img-w{
    padding: 10px;
    width: 130px;
    height: 130px;
    float: left;
    overflow: hidden;
    img{
      width: 100%
    }
  }
  .status{
    text-align: center;
    font-size: 20px;
    width: 200px;
    float: right;
    padding-top: 50px;
  }
  .statu0{
    color: #539cd2;
  }
  .statu1{
    color: green;
  }
  .statu2{
    color: #F53C44;
  }
  .p{
    padding-left: 20px;
    margin:10px 0;
  }
  .btn-w{
    margin: 10px 0;
    padding-left: 85px;
    button{
      border:none;
      border-radius: 0;
      color: white;
    }
  }
  .btn-l{
    background: #53BF8A;
  }
  .btn-r{
    background: #F53C44;
  }
}
.three-pic{
  overflow: hidden;
  .pic-w{
    width: 100px;
    float: left;
    margin-left: 10px;
    h3{
      text-align: center;
    }
    img{
      width: 100%;
    }
  }
}
</style>