<template>
  <div>
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" label-width="80px">
      <el-form-item label="商品名称" prop="name">
        <el-input v-model="dataForm.name" placeholder="商品名称"></el-input>
      </el-form-item>
      <el-form-item label="商品描述" prop="description">
        <el-input v-model="dataForm.description" placeholder="商品描述"></el-input>
      </el-form-item>
      <el-form-item label="商品分类" prop="goodsCategoryIds">
        <el-cascader
          :options="goodsCategory"
          clearable
          v-model="dataForm.goodsCategoryIds"
          :props="{ value: 'id',label: 'name',children: 'children'}">
        </el-cascader>
      </el-form-item>
      <el-form-item label="所属品牌" prop="brandId">
        <el-select v-model="dataForm.brandId" clearable placeholder="请选择">
          <el-option
            v-for="item in brandList"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="所属商户" prop="merchantId">
        <el-select v-model="dataForm.merchantId" clearable placeholder="请选择">
          <el-option
            v-for="item in merchantList"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="商品编号" prop="code">
        <el-input v-model="dataForm.code" placeholder="商品编号"></el-input>
      </el-form-item>
      <el-form-item label="商品单位" prop="unit">
        <el-input v-model="dataForm.unit" placeholder="商品单位"></el-input>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { getGoodsCategoryTree } from '@/api/mall-goods/goods-category'
import { getBrandListAll } from '@/api/mall-brand/brand'
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
        merchantId: null, //所属商户id
        code: '', //商品编码
        unit: '' //单位
      },
      dataRule: {
        name: [
          { required: true, message: '分类名称不能为空', trigger: 'blur' }
        ],
        parentName: [
          { required: true, message: '上级分类不能为空', trigger: 'change' }
        ]
      },
      goodsCategory:[], //商品分类
      brandList: [], //品牌列表
      merchantList: [] //所属商户
    }
  },
  mounted() {
    this.getGoodsCategory();
    this.getBrandList();
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

    /**
     * 获取品牌列表
     */
    getBrandList() {
      getBrandListAll().then(({data})=>{
        this.brandList = data.data;
      });
    }
  }
}
</script>

<style lang="scss">
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
  width: 640px;
}
.el-cascader-menu__wrap {
  height: 500px;
}

</style>
