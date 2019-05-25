<template>
  <div>
    <div class="record-content">
      <el-button class="record-edit-btn" :applyId="applyId" :customerId="customerId" @click="addComplaintRecord" style="width: 120px;">添加投诉记录</el-button>
      <!-- 查看 -->
      <div class="el-form__view">
        <el-table
          class="content__table"
          :data="complaintRecord"
          border>
           <el-table-column
            prop="recordId"
            label="投诉编号"
            min-width="110">
          </el-table-column>
          <el-table-column
            prop="custName"
            label="客户称呼"
            min-width="110">
          </el-table-column>
          <el-table-column
            prop="custTelephone"
            label="客户手机号"
            min-width="140">
          </el-table-column>
          <el-table-column
            label="类型"
            min-width="110">
             <template slot-scope="scope">{{type[scope.row.type]}}</template>
          </el-table-column>
          <el-table-column
            prop="busiName"
            label="业务经理"
            min-width="110">
          </el-table-column>
          <el-table-column
            prop="busiTelephone"
            label="经理手机号"
            min-width="130">
          </el-table-column>
          <el-table-column
            prop="detailDesc"
            label="客服处理人"
            min-width="110">
          </el-table-column>
          <el-table-column
            label="处理状态"
            min-width="110">
            <template slot-scope="scope">{{status[scope.row.status]}}</template>
          </el-table-column>
          <el-table-column
            label="投诉等级"
            min-width="110">
            <template slot-scope="scope">{{complaintGrade[scope.row.complaintGrade]}}</template>
          </el-table-column>
          <el-table-column
            prop="serviceName"
            label="客服处理人"
            min-width="110">
          </el-table-column>
          <el-table-column
            prop="serviceDesc"
            label="客服描述"
            min-width="110">
          </el-table-column>
          <el-table-column
          fixed="right"
          label="操作"
          width="130">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="complaintHandle(scope.row)">投诉处理</el-button>
          </template>
        </el-table-column>
        </el-table>
      </div>
    </div>
    <complaint-deal 
    v-model="isShow" 
    :applyId="applyId" 
    :customerId="customerId" 
    @change="complaintChange"/>
    <complaint-handle 
    v-model="handelShow" 
    :complaintInfo="complaintInfo" 
    :applyId="applyId" 
    :customerId="customerId"
    :type="type"
    :status="status"
    :complaintGrade="complaintGrade"
    @change="complaintHandleChange"/>
  </div>
</template>

<script>
import ComplaintDeal from '@/components/work/ComplaintDeal'
import ComplaintHandle from '@/components/work/complaintHandle'
// 预约子组件
export default {
  name: 'complaint-view',
  props: {
    complaintRecord: Array,
    customerId: [Number, String],
    applyId: [Number, String]
  },
  data () {
    return {
      isShow: false,
      handelShow: false,
      type: {
        1: '建议',
        2: '投诉'
      },
      status: {
        0: '待处理',
        1: '处理中',
        2: '处理完成',
        3: '无法处理'
      },
      complaintGrade: {
        1: '非投诉',
        2: '一般投诉',
        3: '严重投诉',
        4: '不合理投诉'
      },
      complaintInfo: {}
    }
  },
  methods: {
    addComplaintRecord () {
      this.isShow = true
    },
    complaintChange (value) {
      if (value === 'search') {
        this.isShow = false
        this.$emit('change', 'search')
      } else {
        this.isShow = value
      }
    },
    // 处理投诉
    complaintHandle (row) {
      this.complaintInfo = row
      this.handelShow = true
    },
    // 处理投诉组件监听
    complaintHandleChange (value) {
      if (value === 'search') {
        this.handelShow = false
        this.$emit('change', 'search')
      } else {
        this.handelShow = value
      }
    }
  },
  components: {
    ComplaintDeal,
    ComplaintHandle
  }
}
</script>
