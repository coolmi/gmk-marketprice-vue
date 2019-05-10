<template>
  <div>
    <el-button v-show="!hidden" :id="formSchema.key" :type="type" :icon="icon"
             :disabled="disabled"
             @click="click($event)">{{ formSchema.name }}</el-button>
  </div>
</template>

<script>
  import Vue from 'vue';

  export default {
    name: "gmk-button",
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
        if(this.formEvent != null && typeof this.formEvent != 'undefined') {
          var _btnKey = this.formSchema.key + "_click";
          var _defition = this.formSchema.defition;
          if(_btnKey in this.formEvent) {
            this.formEvent[_btnKey](event, _defition);
          }
          else if('btn_click' in this.formEvent){
            this.formEvent.btn_click(event, _defition);
          }
          else {
            console.log('没有找到按钮方法');
          }
        }
      }
    }
  }
</script>

<style scoped>

</style>
