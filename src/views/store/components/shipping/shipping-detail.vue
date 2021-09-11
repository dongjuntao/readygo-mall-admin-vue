<template>
  <el-dialog
    :title="详情"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" label-width="95px">
      <el-form-item label="发货人姓名" prop="name">
        <div>{{dataForm.name}}</div>
      </el-form-item>
      <el-form-item label="发货人性别" prop="sex">
        <div>{{dataForm.sex == '0' ? '男' : '女'}}</div>
      </el-form-item>
      <el-form-item label="手机号码" prop="mobile">
        <div>{{dataForm.mobile}}</div>
      </el-form-item>
      <el-form-item label="固定电话" prop="fixedTelephone">
        <div>{{dataForm.fixedTelephone}}</div>
      </el-form-item>
      <el-form-item label="所属商户" prop="adminUserId">
        <div>{{dataForm.merchant}}</div>
      </el-form-item>
      <el-form-item label="发货地区" prop="regions">
        <div>{{dataForm.regionNames}}</div>
      </el-form-item>
      <el-form-item label="详细地址" prop="address">
        <div>{{dataForm.address}}</div>
      </el-form-item>
      <el-form-item label="邮政编码" prop="postalCode">
        <div>{{dataForm.postalCode}}</div>
      </el-form-item>
      <el-form-item label="是否默认" prop="isDefault">
        <div>{{dataForm.isDefault ? '是' : '否'}}</div>
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
        regionNames:'',
        address: '',
        postalCode: '',
        mobile: '',
        merchant:'',
        fixedTelephone: '',
        adminUserId: null,
        isDefault: false
      },
      createBy: 0, //创建人id
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
  },

  methods: {
    init (id) {
      this.dataForm.id = id || 0
      this.visible = true;
      this.$nextTick( ()=> {
        this.$refs['dataForm'].resetFields()
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
              that.dataForm.merchant = data.data.merchant
              that.dataForm.postalCode = data.data.postalCode;
              that.dataForm.sex = data.data.sex;
              that.dataForm.regions = data.data.regions;
              that.dataForm.regionNames = data.data.regionNames;
            }
          });
        }
      })
    }
  }
}
</script>
