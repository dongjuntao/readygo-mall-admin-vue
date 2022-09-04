<template>
  <el-dialog
    title="订单详情"
    :close-on-click-modal="false"
    :visible.sync="visible">
<!--    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">-->
<!--      <el-form-item label="用户名" prop="userName">-->
<!--        <el-input v-model="dataForm.userName" placeholder="登录帐号"></el-input>-->
<!--      </el-form-item>-->
<!--      <el-form-item label="姓名" prop="name">-->
<!--        <el-input v-model="dataForm.name" placeholder="姓名"></el-input>-->
<!--      </el-form-item>-->
<!--      <el-form-item label="昵称" prop="nickName">-->
<!--        <el-input v-model="dataForm.nickName" placeholder="昵称"></el-input>-->
<!--      </el-form-item>-->
<!--      <el-form-item label="密码" prop="password" :class="{ 'is-required': !dataForm.id }">-->
<!--        <el-input v-model="dataForm.password" type="password" placeholder="密码"></el-input>-->
<!--      </el-form-item>-->
<!--      <el-form-item label="确认密码" prop="confirmPassword" :class="{ 'is-required': !dataForm.id }">-->
<!--        <el-input v-model="dataForm.confirmPassword" type="password" placeholder="确认密码"></el-input>-->
<!--      </el-form-item>-->
<!--      <el-form-item label="手机号" prop="mobile">-->
<!--        <el-input v-model="dataForm.mobile" placeholder="手机号"></el-input>-->
<!--      </el-form-item>-->
<!--    </el-form>-->
    <div class="order-card">
      <h3>收货人信息</h3>
      <p>收货人：{{order.recipientName}}</p>
      <p>手机号码：{{order.recipientMobile}}</p>
      <p>收货地址：{{ order.regionNames }} {{order.recipientDetailAddress }}</p>
    </div>
    <div class="order-card">
      <h3>付款信息</h3>
      <p>支付方式：{{order.payType == 0 ? '支付宝' : '微信'}}</p>
      <p>付款状态：{{'已付款'}}</p>
    </div>

    <!-- 订单商品 -->
    <div class="goods">
      <div class="shop-name">
        <span @click="shopPage(order.merchantId)">{{ order.merchantName }}</span>
      </div>
      <table>
        <thead>
        <tr>
          <th width="40%">商品</th>
          <th width="20%">货号</th>
          <th width="10%">单价</th>
          <th width="10%">数量</th>
          <th width="10%">小计</th>
          <th width="10%">操作</th>
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
          <td>{{ goods.id }}</td>
          <td>{{ goods.goodsSellingPrice | unitPrice('￥') }}</td>
          <td>{{ goods.goodsCount }}</td>
          <td>{{ (goods.goodsSellingPrice * goods.goodsCount) | unitPrice('￥') }}</td>
          <td>
            <!--              <Button v-if="goods.afterSaleStatus.includes('NOT_APPLIED') || goods.afterSaleStatus.includes('PART_AFTER_SALE')" @click="applyAfterSale(goods.sn)" type="info" size="small" class="mb_5">申请售后</Button>-->
            <!--              <Button v-if="goods.commentStatus == 'UNFINISHED'" @click="comment(order.order.sn, goodsIndex)" size="small" type="success" class="fontsize_12 mb_5" >评价</Button>-->
            <!--              <Button v-if="goods.complainStatus == 'NO_APPLY'" @click="complain(order.order.sn, goodsIndex)" type="warning" class="fontsize_12" size="small">投诉</Button>-->
          </td>
        </tr>
        </tbody>
      </table>
      <!-- 订单价格 -->
      <div class="order-price">
        <div>
          <span>商品件数：</span><span>{{ order.orderDetailList.length }}件</span>
        </div>
        <div>
          <span>商品总价：</span><span>{{ order.finalPrice | unitPrice("￥") }}</span><br>
        </div>
        <div>
          <span>运费：</span><span>+{{ order.freight | unitPrice("￥") }}</span><br>
        </div>
        <!--        <div v-if="order.order.priceDetailDTO.couponPrice"><span>优惠券：</span><span>-{{ order.order.priceDetailDTO.couponPrice || 0 | unitPrice("￥") }}</span></div>-->
        <!--        <div v-if="order.order.discountPrice"><span>活动优惠：</span><span>-{{ order.order.discountPrice | unitPrice("￥") }}</span></div>-->
        <div>
          <span>应付金额：</span>
          <span class="actrual-price">{{ order.finalPrice | unitPrice("￥") }}</span>
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
        order: {}, // 订单详情数据
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
                console.log("data==",data)
                this.order = data.data;
              }
            })
          }
        });
      }

    }
  }
</script>
<style lang="scss" scoped>
.mb_5{
  margin-bottom: 5px;
}
.order-card {
  padding: 10px;
  padding-bottom: 10px;
  margin-bottom: 10px;
  border-bottom: 1px solid #e8eaec;
  position: relative;
  .global_color {
    color: #FF5C58FF;
  }
  p {
    color: #999;
    margin: 3px;
    margin-left: 5px;
  }
  h3 {
    font-weight: normal;
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
    text-align: center;
    &:first-child {
      text-align: left;
      display: flex;
      img {
        width: 70px;
        height: 70px;
        margin-right: 10px;
        margin-left: 10px;
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
  font-size: 16px;
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
    font-size: 20px;
  }
}
.verificationCode {
  font-size: 20px;
  margin-bottom: 20px;
  color: rgb(65, 63, 63);
  font-weight: bold;
  text-align: center;
  span{
    color: #FF5C58FF;
  }
}
/** 订单进度条 */
.progress {
  margin: 15px 0;
}
</style>
