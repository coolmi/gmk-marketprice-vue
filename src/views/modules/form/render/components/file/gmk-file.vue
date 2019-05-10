<template>
  <el-form-item :label="formSchema.name" :prop="formSchema.key" :rules="rules"
                v-show="!hidden">
    <el-upload name="nfile" class="upload-demo"
               :action="uploadUrl" :data="formData"
               :limit="limit" :multiple="false"
               :before-upload="onBeforeUpload" :on-success="handleSuccess" :on-remove="handleRemove"
               :on-exceed="handleExceed" :on-preview="handlePreview" :on-error="handleError"
               :file-list="fileList" :disabled="disabled">
      <el-button slot="trigger"  size="small" type="primary" :disabled="disabled">点击上传</el-button>
      <div slot="tip" class="el-upload__tip">文件不能超过{{ filemaxsize }}MB</div>
    </el-upload>
  </el-form-item>
</template>

<script>
  import Vue from 'vue';

  export default {
    name: "gmk-file",
    props: {
      formName: String,
      state: String,
      formSchema: Object,
      formData: Object,
      formEvent: Object
    },
    data () {
      return {
        rules: [],
      }
    },
    computed: {
      fileList: function() {
        if(this.formData != null && typeof this.formData != 'undefined'
          && this.formSchema.key in this.formData && this.formData[this.formSchema.key] != null && typeof this.formData[this.formSchema.key] != 'undefined') {
          return this.formData[this.formSchema.key];
        }
        return [];
      },
      uploadUrl: function() {
        return this.$http.adornUrl('/form/file/upload/'+this.formName+'/'+this.formSchema.key+'?token=' + Vue.cookie.get('token'));
      },
      limit: function() {
        if(this.formSchema.ui.limit) {
          return this.formSchema.ui.limit;
        }
        return 100;
      },
      filemaxsize: function() {
        if(this.formSchema.ui.filemaxsize) {
          return this.formSchema.ui.filemaxsize;
        }
        return 100;
      },
      disabled: function() {
        if(this.formSchema.state != null && typeof this.formSchema.state != 'undefined'
          && 'disabled' in this.formSchema.state && this.formSchema.state.disabled != null) {
          if(this.formSchema.state.disabled.startsWith("dx:")) {
            var dx = this.formSchema.state.disabled.replace("dx:", "");
            return eval(dx);
          }
          else {
            return this.formSchema.state.disabled === 'true' ? true : false;
          }
        }
        return false;
      },
      hidden: function() {
        if(this.formSchema.state != null && typeof this.formSchema.state != 'undefined'
          && 'hidden' in this.formSchema.state && this.formSchema.state.hidden != null) {
          if(this.formSchema.state.hidden.startsWith("dx:")) {
            var dx = this.formSchema.state.hidden.replace("dx:", "");
            return eval(dx);
          }
          else {
            return this.formSchema.state.hidden === 'true' ? true : false;
          }
        }
        return false;
      }
    },
    mounted() {
      if(this.formSchema.rules && this.formSchema.rules.length > 0) {
        for(var i = 0; i < this.formSchema.rules.length; i++) {
          var item = this.formSchema.rules[i];
          if(item.validator == "required") {
            this.rules.push({
              required: item.value === 'true' ? true : false,
              message: item.message,
              trigger: item.trigger
            });
          }
        }
      }

      if(this.formEvent != null && typeof this.formEvent != 'undefined' && 'rules' in this.formEvent
        && this.formEvent.rules != null && typeof this.formEvent.rules != 'undefined') {
        var extendRules = this.formEvent.rules;
        if(this.formSchema.key in extendRules) {
          var _rules = extendRules[this.formSchema.key];
          if(_rules != null && typeof _rules != 'undefined' && _rules.length > 0) {
            for(var i = 0; i < _rules.length; i++) {
              this.rules.push(_rules[i]);
            }
          }
        }
      }
    },
    methods: {
      downloadUrl(businessFileId) {
        return this.$http.adornUrl('/form/file/download/'+businessFileId+'?token=' + Vue.cookie.get('token'));
      },
      onBeforeUpload(file) {
        const isLtM = file.size / 1024 / 1024 < this.filemaxsize;
        if (!isLtM) {
          this.$message.error('上传文件不能超过'+this.filemaxsize+'MB!');
        }
        return isLtM;
      },
      handleSuccess(data, file, fileList) {
        if (data && data.code === 0) {
          var _fileId = data.businessFileId;
          if(_fileId != null && _fileId != "") {
            file.id=_fileId;

            this.$message({
              message: '上传成功',
              type: 'success',
              duration: 1500,
              onClose: () => {
                // this.visible = false
                // this.$emit('refreshDataList')
              }
            })
          }
        } else {
          this.$message.error(data.msg)
        }
      },
      handleRemove(file, fileList) {
        var _fileId =  file.id;

        var _fileIds = [_fileId];
        this.$http({
          url: this.$http.adornUrl('/form/file/delete'),
          method: 'post',
          data: this.$http.adornData(_fileIds, false)
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.$message({
              message: '删除成功',
              type: 'success',
              duration: 1500,
              onClose: () => {

              }
            })
          } else {
            this.$message.error(data.msg)
          }
        })
      },
      handleExceed(file, fileList) {
        this.$message.warning('已经到达文件上传个数限制');
      },
      handlePreview(file) {
        var _fileId =  file.id;

        let link = document.createElement('a')
        link.style.display = 'none'
        link.href = this.downloadUrl(_fileId);
        link.setAttribute('download', file.name)
        link.click();
      },
      handleError(err, file, fileList) {
        this.$message.error("文件上传失败")
      }
    },
    // watch: {
    //
    // }
  }
</script>

<style scoped>

</style>
