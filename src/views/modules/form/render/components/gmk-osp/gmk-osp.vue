<template>
  <el-form-item :label="formSchema.name" :prop="formSchema.key" :rules="rules"
                v-show="!hidden">
    <el-input v-model="value" :placeholder="formSchema.ui.placeholder" readonly="true">
      <template slot="append">
        <gmk-osp-choosetree :showStyle="false" v-bind:send.sync="keyidvalue" v-bind:sendtxt.sync="value" :chooseType="chooseType"  :ismul="multiple" coslabel="请选择"
                            :ospTreeDisabled="disabled"></gmk-osp-choosetree>
      </template>
    </el-input>
  </el-form-item>
</template>

<script>
  import Vue from 'vue';
  import GmkOspChoosetree from './gmk-osp-choosetree'

  export default {
    name: "gmk-osp",
    components: {
      'gmk-osp-choosetree': GmkOspChoosetree
    },
    props: {
      formName: String,
      state: String,
      formSchema: Object,
      formData: Object,
      formEvent: Object
    },
    data () {
      return {
        rules: []
      }
    },
    computed: {
      value: {
        get: function () {
          if(this.formData != null && typeof this.formData != 'undefined' &&  this.formSchema.key in this.formData) {
            return this.formData[this.formSchema.key];
          }
          if(this.formSchema.defaultval) {
            Vue.set(this.formData, this.formSchema.key, this.formSchema.defaultval);
            return this.formData[this.formSchema.key];
          }
          return '';
        },
        set: function (newValue) {
          Vue.set(this.formData, this.formSchema.key, newValue);
        }
      },
      keyid: function() {
        if(this.formSchema.ui.keyid) {
          return this.formSchema.ui.keyid;
        }
        return '';
      },
      keyidvalue: {
        get: function () {
          if(this.keyid != null && typeof this.keyid != 'undefined' && this.keyid != '') {
            return this.formData[this.keyid];
          }
          return '';
        },
        set: function (newValue) {
          if(this.keyid != null && typeof this.keyid != 'undefined' && this.keyid != '') {
            Vue.set(this.formData, this.keyid, newValue);
          }
        }
      },
      chooseType: function() {
        if(this.formSchema.ui.chooseType) {
          return this.formSchema.ui.chooseType;
        }
        return 'O';
      },
      multiple: function() {
        if(this.formSchema.ui.multiple) {
          return this.formSchema.ui.multiple === 'true' ? true : false;
        }
        return false;
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
      // change: function (value) {
      //   var _mkey = this.formSchema.key + "_change";
      //   if(this.formEvent != null && typeof this.formEvent != 'undefined' && _mkey in this.formEvent) {
      //     this.formEvent[_mkey](value);
      //   }
      // },
      // blur: function (event) {
      //   var _mkey = this.formSchema.key + "_blur";
      //   if(this.formEvent != null && typeof this.formEvent != 'undefined' && _mkey in this.formEvent) {
      //     this.formEvent[_mkey](event);
      //   }
      // },
      // focus: function (event) {
      //   var _mkey = this.formSchema.key + "_focus";
      //   if(this.formEvent != null && typeof this.formEvent != 'undefined' && _mkey in this.formEvent) {
      //     this.formEvent[_mkey](event);
      //   }
      // }
    }
  }
</script>

<style scoped>

</style>
