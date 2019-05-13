<template>
  <el-dialog
    title="表单页面"
    :close-on-click-modal="false" width="100%"
    :visible.sync="visible" :append-to-body="true" @close="closeDialog">
    <div class="mod-config">
      <el-button @click="addRow()">新增</el-button>
      <el-button @click="dataFormSubmit()">保存</el-button>
      <el-table
        :data="dataList"
        border
        v-loading="dataListLoading"
        style="width: 100%;">
        <el-table-column prop="validator" header-align="center" align="center" label="校验规则" width="140">
          <template slot-scope="scope">
            <el-select v-model="scope.row.validator" placeholder="">
              <el-option label="必填" value="required"></el-option>
              <el-option label="最小长度" value="min"></el-option>
              <el-option label="最大长度" value="max"></el-option>
              <el-option label="正则表达式" value="pattern"></el-option>
              <el-option label="唯一值" value="unique"></el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column prop="validvalue" header-align="center" align="center" label="校验规则参数">
          <template slot-scope="scope">
            <el-input v-model="scope.row.validvalue" placeholder=""></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="message" header-align="center" align="center" label="规则提醒">
          <template slot-scope="scope">
            <el-input v-model="scope.row.message" placeholder=""></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="validtrigger" header-align="center" align="center" label="规则触发时机">
          <template slot-scope="scope">
            <el-select v-model="scope.row.validtrigger" placeholder="">
              <el-option label="无" value=""></el-option>
              <el-option label="blur" value="blur"></el-option>
              <el-option label="change" value="change"></el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column
          fixed="right"
          header-align="center"
          align="center"
          width="150"
          label="操作">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="delRow(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </el-dialog>
</template>

<script>
  export default {
    name: "form-rule",
    data() {
      return {
        visible: false,
        pageinfoid: 0,
        pageuiid: 0,
        dataListLoading: false,
        dataList: []
      }
    },
    activated () {
      this.getDataList()
    },
    methods: {
      getDataList: function(){
        this.init(this.pageinfoid, this.pageuiid)
      },
      init: function (pageinfoid, pageuiid) {
        this.visible = true
        this.pageinfoid = pageinfoid
        this.pageuiid = pageuiid;

        this.$nextTick(() => {
          this.$http({
            url: this.$http.adornUrl('/form/pageuirule/rules/' + this.pageinfoid + '/' + this.pageuiid),
            method: 'get',
            params: this.$http.adornParams()
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.dataList = data.rules
            }
          })
        })
      },
      addRow() {
        this.dataList.push({
          pageinfoid: 0,
          pageuiid: 0,
          validator: '',
          validvalue: '',
          message: '',
          validtrigger: ''
        });
      },
      delRow: function (index, item) {
        this.dataList.splice(index, 1);
      },
      dataFormSubmit: function() {
        this.$http({
          url: this.$http.adornUrl('/form/pageuirule/save'),
          method: 'post',
          data: this.$http.adornData({
            'pageinfoid': this.pageinfoid,
            'pageuiid': this.pageuiid,
            'rules': this.dataList
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.$message({
              message: '操作成功',
              type: 'success',
              duration: 1500,
              onClose: () => {
                // this.visible = false
                // this.$emit('refreshDataList')
              }
            })
          } else {
            this.$message.error(data.msg)
          }
        })
      },
      closeDialog() {
        // this.$emit('refreshNode', this.catalogueid)
      }
    }
  }
</script>

<style scoped>

</style>
