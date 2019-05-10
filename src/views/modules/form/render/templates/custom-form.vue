<template>
  <!--
  普通表格模版，分为title区、form区（form、子列表）、功能区
  子列表分为功能区和列表展示区域
  -->
  <div>
    <gmk-form :ref="formName" v-if="Object.keys(formSchema).length>0" :form-name="formName" :form-schema="formSchema" :form-event="formEvent" :form-data="formData" :form-params="formParams" :state="state"></gmk-form>
    <gmk-button-area v-if="Object.keys(formSchema).length>0" :form-name="formName" :form-schema="formSchema.ui.functions" :form-event="formEvent" :form-params="formParams" :state="state"></gmk-button-area>

    <component :is="subFormTemplateName" ref="subForm" :form-name="subFormName" :state="subFormState" :form-params="subFormParams" @close="closeSubForm" @closeAndRefreshList="initPratUI" v-if="subFormVisible"></component>
    <remote-script :src="scriptUrl" @load="loadScript"></remote-script>
  </div>
</template>

<script>
  import Vue from 'vue'

  import events from '../events/index'

  export default {
    name: 'custom-form',
    props: {
      formName: String,
      state: String,
      formParams: Object
    },
    data() {
      return {
        formSchema: {},
        formData: {},
        formEvent: {},
        subFormName: '',
        subFormState: '',
        subFormParams: {},
        subFormTemplateName: '',
        subFormVisible: false,
        tempData: {}   //临时数据保存区
      }
    },
    computed: {
      scriptUrl: function() {
        return this.$http.adornUrl('/api/form/javascript/'+this.formName+'?token=' + Vue.cookie.get('token'));
      },
    },
    components: {
    },
    async created() {
      var _this = this;
      this.formEvent = events(this.formName, _this, 'form');

      let res = await this.$http.get(this.$http.adornUrl('/form/schema/form/' + this.formName));
      if (res.data && res.data.code === 0) {
        this.formSchema = res.data.schema;
      }
    },
    mounted() {

    },
    methods: {
      loadScript() {
        var _formevt0 = window[this.formName];
        if(_formevt0 != null && typeof _formevt0 != 'undefined' && Object.keys(_formevt0).length>0) {
          this.formEvent.rules = _formevt0.rules;
          if(_formevt0.methods != null && typeof _formevt0.methods != 'undefined') {
            for(var methodkey in _formevt0.methods) {
              this.formEvent[methodkey] = _formevt0.methods[methodkey];
            }
          }
        }

        this.$nextTick(() => {
          this.initData();
        })
      },
      initData() {
        this.clearFormData();
        this.formEvent.init();
      },
      initPratUI(forminfo) { //局部刷新
        this.closeSubForm();
        var _this = this;
        if(forminfo.tableColumn) {
          this.formEvent.initPratUI(forminfo.tableColumn);
        }
        else if(forminfo.fromFormName) {
          //设置找一下上层表单的子组件字段
          this.$http({
            url: this.$http.adornUrl('/form/pageinfo/parentColumnUI/' + forminfo.fromFormName),
            method: 'get',
            params: this.$http.adornParams()
          }).then(({data}) => {
            if (data && data.code === 0) {
              if(data.pageUIEntity != null && typeof data.pageUIEntity != 'undefined' && 'colkey' in data.pageUIEntity) {
                var _colkey = data.pageUIEntity.colkey;
                this.formEvent.initPratUI(_colkey);
              }
              else {
                _this.initData();
              }
            }
          })
        }
      },

      getFormParams() {
        return this.formParams;
      },
      setFormParam(key, value) {
        Vue.set(this.formParams, key, value);
      },
      setFormData(formData) {
        for(var _key in formData) {
          Vue.set(this.formData, _key, formData[_key]);
        }
      },
      setFormKeyData(key, value) {
        Vue.set(this.formData, key, value);
      },
      getFormData() {
        return this.formData;
      },
      clearFormData() {
        for(var _key in this.formData){
          delete this.formData[_key];
        }
      },
      setTempKeyData(key, value) {
        Vue.set(this.tempData, key, value);
      },
      getTempKeyData(key) {
        if(key in this.tempData) {
          return this.tempData[key];
        }
        return null;
      },
      openSubForm(subFormName, state, params) {
        this.$http({
          url: this.$http.adornUrl('/form/pageinfo/wcode/' + subFormName),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.subFormName = subFormName;
            this.subFormState = state;
            this.subFormParams = {};
            for(var skey in params) {
              Vue.set(this.subFormParams, skey, params[skey]);
            }

            this.subFormTemplateName = data.formPageInfo.template.mtcode;
            this.subFormVisible = true;

            this.$nextTick(() => {
              this.$refs.subForm.showForm();
            })
          }
        })
      },
      getSelectionList(column) {
        return this.$refs[this.formName].getSelectionList(column);
      },
      validate(callback) {
        this.$refs[this.formName].validate(callback);
      },
      showForm() {
        //无方法体
      },
      closeSubForm() {
        this.subFormVisible = false;  //重新绘制子组件
      },
      closeAndRefreshList(forminfo) {
        this.clearFormData();
        this.$emit('closeAndRefreshList', forminfo);
      }
    },
  }
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
