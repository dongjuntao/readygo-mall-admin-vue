<template>
  <div>
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" label-width="80px">
      <el-form-item label="商品规格">
        <el-select style="width: 44%" value-key="id" clearable placeholder="请选择规格" ref="selectedSpecifications" v-model="selectedSpecifications" @change="selectSpecificationValue">
          <el-option
            v-for="item in specificationList"
            :key="item.id"
            :label="item.name"
            :value="item">
          </el-option>
        </el-select>
        <el-select style="width: 44%;" value-key="id" clearable placeholder="请选择规格值" ref="selectedSpecificationsValue" v-model="selectedSpecificationsValue" @change="addSelectedSpec">
          <el-option
            v-for="item in specificationValueList"
            :key="item.id"
            :label="item.value"
            :value="item">
          </el-option>
        </el-select>
        <el-button type="primary" style="margin-left: 6px;" @click="addSpecificationsHandle">新建商品规格</el-button>
      </el-form-item>

      <el-form-item>
        <el-card style="background: #F8F9FC;">
          <template v-for="selectedSpec in selectedSpecificationsAndValueList" ref="selectedSpecificationsAndValueList">
            <div class="tag-group">
              <el-tag closable effect="dark" size="medium" type=""  @close="handleClose(selectedSpec)">
                {{selectedSpec.name}}
              </el-tag>
            </div>
            <span style="margin-left: 5px;" v-for="item in selectedSpec.specificationsDetailList">
              <el-tag closable size="small" @close="handleClose(selectedSpec,item)">{{ item.value }}</el-tag>
            </span>
          </template>
        </el-card>
      </el-form-item>

      <el-form-item prop="goodsSpecificationsDetailEntityList">
        <el-table
          :data="dataForm.goodsSpecificationsDetailEntityList"
          border
          @selection-change=""
          style="width: 100%;">
          <el-table-column
            header-align="center"
            align="center"
            label="sku编号"
            width="162"
            fixed>
            <template slot-scope="scope">
              <el-input v-model="scope.row.code"></el-input>
            </template>
          </el-table-column>
          <el-table-column
            v-if="selectedSpecificationsAndValueList.length>0"
            v-for="(selectedSpecifications,index) in selectedSpecificationsAndValueList"
            :key="index"
            width="120"
            header-align="center"
            align="center"
            :label="selectedSpecifications.name">
            <template slot-scope="scope">
              {{ JSON.parse(scope.row.extendValue)[index].value}}
            </template>
          </el-table-column>
          <el-table-column
            header-align="center"
            align="center"
            label="价格（元）"
            width="140">
            <template slot-scope="scope">
              <el-input-number v-model="scope.row.price" controls-position="right" size="medium" :min="0" :max="999999">
              </el-input-number>
            </template>
          </el-table-column>
          <el-table-column
            header-align="center"
            align="center"
            label="库存"
            width="140">
            <template slot-scope="scope">
              <el-input-number v-model="scope.row.stock" controls-position="right" size="medium" :min="0" :max="999999">
              </el-input-number>
            </template>
          </el-table-column>
          <el-table-column
            header-align="center"
            align="center"
            label="重量（kg）"
            width="140">
            <template slot-scope="scope">
              <el-input-number v-model="scope.row.weight" controls-position="right" size="medium" :min="0" :max="999999">
              </el-input-number>
            </template>
          </el-table-column>
          <el-table-column
            header-align="center"
            align="center"
            label="体积（m³）"
            width="140">
            <template slot-scope="scope">
              <el-input-number v-model="scope.row.volume" controls-position="right" size="medium" :min="0" :max="999999">
              </el-input-number>
            </template>
          </el-table-column>
          <el-table-column
            header-align="center"
            align="center"
            label="操作">
            <template slot-scope="scope">
              <el-button v-if="!scope.row.enable" type="text" size="small" @click="updateEnable(scope.$index,scope.row.enable)">启用</el-button>
              <el-button v-if="scope.row.enable" type="text" size="small" @click="updateEnable(scope.$index,scope.row.enable)">禁用</el-button>
              <el-button type="text" size="small" @click="remove(scope.$index)">移除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>

      <el-form-item label="商品参数" prop="params">
        <el-button type="primary" plain @click="addGoodsParams">新增+</el-button>
      </el-form-item>
      <el-form-item>
        <el-table
          :data="dataForm.params"
          border
          @selection-change=""
          style="width: 100%;">
          <el-table-column
            header-align="center"
            align="center"
            label="参数名称"
            width="400">
            <template slot-scope="scope">
              <el-input v-model="scope.row.name" placeholder="请输入参数名称" ></el-input>
            </template>
          </el-table-column>
          <el-table-column
            header-align="center"
            align="center"
            label="参数值"
            width="600">
            <template slot-scope="scope">
              <el-input v-model="scope.row.value" placeholder="请输入参数值" ></el-input>
            </template>
          </el-table-column>
          <el-table-column
            header-align="center"
            align="center"
            label="操作">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="deleteGoodsParams(scope.$index)">移除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
    </el-form>
    <!-- 弹窗, 新增 -->
    <add-or-update v-if="addVisible" ref="addOrUpdate" @refreshDataList="getGoodsSpecificationsList"></add-or-update>
  </div>
