<template>
  <el-dialog
    width="60%"
    title="订单详情"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <div class="order-card">
      <h3>订单信息</h3>
      <p style="float: right; position: absolute; margin-left: 70%;"><span>下单时间</span>：{{order.createTime | formatDateTime}}</p>
      <p><span>订单号</span>：{{order.code}}</p>
      <p style="float: right; position: absolute; margin-left: 70%;"><span>支付方式</span>：{{order.payType ==='ALIPAY' ? '支付宝' : '微信'}}</p>
      <p><span>订单状态</span>：{{parseStatus(order.status)}}</p>
    </div>
    <div class="order-card">
      <h3>收货人信息</h3>
      <p style="float: right; position: absolute; margin-left: 70%;"><span>手机号码</span>：{{order.recipientMobile}}</p>
      <p><span>收货人</span>：{{order.recipientName}}</p>
      <p><span>收货地址</span>：{{ order.regionNames }} {{order.recipientDetailAddress }}</p>
    </div>
    <!-- 订单商品 -->
    <div class="goods">
      <div class="shop-name">
       {{ order.merchantName }}
      </div>
      <table>
        <thead>
        <tr>
          <th width="40%">商品</th>
          <th width="25%">商品编号</th>
          <th width="12%">单价</th>
          <th width="8%">数量</th>
          <th width="15%">小计</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(goods, goodsIndex) in order.orderDetailList" :key="goodsIndex">
          <td>
            <img @click="goodsDetail(goods.goodsSkuId, goods.goodsId)" :src="goods.goodsImage" alt="" />
            <div>
              <p @click="goodsDetail(goods.goodsSkuId, goods.goodsId)" class="hover-color">
                {{ goods.goodsName }}
              </p>
            </div>
          </td>
          <td>{{ goods.subCode }}</td>
          <td>{{ goods.goodsSellingPrice | formatPrice(goods.goodsSellingPrice)}}</td>
          <td>{{ goods.goodsCount }}</td>
          <td>{{ (goods.goodsSellingPrice * goods.goodsCount) | formatPrice(goods.goodsSellingPrice * goods.goodsCount)}}</td>
        </tr>
        </tbody>
      </table>
      <!-- 订单价格 -->
      <div class="order-price">
        <div>
          <span>商品件数：</span><span>{{ order.orderDetailList.length }}件</span>
        </div>
        <div>
          <span>商品总价：</span><span>{{ order.finalPrice | formatPrice(order.finalPrice) }}</span><br>
        </div>
        <div>
          <span>运费：</span><span>+{{ order.freight | formatPrice(order.freight) }}</span><br>
        </div>
        <!--        <div v-if="order.order.priceDetailDTO.couponPrice"><span>优惠券：</span><span>-{{ order.order.priceDetailDTO.couponPrice || 0 | unitPrice("￥") }}</span></div>-->
        <!--        <div v-if="order.order.discountPrice"><span>活动优惠：</span><span>-{{ order.order.discountPrice | unitPrice("￥") }}</span></div>-->
        <div>
          <span>应付金额：</span>
          <span class="actrual-price">{{ order.finalPrice | formatPrice(order.finalPrice)}}</span>
        </div>
      </div>
    </div>

    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import { isMobile } from '@/utils/validate'
  import { getOrderAndDetailByParams } from '@/api/mall-order/order'
  import { unitPrice } from "@/utils/filters";

  export default {
    data () {
      var validateMobile = (rule, value, callback) => {
        if (!isMobile(value)) {
          callback(new Error('手机号格式错误'))
        } else {
          callback()
        }
      }
      return {
        visible: false,
        order: {orderDetailList:[]}, // 订单详情数据
        progressList: [], // 订单流程
        logistics: "", // 物流数据
        cancelParams: { // 取消售后参数
          orderSn: '',
          reason: ''
        },
        cancelAvail: false, // 取消订单modal控制
        cancelReason: [] // 取消订单原因
      }
    },
    filters:{
      /**
       * 金额格式转换
       * @param price
       * @returns {*}
       */
      formatPrice(price) {
        return unitPrice(price);
      }
    },
    methods: {
      init (code) {
        this.visible = true;
        this.$nextTick(() => {
          if (code) {
            var params = this.axios.paramsHandler({
              code: code
            });
            getOrderAndDetailByParams(params).then(({data}) => {
              if (data && data.code=='200') {
                this.order = data.data;
              }
            })
          }
        });
      },

      //订单状态转换
      parseStatus(status) {
        if (!status) {
          return null;
        }
        if (status == 'UNPAID') {
          return "待付款";
        } else if (status == 'UNDELIVERED') {
          return "待发货";
        } else if (status == 'DELIVERED') {
          return "已发货";
        } else if (status == 'FINISHED') {
          return "已完成";
        }else if (status == 'CANCELLED') {
          return "已取消";
        }
      }

    }
  }
</script>
<style lang="scss" scoped>
.mb_5{
  margin-bottom: 5px;
}
.order-card {
  top: -30px;
  line-height: 18px;
  padding-bottom: 10px;
  margin-bottom: 10px;
  border-bottom: 1px solid #e8eaec;
  position: relative;
  .global_color {
    color: #FF5C58FF;
  }
  p {
    color: #474444;
    margin: 3px 3px 3px 5px;
    span {
      font-weight: bolder
    }
  }
  h3 {
    font-size: 16px;
  }
  .operation-time {
    position: absolute;
    right: 20px;
    top: 20px;
  }
}
/** 店铺名称 */
.shop-name {
  font-weight: bolder;
  margin: 15px 0;
  span {
    color: #438cde;
    cursor: pointer;
    &:hover {
      color: #FF5C58FF;
    }
  }
  .ivu-icon {
    color: #ff8f23;
    cursor: pointer;
    &:hover {
      color: #FF5C58FF;
    }
  }
}
/** 商品列表 */
table {
  border: 1px solid #ddd;
  color: #999;
  border-collapse: collapse;
  width: 100%;
  tr {
    border-top: 1px solid #ddd;
  }
  thead > tr {
    height: 40px;
    background: #eee;
  }
  td {
    padding: 5px;
    font-size: 13px;
    text-align: center;
    &:first-child {
      text-align: left;
      display: flex;
      img {
        width: 40px;
        height: 40px;
        margin-right: 10px;
        margin-left: 10px;
        margin-top: 8px;
        cursor: pointer;
      }
    }
    &:last-child {
      color: #FF5C58FF;
    }
  }
}
/** 订单价格 */
.order-price {
  text-align: right;
  margin-top: 30px;
  font-size: 15px;
  color: #999;
  > div > span:nth-child(2) {
    width: 130px;
    text-align: right;
    display: inline-block;
    margin-top: 10px;
  }
  .actrual-price {
    color: #FF5C58FF;
    font-weight: bold;
    font-size: 18px;
  }
}
.verificationCode {
  font-size: 18px;
  margin-bottom: 20px;
  color: rgb(65, 63, 63);
  font-weight: bold;
  text-align: center;
  span{
    color: #FF5C58FF;
  }
}

.goods {
  margin-top: -25px;
}

</style>
