<template>
  <el-form-item :label="formSchema.name" :prop="formSchema.key" :rules="rules"
                v-show="!hidden">
    <el-input v-model="value" :placeholder="formSchema.ui.placeholder" readonly="true">
      <el-button slot="append" :disabled="disabled" @click="openInfoForm()">请选择</el-button>
    </el-input>
    <component :is="infoFormTemplateName" ref="infoForm" :form-name="infoFormName" :state="infoFormState" :form-params="infoFormParams" :multiple="multiple" @close="closeSubForm" @closeAndSelectionList="closeAndSelectionList" v-if="infoFormVisible"></component>
  </el-form-item>
</template>

<script>
  import Vue from 'vue';

  export default {
    name: "gmk-infoselect",
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
        infoFormState: '',
        infoFormTemplateName: '',
        infoFormParams: {},
        infoFormVisible: false
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
      infoFormName: function() {
        if(this.formSchema.ui.infoFormName) {
          return this.formSchema.ui.infoFormName;
        }
        return '';
      },
      multiple: function() {
        if(this.formSchema.ui.multiple) {
          return this.formSchema.ui.multiple === 'true' ? true : false;
        }
        return false;
      },
      keyid: function() {
        if(this.formSchema.ui.keyid) {
          return this.formSchema.ui.keyid;
        }
        return '';
      },
      labelid: function() {
        if(this.formSchema.ui.labelid) {
          return this.formSchema.ui.labelid;
        }
        return '';
      },
      valueid: function() {
        if(this.formSchema.ui.valueid) {
          return this.formSchema.ui.valueid;
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
      openInfoForm() {
        this.$http({
          url: this.$http.adornUrl('/form/pageinfo/wcode/' + this.infoFormName),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.infoFormParams = {};
            for(var skey in this.formData) {
              Vue.set(this.infoFormParams, skey, this.formData[skey]);
            }

            this.infoFormTemplateName = data.formPageInfo.template.mtcode;
            this.infoFormVisible = true;

            this.$nextTick(() => {
              this.$refs.infoForm.initData();
            })
          }
        })
      },
      closeSubForm() {
        this.infoFormVisible = false;  //重新绘制子组件
      },
      closeAndSelectionList(selectionList) {
        this.infoFormVisible = false;  //重新绘制子组件
        if(selectionList && selectionList.length > 0) {
          var labelstring = '';
          var valuestring = '';
          for(var i = 0; i < selectionList.length; i++) {
            var item = selectionList[i];
            if(this.labelid && this.labelid!='') {
              labelstring += item[this.labelid] + ",";
            }
            if(this.valueid && this.valueid!='') {
              valuestring += item[this.valueid] + ",";
            }
          }
          if(labelstring.length > 0) {
            labelstring = labelstring.substring(0, labelstring.length - 1);
          }
          if(valuestring.length > 0) {
            valuestring = valuestring.substring(0, valuestring.length - 1);
          }
          this.value = labelstring;
          if(this.keyid && this.keyid != '') {
            Vue.set(this.formData, this.keyid, valuestring);
          }
          this.change(selectionList);  //触发改变事件
        }
        else {
          this.change(null);  //触发改变事件
        }
      },
      change: function (value) {
        var _mkey = this.formSchema.key + "_change";
        if(this.formEvent != null && typeof this.formEvent != 'undefined' && _mkey in this.formEvent) {
          this.formEvent[_mkey](value);
        }
      }
    }
  }
</script>

<style scoped>

</style>
