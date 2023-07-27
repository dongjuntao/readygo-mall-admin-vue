<template>
  <el-dialog
    width="60%"
    title="商品发货"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <!-- 订单商品 -->
    <div class="goods">
      <el-table border="border"
                :data="order.orderDetailList"
                :header-cell-style="{'font-size': '12px','background-color': '#f8f8f9', 'height': '40px','color':'#515a6e'}">
        <el-table-column prop="goodsName" label="商品名称"  align="center">
          <template slot-scope="scope">
            {{ scope.row.goodsName }}
          </template>
        </el-table-column>
        <el-table-column prop="goodsName" label="图片" width="70" align="center" >
          <template slot-scope="scope" style="text-align: center">
            <img style="width: 40px; height: 40px;" :src="scope.row.goodsImage"/>
          </template>
        </el-table-column>
        <el-table-column prop="subCode" label="商品编号" align="center" width="160">
          <template slot-scope="scope">
            {{ scope.row.subCode }}
          </template>
        </el-table-column>

        <el-table-column prop="subLogisticsCompany" label="物流公司" align="center" v-if="dataForm.isSplit">
          <template slot-scope="scope">
              <el-select v-model="scope.row.subLogisticsCompany" :disabled="scope.row.subStatus === 'DELIVERED'" clearable placeholder="请选择物流公司">
                <el-option
                  v-for="item in logisticsCompanyList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.name">
                </el-option>
              </el-select>
          </template>
        </el-table-column>
        <el-table-column prop="subTrackingNumber" label="物流单号" align="center" v-if="dataForm.isSplit">
          <template slot-scope="scope">
            <el-input v-model="scope.row.subTrackingNumber" :disabled="scope.row.subStatus === 'DELIVERED'" placeholder="请输入物流单号"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="状态" align="center" v-if="dataForm.isSplit" width="60">
          <template slot-scope="scope">
            <div style="color: green;" v-if="scope.row.subStatus === 'DELIVERED'">已发货</div>
            <div style="color: red;" v-else>待发货</div>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" label-width="150px" style="margin-top: 20px;">
      <el-form-item label="是否拆分订单发货" size="mini" prop="isSplit">
        <el-tooltip placement="top" effect="light" style="left: -140px; position: absolute; bottom: 8px;">
          <div slot="content">一个订单包含多种商品时，支持拆分订单，分开发货，默认一起发货</div>
          <i class="el-icon-warning"></i>
        </el-tooltip>
        <el-radio-group v-model="dataForm.isSplit" :disabled="disable">
          <el-radio :label="false">否</el-radio>
          <el-radio :label="true">是</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item v-if="!dataForm.isSplit" label="物流公司" prop="logisticsCompany">
        <el-select v-model="dataForm.logisticsCompany" clearable placeholder="请选择物流公司" style="width: 100%">
          <el-option
            v-for="item in logisticsCompanyList"
            :key="item.id"
            :label="item.name"
            :value="item.name">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item v-if="!dataForm.isSplit" label="物流单号" prop="trackingNumber">
        <el-input v-model="dataForm.trackingNumber" placeholder="请输入物流单号"></el-input>
      </el-form-item>
    </el-form>

    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确认发货</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import { getOrderAndDetailByParams, shipment } from '@/api/mall-order/order'
  import { unitPrice } from "@/utils/filters";
  import { listAll } from "@/api/mall-admin/mall-logistics-company";

  export default {
    data () {
      return {
        visible: false,
        order: { orderDetailList:[] }, // 订单详情数据
        disable: false, //是否禁用选择，如果是单个商品，则无法拆单发货
        dataForm: {
          orderId: null, //订单id
          isSplit: false, //是否拆单发货，默认否
          logisticsCompany: null, //物流公司
          trackingNumber: null //物流单号
        },
        logisticsCompanyList: [],
        adminUserId: null,
        dataRule: {
          logisticsCompany: [ { required: true, message: '请选择物流公司', trigger: 'blur' } ],
          trackingNumber: [ { required: true, message: '请输入物流单号', trigger: 'blur' } ]
        }
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
      init (code, merchantId) {
        this.adminUserId = merchantId;
        this.visible = true;
        this.$nextTick(() => {
          this.dataForm.isSplit = false;
          this.disable = true;
          this.dataForm.logisticsCompany = null
          if (code) {
            var params = this.axios.paramsHandler({
              code: code
            });
            getOrderAndDetailByParams(params).then(({data}) => {
              if (data && data.code=='200') {
                this.order = data.data;
                if (!data.data.isSplit) {
                  this.dataForm.isSplit = false;
                  this.dataForm.logisticsCompany = data.data.logisticsCompany;
                  this.dataForm.trackingNumber = data.data.trackingNumber;
                } else {
                  this.dataForm.isSplit = true;
                }
                if (!this.dataForm.isSplit && this.order.orderDetailList && this.order.orderDetailList.length>1) {
                  this.disable = false
                }
                this.getLogisticsCompanyList()
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
      },

      //物流公司列表
      getLogisticsCompanyList() {
        var params = this.axios.paramsHandler({
          adminUserId: this.adminUserId,
          enable: true
        });
        listAll(params).then(({data}) => {
          if (data && data.code=='200') {
            this.logisticsCompanyList = data.data
          }
        })
      },

      /**
       * 提交数据
       */
      dataFormSubmit() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            var all = true; //点击发货时，判断是否全部发，如果不是，做出提示
            if (this.dataForm.isSplit) { //拆单发货，需要校验，给提示信息
              var tipMsg = ''; //提示信息
              var leastOne = false; //点击发货时，至少选择一个商品
              var orderDetailList = this.order.orderDetailList;
              for (var i=0; i<orderDetailList.length; i++) {
                //已发货的过滤掉
                if (orderDetailList[i].subStatus === 'DELIVERED') {
                  continue;
                }
                if (!orderDetailList[i].subLogisticsCompany && orderDetailList[i].subTrackingNumber) {
                  tipMsg = '编号为'+"【"+orderDetailList[i].subCode+"】"+"的商品未选择物流公司"
                  break;
                } else if (orderDetailList[i].subLogisticsCompany && !orderDetailList[i].subTrackingNumber) {
                  tipMsg = '编号为'+"【"+orderDetailList[i].subCode+"】"+"的商品未填写物流单号"
                  break;
                }
                if (orderDetailList[i].subLogisticsCompany && orderDetailList[i].subTrackingNumber) {
                  leastOne = true;
                }
                if (!orderDetailList[i].subLogisticsCompany && !orderDetailList[i].subTrackingNumber) {
                  all = false;
                }
              }
              if (!tipMsg && !leastOne) {
                tipMsg = '请至少选择一件商品发货';
              }
              if (tipMsg) {
                this.$alert(tipMsg);
                return
              }
            }

            var confirmMsg = "是否确认发货?";
            if (!all) {
              confirmMsg = "存在未选择物流公司，且未填写物流单号的商品，此商品则不进行发货，请确定"
            }
            this.$confirm(confirmMsg, '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              var setData;
              if (!this.dataForm.isSplit) {
                setData = {
                  orderId: this.order.id,
                  isSplit: false,
                  logisticsCompany: this.dataForm.logisticsCompany,
                  trackingNumber: this.dataForm.trackingNumber
                }
              } else {
                var subLogisticsInfoList = [];
                for (var i=0; i<this.order.orderDetailList.length; i++) {
                  subLogisticsInfoList.push({
                    orderDetailId: this.order.orderDetailList[i].id,
                    subLogisticsCompany: this.order.orderDetailList[i].subLogisticsCompany,
                    subTrackingNumber: this.order.orderDetailList[i].subTrackingNumber
                  });
                }
                setData = {
                  orderId: this.order.id,
                  isSplit: this.dataForm.isSplit,
                  subLogisticsInfoList: subLogisticsInfoList
                }
              }
              var putData = this.axios.dataHandler(setData, false);
              shipment(putData).then(({data}) => {
                if (data && data.code === "200") {
                  this.$message({
                    message: '操作成功',
                    type: 'success',
                    duration: 1000,
                    onClose: () => {
                      this.visible = false; //关闭上一层弹出框
                      this.$parent.getDataList();
                    }
                  })
                } else {
                  this.$message.error(data.message)
                }
              })
            }).catch(() => {})
          }
        })
      }
    }
  }
</script>
<style lang="scss" scoped>
.mb_5{
  margin-bottom: 5px;
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
  }
}

</style>
