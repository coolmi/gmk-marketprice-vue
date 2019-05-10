<template>
  <div>
    <el-button v-show="!hidden" :id="formSchema.key" :type="type" :icon="icon"
             :disabled="disabled"
               @click="click($event)">{{ formSchema.name }}</el-button>
    <gmk-upload v-if="uploadDataVisible" ref="uploadData" @complete="complete"></gmk-upload>
  </div>
</template>

<script>
  import Vue from 'vue';
  import GmkUpload from './gmk-upload'
  import {objToUrl} from '@/utils/typeUtil'

  export default {
    name: "gmk-button-upload",
    props: {
      formName: String,
      state: String,
      formSchema: Object,
      formEvent: Object,
      formParams: Object
    },
    components: {
      GmkUpload
    },
    data () {
      return {
        uploadDataVisible: false
      }
    },
    computed: {
      type: function() {
        if(this.formSchema.ui.type) {
          return this.formSchema.ui.type;
        }
        return '';
      },
      icon: function () {
        if(this.formSchema.ui.icon) {
          return this.formSchema.ui.icon;
        }
        return '';
      },
      uploadUrl: function() {
        if(this.formSchema.uploadUrl) {
          return this.$http.adornUrl(this.formSchema.uploadUrl + '?token=' + Vue.cookie.get('token')+ "&" + objToUrl(this.formParams));
        }
        return '';
      },
      templateUrl: function() {
        if(this.formSchema.templateUrl) {
          return this.$http.adornUrl(this.formSchema.templateUrl + '?token=' + Vue.cookie.get('token')+ "&" + objToUrl(this.formParams));
        }
        return '';
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
    methods: {
      click: function (event) {
        this.uploadDataVisible = true
        this.$nextTick(() => {
          this.$refs.uploadData.init(this.uploadUrl, this.templateUrl)
        })
      },
      complete: function () {   //上传完成
        if(this.formEvent != null && typeof this.formEvent != 'undefined') {
          var _btnKey = this.formSchema.key + "_complete";
          var _defition = this.formSchema.defition;
          if(_btnKey in this.formEvent) {
            this.formEvent[_btnKey](event, _defition);
          }
          else {
            this.formEvent.initPratUI(this.formName);   //刷新
          }
        }
      }
    }
  }
</script>

<style scoped>

</style>
