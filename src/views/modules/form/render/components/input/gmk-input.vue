<template>
  <el-form-item :label="formSchema.name" :prop="formSchema.key" :rules="rules"
                v-show="!hidden">
    <el-input v-model="value" :type="type" :rows="rows" :placeholder="formSchema.ui.placeholder"
            :readonly="readonly" @change="change" @focus="focus($event)" @blur="blur($event)"></el-input>
  </el-form-item>
</template>

<script>
  import Vue from 'vue';

  export default {
    name: "gmk-input",
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
            if(this.formSchema.defaultval.startsWith("dx:")) {
              var dx = this.formSchema.defaultval.replace("dx:", "");
              Vue.set(this.formData, this.formSchema.key, eval(dx));
            }
            else {
              Vue.set(this.formData, this.formSchema.key, this.formSchema.defaultval);
            }
            return this.formData[this.formSchema.key];
          }
          return '';
        },
        set: function (newValue) {
          Vue.set(this.formData, this.formSchema.key, newValue);
        }
      },
      type: function() {
        if(this.formSchema.ui.type) {
          return this.formSchema.ui.type;
        }
        return 'text';
      },
      rows: function() {
        if(this.type == 'textarea' && this.formSchema.ui.rows) {
          return this.formSchema.ui.rows;
        }
        return 1;
      },
      readonly: function() {
        if(this.formSchema.state != null && typeof this.formSchema.state != 'undefined'
          && 'readonly' in this.formSchema.state && this.formSchema.state.readonly != null) {
          if(this.formSchema.state.readonly.startsWith("dx:")) {
            var dx = this.formSchema.state.readonly.replace("dx:", "");
            return eval(dx);
          }
          else {
            return this.formSchema.state.readonly === 'true' ? true : false;
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
          else if(item.validator == "min") {
            this.rules.push({
              min: Number(item.value),
              message: item.message,
              trigger: item.trigger
            });
          }
          else if(item.validator == "max") {
            this.rules.push({
              max: Number(item.value),
              message: item.message,
              trigger: item.trigger
            });
          }
          else if(item.validator == "pattern") {
            this.rules.push({
              pattern: item.value,
              message: item.message,
              trigger: item.trigger
            });
          }
          else if(item.validator == "unique") {
            this.rules.push({
              validator: this.formEvent.validator.unique,
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
      change: function (value) {
        var _mkey = this.formSchema.key + "_change";
        if(this.formEvent != null && typeof this.formEvent != 'undefined' && _mkey in this.formEvent) {
          this.formEvent[_mkey](value);
        }
      },
      blur: function (event) {
        var _mkey = this.formSchema.key + "_blur";
        if(this.formEvent != null && typeof this.formEvent != 'undefined' && _mkey in this.formEvent) {
          this.formEvent[_mkey](event);
        }
      },
      focus: function (event) {
        var _mkey = this.formSchema.key + "_focus";
        if(this.formEvent != null && typeof this.formEvent != 'undefined' && _mkey in this.formEvent) {
          this.formEvent[_mkey](event);
        }
      }
    }
  }
</script>

<style scoped>

</style>
