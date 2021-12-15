<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="100px">
      <el-form-item label="优惠券名称" prop="name">
        <el-input v-model="dataForm.name" placeholder="优惠券名称"></el-input>
      </el-form-item>
      <el-form-item label="优惠券来源" prop="source" v-if="userType == 0">
        <el-radio-group v-model="dataForm.source" @change="changeSource">
          <el-radio :label="0">平台</el-radio>
          <el-radio :label="1">商户</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="所属商户" prop="adminUserId" v-if="userType == 0 && dataForm.source == 1">
        <el-select v-model="dataForm.adminUserId" clearable placeholder="请选择所属商户" @change="changeAdminUserId">
          <el-option
            v-for="item in merchantList"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="优惠券类型" prop="type">
        <el-radio-group v-model="dataForm.type">
          <el-radio :label="0">满减券</el-radio>
          <el-radio :label="1">满折券</el-radio>
        </el-radio-group>
      </el-form-item>


      <el-form-item label="使用门槛" prop="useThreshold">
        <el-radio-group v-model="dataForm.useThreshold">
          <el-radio :label="0">无门槛</el-radio>
          <el-radio :label="1">有门槛</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="最低消费" prop="minConsumption" v-if="dataForm.useThreshold == 1">
        <el-input-number v-model="dataForm.minConsumption" controls-position="right" size="small" :min="1" :max="999999"></el-input-number>
        元
      </el-form-item>

      <el-form-item label="优惠额度" prop="discountAmount" v-if="dataForm.type==0">
        <el-input-number v-model="dataForm.discountAmount" controls-position="right" size="small" :min="0" :max="999999"></el-input-number>元
      </el-form-item>
      <el-form-item label="优惠折扣" prop="discountAmount" v-if="dataForm.type==1">
        <el-input-number v-model="dataForm.discountAmount" controls-position="right" size="small" :min="0.01" :max="9.99"></el-input-number>折
      </el-form-item>

      <el-form-item label="使用范围" prop="useScope">
        <el-radio-group v-model="dataForm.useScope">
          <el-radio :label="0">全部商品</el-radio>
          <el-radio :label="1" v-if="userType == 0 && dataForm.source==0">指定分类</el-radio>
          <el-radio :label="2" v-else-if="userType != 0 || dataForm.source==1">指定商品</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="选择分类" prop="goodsCategoryIds" v-if="userType==0 && dataForm.source==0 && dataForm.useScope==1">
        <el-select v-model="dataForm.goodsCategoryIds" filterable placeholder="请选择">
          <el-option
            v-for="item in categoryList"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="选择商品" prop="goodsIds" v-if="dataForm.source== 1 && dataForm.useScope == 2">
        <el-select style="width: 100%" v-model="dataForm.goodsIds" filterable  multiple placeholder="请选择">
          <el-option
            v-for="item in goodsList"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="适用会员" prop="applicableMember">
        <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
        <el-checkbox-group v-model="dataForm.applicableMember" @change="handleCheckedMemberChange">
          <el-checkbox :label="applicableMemberList[0]"></el-checkbox>
          <el-checkbox :label="applicableMemberList[1]"></el-checkbox>
          <el-checkbox :label="applicableMemberList[2]"></el-checkbox>
          <el-checkbox :label="applicableMemberList[3]"></el-checkbox>
          <el-checkbox :label="applicableMemberList[4]"></el-checkbox>
          <el-checkbox :label="applicableMemberList[5]"></el-checkbox>
          <el-checkbox :label="applicableMemberList[6]"></el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="发行数量" prop="issueNumber">
        <el-input-number v-model="dataForm.issueNumber" controls-position="right"
                         size="small" :min="1" :max="999999">
        </el-input-number>
      </el-form-item>

      <el-form-item label="有效期" prop="validDateTime">
        <el-date-picker
          v-model="validDateTime"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd HH:mm:ss">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="限领条件" prop="perLimit">
        每人限领
        <el-input-number v-model="dataForm.perLimit" controls-position="right"
                         size="small" :min="1" :max="99">
        </el-input-number>
        张
      </el-form-item>

      <el-form-item label="状态" size="mini" prop="status">
        <el-radio-group v-model="dataForm.status">
          <el-radio :label="false">禁用</el-radio>
          <el-radio :label="true">启用</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import { getUserInfo } from '@/utils/auth'
  import { getAdminListAll } from '@/api/mall-admin'
  import { getSubFirst } from '@/api/mall-goods/goods-category'
  import { getAllGoodsList } from '@/api/mall-goods/goods'
  import { getCouponById, saveCoupon, updateCoupon } from '@/api/mall-coupon/coupon'
  export default {
    data () {
      var validateApplicableMember = (rule, value, callback) => {
        if (!value || value.length == 0) {
          callback(new Error('请至少选择一种会员'))
        } else {
          callback()
        }
      }
      return {
        visible: false,
        isIndeterminate: false,
        checkAll: false,
        userType: null,
        validDateTime: null,
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
          validStartTime: null, //有效起始时间
          validEndTime: null, //有效结束时间
          perLimit: 0, //每人限领多少张
          status: false //状态（false：禁用；true：启用）
        },
        categoryList:[],//商品分类列表
        goodsList: [], //商品列表
        dataRule: {
          name: [
            { required: true, message: '优惠券名称不能为空', trigger: 'blur' }
          ],
          adminUserId: [
            { required: true, message: '所属商户不能为空', trigger: 'blur' }
          ],
          applicableMember: [
            { required: true, message: '请至少选择一种会员',trigger: 'blur' },
          ],
          validDateTime: [
            { required: true, message: '请选择有效期', trigger: 'blur' }
          ]
        }
      }
    },
    mounted () {
      this.getUserInfo();
      this.getMerchantList();
      this.selectGoodsCategory();
    },
    methods: {
      init (id) {
        this.dataForm.id = id || 0
        this.visible = true;
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields();//清空选择框
          this.validDateTime = null;
          if (this.dataForm.id) {
            getCouponById(this.axios.paramsHandler({couponId: this.dataForm.id})).then(({data}) => {
              if (data && data.code === "200") {
                this.dataForm = data.data
                //处理”适用会员“
                this.dataForm.applicableMember = data.data.applicableMember.split(",")
                //处理有效期
                var validDateTime = [];
                if (data.data.validStartTime && data.data.validEndTime) {
                  validDateTime.push(new Date(data.data.validStartTime));
                  validDateTime.push(new Date(data.data.validEndTime));
                  this.validDateTime = validDateTime
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

      handleCheckAllChange(val) {
        this.dataForm.applicableMember = val ? this.applicableMemberList : [];
        this.isIndeterminate = false;
      },
      handleCheckedMemberChange(value) {
        let checkedCount = value.length;
        this.checkAll = checkedCount === this.applicableMemberList.length;
        this.isIndeterminate = checkedCount > 0 && checkedCount < this.applicableMemberList.length;
      },

      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            var saveOrUpdate = this.dataForm.id ? updateCoupon : saveCoupon;
            var applicableMemberList = this.dataForm.applicableMember;
            var applicableMemberStr = '';
            for (var i=0; i<applicableMemberList.length; i++) {
              applicableMemberStr += applicableMemberList[i] + ",";
            }
            if (applicableMemberStr) {
              applicableMemberStr = applicableMemberStr.substring(0,applicableMemberStr.length-1);
            }
            var validStartTime;
            var validEndTime;
            if (this.validDateTime) {
              validStartTime = new Date(this.validDateTime[0]);
              validEndTime = new Date(this.validDateTime[1]);
            }
            var goodsCategoryIdsTemp = "";
            if (this.dataForm.goodsCategoryIds) {
              goodsCategoryIdsTemp = this.dataForm.goodsCategoryIds;
            }else {
              goodsCategoryIdsTemp = null;
            }
            var goodsIdsTemp = "";
            if (this.dataForm.goodsIds) {
              for (var i=0; i<this.dataForm.goodsIds.length; i++) {
                goodsIdsTemp += this.dataForm.goodsIds[i] + ",";
              }
              goodsIdsTemp = goodsIdsTemp.substring(0, goodsIdsTemp.length-1)
            }else {
              goodsIdsTemp = null;
            }
            //如果是全部商品，则选择分类和选择商品的内容清空
            if (this.dataForm.useScope == 0) {
              goodsCategoryIdsTemp = null;
              goodsIdsTemp = null;
            }
            //如果是平台，清空adminUserId和所选商品，如果是商户，清空所选分类
            if (this.dataForm.source==0) {
              this.dataForm.adminUserId = null;
              this.dataForm.goodsIds = []
            }else {
              this.dataForm.goodsCategoryIds = [];
            }
            var data = this.axios.dataHandler({
              id: this.dataForm.id || undefined,
              name: this.dataForm.name, //优惠券名称
              source: this.userType == 0 ? this.dataForm.source : 1, //优惠券来源（0：平台；1：商家）
              adminUserId: this.userType == 0 && this.dataForm.source == 0 ? null : this.dataForm.adminUserId, //所属商户
              type: this.dataForm.type, //优惠券类型（0：满减券；1：满折券）
              useThreshold: this.dataForm.useThreshold,//使用门槛（0: 无门槛 1:有门槛）
              minConsumption: this.dataForm.minConsumption, //有门槛时
              discountAmount: this.dataForm.discountAmount,//优惠额度（如果是满减券，该字段是减钱数，如果是满折券，该字段是打折数）
              useScope: this.dataForm.useScope, //使用范围（0：全部商品；1：(如果是平台优惠券，则为指定分类；如果是商家优惠券则为指定商品）
              goodsCategoryIds: goodsCategoryIdsTemp,
              goodsIds: goodsIdsTemp,
              applicableMember: applicableMemberStr, //适用会员（普通会员，青铜会员，白银会员，黄金会员，铂金会员，钻石会员，最强买家）
              issueNumber: this.dataForm.issueNumber, //发行数量
              validStartTime: validStartTime, //有效起始时间
              validEndTime: validEndTime, //有效结束时间
              perLimit: this.dataForm.perLimit, //每人限领多少张
              status: this.dataForm.status //状态（0：禁用；1：启用）
            })
            saveOrUpdate(data).then(({data}) => {
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

      /**
       * 修改优惠券来源时，清空商品信息
       */
      changeSource(val) {
        if (val == 1) {
          this.goodsList = [] //清空商品信息
          this.dataForm.useScope = 0
          this.selectGoods()
        }else {
          this.dataForm.useScope = 0
        }
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
      },
      //选择商品分类
      selectGoodsCategory() {
        var subFirstParams =  this.axios.paramsHandler({},false)
        getSubFirst(subFirstParams).then(({data}) => {
          if (data && data.code === "200") {
            this.categoryList = data.data
          }
        });
      },
      //切换所属商户
      changeAdminUserId() {
        this.dataForm.goodsIds = []
        this.selectGoods();
      }
    }
  }
</script>
