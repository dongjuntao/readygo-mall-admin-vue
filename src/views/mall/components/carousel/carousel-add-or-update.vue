<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="100px">
      <el-form-item label="轮播图名称" prop="name">
        <el-input v-model="dataForm.name" placeholder="导航栏名称"></el-input>
      </el-form-item>

      <el-form-item label="图片上传" prop="url">
        <el-upload
          v-model="dataForm.url"
          action="#"
          list-type="picture"
          :multiple="false"
          :show-file-list="true"
          :file-list="fileList"
          :http-request="uploadFile"
          :before-upload="beforeUpload"
          :on-remove="handleRemove">
          <el-button size="small" type="primary">点击上传</el-button>
          <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过3MB</div>
        </el-upload>
      </el-form-item>

      <el-form-item label="关联商品" prop="goodsId">
        <el-select style="width: 100%" v-model="dataForm.goodsId" filterable placeholder="请选择">
          <el-option
            v-for="item in goodsList"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="排序号" prop="sortNum">
        <el-input-number v-model="dataForm.sortNum" controls-position="right" size="small" :min="0" :max="999"></el-input-number>
      </el-form-item>
      <el-form-item label="状态" size="mini" prop="enable">
        <el-radio-group v-model="dataForm.enable">
          <el-radio :label="false">禁用</el-radio>
          <el-radio :label="true">启用</el-radio>
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
  import { getAllGoodsList } from '@/api/mall-goods/goods'
  import { getHomepageCarouselById, saveHomepageCarousel, updateHomepageCarousel } from '@/api/mall-admin/mall-homepage-carousel'
  import { fileUpload } from '@/api/mall-file/file'
  import { homepageConstant } from "@/utils/constant";
  export default {
    data () {
      return {
        visible: false,
        dataForm: {
          id: 0,
          name: '', //轮播图名称
          url: '', //轮播图地址
          goodsId: null, //关联的商品id
          sortNum: null,//排序号
          enable: false //状态（false：禁用；true：启用）
        },
        goodsList: [],
        fileList: [],
        dataRule: {
          name: [
            { required: true, message: '轮播图名称不能为空', trigger: 'blur' }
          ],
          url: [
            { required: true, message: '请上传图片', trigger: 'blur' }
          ],
          goodsId: [
            { required: true, message: '请选择关联商品', trigger: 'blur' }
          ],
        }
      }
    },
    mounted () {
      this.getAllGoods();
    },
    methods: {
      init (id) {
        this.dataForm.id = id || 0
        this.visible = true;
        this.fileList = [];
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields();//清空选择框
          if (this.dataForm.id) {
            getHomepageCarouselById(this.axios.paramsHandler({homepageCarouselId: this.dataForm.id})).then(({data}) => {
              if (data && data.code === "200") {
                this.dataForm = data.data
                //图片回显
                if (this.dataForm.url) {
                  this.fileList.push({
                    name:this.dataForm.url.substring(this.dataForm.url.lastIndexOf("/")+20),
                    url:this.dataForm.url
                  });
                }
              }
            });
          }
        })
      },

      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            var saveOrUpdate = this.dataForm.id ? updateHomepageCarousel : saveHomepageCarousel;
            var data = this.axios.dataHandler({
              id: this.dataForm.id || undefined,
              name: this.dataForm.name,
              url: this.dataForm.url,
              goodsId: this.dataForm.goodsId,
              sortNum: this.dataForm.sortNum,
              enable: this.dataForm.enable,
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

      /**
       * 获取所以商品列表
       */
      getAllGoods() {
        var allGoodsParams =  this.axios.paramsHandler({},false)
        getAllGoodsList(allGoodsParams).then(({data}) => {
          if (data && data.code === "200") {
            console.log("data===",data)
            this.goodsList = data.data
          }
        })
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
        const fileNum = this.fileList.length<1;
        if (!fileNum) {
          this.$message.error('只能上传一张图片')
        }
        return (isType || isType2) && isImg && fileNum
      },

      //上传轮播图
      uploadFile(file){
        let formData = new FormData();
        formData.append("files", file.file);
        var params = this.axios.paramsHandler({folderName: homepageConstant.homepage_carousel_folder_name})
        fileUpload(formData, params).then(({data}) => {
          this.dataForm.url = data.data;
          this.fileList.push({
            name:this.dataForm.url.substring(this.dataForm.url.lastIndexOf("/")+1),
            url:this.dataForm.url
          });
        })
      },

      //删除已上传的图片
      handleRemove(file) {
        if (this.fileList && this.fileList.length>0) {
          for (var i=0; i<this.fileList.length; i++) {
            if (file.name === this.fileList[i].name) {
              this.fileList.splice(i,1);
            }
          }
        }
        this.dataForm.url = null;
      }

    }
  }
</script>
<style lang="scss">
.el-upload-list__item.is-ready {
  display: none;
}
.el-upload-list__item {
  transition: none !important;
}

</style>
