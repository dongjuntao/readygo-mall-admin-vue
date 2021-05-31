<template>
  <el-submenu
    v-if="menu.list && menu.list.length >= 1"
    :index="menu.id + ''"
    :popper-class="'site-sidebar--' + sidebarLayoutSkin + '-popper'">
    <template slot="title">
      <icon-svg :name="menu.icon || ''" class="site-sidebar__menu-icon"></icon-svg>
      <span>{{ menu.name }}</span>
    </template>
    <sub-menu
      v-for="item in menu.list"
      :key="item.id"
      :menu="item"
      :dynamicMenuRoutes="dynamicMenuRoutes">
    </sub-menu>
  </el-submenu>
  <el-menu-item v-else :index="menu.id + ''" @click="gotoRouteHandle(menu)">
    <icon-svg :name="menu.icon || ''" class="site-sidebar__menu-icon"></icon-svg>
    <span>{{ menu.name }}</span>
  </el-menu-item>
</template>

<script>
import SubMenu from './main-sidebar-sub-menu'
export default {
  name: 'sub-menu',
  props: {
    menu: {
      type: Object,
      required: true
    },
    dynamicMenuRoutes: {
      type: Array,
      required: true
    }
  },
  components: {
    SubMenu
  },
  computed: {
    sidebarLayoutSkin: {
      get () { return this.$store.state.common.sidebarLayoutSkin }
    }
  },
  methods: {
    // 通过菜单Id与动态(菜单)路由进行匹配跳转至指定路由
    gotoRouteHandle (menu) {
      var route = this.dynamicMenuRoutes.filter(item => item.meta.menuId === menu.id)
      if (route.length >= 1) {
        this.$router.push({ name: route[0].name })
      }
    }
  }
}
</script>
