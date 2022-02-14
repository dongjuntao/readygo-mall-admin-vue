<template>
  <el-dialog
    :title="type=='auth' ? '审核' : '详情'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" ref="dataForm" label-width="80px">
      <el-form-item label="用户名" prop="userName">
        <div>{{dataForm.userName}}</div>
      </el-form-item>
      <el-form-item label="头像" prop="avatar">
        <el-image v-for="data in dataForm.avatar"
                  class="images"
                  :src="data"
                  :key="data"
                  :preview-src-list="dataForm.avatar">
        </el-image>
      </el-form-item>
      <el-form-item label="商家名称" prop="name">
        <div>{{dataForm.name}}</div>
      </el-form-item>
      <el-form-item label="资质材料" prop="name">
        <el-image v-for="data in dataForm.qualificationMaterials"
                  class="images"
                  :src="data"
                  :key="data"
                  :preview-src-list="dataForm.qualificationMaterials">
        </el-image>
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <div>{{dataForm.email}}</div>
      </el-form-item>
      <el-form-item label="手机号" prop="mobile">
        <div>{{dataForm.mobile}}</div>
      </el-form-item>
      <el-form-item label="固定电话" prop="fixedTelephone">
        <div>{{dataForm.fixedTelephone}}</div>
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <div>{{dataForm.email}}</div>
      </el-form-item>
      <el-form-item label="地区" prop="email">
        <div>{{dataForm.regions}}</div>
      </el-form-item>
      <el-form-item label="详细地址" prop="email">
        <div>{{dataForm.address}}</div>
      </el-form-item>
      <el-form-item label="用户状态" size="mini" prop="status">
        <div v-if="dataForm.status==0">禁用</div>
        <div v-if="dataForm.status==1">正常</div>
      </el-form-item>
      <el-form-item v-if="type=='audit'" label="角色" size="mini" prop="roleIdList">
        <el-checkbox-group v-model="dataForm.roleIdList">
          <el-checkbox v-for="role in roleList" :key="role.id" :label="role.id">{{ role.name }}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item v-else label="角色" size="mini" prop="auditComments">
        <div>{{roleName}}</div>
      </el-form-item>

      <el-form-item v-if="type=='audit'" label="审核意见" size="mini" prop="auditComments">
        <el-input type="textarea"
                  v-model="dataForm.auditComments"
                  maxlength="100"
                  style="border: none"
                  placeholder="请输入审核意见，最多科输入100个字"></el-input>
      </el-form-item>
      <el-form-item v-else label="审核意见" size="mini" prop="auditComments">
        <div>{{dataForm.auditComments}}</div>
      </el-form-item>

    </el-form>
    <span slot="footer" class="dialog-footer" v-if="type=='audit'">
      <el-button type="primary" @click="dataFormSubmit(1)">通过</el-button>
      <el-button type="danger" @click="dataFormSubmit(2)">拒绝</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import { select } from '@/api/mall-admin/mall-role'
  import { getUserById, auditAdmin } from '@/api/mall-admin/mall-admin'
  import { getRegionsNameByRegions } from '@/api/mall-admin/mall-region'
  import { getUserInfo, setUserInfo} from '@/utils/auth'

  export default {
    data () {
      return {
        visible: false,
        roleList: [],
        roleName:'', //详情查看 角色
        type: "", //页面类型：detail / audit
        dataForm: {
          id: 0,
          userName: '',
          password: '',
          email: '',
          mobile: '',
          status: '',
          roleIdList: [],
          userType: 1, //商户管理员
          avatar: '', //头像
          name: '', //商户真实名称
          qualificationMaterials: '', //商户资质材料
          fixedTelephone: '', //固定电话
          regions: '', //所属区域id集合【1,2,3】
          address: '',//详细地址
          auditComments: '' //审核意见
        }
      }
    },
    methods: {
      init (id, type) {
        this.type = type;
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
                this.dataForm = data.data;
                //处理资质材料
                this.dataForm.qualificationMaterials = data.data.qualificationMaterials.split(",");
                //处理头像，【头像需要预览，根据element-ui规范，将其放到一个list中】
                this.dataForm.avatar = data.data.avatar.split(",")
                //查看页面，显示已选择的角色
                if(this.dataForm.roleIdList && this.dataForm.roleIdList.length>0){
                  this.roleName = "";
                  this.dataForm.roleIdList.forEach(roleId=>{
                    this.roleList.forEach(role=>{
                      if (roleId == role.id){
                        this.roleName += role.name + " "
                      }
                    })
                  })
                }
                this.getRegionList();
              }
            });
          }
        });
      },
      //处理地区显示
      getRegionList(){
        getRegionsNameByRegions(this.axios.paramsHandler({regions: this.dataForm.regions})).then(({data})=>{
          this.dataForm.regions = data.data
        });
      },
      // 表单提交
      dataFormSubmit (auditStatus) {
        //如果同意通过，必须选择角色
        if (auditStatus == 1 && (!this.dataForm.roleIdList || this.dataForm.roleIdList.length==0)){
          this.$message.warning("请选择角色")
          return;
        }
        //如果拒绝，必须填写审核意见
        if (auditStatus == 2 && !this.dataForm.auditComments){
          this.$message.warning("请填写审核意见")
          return;
        }
        return this.$confirm("是否确认"+(auditStatus==1 ? "通过":"拒绝"+"?"), "系统提示",{
          confirmButtonText: "确认",
          cancelButtonText: "取消",
          type: "warning",
          center: true
        }).then(() => {
          var data = this.axios.dataHandler({
            auditStatus: auditStatus,
            roleIdList: this.dataForm.roleIdList,
            auditComments: this.dataForm.auditComments
          })
          auditAdmin(this.dataForm.id, data).then(({data}) => {
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
        });
      }
    }
  }
</script>
<style>
  .images{
    width: 50px;
    height: 50px;
    margin-top: -10px;
  }
</style>
