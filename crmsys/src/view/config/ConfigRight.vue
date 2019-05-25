<template>
  <div class="content-box">
    <div class="header__title">权限设置</div>
    <div class="right-box">
      <div class="checkbox-group">
        <div class="right-main" v-for="item,index in rightList" :key="index">
          <div class="right__cell right-left">
            <el-checkbox :label="item.menuName" v-model="item.havMenu" @change="checkChange(index)"></el-checkbox>
          </div>
          <div class="right__cell right-right">
            <template v-for="subItem,subIndex in item.subMenus">
              <div class="right-head">
                <el-checkbox :label="subItem.menuName" v-model="subItem.havMenu" @change="checkChange(index,subIndex)"></el-checkbox>
              </div>
              <div class="right-subHead clearfix">
                <div class="right-body fl" v-for="childItem,childIndex in subItem.subMenus" :key="childIndex">
                  <el-checkbox :label="childItem.menuName" v-model="childItem.havMenu" @change="checkChange(index,subIndex,childIndex)"></el-checkbox>
                  <el-checkbox label="查询" v-model="childItem.havQuery" @change="checkChange(index,subIndex,childIndex,0)"></el-checkbox>
                  <el-checkbox label="审核" v-model="childItem.havCheck" @change="checkChange(index,subIndex,childIndex,1)"></el-checkbox>
                  <el-checkbox label="修改" v-model="childItem.havModify" @change="checkChange(index,subIndex,childIndex,2)"></el-checkbox>
                </div>
              </div>
            </template>
          </div>
        </div>
      </div>
      <div class="ctrl-row">
        <el-button class="cancal__btn">取消</el-button>
        <el-button class="confirm__btn" @click="storeHandle">保存</el-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'right',
  data () {
    let roleId = this.$route.query.roleId || ''
    return {
      roleId,
      rightList: []
    }
  },
  created () {
    this.getRight()
  },
  methods: {
    // 获取权限信息
    getRight () {
      this.$ajax({
        url: '/store/account/config/role/queryMemuList',
        data: {
          roleId: this.$route.query.roleId
        },
        success: data => {
          let rightList = data.rows || []
          rightList.map(item => {
            item['havMenu'] = !!item['havMenu']
            item['subMenus'] = item['subMenus'] || []
            item['subMenus'].map(subItem => {
              subItem['havMenu'] = !!subItem['havMenu']
              subItem['subMenus'].map(childItem => {
                childItem['havMenu'] = !!childItem['havMenu']
                childItem['havQuery'] = !!childItem['havQuery']
                childItem['havCheck'] = !!childItem['havCheck']
                childItem['havModify'] = !!childItem['havModify']
              })
            })
          })
          this.rightList = rightList
        }
      })
    },
    // 勾选处理
    checkChange (index, subIndex, childIndex, finalIndex) {
      if (finalIndex === undefined) {
        if (childIndex === undefined) {
          if (subIndex === undefined) {
            this.downCheck(index)
          } else {
            this.downCheck(index, subIndex)
            this.upCheck(index, subIndex)
          }
        } else {
          this.downCheck(index, subIndex, childIndex)
          this.upCheck(index, subIndex, childIndex)
        }
      } else {
        this.upCheck(index, subIndex, childIndex, finalIndex)
      }
    },
    // 向下递归
    downCheck (index, subIndex, childIndex) {
      if (childIndex === undefined) {
        if (subIndex === undefined) {
          let subMenus = this.rightList[index]
          subMenus['subMenus'].map((item, sIndex) => {
            item['havMenu'] = subMenus['havMenu']
            this.downCheck(index, sIndex)
          })
        } else {
          let subMenus = this.rightList[index]['subMenus'][subIndex]
          subMenus['subMenus'].map((item, cIndex) => {
            item['havMenu'] = subMenus['havMenu']
            this.downCheck(index, subIndex, cIndex)
          })
        }
      } else {
        let subMenus = this.rightList[index]['subMenus'][subIndex]['subMenus'][childIndex]
        subMenus['havQuery'] = subMenus['havMenu']
        subMenus['havCheck'] = subMenus['havMenu']
        subMenus['havModify'] = subMenus['havMenu']
      }
    },
    // 向上递归
    upCheck (index, subIndex, childIndex, finalIndex) {
      if (finalIndex === undefined) {
        if (childIndex === undefined) {
          let [checkLen, subMenus] = [0, this.rightList[index]]
          subMenus['subMenus'].map(item => {
            if (item.havMenu) checkLen++
          })
          if (checkLen === 0) subMenus['havMenu'] = false
          else subMenus['havMenu'] = true
        } else {
          let [checkLen, subMenus] = [0, this.rightList[index]['subMenus'][subIndex]]
          subMenus['subMenus'].map(item => {
            if (item.havMenu) checkLen++
          })
          if (checkLen === 0) subMenus['havMenu'] = false
          else subMenus['havMenu'] = true
          this.upCheck(index, subIndex)
        }
      } else {
        let subMenus = this.rightList[index]['subMenus'][subIndex]['subMenus'][childIndex]
        if (!subMenus['havQuery'] && !subMenus['havCheck'] && !subMenus['havModify']) subMenus['havMenu'] = false
        else subMenus['havMenu'] = true
        this.upCheck(index, subIndex, childIndex)
      }
    },
    // 保存
    storeHandle () {
      let checkList = []
      this.rightList.map(item => {
        if (item.havMenu) checkList.push(item.menuId)
        item['subMenus'].map(subItem => {
          if (subItem.havMenu) checkList.push(subItem.menuId)
          subItem['subMenus'].map(childItem => {
            if (childItem.havMenu) checkList.push(childItem.menuId)
            if (childItem['havQuery']) checkList.push(`${childItem.menuId}-1`)
            if (childItem['havCheck']) checkList.push(`${childItem.menuId}-2`)
            if (childItem['havModify']) checkList.push(`${childItem.menuId}-3`)
          })
        })
      })
      let menuIds = checkList.join(',')
      this.$ajax({
        url: '/store/account/config/role/authRoleMemus',
        data: {
          roleId: this.roleId,
          menuIds
        },
        success: data => {
          this.$rmLocalStorage('menus')
          this.$rmLocalStorage('checkMenus')
          let attr = data.attr
          let menus = attr['menus'] || [] // 用户菜单
          let checkMenus = attr['checkMenus'] || [] // 用户审核权限
          window.localStorage.setItem('menus', JSON.stringify(menus))
          window.localStorage.setItem('checkMenus', JSON.stringify(checkMenus))
          this.$router.back()
        }
      })
    }
  }
}
</script>
