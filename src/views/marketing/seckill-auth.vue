<template>
  <el-dialog
    :title="'审核'"
    :close-on-click-modal="false"
    :visible.sync="visible"
    width="85%">
    <el-form :model="dataForm" ref="dataForm"  label-width="110px">

      <el-form-item label="所属店铺" prop="adminUserId" v-if="userType == 0">
        <div>{{dataForm.merchantName}}</div>
      </el-form-item>

      <el-form-item label="商品" prop="goodsId">
        <div>{{dataForm.goodsName}}</div>
      </el-form-item>

      <el-form-item label="秒杀起始日期" prop="startAndEndDate">
        <el-date-picker
          disabled
          v-model="dataForm.startAndEndDate"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd">
        </el-date-picker>
      </el-form-item>

      <el-form-item label="秒杀时间段" prop="startAndEndTime">
        <el-select v-model="dataForm.startAndEndTime" clearable placeholder="请选择" disabled>
          <el-option value="00:00:00 - 02:00:00"></el-option>
          <el-option value="06:00:00 - 08:00:00"></el-option>
          <el-option value="08:00:00 - 10:00:00"></el-option>
          <el-option value="10:00:00 - 12:00:00"></el-option>
          <el-option value="12:00:00 - 14:00:00"></el-option>
          <el-option value="14:00:00 - 16:00:00"></el-option>
          <el-option value="16:00:00 - 18:00:00"></el-option>
          <el-option value="18:00:00 - 20:00:00"></el-option>
          <el-option value="20:00:00 - 22:00:00"></el-option>
          <el-option value="22:00:00 - 23:59:59"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="限购条件" prop="perLimit">
        每人限购
        {{dataForm.perLimit}}
        件
      </el-form-item>

      <el-form-item label="状态" size="mini" prop="status">
        <el-radio-group v-model="dataForm.status" disabled>
          <el-radio :label="false">禁用</el-radio>
          <el-radio :label="true">启用</el-radio>
        </el-radio-group>
      </el-form-item>

      <!--多规格-->
      <el-form-item  label="商品设置" prop="goodsSkuList">
        <el-table
          size="mini"
          border
          :header-cell-style="{'background-color': '#f8f8f9','color':'#515a6e'}"
          :cell-style="{'height': '50px'}"
          :data="dataForm.goodsSkuList"
          style="width: 100%;">
          <el-table-column
            header-align="center"
            align="center"
            prop="code"
            :label="specificationType == 0 ? '商品编号' : 'SKU编号'"
            width="130">
          </el-table-column>
          <el-table-column
            v-if="selectedSpecificationsAndValueList.length>0"
            v-for="(selectedSpecifications,index) in selectedSpecificationsAndValueList"
            :key="index"
            width="130"
            header-align="center"
            align="center"
            :label="selectedSpecifications.name">
            <template slot-scope="scope">
              {{ JSON.parse(scope.row.extendValue)[index].value}}
            </template>
          </el-table-column>
          <el-table-column
            header-align="center"
            align="center"
            prop="originalPrice"
            label="原价（元）"
            width="90">
          </el-table-column>
          <el-table-column
            header-align="center"
            align="center"
            label="销售价（元）"
            prop="sellingPrice"
            width="100">
          </el-table-column>
          <el-table-column
            header-align="center"
            align="center"
            prop="stock"
            label="原库存"
            width="90">
          </el-table-column>
          <el-table-column
            header-align="center"
            align="center"
            label="图片"
            width="60">
            <template slot-scope="scope">
              <img style="width: 35px; height: 35px;" v-if="scope.row.image" :src="scope.row.image" class="avatar">
            </template>
          </el-table-column>
          <el-table-column
            header-align="center"
            align="center"
            label="秒杀价">
            <template slot-scope="scope">
              <el-input disabled v-model="scope.row.seckillGoodsSkuVO.seckillPrice" controls-position="right" maxLength="10"></el-input>
            </template>
          </el-table-column>
          <el-table-column
            header-align="center"
            align="center"
            label="秒杀库存">
            <template slot-scope="scope">
              <el-input disabled v-model="scope.row.seckillGoodsSkuVO.seckillStock" controls-position="right" maxLength="10"></el-input>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>

      <el-form-item label="审核意见">
        <el-input type="textarea" v-model="authOpinion" placeholder="如果拒绝，请写明拒绝理由"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="authCoupon('AUDIT_SUCCESS')">通过</el-button>
      <el-button type="danger" @click="authCoupon('AUDIT_FAILED')">拒绝</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { getUserInfo } from '@/utils/auth'
