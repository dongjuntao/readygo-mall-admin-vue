<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="120px">
      <el-form-item label="用户名" prop="userName" >
        <el-input v-model="dataForm.userName" placeholder="请输入用户名"></el-input>
      </el-form-item>
      <el-form-item prop="password" label="密码" >
        <el-input name="password" type="password" v-model="dataForm.password" placeholder="请输入密码"></el-input>
      </el-form-item>
      <el-form-item prop="surePassword" label="确认密码" >
        <el-input type="password" v-model="dataForm.surePassword" placeholder="请输入确认密码"></el-input>
      </el-form-item>
      <el-form-item prop="avatar" label="商户头像" >
        <el-upload
          class="avatar-uploader"
          action="#"
          :multiple="false"
          :show-file-list="false"
          :http-request="uploadAvatar"
          :before-upload="beforeUploadAvatar">
          <img style="width: 50px; height: 50px;" v-if="dataForm.avatar" :src="dataForm.avatar" class="avatar">
          <i v-else >
            <el-button type="primary" plain>上传头像</el-button>
          </i>
        </el-upload>
      </el-form-item>
      <el-form-item prop="name" label="商户真实名称" >
        <el-input type="name" v-model="dataForm.name" placeholder="请输入商户真实名称"></el-input>
      </el-form-item>
      <el-form-item prop="qualificationMaterials" label="商户资质材料" >
        <el-upload
          class="upload-demo"
          action="#"
          :http-request="uploadQualificationMaterials"
          :before-upload="beforeUploadQualificationMaterials"
          :on-remove="removeQualificationMaterials"
          :file-list="qualificationMaterialsList"
          multiple>
          <el-button type="primary" plain>点击上传</el-button>
          <span slot="tip" class="el-upload__tip custom-tip">只能上传jpg/png文件，且不超过1MB</span>
        </el-upload>
      </el-form-item>

      <el-form-item prop="fixedTelephone" label="固定电话" >
        <el-input v-model="dataForm.fixedTelephone" placeholder="请输入固定电话"></el-input>
      </el-form-item>
      <el-form-item prop="mobile" label="手机号码" >
        <el-input v-model="dataForm.mobile" placeholder="请输入手机号码"></el-input>
      </el-form-item>
      <el-form-item prop="email" label="邮箱" >
        <el-input type="email" v-model="dataForm.email" placeholder="请输入邮箱"></el-input>
      </el-form-item>
      <el-form-item prop="regions" label="地区" >
        <template>
          <el-select v-model="province" filterable placeholder="请选择省份" @change="getCity()">
            <el-option
              v-for="item in provinceList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
          <el-select style="margin-left: 12px;" v-model="city" filterable placeholder="请选择城市" @change="getArea()">
            <el-option
              v-for="item in cityList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
          <el-select style="margin-left: 12px;" v-model="area" filterable placeholder="请选择区县">
            <el-option
              v-for="item in areaList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select >
        </template>
      </el-form-item>
      <el-form-item prop="address" label="详细地址" >
        <el-input type="address" v-model="dataForm.address" placeholder="请输入详细地址"></el-input>
      </el-form-item>

      <el-form-item label="角色" size="mini" prop="roleIdList">
        <el-checkbox-group v-model="dataForm.roleIdList">
          <!--入驻商户新增时，角色智能选择入驻商户-->
          <el-checkbox :disabled="role.id !=2" v-for="role in roleList" :key="role.id" :label="role.id">{{ role.name }}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="状态" size="mini" prop="status">
        <el-radio-group v-model="dataForm.status">
          <el-radio :label="0">禁用</el-radio>
          <el-radio :label="1">正常</el-radio>
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
  import { isEmail, isMobile } from '@/utils/validate'
  import { select } from '@/api/mall-admin/mall-role'
  import { getUserById, saveAdmin, updateAdmin } from '@/api/mall-admin/mall-admin'
  import { getRegionList } from '@/api/mall-admin/mall-region'
  import {  fileUpload } from '@/api/mall-file/file'
  import { adminUserConstant } from "@/utils/constant";
  export default {
    data () {
      //密码校验
      var surePasswordValidator = (rule, value, callback) => {
        if (!this.dataForm.id && !/\S/.test(value)) {
          callback(new Error('确认密码不能为空'))
        } else if (this.dataForm.password !== value) {
          callback(new Error('确认密码与密码输入不一致'))
        } else {
          callback()
        }
      }
      //校验邮箱
      var validateEmail = (rule, value, callback) => {
        if (!isEmail(value)) {
          callback(new Error('邮箱格式错误'))
        } else {
          callback()
        }
      }
      //资质证明检验
      var qualificationMaterialsValidator = (rule, value, callback)=>{
        if (!this.qualificationMaterialsList || this.qualificationMaterialsList.length == 0) {
          callback(new Error('请上传商户资质材料！'))
        } else {
          callback()
        }
      }
      //地区检验
      var regionsValidator = (rule, value, callback)=>{
        if (!this.province || !this.city || !this.area) {
          callback(new Error('请选择地区!'))
        } else {
          callback()
        }
      }
      //检验手机号
      var validateMobile = (rule, value, callback) => {
        if (!isMobile(value)) {
          callback(new Error('手机号格式错误'))
        } else {
          callback()
        }
      }

      return {
        visible: false,
        roleList: [],
        dataForm: {
          id: 0,
          userName: '',//用户名
          password: '',//密码
          surePassword: '', //确认密码
          avatar: '', //头像
          name: '', //商户真实名称
          qualificationMaterials: '', //商户资质材料
          fixedTelephone: '', //固定电话
          mobile: '', //手机号码
          email: '', //邮箱
          regions: '', //所属区域id集合【1,2,3】
          address: '',//详细地址
          status: 1,
          roleIdList: []
        },
        qualificationMaterialsList:[], //商户资质材料列表
        provinceList: [], //省份
        province:"", //已选省份
        cityList: [], //城市
        city: "", //已选城市
        areaList: [], //区县
        area: "", //已选区县
        dataRule: {
          userName: [
            { required: true, message: '帐号不能为空', trigger: 'blur' }
          ],
          password: [
            { required: true, message: '密码不能为空', trigger: 'blur' }
          ],
          avatar: [
            { required: true, message: '请上传头像', trigger: 'blur' }
          ],
          name: [
            { required: true, message: '商户真实名称不能为空', trigger: 'blur' }
          ],
          mobile: [
            { required: true, message: '手机号码不能为空', trigger: 'blur' },
            { validator: validateMobile, trigger: 'blur' }
          ],
          email: [
            { required: true, message: '邮箱不能为空', trigger: 'blur' },
            { validator: validateEmail, trigger: 'blur' }
          ],
          address: [
            { required: true, message: '详细地址不能为空', trigger: 'blur' }
          ],
          regions: [
            { required: true, validator:regionsValidator, trigger: 'blur' }
          ],
          qualificationMaterials: [
            { required: true, validator:qualificationMaterialsValidator, trigger: 'blur' }
          ],
          surePassword: [
            {required: true, validator:surePasswordValidator, trigger: 'blur'}
          ]
        }
      }
    },

    mounted () {
      this.getProvinceData();
    },

    methods: {
      init (id) {
        this.dataForm.id = id || 0
        select(this.axios.paramsHandler()).then(({data})=>{
          this.roleList = data && data.code === "200" ? data.data : []
        }).then(() => {
          this.visible = true;
          this.$nextTick(() => {
            this.$refs['dataForm'].resetFields()
          })
        }).then(() => {
          if (this.dataForm.id) {
            getUserById(this.axios.paramsHandler({id: this.dataForm.id})).then(({data}) => {
              if (data && data.code === "200") {
                this.dataForm.userName = data.data.userName
                this.dataForm.email = data.data.email
                this.dataForm.mobile = data.data.mobile
                this.dataForm.roleIdList = data.data.roleIdList
                this.dataForm.status = data.data.status
              }
            });
          }
        });
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            //需要特殊处理的字段
            var qualificationMaterials = ''; //商户资质材料
            var regions = this.province+","+this.city+","+this.area; //所属区域
            if (this.qualificationMaterialsList.length>0){
              this.qualificationMaterialsList.forEach(qualification=>{
                qualificationMaterials += qualification.url + ",";
              });
              qualificationMaterials = qualificationMaterials.substring(0,qualificationMaterials.length-1)
            }

            var saveOrUpdate = this.dataForm.id ? updateAdmin : saveAdmin;
            var data = this.axios.dataHandler({
              id: this.dataForm.id || undefined,
              userName: this.dataForm.userName,
              password: this.dataForm.password,
              userType: 1, //商户（店铺）管理员
              merchantType: 0, //入驻商户（店铺）
              avatar: this.dataForm.avatar, //头像
              name: this.dataForm.name, //商户真实名称
              qualificationMaterials: qualificationMaterials, //商户资质材料
              fixedTelephone: this.dataForm.fixedTelephone, //固定电话
              mobile: this.dataForm.mobile, //手机号码
              email: this.dataForm.email, //邮箱
              regions: regions, //所属区域id集合【1,2,3】
              address: this.dataForm.address,//详细地址
              status: this.dataForm.status,
              roleIdList: this.dataForm.roleIdList
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

      //获取（初始化）省份信息
      getProvinceData() {
        this.dataListLoading = true
        var params =  this.axios.paramsHandler({parent_id: 0},false)
        getRegionList(params).then(({data}) => {
          if (data && data.code === "200") {
            this.provinceList = data.data;
          }
          this.dataListLoading = false
        })
      },
      //获取城市信息
      getCity(){
        this.dataListLoading = true
        var params =  this.axios.paramsHandler({parent_id: this.province},false)
        getRegionList(params).then(({data}) => {
          if (data && data.code === "200") {
            this.city = null;
            this.area = null;
            this.cityList = data.data
            this.areaList = [];
          }
          this.dataListLoading = false
        })
      },
      //获取区县信息
      getArea(){
        this.dataListLoading = true
        var params =  this.axios.paramsHandler({parent_id: this.city},false)
        getRegionList(params).then(({data}) => {
          if (data && data.code === "200") {
            this.area = null;
            this.areaList = data.data
          }
          this.dataListLoading = false
        })
      },

      //上传头像
      uploadAvatar(file){
        let formData = new FormData();
        formData.append("files", file.file);
        var params = this.axios.paramsHandler({folderName: adminUserConstant.admin_user_avatar })
        fileUpload(formData, params).then(({data}) => {
          this.dataForm.avatar = data.data;
        })
      },
      //上传头像前判断
      beforeUploadAvatar(file){
        const isImg = (file.size / 1024 / 1024) < 1
        if (!isImg) {
          this.$message.error('上传头像图片大小不能超过 1MB!')
        }
        const isType = file.type === "image/png"
        const isType2 = file.type === "image/jpeg"
        if (!isType && !isType2) {
          this.$message.error('上传logo图片格式为png或jpg')
        }
        return (isType || isType2) && isImg
      },
      /**
       * 上传资质材料
       * @param file
       */
      uploadQualificationMaterials(file){
        let formData = new FormData();
        formData.append("files", file.file);
        var params = this.axios.paramsHandler({folderName: adminUserConstant.admin_qualification_materials })
        fileUpload(formData, params).then(({data}) => {
          this.qualificationMaterialsList.push({
            name:data.data.substring(data.data.lastIndexOf("/")+20),
            url: data.data
          });
        })
      },
      /**
       * 上传资质材料前
       * @returns {boolean}
       */
      beforeUploadQualificationMaterials(file){
        const isImg = (file.size / 1024 / 1024) < 1
        if (!isImg) {
          this.$message.error('上传头像图片大小不能超过 1MB!')
        }
        const isType = file.type === "image/png"
        const isType2 = file.type === "image/jpeg"
        if (!isType && !isType2) {
          this.$message.error('上传资质材料格式为png或jpg')
        }
        const fileNum = this.qualificationMaterialsList.length<5;
        if (!fileNum) {
          this.$message.error('最多只能上传5份资质材料')
        }
        return (isType || isType2) && isImg && fileNum
      },
      /**
       * 移除资质材料
       */
      removeQualificationMaterials(file, fileList){
        this.qualificationMaterialsList
          .splice(this.qualificationMaterialsList.findIndex(item=>{return item.url==file.url}), 1);
      },
    }
  }
</script>
