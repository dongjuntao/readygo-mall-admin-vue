<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" label-width="95px">
      <el-form-item label="发货人姓名" prop="name">
        <el-input v-model="dataForm.name" placeholder="发货人姓名"></el-input>
      </el-form-item>
      <el-form-item label="发货人性别" prop="sex">
        <el-radio v-model="dataForm.sex" :label="0">男</el-radio>
        <el-radio v-model="dataForm.sex" :label="1">女</el-radio>
      </el-form-item>
      <el-form-item label="手机号码" prop="mobile">
        <el-input v-model="dataForm.mobile" maxlength="11" placeholder="手机号"></el-input>
      </el-form-item>
      <el-form-item label="固定电话" prop="fixedTelephone">
        <el-input v-model="dataForm.fixedTelephone" placeholder="固定电话"></el-input>
      </el-form-item>
      <el-form-item label="所属商户" prop="adminUserId" v-if="userType == 0">
        <el-select v-model="dataForm.adminUserId" clearable placeholder="请选择">
          <el-option
            v-for="item in merchantList"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="发货地区" >
        <template>
          <el-select v-model="province" filterable placeholder="请选择省份" @change="getCity()">
            <el-option
              v-for="item in provinceList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
          <el-select v-model="city" style="margin-left: 2.5px;" filterable placeholder="请选择城市" @change="getArea()">
            <el-option
              v-for="item in cityList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
          <el-select v-model="area" style="margin-left: 2.5px;" filterable placeholder="请选择区县">
            <el-option
              v-for="item in areaList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </template>
      </el-form-item>
      <el-form-item label="详细地址" prop="address">
        <el-input v-model="dataForm.address" maxlength="100" placeholder="详细地址"></el-input>
      </el-form-item>
      <el-form-item label="邮政编码" prop="postalCode">
        <el-input v-model="dataForm.postalCode" maxlength="6" placeholder="邮政编码"></el-input>
      </el-form-item>
      <el-form-item label="是否默认" prop="isDefault">
        <el-checkbox v-model="dataForm.isDefault" label="设置为默认地址"></el-checkbox>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import { isMobile } from '@/utils/validate'
  import { getAdminListAll } from '@/api/mall-admin'
  import { getRegionList } from '@/api/mall-region'
  import { saveShippingInfo, updateShippingInfo, getShippingInfoById } from '@/api/mall-shipping-info'
  import { getUserInfo } from '@/utils/auth'

  export default {
    data () {
      //手机号码格式校验
      var validateMobile = (rule, value, callback) => {
        if (!isMobile(value)) {
          callback(new Error('手机号格式错误'))
        } else {
          callback()
        }
      }
      var validateRegions = (rule, value, callback) => {
        if (!this.province){
          callback(new Error('请选择省份'));
        }else if(!this.city){
          callback(new Error('请选择城市'));
        }else if(!this.area){
          callback(new Error('请选择区县'));
        }else {
          callback()
        }
      }
      return {
        visible: false,
        roleList: [],
        dataForm: {
          id: 0,
          name: '',
          sex: 0,
          regions: '',
          address: '',
          postalCode: '',
          mobile: '',
          fixedTelephone: '',
          adminUserId: null,
          isDefault: false
        },
        createBy: 0, //创建人id
        userType: null, //用户类型
        provinceList: [], //省份
        province:"", //已选省份
        cityList: [], //城市
        city: "", //已选城市
        areaList: [], //区县
        area: "", //已选区县
        merchantList:[], //商户列表（userType为1的管理员列表）
        dataRule: {
          name: [
            { required: true, message: '用户名不能为空', trigger: 'blur' }
          ],
          sex: [
            { required: true, message: '性别不能为空', trigger: 'blur' }
          ],
          address: [
            { required: true, message: '详细地址不能为空', trigger: 'blur' }
          ],
          adminUserId: [
            { required: true, message: '所属商户不能为空', trigger: 'blur' }
          ],
          regions: [
            { required: true, validator:validateRegions, trigger: 'blur' }
          ],
          mobile: [
            { required: true, message: '手机号不能为空', trigger: 'blur' },
            { validator: validateMobile, trigger: 'blur' }
          ]
        }
      }
    },

    created() {
      this.getProvinceData();
      this.getMerchantList();
      this.getUserInfo();
    },

    methods: {
      init (id) {
        this.dataForm.id = id || 0
        this.visible = true;
        this.$nextTick( ()=> {
          this.$refs['dataForm'].resetFields()
          this.province=null;
          this.city=null;
          this.area=null;
          if (this.dataForm.id) {
            var that = this;
            getShippingInfoById(this.axios.paramsHandler({id: this.dataForm.id})).then(async function ({data}) {
              if (data && data.code === "200") {
                that.dataForm.address = data.data.address;
                that.dataForm.adminUserId = data.data.adminUserId;
                that.dataForm.fixedTelephone = data.data.fixedTelephone;
                that.dataForm.isDefault = data.data.isDefault;
                that.dataForm.mobile = data.data.mobile;
                that.dataForm.name = data.data.name;
                that.dataForm.postalCode = data.data.postalCode;
                that.dataForm.sex = data.data.sex;
                that.province = parseInt(data.data.regions.split(",")[0]);
                await that.getCity();
                that.city = parseInt(data.data.regions.split(",")[1]);
                await that.getArea();
                that.area = parseInt(data.data.regions.split(",")[2]);
              }
            });
          }
        })
      },

      getProvinceData() {
        var params = this.axios.paramsHandler({parent_id: 0},false)
        getRegionList(params).then(({data}) => {
          if (data && data.code === "200") {
            this.provinceList = data.data;
          }
        })
      },
      //获取城市信息
      async getCity(){
        var params = this.axios.paramsHandler({parent_id: this.province},false)
        await getRegionList(params).then(({data}) => {
          if (data && data.code === "200") {
            this.city = null;
            this.area = null;
            this.cityList = data.data
            this.areaList = [];
          }
        })
      },
      //获取区县信息
      async getArea(){
        var params = this.axios.paramsHandler({parent_id: this.city},false)
        await getRegionList(params).then(({data}) => {
          if (data && data.code === "200") {
            this.area = null;
            this.areaList = data.data
          }
        })
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
       * cookie中获取当前登录的用户信息
       */
      getUserInfo() {
        var userInfo = JSON.parse(getUserInfo(sessionStorage.getItem("userNameKey")));
        this.createBy = userInfo.userId;
        this.userType = userInfo.userType;
      },

      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            var saveOrUpdate = this.dataForm.id ? updateShippingInfo : saveShippingInfo;
            var data = this.axios.dataHandler({
              id: this.dataForm.id || undefined,
              name: this.dataForm.name,
              sex: this.dataForm.sex,
              regions: this.province+","+this.city+","+this.area,
              address: this.dataForm.address,
              postalCode: this.dataForm.postalCode,
              mobile: this.dataForm.mobile,
              fixedTelephone: this.dataForm.fixedTelephone,
              adminUserId: this.dataForm.adminUserId ? this.dataForm.adminUserId : this.createBy,
              createBy: this.createBy,
              isDefault: this.dataForm.isDefault,
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
      }
    }
  }
</script>
