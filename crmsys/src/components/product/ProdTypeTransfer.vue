<template>
  <div class="card-box el-col el-col-20 clearfix">
    <el-card class="fl">
      <div slot="header" class="clearfix">
        <span>选择列表</span>
      </div>
      <div class="box-list">
        <div v-for="item,index in prodAuthData" :key="index" @click="selecHandle(item, index)" class="item">
          <span>{{index}} -- {{item.prodName}}</span>
        </div>
      </div>
    </el-card>
    <el-card class="fl box-right">
      <div slot="header" class="clearfix">
        <span>配置列表</span>
        <el-button size="small" type="primary" :disabled="!hasChange" class="top-btn" @click="savaHandle">保存</el-button>
      </div>
      <div class="box-list list-right">
        <div v-for="item,index in prodArray" :key="index" class="item">
          <span>{{index}} -- {{item.prodName}}</span>
          <el-button size="small" class="del-btn" @click="delectHandle(index)">删除</el-button>
          <el-button size="small" class="move-btn" @click="moveHandle(index)" :disabled="index===0" type="primary">上移</el-button>
        </div>
      </div>
    </el-card>
  </div>
  
</template>

<script>

export default {
  name: 'prod-type-transfer',
  props: {
    prodAuthData: Array,
    prodArray: Array
  },
  data () {
    // let prodArray = this.fillingArray(this.prodArray, this.prodAuthData)
    return {
      hasDel: false,
      hasMove: false,
      hasAdd: false,
      newProdArray: []
    }
  },
  computed: {
    hasChange: {
      set (value) {},
      get () {
        if (this.hasDel || this.hasMove || this.hasAdd) {
          this.$emit('change', true)
          return true
        } else {
          this.$emit('change', false)
          return false
        }
      }
    }
  },
  methods: {
    delectHandle (index) {
      this.hasDel = true
      this.prodArray.splice(index, 1)
    },
    selecHandle (item, index) {
      this.hasAdd = true
      this.prodArray.push(item)
    },
    moveHandle (index) {
      this.hasMove = true
      let lastItem = this.prodArray.splice(index, 1)[0]
      this.prodArray.splice(index - 1, 0, lastItem)
    },
    savaHandle () {
      this.hasDel = false
      this.hasAdd = false
      this.hasMove = false
      this.newProdArray = this.prodArray.map((item, index) => {
        return item.prodId
      })
      this.$emit('input', this.newProdArray)
    }
  }
}
</script>
