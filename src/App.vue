<template>
  <transition name="fade">
    <router-view></router-view>
  </transition>
</template>

<script>
  export default {
  }
</script>

<style lang="scss" type="text/css">
  .el-table--border th.gutter:last-of-type {
    display: block!important; width: 17px!important;
  }
  .el-form-item__label{
    font-weight: 700;
  }
  .el-form-item {
    min-height: 20px;
  }
</style>
