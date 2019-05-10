<template>
  <el-dialog
    title="页面管理"
    :close-on-click-modal="false"
    :visible.sync="visible" width="80%">
    <el-row>
      <el-button @click="addTablePage">新增数据列表页</el-button>
      <el-button @click="addFormPage">新增表单页</el-button>
    </el-row>
    <el-table
      :data="dataList"
      border
      style="width: 100%;">
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-table
            :data="props.row.subPageInfoEntities"
            border
            style="width: 100%;">
            <el-table-column
              prop="wcode"
              header-align="center"
              align="center"
              label="页面编号">
            </el-table-column>
            <el-table-column
              prop="wname"
              header-align="center"
              align="center"
              label="页面名称">
            </el-table-column>
            <el-table-column
              prop="wtype"
              header-align="center"
              align="center"
              label="页面类型" :formatter="formatterWtype">
            </el-table-column>
          </el-table>
        </template>
      </el-table-column>
      <el-table-column
        prop="wcode"
        header-align="center"
        align="center"
        label="页面编号">
      </el-table-column>
      <el-table-column
        prop="wname"
        header-align="center"
        align="center"
        label="页面名称">
      </el-table-column>
      <el-table-column
        prop="wtype"
        header-align="center"
        align="center"
        label="页面类型" :formatter="formatterWtype">
      </el-table-column>
      <el-table-column label="操作" fixed="right">
        <template slot-scope="scope">
          <el-button
            size="mini"
            @click="editWebPage(scope.$index, scope.row)">编辑</el-button>
          <el-button
            size="mini"
            type="danger"
            @click="delWebPage(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <table-page v-if="tablePageVisible" ref="tablePage" @refreshDataList="getDataList"></table-page>
    <form-page v-if="formPageVisible" ref="formPage" @refreshDataList="getDataList"></form-page>
  </el-dialog>
</template>

<script>
  import tablePage from './design/table-page'
  import formPage from './design/form-page'

  export default {
    name: 'page-list',
    data() {
      return {
        visible: false,
        pagemenuid: 0,
        dataList: [],
        tablePageVisible: false,
        formPageVisible: false
      }
    },
    components: {
      tablePage,formPage
    },
    methods: {
      getDataList() {
        this.init(this.pagemenuid);
      },
      init(pagemenuid) {
        this.pagemenuid = pagemenuid;
        this.dataList = [];
        this.visible = true

        this.$nextTick(() => {
          this.$http({
            url: this.$http.adornUrl('/form/pageinfo/list/' + pagemenuid),
            method: 'get',
            params: this.$http.adornParams()
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.dataList = data.pageInfos;
            }
          })
        })
      },
      addTablePage() {
        this.tablePageVisible = true;
        this.$nextTick(() => {
          this.$refs.tablePage.init(this.pagemenuid, -1)
        })
      },
      addFormPage() {
        this.formPageVisible = true;
        this.$nextTick(() => {
          this.$refs.formPage.init(this.pagemenuid, -1)
        })
      },
      editWebPage(index, row) {
        var _id = row.id;
        if(row.wtype == '0') {   //列表页
          this.tablePageVisible = true;
          this.$nextTick(() => {
            this.$refs.tablePage.init(this.pagemenuid, -1, _id)
          })
        }
        else if(row.wtype == '1') {  //表单页
          this.formPageVisible = true;
          this.$nextTick(() => {
            this.$refs.formPage.init(this.pagemenuid, -1, _id)
          })
        }
      },
      delWebPage(index, row) {
        var ids = [row.id];
        this.$confirm(`确定对[id=${ids.join(',')}]进行删除操作?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl('/form/pageinfo/delete'),
            method: 'post',
            data: this.$http.adornData(ids, false)
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 1500,
                onClose: () => {
                  this.getDataList()
                }
              })
            } else {
              this.$message.error(data.msg)
            }
          })
        })
      },
      formatterWtype(row, column) {
        if(row.wtype == '0') {
          return '列表页';
        }
        else if(row.wtype == '1') {
          return '表单页';
        }
      }
    }
  }
</script>

<style scoped>

</style>
