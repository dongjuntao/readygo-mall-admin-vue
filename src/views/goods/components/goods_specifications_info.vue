<template>
  <div class="goods-specifications_info">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" label-width="80px">
      <el-form-item label="商品规格" prop="specificationType">
        <el-radio-group v-model="dataForm.specificationType">
          <el-radio :label="0">单规格</el-radio>
          <el-radio :label="1">多规格</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item v-if="dataForm.specificationType==1">
        <el-select style="width: 44%" value-key="id" clearable placeholder="请选择规格" v-model="selectedSpecifications" @change="selectSpecificationValue">
          <el-option
            v-for="item in specificationList"
            :key="item.id"
            :label="item.name"
            :value="item">
          </el-option>
        </el-select>
        <el-select style="width: 44%;" value-key="id" clearable placeholder="请选择规格值" v-model="selectedSpecificationsValue" @change="addSelectedSpec">
          <el-option
            v-for="item in specificationValueList"
            :key="item.id"
            :label="item.value"
            :value="item">
          </el-option>
        </el-select>
        <el-button type="primary" style="margin-left: 12px;" @click="addSpecificationsHandle">新建商品规格</el-button>
      </el-form-item>

      <el-form-item v-if="dataForm.specificationType==1">
        <el-card style="background: #F8F9FC;">
          <template v-for="selectedSpec in selectedSpecificationsAndValueList">
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

      <!--单规格-->
      <el-form-item v-if="dataForm.specificationType==0">
        <el-table
          size="mini"
          border
          :header-cell-style="{'background-color': '#f8f8f9','color':'#515a6e'}"
          :cell-style="{'height': '50px'}"
          :data="dataForm.goodsSingleSkuList"
          style="width: 100%;">
          <el-table-column
            header-align="center"
            align="center"
            label="商品编号"
            width="160">
            <template slot-scope="scope">
              <el-input v-model="scope.row.code" maxlength="12"></el-input>
            </template>
          </el-table-column>
          <el-table-column
            header-align="center"
            align="center"
            label="原价（元）"
            width="140">
            <template slot-scope="scope">
              <el-input v-model.trim="scope.row.originalPrice" controls-position="right" maxLength="10"></el-input>
            </template>
          </el-table-column>
          <el-table-column
            header-align="center"
            align="center"
            label="销售价（元）"
            width="140">
            <template slot-scope="scope">
              <el-input v-model.trim="scope.row.sellingPrice" controls-position="right" maxLength="10"></el-input>
            </template>
          </el-table-column>
          <el-table-column
            header-align="center"
            align="center"
            label="库存"
            width="140">
            <template slot-scope="scope">
              <el-input v-model="scope.row.stock" controls-position="right" maxLength="10"></el-input>
            </template>
          </el-table-column>
          <el-table-column
            header-align="center"
            align="center"
            label="图片">
            <template slot-scope="scope">
              <el-upload
                class="avatar-uploader"
                action="#"
                :multiple="false"
                :show-file-list="false"
                :http-request="uploadFile"
                :data="{index: scope.$index}"
                :before-upload="beforeUpload">
                <img style="width: 35px; height: 35px;" v-if="scope.row.image ? scope.row.image : $store.state.goods.firstGoodsImage" :src="scope.row.image ? scope.row.image : $store.state.goods.firstGoodsImage" class="avatar">
                <i v-else >
                  <el-button type="primary" size="mini" plain>上传</el-button>
                </i>
              </el-upload>
            </template>
          </el-table-column>
          <el-table-column
            header-align="center"
            align="center"
            label="操作"
            width="90">
            <template slot-scope="scope">
              <el-button v-if="!scope.row.enable" type="text" size="mini" @click="updateEnable(scope.$index,scope.row.enable)">启用</el-button>
              <el-button v-if="scope.row.enable" type="text" size="mini" @click="updateEnable(scope.$index,scope.row.enable)">禁用</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>

      <!--多规格-->
      <el-form-item v-if="dataForm.specificationType==1">
        <el-table
          size="mini"
          border
          v-loading="dataListLoading"
          :header-cell-style="{'background-color': '#f8f8f9','color':'#515a6e'}"
          :cell-style="{'height': '50px'}"
          :data="dataForm.goodsSkuList"
          style="width: 100%;"
          element-loading-text="正在生成SKU列表，请稍等...">
          <el-table-column
            header-align="center"
            align="center"
            label="SKU编号"
            width="160">
            <template slot-scope="scope">
              <el-input v-model="scope.row.code" maxlength="12"></el-input>
            </template>
          </el-table-column>
          <el-table-column
            v-if="selectedSpecificationsAndValueList.length>0"
            v-for="(selectedSpecifications,index) in selectedSpecificationsAndValueList"
            :key="index"
            width="110"
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
            label="原价（元）"
            width="140">
            <template slot-scope="scope">
              <el-input v-model.trim="scope.row.originalPrice" controls-position="right" maxLength="10"></el-input>
            </template>
          </el-table-column>
          <el-table-column
            header-align="center"
            align="center"
            label="销售价（元）"
            width="140">
            <template slot-scope="scope">
              <el-input v-model.trim="scope.row.sellingPrice" controls-position="right" maxLength="10"></el-input>
            </template>
          </el-table-column>
          <el-table-column
            header-align="center"
            align="center"
            label="库存"
            width="140">
            <template slot-scope="scope">
              <el-input v-model="scope.row.stock" controls-position="right" maxLength="10"></el-input>
            </template>
          </el-table-column>
          <el-table-column
            header-align="center"
            align="center"
            label="图片">
            <template slot-scope="scope">
              <el-upload
                class="avatar-uploader"
                action="#"
                :multiple="false"
                :show-file-list="false"
                :http-request="uploadFile"
                :data="{index: scope.$index}"
                :before-upload="beforeUpload">
                <img style="width: 35px; height: 35px;" v-if="scope.row.image" :src="scope.row.image" class="avatar">
                <i v-else >
                  <el-button type="primary" size="mini" plain>上传</el-button>
                </i>
              </el-upload>
            </template>
          </el-table-column>
          <el-table-column
            header-align="center"
            align="center"
            label="操作"
            width="90">
            <template slot-scope="scope">
              <el-button v-if="!scope.row.enable" type="text" size="mini" @click="updateEnable(scope.$index,scope.row.enable)">启用</el-button>
              <el-button v-if="scope.row.enable" type="text" size="mini" @click="updateEnable(scope.$index,scope.row.enable)">禁用</el-button>
              <el-button type="text" size="small" @click="remove(scope.$index)">移除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>

      <!--商品参数-->
      <el-form-item label="商品参数">
        <el-button type="primary" plain @click="addGoodsParams">新增+</el-button>
      </el-form-item>
      <el-form-item>
        <el-table
          :data="dataForm.params"
          border
          style="width: 100%;">
          <el-table-column
            header-align="center"
            align="center"
            label="参数名称"
            width="440">
            <template slot-scope="scope">
              <el-input v-model="scope.row.name" placeholder="请输入参数名称" ></el-input>
            </template>
          </el-table-column>
          <el-table-column
            header-align="center"
            align="center"
            label="参数值">
            <template slot-scope="scope">
              <el-input v-model="scope.row.value" placeholder="请输入参数值" ></el-input>
            </template>
          </el-table-column>
          <el-table-column
            header-align="center"
            align="center"
            label="操作" width="90">
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
import { goodsConstant } from '@/utils/constant';
import { fileUpload } from '@/api/mall-file/file'

