<template>
  <div>
    <el-table
      :border="columns.multistage"
      :data="tableData"
      @selection-change="selectionChange"
      @row-click="rowClick"
      @sort-change="sortChange"
      class="content__table"
      style="width: 100%">
      <template v-for="(column, index) in columns.rows">
        <!-- 类型状态 -->
        <el-table-column v-if="column.type === 'flag'"
          :key = index
          :label="column.label"
          :prop="column.prop"
          :width="column.width"
          :min-width="column.minWidth">
          <template slot-scope="scope">
            {{ column.prop ? column.flags[scope.row[column.prop]] : column.flags[scope.row.allotFlag] }}
          </template>
        </el-table-column>
        <!-- tag1类型状态 -->
        <el-table-column v-else-if="column.type === 'tag1'"
          :key = index
          :label="column.label"
          :prop="column.prop"
          :width="column.width"
          :min-width="column.minWidth">
          <template slot-scope="scope">
            <el-tag v-if="scope.row[column.prop] === 1" type="success">
              {{ column.tags[scope.row[column.prop]] }}
            </el-tag>
            <el-tag v-else>
              {{ column.tags[scope.row[column.prop]] }}
            </el-tag>
          </template>
        </el-table-column>
        <!-- tag2类型状态 -->
        <el-table-column v-else-if="column.type === 'tag2'"
          :key = index
          :label="column.label"
          :prop="column.prop"
          :width="column.width"
          :min-width="column.minWidth">
          <template slot-scope="scope">
            <el-tag v-if="scope.row[column.prop] === 0" type="primary">
              {{ column.tags[scope.row[column.prop] + 1] }}
            </el-tag>
            <el-tag v-else-if="scope.row[column.prop] === 1" type="success">
              {{ column.tags[scope.row[column.prop] + 1]}}
            </el-tag>
            <el-tag v-else-if="scope.row[column.prop] === 2" type="danger">
              {{ column.tags[scope.row[column.prop] + 1] }}
            </el-tag>
            <el-tag v-else>
              {{ column.tags[scope.row[column.prop] + 1] }}
            </el-tag>
          </template>
        </el-table-column>
        <!-- 需要显示图片 -->
        <el-table-column v-else-if="column.type === 'img'"
          :key = index
          :label="column.label"
          :prop="column.prop"
          :width="column.width"
          :min-width="column.minWidth">
            <template slot-scope="scope">
              <img v-if="scope.row[column.prop]" :src="scope.row[column.prop]" style="width:64px;height:64px;">
              <span v-else></span>
            </template>
        </el-table-column>
        <!-- selection -->
        <el-table-column v-else-if="column.type === 'selection'"
          :key = index
          type="selection"
          :width="column.width"
          :min-width="column.minWidth">
        </el-table-column>
        <!-- checkbox -->
        <el-table-column v-else-if="column.type === 'checkbox'"
          :key = index
          :width="column.width"
          :min-width="column.minWidth">
          <template slot-scope="scope">
            <el-checkbox v-for="(checkbox, index) in column.checkboxs"
              :key="index"
              @change="checkbox.func(scope.row, $event)">
              </el-checkbox>
          </template>
        </el-table-column>
        <!-- 操作按钮 -->
        <el-table-column v-else-if="column.type === 'handle'"
          fixed="right"
          :key = index
          :label="column.label"
          :width="column.width"
          :min-width="column.minWidth">
          <template slot-scope="scope">
            <el-button v-for="(operate, index) in column.operations" v-if="operate.disabled"
              :key = index
              @click="operate.params ? operate.func(scope.row[operate.params[0]], scope.row[operate.params[1]]) : operate.func(scope.row)"
              type="text"
              :style="{ color: operate.color ? operate.color : '' }"
              size="small">
              {{ operate.label }}
              </el-button>
          </template>
        </el-table-column>
        <!-- 多级表头 -->
        <el-table-column v-else-if="columns.multistage"
          align="center"
          :key = index
          :label="column.label">
          <template v-for="(tr, i) in column.rows">
            <el-table-column
              :key = i
              :label="tr.label"
              :width="tr.width"
              :min-width="tr.minWidth"
              :prop="tr.prop">
            </el-table-column>
          </template>
        </el-table-column>
        <!-- 单级表头 -->
        <el-table-column v-else
            :key = index
            :label="column.label"
            :width="column.width"
            :sortable="column.sortable"
            :min-width="column.minWidth"
            :prop="column.prop">
          </el-table-column>
      </template>
    </el-table>
    <!-- 分页 -->
    <div class="xxjr-page" v-if="currentPage">
      <div class="xxjr-fr">
        <el-pagination
          @current-change="currentChange"
          :current-page="currentPage"
          layout="total, prev, pager, next"
          :page-size="pageSize"
          :total="totalRecords">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
export default{
  name: 'table-list',
  props: {
    currentPage: Number,
    totalRecords: Number,
    pageSize: Number,
    data: {
      type: Array
    },
    columns: Object
  },
  computed: {
    tableData () {
      return this.data
    }
  },
  methods: {
    currentChange (page) {
      this.$emit('currentChange', page)
    },
    selectionChange (val) {
      this.$emit('selection-change', val)
    },
    rowClick (row, event, column) {
      this.$emit('row-click', row, event, column)
    },
    sortChange (column) {
      this.$emit('sort-change', column)
    }
  }
}
</script>
