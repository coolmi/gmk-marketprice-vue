<template>
  <el-dialog width="50%"
             title="上传"
             :close-on-click-modal="false"
             :visible.sync="visible" :append-to-body="true" @close="closeDialog">
    <div class="mod-config">
      <div v-for="(message, index) in messages" :key="index">{{ message }}</div><br/>
      <el-upload name="file"
        class="upload-demo" accept="application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        :action="uploadUrl"
        :limit="1" :multiple="false"
        :on-success="handleSuccess" :before-upload="handleBeforeUpload"
        :file-list="fileList">
        <el-button size="small" type="primary">点击上传</el-button>
        <div slot="tip" class="el-upload__tip">请选择xls/xlsx文件，<a :href="templateUrl">点击此次下载模版</a></div>
      </el-upload>
    </div>
  </el-dialog>
</template>

<script>
    import Vue from 'vue'
    // import {objToUrl} from '@/utils/typeUtil'

    export default {
      name: "gmk-upload",
      data() {
          return {
            visible: false,
            uploadUrl: '',
            templateUrl: '',
            messages: [],
            fileList: [],
            loding: null
          }
      },
      methods: {
        init (uploadUrl, templateUrl) {
          this.visible = true
          this.uploadUrl = uploadUrl;
          this.templateUrl = templateUrl;
          this.fileList = [];
          this.messages = [];
        },
        handleBeforeUpload(file) {
          this.loading = this.$loading({
            lock: true,
            text: '上传中...',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
          });
          return true;
        },
        handleSuccess(data, file, fileList) {
          if (data && data.code === 0) {
            this.messages = [];
            this.$message({
              message: '上传成功',
              type: 'success',
              duration: 1500,
              onClose: () => {
                this.visible = false
                this.$emit('complete')
              }
            })
          } else {
            this.messages = data.result;
            if(data.msg) {
              this.$message.error(data.msg)
            }
          }
          this.loading.close();
        },
        closeDialog() {
          this.visible = false;
          // this.$emit('close');
        }
      }
    }
</script>

<style scoped>

</style>
