<template>
  <el-tabs v-model="activeName" @tab-click="">
    <el-tab-pane label="首页导航栏" name="navbar">
      <navbar ref="Navbar" ></navbar>
    </el-tab-pane>
    <el-tab-pane label="板块管理" name="plate">
      <plate ref="Plate"></plate>
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import Navbar from './components/navbar/navbar'
import Plate from './components/plate/plate'
export default {
  name: 'homepage',
  data () {
    return {
      activeName: 'navbar'
    }
  },
  components: {
    Navbar,
    Plate
  },
}
</script>

<style scoped>

</style>