import { getAdminListAll } from '@/api/mall-admin/mall-admin'
import { getAllGoodsList } from '@/api/mall-goods/goods'
import { getSeckillConfigById } from '@/api/mall-seckill/seckill-config'
import { auth } from "../../api/mall-seckill/seckill-config";

export default {
  data () {
    return {
      visible: false,
      userType: null,
      merchantList: [], //商户列表
      dataForm: {
        id: null,
        name: '', //秒杀商品名称
        adminUserId: null,//所属商户id
        currentUserId: null,//当前操作人的id
        goodsId: null,
        startAndEndDate: null, //秒杀起始日期
        startAndEndTime: null, //秒杀起始时间
        perLimit: 0, //每人限购多少
        status: false, //状态（false：禁用；true：启用）
        goodsSkuList: [] //秒杀商品详细信息
      },
      authOpinion: "", //审核意见
      // skuList: [], //多规格或单规格商品详细信息
      selectedSpecificationsAndValueList:[],//sku扩展属性
      specificationType: 0,
      goodsList: []//商品列表
    }
  },
  mounted () {
    this.getUserInfo();
    this.getMerchantList();
  },
  methods: {
    init (id) {
      this.dataForm.id = id || 0
      this.visible = true;
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields();//清空选择框
        //清空商品列表
        this.goodsList=[];
        if (this.dataForm.id) {
          getSeckillConfigById(this.axios.paramsHandler({seckillConfigId: this.dataForm.id})).then(({data}) => {
            if (data && data.code === "200") {
              this.dataForm = data.data
              //处理秒杀起始日期
              // this.dataForm.startAndEndDate = [ data.data.seckillStartDate, data.data.seckillEndDate ];
              this.$set(this.dataForm, 'startAndEndDate', [ data.data.seckillStartDate, data.data.seckillEndDate ])
              //处理秒杀起始时间
              // this.dataForm.startAndEndTime = [ data.data.seckillStartTime, data.data.seckillEndTime ];
              this.$set(this.dataForm, 'startAndEndTime', data.data.seckillStartTime + " - " + data.data.seckillEndTime)
              //展示商品详细信息
              this.dataForm.goodsSkuList = this.dataForm.goodsSkuList
              //商品设置展示（秒杀商品详细信息）
              this.selectGoods()
            }
          });
        }
      })
    },


    // 审核提交
    authCoupon (authStatus) {
      //如果拒绝，要填写审核意见，通过的话，可写可不写
      if (authStatus == 'AUDIT_FAILED' && !this.authOpinion) {
        this.$message({
          message: '请填写审核意见',
          type: 'warning'
        })
        return;
      }
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          var params = this.axios.paramsHandler({
            seckillConfigId: this.dataForm.id || undefined,
            authStatus: authStatus, //审核状态【1:通过 2:拒绝】
            authOpinion: this.authOpinion
          })
          auth(params).then(({data}) => {
            if (data && data.code === "200") {
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 1500,
                onClose: () => {
                  this.visible = false
                  this.$emit('refreshDataList')
                }
              })
            } else {
              this.$message.error(data.msg)
            }
          });
        }
      })
    },


    /**
     * cookie中获取当前登录的用户信息
     */
    getUserInfo() {
      var userInfo = JSON.parse(getUserInfo(sessionStorage.getItem("userNameKey")));
      this.userType = userInfo.userType;
      this.dataForm.currentUserId = userInfo.userId;
    },

    //获取商户列表（userType=1且auditStatus=1）
    getMerchantList(){
      var params =  this.axios.paramsHandler({userType: 1, authStatus: 1},false)
      getAdminListAll(params).then(({data}) => {
        if (data && data.code === "200") {
          this.merchantList = data.data
        }
      })
    },

    /**
     * 选择使用范围时，选择指定分类或指定商品
     */
    async selectGoods() {
      if (this.dataForm.adminUserId) {
        var allGoodsParams =  this.axios.paramsHandler({adminUserId:  this.dataForm.adminUserId},false)
        await getAllGoodsList(allGoodsParams).then(({data}) => {
          if (data && data.code === "200") {
            this.goodsList = data.data
          }
        })
      }
    }

  }
}

function parserDate(date) {
  var t = Date.parse(date)
  if (!isNaN(t)) {
    return new Date(Date.parse(date.replace(/-/g, '/')))
  }
}
</script>
