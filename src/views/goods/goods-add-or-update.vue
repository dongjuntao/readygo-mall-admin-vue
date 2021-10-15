<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    width="85%"
    :visible.sync="visible" :before-close="closeDialog">

    <el-steps style="margin-top: -20px;margin-bottom: 20px;" :active="active" align-center finish-status="success">
      <el-step title="商品基本信息"></el-step>
      <el-step title="商品详细信息"></el-step>
      <el-step title="商品规格参数"></el-step>
      <el-step title="商品促销信息"></el-step>
    </el-steps>
    <!--商品基本信息-->
    <GoodsBasicInfo
      v-show="showGoodsBasicInfo"
      ref="goodsBasicInfo">
    </GoodsBasicInfo>
    <!--商品详细信息-->
    <GoodsDetailInfo
      v-show="showGoodsDetailInfo"
      ref="goodsDetailInfo">
    </GoodsDetailInfo>
    <!--商品规格信息-->
    <GoodsSpecificationsInfo
      v-show="showGoodsSpecificationsInfo"
      ref="goodsSpecificationsInfo">
    </GoodsSpecificationsInfo>
    <!--商品促销信息-->
    <GoodsPromotionInfo
      v-show="showGoodsPromotionInfo"
      ref="goodsPromotionInfo">
    </GoodsPromotionInfo>
    <div style="text-align: center;">
      <el-button v-show="showGoodsBasicInfo" type="primary" @click="beforeNextStep(1,'goodsBasicInfo')">下一步，填写商品详细信息</el-button>
      <el-button v-show="showGoodsDetailInfo" type="primary" @click="previousStep(2)">上一步，填写商品基本信息</el-button>
      <el-button v-show="showGoodsDetailInfo" type="primary" @click="beforeNextStep(2,'goodsDetailInfo')">下一步，填写商品规格参数</el-button>
      <el-button v-show="showGoodsSpecificationsInfo" type="primary" @click="previousStep(3)">上一步，填写商品详细信息</el-button>
      <el-button v-show="showGoodsSpecificationsInfo" type="primary" @click="beforeNextStep(3, 'goodsSpecificationsInfo')">下一步，填写商品促销信息</el-button>
      <el-button v-show="showGoodsPromotionInfo" type="primary" @click="previousStep(4, 'goodsPromotionInfo')">上一步，填写商品规格参数</el-button>
      <el-button v-show="showGoodsPromotionInfo" type="primary" @click="dataFormSubmit()">确认提交</el-button>
    </div>
  </el-dialog>
</template>

