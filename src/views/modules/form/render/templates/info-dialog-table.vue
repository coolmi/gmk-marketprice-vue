<template>
  <el-dialog
    :title="title" :width="width"
    :close-on-click-modal="false"
    :visible.sync="visible" :append-to-body="true" @close="closeForm">
    <custom-table ref="customTable" :form-name="formName" :state="state" :form-params="formParams" @closeAndRefreshList="closeAndRefreshList" v-if="formName != ''"/>
    <span slot="footer" class="dialog-footer">
    <el-button type="primary" @click="handleSelect()">选择</el-button>
  </span>
  </el-dialog>
</template>

<script>

  export default {
    name: "info-dialog-table",
    props: {
      formName: String,
      state: String,
      formParams: Object,
      multiple: Boolean
    },
    components: {
    },
    data() {
      return {
        visible: false,
        title: '',
        width: '50%'
      }
    },
    computed: {},
    created() {
    },
    mounted() {
      this.$http({
        url: this.$http.adornUrl('/form/pageinfo/wcode/' + this.formName),
        method: 'get',
        params: this.$http.adornParams()
      }).then(({data}) => {
        if (data && data.code === 0) {
          this.title = data.formPageInfo.wname;
          if('pageattributes' in data.formPageInfo) {
            var _pageattributes = data.formPageInfo.pageattributes;
            if(_pageattributes != null && typeof _pageattributes != 'undefined'
              && _pageattributes.length > 0) {
              for(var i = 0; i < _pageattributes.length; i++) {
                if(_pageattributes[i].atrkey == 'width' && _pageattributes[i].templateatrval != '') {
                  this.width = _pageattributes[i].templateatrval + "%";
                }
              }
            }
          }
        }
      })
    },
    methods: {
      initData () {
        this.visible = true;
        this.$nextTick(() => {
          this.$refs['customTable'].initData();
        })
      },
      handleSelect() {
        var selectionList = this.$refs['customTable'].getSelectionList();
        if(selectionList && selectionList.length > 0) {
          if(this.multiple) {
            //多选
            this.visible = false
            this.$emit('closeAndSelectionList', selectionList)
          }
          else {
            if(selectionList.length == 1) {
              this.visible = false
              this.$emit('closeAndSelectionList', selectionList)
            }
            else {
              this.$message.error("只能选择一行");
            }
          }
        }
        else {
          this.$message.error("至少选择一行");
        }
      },
      showForm() {
        this.visible = true
      },
      closeForm() {
        this.visible = false
        this.$emit('close')
      },
      closeAndRefreshList(forminfo) {
        this.visible = false
        this.$emit('closeAndRefreshList', forminfo)
      }
    }
  }
</script>

<style scoped>

</style>
