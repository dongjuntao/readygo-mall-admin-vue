<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="100px">
      <el-form-item label="优惠券名称" prop="name">
        <el-input v-model="dataForm.name" placeholder="优惠券名称"></el-input>
      </el-form-item>
      <el-form-item label="优惠券来源" prop="source">
        <el-radio-group v-model="dataForm.source">
          <el-radio :label="0">平台</el-radio>
          <el-radio :label="1">商户</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="所属商户" prop="adminUserId" v-if="dataForm.source == 1">
        <el-select v-model="dataForm.adminUserId" clearable placeholder="请选择所属商户">
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
        <el-input-number v-model="dataForm.minConsumption" controls-position="right" size="small" :min="0" :max="999999"></el-input-number>
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
          <el-radio :label="1" v-if="userType != 0">指定商品</el-radio>
          <el-radio :label="1" v-else>指定分类</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="适用会员" prop="applicableMember" v-if="userType == 0">
        <el-checkbox-group v-model="dataForm.applicableMember">
          <el-checkbox label="普通会员"></el-checkbox>
          <el-checkbox label="青铜会员"></el-checkbox>
          <el-checkbox label="白银会员"></el-checkbox>
          <el-checkbox label="黄金会员"></el-checkbox>
          <el-checkbox label="铂金会员"></el-checkbox>
          <el-checkbox label="钻石会员"></el-checkbox>
          <el-checkbox label="最强买家"></el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="发行数量" prop="issueNumber">
        <el-input-number v-model="dataForm.issueNumber" controls-position="right"
                         size="small" :min="0" :max="999999">
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
                         size="small" :min="0" :max="999999">
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
  import { getCouponById, saveCoupon, updateCoupon } from '@/api/mall-coupon/coupon'
  export default {
    data () {
      var validatePassword = (rule, value, callback) => {
        if (!this.dataForm.id && !/\S/.test(value)) {
          callback(new Error('密码不能为空'))
        } else {
          callback()
        }
      }
      return {
        visible: false,
        roleList: [],
        userType: null,
        validDateTime: null,
        merchantList: [], //商户列表
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
          applicableMember: [], //适用会员（普通会员，青铜会员，白银会员，黄金会员，铂金会员，钻石会员，最强买家）
          issueNumber: 0, //发行数量
          validStartTime: null, //有效起始时间
          validEndTime: null, //有效结束时间
          perLimit: 0, //每人限领多少张
          status: 0 //状态（0：禁用；1：启用）
        },
        dataRule: {
          name: [
            { required: true, message: '优惠券名称不能为空', trigger: 'blur' }
          ],
          adminUserId: [
            { required: true, message: '所属商户不能为空', trigger: 'blur' }
          ]
        }
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
              }
            });
          }
        })
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
            var data = this.axios.dataHandler({
              id: this.dataForm.id || undefined,
              name: this.dataForm.name, //优惠券名称
              source: this.dataForm.source, //优惠券来源（0：平台；1：商家）
              adminUserId: this.dataForm.source == 0 ? null : this.dataForm.adminUserId, //所属商户
              type: this.dataForm.type, //优惠券类型（0：满减券；1：满折券）
              useThreshold: this.dataForm.useThreshold,//使用门槛（0: 无门槛 1:有门槛）
              minConsumption: this.dataForm.minConsumption, //有门槛时
              discountAmount: this.dataForm.discountAmount,//优惠额度（如果是满减券，该字段是减钱数，如果是满折券，该字段是打折数）
              useScope: this.dataForm.useScope, //使用范围（0：全部商品；1：(如果是平台优惠券，则为指定分类；如果是商家优惠券则为指定商品）
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
    }
  }
</script>
