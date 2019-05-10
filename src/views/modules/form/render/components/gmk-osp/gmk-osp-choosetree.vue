<!--选择人 表单组件-->
<!--案列：
1.引入
import coscolcustomer from '@/views/flow/genemast/costomview/cos-col-customer'
2.注册
'cos-col-customer': coscolcustomer
3.使用
<cos-col-choosetree v-bind:send.sync="mainModel.send" :rootorg="rootorg" :isxskg="isxskg"  :ismul="ismul"
                               v-bind:sendtxt.sync="mainModel.sendtxt" coslabel="请选择"
                               :flag="flag" coltype="0.0625" ></cos-col-choosetree>

-->
<!--说明：
coltype：宽度样式(默认0.25，不可以用分数) 例:coltype="0.5"
cospropBoolean: 是否必填（默认true） true false
cospropMsg: 必填提示信息(默认请输入)
-->
<!--注意：-->
<template>

  <el-col :xs="getColSize('xs',coltype)" :sm="getColSize('sm',coltype)" :md="getColSize('md',coltype)"
          :lg="getColSize('lg',coltype)" v-show="!ospTreeDisabled">
    <!--<el-form-item>-->
    <el-button :style="showStyle?'position: absolute;right:0;top:-34px':''" @click="openchoosetree">{{coslabel}}
    </el-button>
    <!--</el-form-item>-->
    <el-dialog
      title="选择信息"
      :visible.sync="treeVisible"
      width="60%"
      append-to-body>
      <el-row :gutter="15" style="margin-top: 0px">
        <choosetree @trasferVal="changeSelectedVal" :rootorg="rootorg" :isxskg="isxskg" :isonlyxskg="isonlyxskg" :isinitpost="isinitpost" :chooseType="chooseType"
                    :mulCheck="ismul" ref="ctree"></choosetree>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="hidechoosetree">取 消</el-button>
        <el-button size="mini" type="primary" @click="hidechoosetree">确 定</el-button>
      </span>
    </el-dialog>
  </el-col>
</template>

<script>
  import choosetree from './choosetree'

  export default {
    props: {
      ospTreeDisabled: {
        type: Boolean,
        default: false
      },
      coltype: {
        type: String
      },
      coslabel: {
        type: String
      },
      send: {
        type: String
      },
      sendtxt: {
        type: String
      },
      rootorg: {
        type: String
      },
      isxskg: {
        type: Boolean,
        default: false
      },
      isonlyxskg: {
        type: Boolean,
        default: false
      },
      chooseType: {
        type: String,
        default: 'S'
      },
      ismul: {
        type: Boolean,
        default: false
      },
      showStyle: {
        type: Boolean,
        default: true
      }
    },
    name: 'cos-col-choosetree',
    components: {
      'choosetree': choosetree
    },
    data() {
      return {
        // assetstxtdisabled: false,
        treeVisible: false
      }
    },
    computed: {
      isinitpost: function () {
        if(this.chooseType == "O") {
          return false;
        }
        return true;
      }
    },
    watch: {},
    created() {

    },
    methods: {
      getColSize(type, val) {
        if (val === '' || val === undefined || val === null) {
          val = 1 / 4
        }
        if (type === 'xs') {
          return Math.round(24 * 4 * val)
        }
        if (type === 'sm') {
          return Math.round(12 * 4 * val)
        }
        if (type === 'md') {
          return Math.round(8 * 4 * val)
        }
        if (type === 'lg') {
          return Math.round(6 * 4 * val)
        }
      },
      changeSelectedVal(item, text) {
        this.$emit('update:send', item);
        this.$emit('update:sendtxt', text);
      },
      hidechoosetree() {
        this.treeVisible = false;
      },
      openchoosetree() {
        this.treeVisible=true;
        this.$nextTick(() => {
          this.$refs.ctree.init()
        })
      }
    }
  }
</script>

<style scoped>

</style>
