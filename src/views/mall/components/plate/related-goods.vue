<template>
  <el-dialog
    title="关联商品"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="110px">

      <el-form-item label="选择商品" prop="goodsIds">
        <el-select style="width: 100%"
                   v-model="dataForm.goodsIds"
                   filterable
                   multiple
                   :multiple-limit="maxLimit"
                   placeholder="请选择">
          <el-option
            v-for="item in goodsList"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>

    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>

import { getAllGoodsList } from '@/api/mall-goods/goods'
import { getHomepagePlateById, relateGoods } from '@/api/mall-admin/mall-homepage-plate'
import {getRelatedGoods} from "../../../../api/mall-admin/mall-homepage-plate";
export default {
  data () {
    return {
      visible: false,
      dataForm: {
        id: 0,
        goodsIds: null
      },
      plateId: null,//板块id
      goodsList: [], //商品列表
      maxLimit: null, //最大限制
      dataRule: {
        goodsIds: [
          { required: true, message: '请选择商品', trigger: 'blur' }
        ]
      }
    }
  },
  mounted () {
    this.getAllGoodsList();
  },
  methods: {
    init (id) {
      this.dataForm.id = id || 0
      this.visible = true;
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields();//清空选择框
        if (this.dataForm.id) {
          getHomepagePlateById(this.axios.paramsHandler({homepagePlateId: this.dataForm.id})).then(({data}) => {
            if (data && data.code === "200") {
              this.maxLimit = data.data.maxLimit
              this.getRelatedGoods();
            }
          });
        }
      })
    },

    //获取所有商品
    getAllGoodsList () {
      var allGoodsParams =  this.axios.paramsHandler({},false)
      getAllGoodsList(allGoodsParams).then(({data}) => {
        if (data && data.code === "200") {
          this.goodsList = data.data
        }
      })
    },

    /**
     * 获取关联商品
     */
    getRelatedGoods(){
      getRelatedGoods(this.dataForm.id).then(({data}) => {
        if (data && data.code === "200") {
          if (data.data) {
            var goodsIds = []
            for (var i=0; i<data.data.length;i++) {
              goodsIds.push(data.data[i].goodsId)
            }
            this.dataForm.goodsIds = goodsIds;
          }
        }
      })
    },

    // 表单提交
    dataFormSubmit () {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          var goodsIds = this.dataForm.goodsIds.map(goodsId => { return goodsId })
          var postData = this.axios.dataHandler(goodsIds, false);
          relateGoods(this.dataForm.id, postData).then(({data}) => {
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
              this.$message.error(data.message)
            }
          });
        }
      })
    }

  }
}
</script>
