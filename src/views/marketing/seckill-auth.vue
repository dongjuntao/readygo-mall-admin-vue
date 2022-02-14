<template>
  <el-dialog
    title="审核"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" ref="dataForm" label-width="100px">
      <el-form-item label="优惠券名称" style="font-weight: 500">
        <div>{{dataForm.name}}</div>
      </el-form-item>
      <el-form-item label="优惠券来源" v-if="userType == 0">
        <div v-if="dataForm.source==0">平台</div>
        <div v-if="dataForm.source==1">商户</div>
      </el-form-item>

      <el-form-item label="所属商户" v-if="userType == 0 && dataForm.source == 1">
        <div>{{merchantList.find(merchant=>{return dataForm.adminUserId == merchant.id}).name}}</div>
      </el-form-item>

      <el-form-item label="优惠券类型" prop="type">
        <div v-if="dataForm.type==0">满减券</div>
        <div v-if="dataForm.type==1">满折券</div>
      </el-form-item>

      <el-form-item label="使用门槛" prop="useThreshold">
        <div v-if="dataForm.useThreshold==0">无门槛</div>
        <div v-if="dataForm.useThreshold==1">有门槛</div>
      </el-form-item>

      <el-form-item label="最低消费" prop="minConsumption" v-if="dataForm.useThreshold == 1">
        <div>{{dataForm.minConsumption}}</div>
      </el-form-item>

      <el-form-item label="优惠额度" v-if="dataForm.type==0">
        <div>{{dataForm.discountAmount}}</div>
      </el-form-item>
      <el-form-item label="优惠折扣" v-if="dataForm.type==1">
        <div>{{dataForm.discountAmount}}</div>
      </el-form-item>

      <el-form-item label="使用范围" >
        <div v-if="dataForm.useScope==0">全部商品</div>
        <div v-if="dataForm.useScope==1 && (userType == 0 && dataForm.source==0)">指定分类</div>
        <div v-if="dataForm.useScope==2 && (userType != 0 || dataForm.source==1)">指定商品</div>
      </el-form-item>

      <el-form-item label="选择分类" v-if="userType==0 && dataForm.source==0 && dataForm.useScope==1">
        <div v-for="categoryId in dataForm.goodsCategoryIds">
          <div v-if="categoryList.find((category)=>{return category.id == categoryId})">
            {{categoryList.find((category)=>{return category.id == categoryId}).name}}
          </div>
        </div>
      </el-form-item>

      <el-form-item label="选择商品" prop="goodsIds" v-if="dataForm.source== 1 && dataForm.useScope == 2">
        <div v-for="goodsId in dataForm.goodsIds">
          <div v-if="goodsList.find((goods)=>{return goods.id == goodsId})">
            {{goodsList.find((goods)=>{return goods.id == goodsId}).name}}
          </div>
        </div>
      </el-form-item>

      <el-form-item label="适用会员" >
        <span v-for="applicableMember in dataForm.applicableMember">
          <span>{{applicableMember}}</span>&nbsp;
        </span>
      </el-form-item>

      <el-form-item label="发行数量" >
        <div>{{dataForm.issueNumber}}</div>
      </el-form-item>

      <el-form-item label="有效期">
        <div>{{dataForm.validPeriod[0]}} 至 {{dataForm.validPeriod[1]}}</div>
      </el-form-item>

      <el-form-item label="限领条件">
        每人限领{{dataForm.perLimit}}张
      </el-form-item>

      <el-form-item label="状态" size="mini">
        <div>{{dataForm.status == true ? '启用' : '禁用'}}</div>
      </el-form-item>

      <el-form-item label="审核意见">
        <el-input type="textarea" v-model="authOpinion" placeholder="如果拒绝，请写明拒绝理由"></el-input>
      </el-form-item>
    </el-form>

    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="authCoupon(1)">通过</el-button>
      <el-button type="danger" @click="authCoupon(2)">拒绝</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { getUserInfo } from '@/utils/auth'
