<template>
  <div>
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" label-width="80px">
      <el-form-item label="积分赠送" prop="points">
        <el-input-number v-model="dataForm.points" @change="" :min="1" :max="10" label="积分"></el-input-number>
      </el-form-item>
      <el-form-item label="商品推荐" prop="recommend">
        <el-checkbox-group v-model="dataForm.recommend">
          <el-checkbox label="最新商品"></el-checkbox>
          <el-checkbox label="推荐商品"></el-checkbox>
          <el-checkbox label="特价商品"></el-checkbox>
          <el-checkbox label="热卖商品"></el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="是否上架" prop="onSale">
        <el-switch active-color="#13ce66"
                   v-model="dataForm.onSale">
        </el-switch>
      </el-form-item>
      <el-form-item label="运费设置" prop="freightSetting">
        <el-select v-model="dataForm.freightSetting" clearable placeholder="请选择">
          <el-option
            v-for="item in freightList"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="关键词" prop="keyword">
        <el-input v-model="dataForm.keyword" placeholder="关键词"></el-input>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data () {
    return {
      visible: false,
      dataForm: {
        id: 0,
        onSale: false, //是否上架
        freightSetting: null, //运费设置
        recommend: [],//商品推荐
        keyword: '', //关键词
        points: 1
      },
      freightList: [ //运费设置
        {id:1, name: '包邮'},
        {id:2, name: '不包邮'},
        {id:3, name: '大陆包邮'},
        {id:4, name: '港澳台不包邮'}
      ],

      dataRule: {
        name: [
          { required: true, message: '分类名称不能为空', trigger: 'blur' }
        ],
        parentName: [
          { required: true, message: '上级分类不能为空', trigger: 'change' }
        ]
      }
    }
  },
  created () {
  },
  methods: {
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
</style>
