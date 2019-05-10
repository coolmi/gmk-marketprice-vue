<template>
  <el-form-item :label="formSchema.name" :prop="formSchema.key" :rules="rules"
                v-show="!hidden">
    <el-date-picker style="width: 100%;" v-model="value"
                    :type="type" :placeholder="formSchema.ui.placeholder" :value-format="valueFormat" :picker-options="pickerOptions"
                    :readonly="readonly" :disabled="disabled" @change="change" @focus="focus($event)" @blur="blur($event)">
    </el-date-picker>
  </el-form-item>
</template>

<script>
  import Vue from 'vue';

  export default {
    name: "gmk-date",
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
      type: function() {
        if(this.formSchema.ui.type) {
          return this.formSchema.ui.type;
        }
        return 'text';
      },
			valueFormat: function() {
				if(this.type == 'datetime') {
					return 'yyyy-MM-dd HH:mm:ss';
				}
				return 'yyyy-MM-dd';
			},
      maxdate: function() {
        if(this.formSchema.ui.maxdate) {
          if(this.formSchema.ui.maxdate.startsWith("dx:")) {
            var dx = this.formSchema.ui.maxdate.replace("dx:", "");
            return eval(dx);
          }
          else {
            return this.formSchema.ui.maxdate;
          }
        }
        return '';
      },
      mindate: function() {
        if(this.formSchema.ui.mindate) {
          if(this.formSchema.ui.mindate.startsWith("dx:")) {
            var dx = this.formSchema.ui.mindate.replace("dx:", "");
            return eval(dx);
          }
          else {
            return this.formSchema.ui.mindate;
          }
        }
        return '';
      },
      pickerOptions: function() {
        let _this = this;
        return {
          disabledDate(time) {
            if(time && _this.maxdate) {
              var _b1 =  time.getTime() > new Date(_this.maxdate);
              if(_b1) {
                return _b1;
              }
            }
            if(time && _this.mindate) {
              var _b2 = time.getTime() < new Date(_this.mindate);
              if(_b2) {
                return _b2;
              }
            }
            return false;
          }
        };
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
          // else if(item.validator == "min") {
          //   this.rules.push({
          //     min: Number(item.value),
          //     message: item.message,
          //     trigger: item.trigger
          //   });
          // }
          // else if(item.validator == "max") {
          //   this.rules.push({
          //     max: Number(item.value),
          //     message: item.message,
          //     trigger: item.trigger
          //   });
          // }
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
