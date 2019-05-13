<template>
  <el-form-item :label="formSchema.name" :prop="formSchema.key" :rules="rules"
                v-show="!hidden">
    <el-radio-group v-model="value" :disabled="disabled" @change="change">
      <el-radio v-for="(item, index) in options" :key="index" :label="item[optionValue]">{{ item[optionLabel] }}</el-radio>
    </el-radio-group>
  </el-form-item>
</template>

<script>
  import Vue from 'vue';

  export default {
    name: "gmk-radio",
    props: {
      formName: String,
      state: String,
      formSchema: Object,
      formData: Object,
      formEvent: Object
    },
    data () {
      return {
        options: [],
        rules: []
      }
    },
    computed: {
      optionLabel: function () {
        if(this.formSchema.ui.datasource.label) {
          return this.formSchema.ui.datasource.label;
        }
        return 'keyname';
      },
      optionValue: function (){
        if(this.formSchema.ui.datasource.value) {
          return this.formSchema.ui.datasource.value;
        }
        return 'keyval';
      },
      datasource: function() {
        if(this.formSchema.ui.datasource.type == 'dict') {  //取自字典
          const dictgroupcode = this.formSchema.ui.datasource.parameter;
          return dictgroupcode;
        }
        else if(this.formSchema.ui.datasource.type == 'static') {  //静态数据源
          return 'static';
        }
        else if(this.formSchema.ui.datasource.type == 'url') {  //取自URL
          const url = this.formSchema.ui.datasource.parameter;
          return url;
        }
      },
      value: {
        get: function () {
          if(this.formData != null && typeof this.formData != 'undefined' &&  this.formSchema.key in this.formData) {
            return this.formData[this.formSchema.key];
          }
          if(this.formSchema.defaultval) {
            Vue.set(this.formData, this.formSchema.key, this.formSchema.defaultval);
            return this.formData[this.formSchema.key];
          }
          return null;
        },
        set: function (newValue) {
          Vue.set(this.formData, this.formSchema.key, newValue);
        }
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
      initdatasrouce() {
        if(this.formSchema.ui.datasource.type == 'dict') {  //取自字典
          const dictgroupcode = this.formSchema.ui.datasource.parameter;
          this.$http({
            url: this.$http.adornUrl(`/sys/dict/group/${dictgroupcode}`),
            method: 'get',
            params: this.$http.adornParams()
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.options = data.dicts;
            }
          })
        }
        else if(this.formSchema.ui.datasource.type == 'static') {  //静态数据源
          var datasource = this.formSchema.ui.datasource.parameter;
          this.options = str2arr(datasource);
        }
        else if(this.formSchema.ui.datasource.type == 'url') {  //取自URL
          const url = this.formSchema.ui.datasource.parameter;
          this.$http({
            url: this.$http.adornUrl(url),
            method: 'get',
            params: this.$http.adornParams()
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.options = data['formData'];
            }
          })
        }
      },
      str2arr(datasource) {
        var arr = [];
        if(datasource) {
          var items = datasource.split(",");
          for(var item of items) {
            var o = {};
            o.key = item.split(":")[0];
            o.name = item.split(":")[1];
            arr.push(o);
          }
        }
        return arr;
      },
      change: function (value) {
        var _mkey = this.formSchema.key + "_change";
        if(this.formEvent != null && typeof this.formEvent != 'undefined' && _mkey in this.formEvent) {
          this.formEvent[_mkey](value);
        }
      },
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
    },
    watch: {
      datasource: {
        handler: function(val, oldval) {
          this.initdatasrouce();
        },
        immediate: true
      }
    }
  }
</script>

<style scoped>

</style>
