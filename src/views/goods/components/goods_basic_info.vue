<template>
  <div>
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" label-width="80px" >
      <el-form-item label="商品名称" prop="name">
        <el-input v-model="dataForm.name" placeholder="请输入商品名称"></el-input>
      </el-form-item>
      <el-form-item label="商品编号" prop="code">
        <el-input v-model="dataForm.code" placeholder="请输入商品编号"></el-input>
      </el-form-item>
      <el-form-item label="商品描述" prop="description" >
        <el-input type="textarea" :rows="3" v-model="dataForm.description"
                  maxLength="200" placeholder="请填写商品描述,最多200个字">
        </el-input>
      </el-form-item>
      <el-form-item label="所属品牌" prop="brandId">
        <el-select v-model="dataForm.brandId" clearable placeholder="请选择所属品牌">
          <el-option
            v-for="item in brandList"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="所属店铺" prop="adminUserId" v-if="userType == 0">
        <el-select v-model="dataForm.adminUserId" clearable placeholder="请选择所属商户"  width="90%">
          <el-option
            v-for="item in merchantList"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
        <el-tooltip class="item" effect="light" content="此处店铺为自营店铺" placement="right"><i class="el-icon-question" /></el-tooltip>
      </el-form-item>
      <el-form-item label="商品分类" prop="goodsCategoryIds">
        <el-cascader
          :options="goodsCategory"
          clearable
          placeholder="请选择商品分类"
          v-model="dataForm.goodsCategoryIds"
          :props="{ value: 'id',label: 'name',children: 'children'}">
        </el-cascader>
      </el-form-item>
      <el-form-item label="商品单位" prop="unit">
        <el-input v-model="dataForm.unit" placeholder="请输入商品单位（如个、件、套、袋、瓶等）"></el-input>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { getGoodsCategoryTree } from '@/api/mall-goods/goods-category'
import { getBrandListAll } from '@/api/mall-goods/brand'
import { getAdminListAll } from '@/api/mall-admin'
import { getUserInfo } from '@/utils/auth'
export default {
  data () {
    return {
      visible: false,
      dataForm: {
        id: 0,
        name: '', //商品名称
        description: '',//商品描述
        goodsCategoryIds:[],//商品分类id集合，三级分类id,如 1,2,3
        brandId: null, //品牌id
        adminUserId: null, //所属商户id
        code: '', //商品编码
        unit: '' //单位
      },
      dataRule: {
        name: [
          { required: true, message: '商品名称不能为空', trigger: 'change' }
        ],
        code: [
          { required: true, message: '商品编号不能为空', trigger: 'change' }
        ],
        brandId: [
          { required: true, message: '所属品牌不能为空', trigger: 'change' }
        ],
        adminUserId: [
          { required: true, message: '所属商户不能为空', trigger: 'change' }
        ],
        goodsCategoryIds: [
          { required: true, message: '商品分类不能为空', trigger: 'change' }
        ]
      },
      goodsCategory:[], //商品分类
      brandList: [], //品牌列表
      merchantList: [], //所属商户
      userType: null
    }
  },
  mounted() {
    this.getUserInfo();
    this.getGoodsCategory();
    this.getBrandList();
    this.getMerchantList();
  },
  methods: {
    // 获取商品分类列表
    getGoodsCategory () {
      getGoodsCategoryTree(this.axios.paramsHandler()).then(({data}) => {
        this.goodsCategory = data.data
        //移除最后一层级的children属性
        for(var i=0; i<this.goodsCategory.length; i++) {
          var second = this.goodsCategory[i].children;
          for (var j=0; j<second.length; j++) {
            var third = second[j].children;
            for (var k=0; k<third.length; k++) {
              for (var key in third[k]) {
                //删除children属性，避免第三级后出现子集
                if (key === 'children') {
                  delete third[k][key];
                }
              }
            }
          }
        }
      })
    },

    //获取商户列表（userType=1,auditStatus=1,merchantType=1）
    getMerchantList(){
      var params =  this.axios.paramsHandler({userType: 1, authStatus: 1, merchantType: 1},false)
      getAdminListAll(params).then(({data}) => {
        if (data && data.code === "200") {
          this.merchantList = data.data
        }
      })
    },

    /**
     * 获取品牌列表
     */
    getBrandList() {
      getBrandListAll().then(({data})=>{
        this.brandList = data.data;
      });
    },


    /**
     * cookie中获取当前登录的用户信息
     */
    getUserInfo() {
      var userInfo = JSON.parse(getUserInfo(sessionStorage.getItem("userNameKey")));
      this.userType = userInfo.userType;
    }
  }
}
</script>

<style lang="scss" scoped>
.mod-goods-category {
  .menu-list__input,
  .icon-list__input {
    > .el-input__inner {
      cursor: pointer;
    }
  }
  &__icon-popover {
    width: 458px;
    overflow: hidden;
  }
  &__icon-inner {
    width: 478px;
    max-height: 258px;
    overflow-x: hidden;
    overflow-y: auto;
  }
  &__icon-list {
    width: 458px;
    padding: 0;
    margin: -8px 0 0 -8px;
    > .el-button {
      padding: 8px;
      margin: 8px 0 0 8px;
      > span {
        display: inline-block;
        vertical-align: middle;
        width: 18px;
        height: 18px;
        font-size: 18px;
      }
    }
  }
  .icon-list__tips {
    font-size: 18px;
    text-align: center;
    color: #e6a23c;
    cursor: pointer;
  }
}
//去除el-scrollbar下方横向滚动条
.el-scrollbar__wrap {
  overflow-x: hidden;
}
.el-cascader-menu {
  height: 450px;
}
.el-cascader {
  width: 100%;
}

.el-select {
  display: block; width: 100%;
}

</style>