export default {
  data () {
    return {
      visible: false,
      dataForm: {
        goodsSingleSkuList : [{
          code: '',
          name: '',
          originalPrice: 0,
          sellingPrice: 0,
          stock: 0,
          image: this.$store.state.goods.firstGoodsImage,
          enable: true
        }], //单规格，只有一个
        goodsSkuList: [],//多规格sku列表
        params: [],
        specificationType: 0 //默认单规格
      },
      dataListLoading: false,
      dataRule: {
        name: [
          { required: true, message: '分类名称不能为空', trigger: 'blur' }
        ],
        parentName: [
          { required: true, message: '上级分类不能为空', trigger: 'change' }
        ]
      },
      goodsSkuEntity : {
        code: '',
        name: '',
        originalPrice: 0,
        sellingPrice: 0,
        stock: 0,
        image: null,
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
      this.dataForm.goodsSkuList = [];
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
            var goodsSkuEntity = Object.assign({}, this.goodsSkuEntity);
            goodsSkuEntity.extendValue = JSON.stringify(extendValue);//扩展属性值
          }else {
            var goodsSkuEntity = Object.assign({}, this.goodsSkuEntity);
            extendValue.push({id: every.id, value: every.value});
            goodsSkuEntity.extendValue = JSON.stringify(extendValue);//扩展属性值
          }
          //sku默认使用商品相册的第一张图片
          goodsSkuEntity.image = this.$store.state.goods.firstGoodsImage
          goodsSkuEntity.extendAttr = JSON.stringify(extendAttr);
          this.dataForm.goodsSkuList.push(goodsSkuEntity)
        }
      }
    },
    // 启用、禁用
    updateEnable(index, enable){
      this.dataForm.goodsSkuList[index].enable = !enable;
    },
    // 移除
    remove(index){
      this.dataForm.goodsSkuList.splice(index,1);
    },

    /**
     * 上传前校验文件
     */
    beforeUpload(file){
      const isImg = (file.size / 1024 / 1024) < 3
      if (!isImg) {
        this.$message.error('上传图片大小不能超过 3MB!')
      }
      const isType = file.type === "image/png"
      const isType2 = file.type === "image/jpeg"
      if (!isType && !isType2) {
        this.$message.error('上传图片格式为png或jpg')
      }
      return (isType || isType2) && isImg
    },

    //上传商品SKU图
    uploadFile(file){
      let index = file.data.index;
      let formData = new FormData();
      formData.append("files", file.file);
      var params = this.axios.paramsHandler({ folderName: goodsConstant.goods_sku_folder_name })
      fileUpload(formData, params).then(({data}) => {
        this.$forceUpdate();
        if (this.dataForm.specificationType == 0) {
          this.dataForm.goodsSingleSkuList[index].image = data.data;
        } else {
          this.dataForm.goodsSkuList[index].image = data.data;
        }
      })
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

<style lang="scss" >
  .el-select-dropdown .el-scrollbar .el-scrollbar__wrap {
    overflow: scroll!important;
  }

</style>
