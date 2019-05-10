<template>
  <div>
    <el-button v-show="!hidden" :id="formSchema.key" :type="type" :icon="icon"
             :disabled="disabled">
      <a :href="ahref" :target="atarget" @click="click($event)">{{ formSchema.name }}</a>
    </el-button>
  </div>
</template>

<script>
  import Vue from 'vue';
  import {objToUrl} from '@/utils/typeUtil'

  export default {
    name: "gmk-button-link",
    props: {
      formName: String,
      state: String,
      formSchema: Object,
      formEvent: Object,
      formParams: Object
    },
    data () {
      return {

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
      ahref: function() {
        if(this.formSchema.href) {
          return this.$http.adornUrl(this.formSchema.href + '?token=' + Vue.cookie.get('token')+ "&" + objToUrl(this.formParams));
        }
        return '';
      },
      atarget: function() {
        if(this.formSchema.target) {
          return this.formSchema.target;
        }
        return '_self';
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
        console.log('link button点击事件不响应，不必复写方法');
      }
    }
  }
</script>

<style scoped>

</style>