import { getAdminListAll } from '@/api/mall-admin/mall-admin'
import { getSubFirst } from '@/api/mall-goods/goods-category'
import { getAllGoodsList } from '@/api/mall-goods/goods'
import { getCouponById, auth } from '@/api/mall-coupon/coupon'
export default {
  data () {
    return {
      visible: false,
      isIndeterminate: false,
      checkAll: false,
      userType: null,
      merchantList: [], //商户列表
      applicableMemberList:["普通会员","青铜会员","白银会员","黄金会员","铂金会员","钻石会员","最强买家"],
      dataForm: {
        id: 0,
        name: '', //优惠券名称
        source: 0, //优惠券来源（0：平台；1：商家）
        adminUserId: null,//所属商户id
        type: 0, //优惠券类型（0：满减券；1：满折券）
        useThreshold: 0,//使用门槛（0：无门槛，1：有门槛）
        minConsumption: 0, //有门槛时最低消费
        discountAmount: 0, //优惠额度（如果是满减券，该字段是减钱数，如果是满折券，该字段是打折数）
        useScope: 0, //使用范围（0：全部商品；1：(如果是平台优惠券，则为指定分类；如果是商家优惠券则为指定商品）
        goodsCategoryIds: null, //已选的分类
        goodsIds: [], //已选的商品
        applicableMember: [], //适用会员（普通会员，青铜会员，白银会员，黄金会员，铂金会员，钻石会员，最强买家）
        issueNumber: 0, //发行数量
        validPeriod: [], //有效期
        perLimit: 0, //每人限领多少张
        status: false //状态（false：禁用；true：启用）
      },
      categoryList:[],//商品分类列表
      goodsList: [], //商品列表
      authOpinion: "" //审核意见
    }
  },
  activated () {
    this.getUserInfo();
    this.getMerchantList();
    this.selectGoods();
    this.getGoodsCategory();
  },
  methods: {
    init (id) {
      this.dataForm.id = id || 0
      this.visible = true;
      this.$nextTick(() => {
        //由于以下字段默认初始化时时未显示状态，无法resetFields()重置，故在此重置
        this.dataForm.minConsumption=0;
        this.dataForm.discountAmount=0;
        this.dataForm.goodsCategoryIds=[];
        this.dataForm.goodsIds=[];
        this.dataForm.type=0;
        this.dataForm.useThreshold=0;
        this.dataForm.useScope=0;
        if (this.dataForm.id) {
          getCouponById(this.axios.paramsHandler({couponId: this.dataForm.id})).then(({data}) => {
            if (data && data.code === "200") {
              this.dataForm = data.data
              //处理”适用会员“
              this.dataForm.applicableMember = data.data.applicableMember.split(",")
              //处理有效期
              var validPeriod = [];
              if (data.data.validPeriod) {
                validPeriod.push(data.data.validPeriod.split(",")[0]);
                validPeriod.push(data.data.validPeriod.split(",")[1]);
                this.dataForm.validPeriod = validPeriod
              }
              //处理指定分类
              if (data.data.goodsCategoryIds) {
                this.dataForm.goodsCategoryIds = parseInt(data.data.goodsCategoryIds)
              }
              //获取该用户所有商品
              this.selectGoods()
              //处理指定商品
              if (data.data.goodsIds) {
                var goodsIds = []
                var goodsIdsArray = data.data.goodsIds.split(",");
                for (var i=0; i<goodsIdsArray.length; i++) {
                  goodsIds.push(parseInt(goodsIdsArray[i]))
                }
                this.dataForm.goodsIds = goodsIds;
              }
            }
          });
        }
      })
    },

    // 审核提交
    authCoupon (authStatus) {
      //如果拒绝，要填写审核意见，通过的话，可写可不写
      if (authStatus == 2 && !this.authOpinion) {
        this.$message({
          message: '请填写审核意见',
          type: 'success'
        })
        return;
      }
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          var params = this.axios.paramsHandler({
            couponId: this.dataForm.id || undefined,
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
      if(this.userType != 0) {
        this.dataForm.source = 1;
      }
      //如果是商户管理员，设置默认的商户管理员id,如果是平台管理员，无需设置
      if (this.userType != 0) {
        this.dataForm.adminUserId = userInfo.userId;
      }
    },

    //获取商户列表（userType=1且auditStatus=1）
    getMerchantList(){
      var params =  this.axios.paramsHandler({userType: 1, auditStatus: 1},false)
      getAdminListAll(params).then(({data}) => {
        if (data && data.code === "200") {
          this.merchantList = data.data
        }
      })
    },

    //选择商品分类
    getGoodsCategory() {
      var subFirstParams =  this.axios.paramsHandler({},false)
      getSubFirst(subFirstParams).then(({data}) => {
        if (data && data.code === "200") {
          this.categoryList = data.data
        }
      });
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
</script>