<script>
import GoodsBasicInfo from './components/goods_basic_info'
import GoodsSpecificationsInfo from './components/goods_specifications_info'
import GoodsDetailInfo from './components/goods_detail_info'
import GoodsPromotionInfo from './components/goods_promotion_info'
import { saveGoods, updateGoods, getGoodsById} from "@/api/mall-goods/goods";
export default {
  data () {
    return {
      visible: false,
      dataForm: {
        id: 0
      },
      active: 0,
      showGoodsBasicInfo: true,
      showGoodsSpecificationsInfo: false,
      showGoodsDetailInfo: false,
      showGoodsPromotionInfo: false
    }
  },
  components: {
    GoodsBasicInfo,
    GoodsSpecificationsInfo,
    GoodsDetailInfo,
    GoodsPromotionInfo
  },
  created () {
  },
  methods: {
    init (id) {
      this.visible=true
      this.$nextTick(() => {
        this.dataForm.id = id;
        //每次打开，进入第一步
        this.active = 0;
        this.showGoodsBasicInfo = true;
        this.showGoodsSpecificationsInfo = false;
        this.showGoodsDetailInfo = false;
        this.showGoodsPromotionInfo = false;
        if (this.dataForm.id) { //修改
          getGoodsById(this.axios.paramsHandler({id: this.dataForm.id})).then(({data})=>{
            var goodsBasicInfo = this.$refs['goodsBasicInfo'].$refs['dataForm'].model; //商品基本信息
            var goodsDetailInfo = this.$refs['goodsDetailInfo'].$refs['dataForm'].model;//商品详细信息
            var goodsSpecificationsInfo = this.$refs['goodsSpecificationsInfo'].$refs['dataForm'].model;//商品规格参数
            var goodsPromotionInfo = this.$refs['goodsPromotionInfo'].$refs['dataForm'].model;//商品促销信息
            //商品基本信息
            goodsBasicInfo.name = data.data.name;
            goodsBasicInfo.description = data.data.description;
            /*直接push无法显示商品分类级联效果，故使用此方法*/
            goodsBasicInfo.goodsCategoryIds = [parseInt( data.data.goodsCategoryIds.split(",")[0]),parseInt(data.data.goodsCategoryIds.split(",")[1]),parseInt(data.data.goodsCategoryIds.split(",")[2])];
            goodsBasicInfo.brandId =  data.data.brandId;
            goodsBasicInfo.adminUserId =  data.data.adminUserId;
            goodsBasicInfo.code =  data.data.code
            goodsBasicInfo.unit =  data.data.unit
            //商品详细信息
            if (data.data.images.split(",") && data.data.images.split(",").length>0){
              this.$refs['goodsDetailInfo'].fileList = [] //先清空
              goodsDetailInfo.images = [];
              //循环回显图片
              data.data.images.split(",").forEach(image=>{
                this.$refs['goodsDetailInfo'].fileList.push({url:image})
                goodsDetailInfo.images.push(image);
              });
            }
            // goodsDetailInfo.images = data.data.images;
            goodsDetailInfo.infoDetail = data.data.infoDetail;
            //商品规格参数
            goodsSpecificationsInfo.goodsSpecificationsDetailEntityList = data.data.goodsSkuList
            goodsSpecificationsInfo.params = JSON.parse(data.data.params)
            if (data.data.goodsSkuList && data.data.goodsSkuList.length>0) {
              this.$refs['goodsSpecificationsInfo'].selectedSpecificationsAndValueList = JSON.parse(data.data.goodsSkuList[0].extendAttr);
            }
            //商品促销信息
            goodsPromotionInfo.points = data.data.points;
            goodsPromotionInfo.recommend = data.data.recommend.split(",");
            goodsPromotionInfo.onSale = data.data.onSale;
            goodsPromotionInfo.freightSetting = data.data.freightSetting;
            goodsPromotionInfo.keyword = data.data.keyword;
          });
        }else { //新增
          this.$refs['goodsBasicInfo'].$refs['dataForm'].resetFields(); //清空商品基本信息
          this.$refs['goodsDetailInfo'].$refs['dataForm'].resetFields();//清空商品详细信息
          this.$refs['goodsSpecificationsInfo'].$refs['dataForm'].resetFields();//清空商品规格参数
          this.$refs['goodsPromotionInfo'].$refs['dataForm'].resetFields();//清空商品促销信息
          //清空规格参数信息（部分数据无法通过resetFields()清空）
          this.$refs['goodsSpecificationsInfo'].selectedSpecifications = null;
          this.$refs['goodsSpecificationsInfo'].selectedSpecificationsValue = null;
          this.$refs['goodsSpecificationsInfo'].selectedSpecificationsAndValueList = [];
          this.$refs['goodsSpecificationsInfo'].params = [];
          this.$refs['goodsDetailInfo'].fileList = [] //清空图片
        }
      })
    },

    /**
     * 下一步进行之前表单校验
     */
    beforeNextStep(step, formName) {
      return this.$refs[formName].$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.nextStep(step);
        } else {
          return false;
        }
      });
    },
    /**
     * 下一步
     * @Params step（当前是哪一步）
     */
    nextStep(step) {
      if (step == 1) {
        this.showGoodsBasicInfo=false;
        this.showGoodsDetailInfo=true;
        this.active=1;
      } else if (step == 2) {
        this.showGoodsDetailInfo=false;
        this.showGoodsSpecificationsInfo=true;
        this.active=2;
      } else if (step == 3) {
        this.showGoodsSpecificationsInfo=false;
        this.showGoodsPromotionInfo=true;
        this.active=3;
      }
    },
    /**
     * 上一步
     * @Params step（当前是哪一步）
     */
    previousStep(step) {
      if (step == 2) {
        this.showGoodsBasicInfo=true;
        this.showGoodsDetailInfo=false;
        this.active=0
      }else if (step == 3) {
        this.showGoodsDetailInfo=true;
        this.showGoodsSpecificationsInfo=false;
        this.active=1;
      }else if (step == 4) {
        this.showGoodsSpecificationsInfo=true;
        this.showGoodsPromotionInfo=false;
        this.active=2;
      }
    },
    // 表单提交
    dataFormSubmit () {
      var goodsBasicInfo = this.$refs['goodsBasicInfo'].$refs['dataForm'].model; //商品基本信息
      var goodsDetailInfo = this.$refs['goodsDetailInfo'].$refs['dataForm'].model;//商品详细信息
      var goodsSpecificationsInfo = this.$refs['goodsSpecificationsInfo'].$refs['dataForm'].model;//商品规格参数
      var goodsPromotionInfo = this.$refs['goodsPromotionInfo'].$refs['dataForm'].model;//商品促销信息
      //组织提交的参数
      var data = {
        id: this.dataForm.id || undefined,
        //商品基本信息
        name: goodsBasicInfo.name, //商品名称
        description: goodsBasicInfo.description,//商品描述
        goodsCategoryIds: goodsBasicInfo.goodsCategoryIds.join(','),//处理商品分类字段,商品分类id集合，三级分类id,如 1,2,3
        brandId: goodsBasicInfo.brandId, //品牌id
        adminUserId: goodsBasicInfo.adminUserId, //所属商户id
        code: goodsBasicInfo.code, //商品编码
        unit: goodsBasicInfo.unit, //单位
        //商品详细信息
        images: goodsDetailInfo.images.join(","),//处理商品图片字段
        infoDetail: goodsDetailInfo.infoDetail, //商品详情
        //商品规格参数
        goodsSkuList: goodsSpecificationsInfo.goodsSpecificationsDetailEntityList, //商品sku
        params: JSON.stringify(goodsSpecificationsInfo.params),//处理商品参数字段
        //商品促销信息
        points: goodsPromotionInfo.points, //积分
        recommend: goodsPromotionInfo.recommend.join(","), //商品推荐
        onSale: goodsPromotionInfo.onSale, //是否上架
        freightSetting: goodsPromotionInfo.freightSetting, //运费设置
        keyword: goodsPromotionInfo.keyword //关键词
      }

      var saveOrUpdate =  this.dataForm.id ? updateGoods : saveGoods;
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
      })

    },

    /**
     * 关闭时提示用户会清除信息
     */
    closeDialog() {
      this.$confirm(`关闭窗口，所填信息将不生效，需重新填写，确定?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        this.visible = false
        this.$emit('refreshDataList')
      }).catch(() => {})
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
</style>
