<template>
  <div>
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" label-width="80px">
      <el-form-item label="商品相册" prop="images">
        <el-upload
          action="#"
          list-type="picture-card"
          :show-file-list="true"
          :file-list="fileList"
          :http-request="uploadFile"
          :before-upload="beforeUpload"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove">
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible" append-to-body>
          <img width="100%" :src="dialogImageUrl" alt="">
        </el-dialog>
      </el-form-item>
      <el-form-item label="商品详情" prop="infoDetail">
        <editor-bar v-model="dataForm.infoDetail" :isClear="isClear"></editor-bar>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>

import EditorBar from '@/components/wang-editor/editorItem'
import { goodsConstant } from "@/utils/constant";
import {  fileUpload, fileDelete } from '@/api/mall-file/file'
export default {
  components: { EditorBar },
  data () {
    return {
      visible: false,
      dialogVisible: false,
      dialogImageUrl: '',
      dataForm: {
        images: [], //商品相册
        infoDetail: '' //商品详细信息
      },
      fileList: [], //已上传的文件，用于移除时删除记录
      dataRule: {
        name: [
          { required: true, message: '分类名称不能为空', trigger: 'blur' }
        ],
        parentName: [
          { required: true, message: '上级分类不能为空', trigger: 'change' }
        ]
      },
      isClear: false
    }
  },
  created () {
  },
  mounted() {

  },
  methods: {
    /**
     * 上传前校验文件
     */
    beforeUpload(file){
      console.log("this.dataForm.images==",this.dataForm.images)
      const isImg = (file.size / 1024 / 1024) < 3
      if (!isImg) {
        this.$message.error('上传头像图片大小不能超过 3MB!')
      }
      const isType = file.type === "image/png"
      const isType2 = file.type === "image/jpeg"
      if (!isType && !isType2) {
        this.$message.error('上传logo图片格式为png或jpg')
      }
      const fileNum = this.dataForm.images.length<8;

      if (!fileNum) {
        this.$message.error('只能上传8张图片')
      }
      const isRepeat =  !this.dataForm.images.find(image=>{return image.indexOf(file.name) > -1})
      if(!isRepeat) {
        this.$message.error('图片名称重复')
      }
      return (isType || isType2) && isImg && fileNum && isRepeat
    },

    //上传品牌logo
    uploadFile(file){
      let formData = new FormData();
      formData.append("files", file.file);
      var params = this.axios.paramsHandler({folderName: goodsConstant.goods_folder_name })
      fileUpload(formData, params).then(({data}) => {
        this.dataForm.images.push(data.data);
      })
    },

    //预览
    handlePictureCardPreview(file){
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },

    handleRemove(file) {
      var find = this.dataForm.images.find(image=>{ return image === file.url});
      if (find && file.status === 'success') {
        this.dataForm.images.remove(find);
      }
    }
  }
}

Array.prototype.remove = function(val) {
  var index = this.indexOf(val);
  if (index > -1) {
    this.splice(index, 1);
  }
};
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

.el-upload-list--picture-card .el-upload-list__item {
  overflow: hidden;
  background-color: #fff;
  border: 1px solid #c0ccda;
  border-radius: 6px;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  width: 120px;
  height: 120px;
  margin: 0 8px 8px 0;
  display: inline-block;
}

.el-upload--picture-card {
  background-color: #fbfdff;
  border: 1px dashed #c0ccda;
  border-radius: 6px;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  width: 120px;
  height: 120px;
  line-height: 130px;
  vertical-align: top;
}

</style>