</template>

<script>
import AddOrUpdate from '../specifications-add-or-update'
import { getGoodsSpecificationsListAll } from '@/api/mall-goods/goods-specifications'

export default {
  data () {
    return {
      visible: false,
      dataForm: {
        goodsSpecificationsDetailEntityList: [],
        params: []
      },

      dataRule: {
        name: [
          { required: true, message: '分类名称不能为空', trigger: 'blur' }
        ],
        parentName: [
          { required: true, message: '上级分类不能为空', trigger: 'change' }
        ]
      },
      goodsSpecificationsDetailEntity : {
        code: '',
        name: '',
        price: '',
        stock: '',
        weight: '',
        volume: null,
        enable: true,
        extendAttr: '',//扩展的属性
        extendValue: '' //扩展的属性值
      },
      addVisible: false, //是否显示新增规格的弹窗
      specificationList: [],//规格列表
      specificationValueList: [], //规格值列表
      selectedSpecifications: {}, //已选的规格
      selectedSpecificationsValue: {},//已选的规格值
      selectedSpecificationsAndValueList:[], //已选好的规格和规格值列表，可以删除
      selectedSpecificationsValueList: [] //规格值列表
    }
  },
  components: {
    AddOrUpdate
  },
  mounted () {
    this.getGoodsSpecificationsList();
  },
  methods: {
    // 新增规格
    addSpecificationsHandle () {
      this.addVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init()
      })
    },
    /**
     * 新增商品参数
     */
    addGoodsParams() {
      var params = {
        name: '',
        value: ''
      }
      this.dataForm.params.push(params);
    },
    /**
     * 删除商品参数
     */
    deleteGoodsParams(index) {
      this.dataForm.params.splice(index,1);
    },

    getGoodsSpecificationsList() {
      getGoodsSpecificationsListAll(this.axios.paramsHandler()).then(({data})=>{
        if (data && data.data) {
          this.specificationList = data.data
        }
      });
    },
    //选择规格值
    selectSpecificationValue(value) {
     var specificationValueList = this.specificationList.find(item=>{return item.id === value.id});
     if (specificationValueList) {
       this.specificationValueList = specificationValueList.goodsSpecificationsDetailEntityList;
       this.selectedSpecificationsValue = null;
     }
    },
    //添加到已选规格中
    addSelectedSpec(item) {
      var specificationsDetailObj = {};
      var specificationsDetailList = [];

      var selectedSpecificationsAndValueList = this.selectedSpecificationsAndValueList.find((spec)=>{ return spec.id === this.selectedSpecifications.id });
      if (!selectedSpecificationsAndValueList) {
        if (this.selectedSpecificationsAndValueList.length>2) {
          this.$message.warning("最多可以选择三种规格")
          return;
        }
        specificationsDetailObj.id = item.id;
        specificationsDetailObj.value = item.value
        specificationsDetailList.push(specificationsDetailObj);
        this.selectedSpecificationsAndValueList.push({
          id: this.selectedSpecifications.id,
          name: this.selectedSpecifications.name,
          specificationsDetailList: specificationsDetailList
        })
      }else {
        //不能重复选择相同的规格值
        if (selectedSpecificationsAndValueList.specificationsDetailList.find(detail=>{ return detail.id=== item.id})) {
          this.$message.warning("规格值已存在")
          return;
        }
        specificationsDetailObj.id = item.id;
        specificationsDetailObj.value = item.value
        selectedSpecificationsAndValueList.specificationsDetailList.push(specificationsDetailObj)
      }
      //自动生成sku
      this.generateSku();
    },

    /**
     * 删除规格或规格值
     */
    handleClose(selectedSpec,item){
      //表示删除规格，下面所有的规格值一并删除
      if (!item) {
        this.selectedSpecificationsAndValueList.splice(this.selectedSpecificationsAndValueList.findIndex(spec=>{ return spec.id === selectedSpec.id}),1);
      }else { //删表示除规格值
        //找到就删除
        var selectedSpecificationsAndValue = this.selectedSpecificationsAndValueList.find((spec)=>{ return spec.id === selectedSpec.id });
        if (selectedSpecificationsAndValue) {
          var specificationsDetailList = selectedSpecificationsAndValue.specificationsDetailList;
          //如果一个规格只剩下一个规格值，不允许删除，至少保证有一个值
          if(specificationsDetailList.length==1) {
            this.$message.warning("每种规格至少有一个规格值")
            return;
          }
          specificationsDetailList.splice(specificationsDetailList.findIndex(detail=>{ return detail.id === item.id}),1)
        }
      }
      this.generateSku();
    },

    /**
     * 动态生成sku信息
     */
    generateSku() {
      var selectedSpecificationsValueListArray = [];
      var extendAttr = [];
      if (this.selectedSpecificationsAndValueList && this.selectedSpecificationsAndValueList.length>0) {
        for(var i=0;i<this.selectedSpecificationsAndValueList.length;i++) {
          var specificationsDetailList = this.selectedSpecificationsAndValueList[i].specificationsDetailList;
          var selectedSpecificationsValue = [];
          for (var j=0; j<specificationsDetailList.length; j++) {
            selectedSpecificationsValue.push({id: specificationsDetailList[j].id, value: specificationsDetailList[j].value});
          }
          selectedSpecificationsValueListArray.push(selectedSpecificationsValue);
          extendAttr.push(this.selectedSpecificationsAndValueList[i])
        }
      }
      this.dataForm.goodsSpecificationsDetailEntityList = [];
      if (selectedSpecificationsValueListArray.length>0){
        //获取可能组合的结果
        var combinationResult = this.getCombinationResult(selectedSpecificationsValueListArray);
        for (var i=0; i<combinationResult.length; i++) {
          var every = combinationResult[i];
          var extendValue = [];
          if (every instanceof Array){
            for (var j=0; j<every.length; j++){
              extendValue.push({id: every[j].id, value: every[j].value})
            }
            var goodsSpecificationsDetailEntity = Object.assign({}, this.goodsSpecificationsDetailEntity);
            goodsSpecificationsDetailEntity.extendValue = JSON.stringify(extendValue);//扩展属性值
          }else {
            var goodsSpecificationsDetailEntity = Object.assign({}, this.goodsSpecificationsDetailEntity);
            extendValue.push({id: every.id, value: every.value});
            goodsSpecificationsDetailEntity.extendValue = JSON.stringify(extendValue);//扩展属性值
          }
          goodsSpecificationsDetailEntity.extendAttr = JSON.stringify(extendAttr);
          this.dataForm.goodsSpecificationsDetailEntityList.push(goodsSpecificationsDetailEntity)
        }
      }
    },
    // 启用、禁用
    updateEnable(index, enable){
      this.dataForm.goodsSpecificationsDetailEntityList[index].enable = !enable;
    },
    // 移除
    remove(index){
      this.dataForm.goodsSpecificationsDetailEntityList.splice(index,1);
    },

    /**
     * 获取多个数组的组合，如[123][456] 组合为14,15,16,24,25,26,34,35,36
     * @param arr
     * @returns {*}
     */
    getCombinationResult(arr){
      var timestamp = (new Date()).valueOf();
      var len = arr.length;
      if(len >= 2){// 当数组大于等于2个的时候
        var len1 = arr[0].length;  // 第一个数组的长度
        var len2 = arr[1].length;// 第二个数组的长度
        var lenBoth = len1 * len2;// 2个数组产生的组合数
        var items = new Array(lenBoth);//  申明一个新数组
        var index = 0;// 申明新数组的索引
        for(var i=0; i<len1; i++){
          for(var j=0; j<len2; j++){
            if(arr[0][i] instanceof Array){
              items[index] = arr[0][i].concat(arr[1][j]);
            }else{
              items[index] = [arr[0][i]].concat(arr[1][j]);
            }
            index++;
          }
        }
        var newArr = new Array(len -1);
        for(var i=2;i<arr.length;i++){
          newArr[i-1] = arr[i];
        }
        newArr[0] = items;
        return this.getCombinationResult(newArr);
      }else{
        return arr[0];
      }

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
//.el-scrollbar__wrap {
//  overflow-x: hidden;
//}

.el-select-dropdown .el-scrollbar .el-scrollbar__wrap {
  overflow: scroll!important;
}

.el-input-number {
  position: relative;
  display: inline-block;
  width: 118px;
  line-height: 35px;
}
</style>
