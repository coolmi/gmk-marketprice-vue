<template>
  <div>
    <!-- API服务发布 -->
    <el-row>
      <el-col :span="6">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>服务组</span>
            <el-button style="float: right; padding: 3px 0" type="text" @click="handleAddGroup()">ADD</el-button>
          </div>
          <div>
            <el-tree :data="treedata" node-key="id" :default-expanded-keys="[0]" :props="defaultProps" @node-click="handleNodeClick"></el-tree>
          </div>
        </el-card>
      </el-col>
      <el-col :span="18">
        <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
          <el-form-item>
            <el-input v-model="dataForm.tablename" placeholder="表名" clearable></el-input>
          </el-form-item>
          <el-form-item>
            <el-button @click="getDataList()">查询</el-button>
            <!--<el-button type="primary" @click="modelapiAddOrUpdateHandle(currentGroupId)">基于模型发布（暂时废弃这个按钮）</el-button>-->
            <el-button type="primary" @click="sqlapiAddOrUpdateHandle(currentGroupId)">基于SQL发布</el-button>
          </el-form-item>
        </el-form>
        <el-table
          :data="dataList"
          border
          v-loading="dataListLoading"
          @selection-change="selectionChangeHandle"
          style="width: 100%;">
          <el-table-column
            type="selection"
            header-align="center"
            align="center"
            width="50">
          </el-table-column>
          <el-table-column
            prop="acode"
            header-align="center"
            align="center"
            label="编号">
          </el-table-column>
          <el-table-column
            prop="aname"
            header-align="center"
            align="center"
            label="服务名">
          </el-table-column>
          <el-table-column
            fixed="right"
            header-align="center"
            align="center"
            width="150"
            label="操作">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="commonUpdateHandle(scope.row)">修改</el-button>
              <el-button type="text" size="small" @click="deleteHandle(scope.row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>

    <!-- 弹窗, 新增 / 修改 -->
    <group-add-or-update v-if="groupAddOrUpdateVisible" ref="groupAddOrUpdate" @refreshDataList="getTreeData"></group-add-or-update>
    <sqlapi-add-or-update v-if="sqlapiAddOrUpdateVisible" ref="sqlapiAddOrUpdate" @refreshDataList="getDataList"></sqlapi-add-or-update>
    <modelapi-add-or-update v-if="modelapiAddOrUpdateVisible" ref="modelapiAddOrUpdate" @refreshDataList="getDataList"></modelapi-add-or-update>
  </div>
</template>

<script>
  import GroupAddOrUpdate from './group-add-or-update'

  import SqlapiAddOrUpdate from './sqlapi-add-or-update'
  import ModelapiAddOrUpdate from './modelapi-add-or-update'

  export default {
    name: "smgr-list",
    data() {
      return {
        treedata: [
          {
            id: 0,
            groupname: '所有服务',
            children: []
          }
        ],
        defaultProps: {
          children: 'children',
          label: 'groupname'
        },
        dataForm: {
          tablename: ''
        },
        currentGroupId: 0,
        dataList: [],
        dataListLoading: false,
        dataListSelections: [],
        groupAddOrUpdateVisible: false,
        sqlapiAddOrUpdateVisible: false,
        modelapiAddOrUpdateVisible: false
      }
    },
    components: {
      GroupAddOrUpdate, SqlapiAddOrUpdate, ModelapiAddOrUpdate
    },
    activated () {
      this.getTreeData()
    },
    methods: {
      getTreeData () {
        //获取API服务组的列表
        this.treedata[0].children = [];
        this.$http({
          url: this.$http.adornUrl('/form/smgrgroup/list'),
          method: 'get',
          params: this.$http.adornParams({
            // 'tablename': this.dataForm.tablename
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            if(data.list != null && typeof data.list != 'undefined' && data.list.length > 0) {
              for(var treeitem of data.list) {
                this.treedata[0].children.push(treeitem)
              }
            }
          }
        })
      },
      getDataList() {
        this.dataListLoading = true

        if(this.currentGroupId > 0) {
          this.$http({
            url: this.$http.adornUrl('/form/smgrapiinfo/grouplist/' + this.currentGroupId),
            method: 'get',
            params: this.$http.adornParams()
          }).then(({data}) => {
            if (data && data.code === 0) {
              if(data.list != null && typeof data.list != 'undefined' && data.list.length > 0) {
                this.dataList = data.list;
              }
            }
            this.dataListLoading = false
          })
        }
        else {
          this.dataList = [];
        }
      },
      // 多选
      selectionChangeHandle (val) {
        this.dataListSelections = val
      },
      handleAddGroup(id) {
        this.groupAddOrUpdateVisible = true
        this.$nextTick(() => {
          this.$refs.groupAddOrUpdate.init(id)
        })
      },
      commonUpdateHandle(row) {
        if(row.apitype === '1') {
          this.sqlapiAddOrUpdateHandle(row.groupid, row.id);
        }
        else if(row.apitype === '2') {
          this.modelapiAddOrUpdateHandle(row.groupid, row.id);
        }
      },
      // 新增 / 修改
      sqlapiAddOrUpdateHandle (groupId, id) {
        if(groupId > 0) {
          this.sqlapiAddOrUpdateVisible = true
          this.$nextTick(() => {
            this.$refs.sqlapiAddOrUpdate.init(groupId, id)
          })
        }
        else {
          this.$message.error("请选中一个服务组")
        }
      },
      modelapiAddOrUpdateHandle (groupId, id) {
        if(groupId > 0) {
          this.modelapiAddOrUpdateVisible = true
          this.$nextTick(() => {
            this.$refs.modelapiAddOrUpdate.init(groupId, id)
          })
        }
        else {
          this.$message.error("请选中一个服务组")
        }
      },
      // 删除
      deleteHandle (id) {
        var ids = id ? [id] : this.dataListSelections.map(item => {
          return item.id
        })
        this.$confirm(`确定对[id=${ids.join(',')}]进行[${id ? '删除' : '批量删除'}]操作?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl('/form/smgrapiinfo/delete'),
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
      handleNodeClick(data) {
        this.currentGroupId = data.id;
        this.getDataList();
      },
    }
  }
</script>

<style scoped>

</style>
