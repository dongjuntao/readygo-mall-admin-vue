<template>
  <el-tabs v-model="activeName" @tab-click="">
    <el-tab-pane label="发货地址" name="shippingInfo">
      <shipping-info ref="ShippingInfo" ></shipping-info>
    </el-tab-pane>
    <el-tab-pane label="快递设置" name="expressSetting">
      <express-setting ref="ExpressSetting"></express-setting>
    </el-tab-pane>
    <el-tab-pane label="运费模板" name="yunfei">运费模板</el-tab-pane>
  </el-tabs>
</template>

<script>
import ShippingInfo from './components/shipping/shippingInfo'
import ExpressSetting from './components/express/expressSetting'
export default {
  name: 'myStore',
  data () {
    return {
      activeName: 'shippingInfo'
    }
  },
  components: {
    ShippingInfo,
    ExpressSetting
  },
}
</script>

<style scoped>

</style>
