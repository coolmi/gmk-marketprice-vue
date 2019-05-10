<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false" width="80%"
    :visible.sync="visible" @close="closeDialog">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" label-width="120px">
      <el-row>
        <el-col :span="24">
          <el-form-item label="服务名" prop="aname">
            <el-input v-model="dataForm.aname" placeholder=""></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="编号" prop="acode">
            <el-input v-model="dataForm.acode" placeholder=""></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="接口类型" prop="atype">
            <el-radio-group v-model="dataForm.atype">
              <el-radio label="3">根据主键获取信息</el-radio>
              <el-radio label="4">插入</el-radio>
              <el-radio label="5">根据主键更新</el-radio>
              <el-radio label="6">根据主键删除</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-show="dataForm.atype ==='4' || dataForm.atype === '5'">
        <el-col :span="24">
          <el-form-item label="更新字段类型" prop="uptype">
            <el-radio-group v-model="dataForm.uptype">
              <el-radio label="0">全部更新，我只对特殊字段说明</el-radio>
              <el-radio label="1">只更新特殊说明的字段</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="存储模型" prop="sqltype">
            <el-button @click="addPageTable">添加存储模型</el-button>
            <el-table :data="dataForm.tables" border>
              <el-table-column label="存储模型" width="180">
                <template slot-scope="scope">
                  <el-autocomplete class="inline-input" v-model="scope.row.tablename" value-key="tablename"
                                   :fetch-suggestions="querySearchTable" placeholder=""></el-autocomplete>
                </template>
              </el-table-column>
              <el-table-column label="排序" width="180">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.sort" placeholder=""></el-input>
                </template>
              </el-table-column>
              <el-table-column label="操作" fixed="right">
                <template slot-scope="scope">
                  <el-button
                    size="mini"
                    type="danger" @click="delPageTable(scope.$index, scope.row)">删除
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row v-show="dataForm.atype ==='4' || dataForm.atype === '5'">
        <el-col :span="24">
          <el-form-item label="特殊字段说明" >
            <el-button @click="addPageColumn">添加字段</el-button>
            <el-table :data="dataForm.columns" border>
              <el-table-column label="存储模型" width="180">
                <template slot-scope="scope">
                  <el-autocomplete class="inline-input" v-model="scope.row.tablename" value-key="tablename"
                                   :fetch-suggestions="querySearchTable" placeholder=""></el-autocomplete>
                </template>
              </el-table-column>
              <el-table-column label="字段KEY" width="180">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.colkey" placeholder=""></el-input>
                </template>
              </el-table-column>
              <el-table-column label="默认值" width="180">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.defalutval" placeholder="" ></el-input>
                </template>
              </el-table-column>
              <el-table-column label="值说明" width="180">
                <template slot-scope="scope">
                  <el-select clearable v-model="scope.row.enumtype" placeholder="请选择">
                    <el-option key="0" label="删除标志位(0未删除,1已删除)" value="0"></el-option>
                    <el-option key="1" label="创建人员ITCOCE" value="1"></el-option>
                    <el-option key="2" label="创建人员姓名" value="2"></el-option>
                    <el-option key="3" label="创建时间" value="3"></el-option>
                    <el-option key="4" label="当前用户ITCODE" value="4"></el-option>
                    <el-option key="5" label="当前用户名称" value="5"></el-option>
                    <el-option key="6" label="当前时间" value="6"></el-option>
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column label="操作" fixed="right">
                <template slot-scope="scope">
                  <el-button
                    size="mini"
                    type="danger" @click="delPageColumn(scope.$index, scope.row)">删除
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-form-item>
        </el-col>
      </el-row>

    </el-form>
    <el-row type="flex" justify="center">
      <el-button type="primary" @click="dataFormSubmit()">保存</el-button>
    </el-row>
  </el-dialog>
</template>

<script>
  export default {
    data () {
      return {
        visible: false,
        dataForm: {
          id: 0,
          groupid: 0,
          apitype: '2',
          sqltype: '',
          atype: '',
          tables: [],
          columns: []
        },
        dataRule: {
          aname: [
            { required: true, message: '不能为空', trigger: 'blur' }
          ],
          acode: [
            { required: true, message: '不能为空', trigger: 'blur' }
          ],
          atype: [
            { required: true, message: '不能为空', trigger: 'blur' }
          ],
        },
        tables: []
      }
    },
    methods: {
      init (groupId, id) {
        this.dataForm.id = id || 0;
        this.dataForm.groupid = groupId;
        this.dataForm.apitype = '2';

        this.visible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          if (this.dataForm.id) {
            this.$http({
              url: this.$http.adornUrl(`/form/smgrapiinfo/info/${this.dataForm.id}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm = data.infovo
              }
            })
          }
        })
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl('/form/smgrapiinfo/saveOrUpdate'),
              method: 'post',
              data: this.$http.adornData(this.dataForm)
            }).then(({data}) => {
              if (data && data.code === 0) {
                var _id = data.id;
                this.$message({
                  message: '操作成功',
                  type: 'success',
                  duration: 1500,
                  onClose: () => {
                    this.visible = false
                    this.$emit('refreshDataList')
                  }
                })
              } else {
                this.$message.error(data.msg)
              }
            })
          }
        })
      },
      addPageTable() {
        this.dataForm.tables.push({});
      },
      delPageTable(index, row) {
        this.$confirm('确认删除吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.dataForm.tables.splice(index, 1);
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          });
        });
      },
      addPageColumn() {
        this.dataForm.columns.push({});
      },
      delPageColumn(index, row) {
        this.$confirm('确认删除吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.dataForm.columns.splice(index, 1);
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          });
        });
      },
      querySearchTable(queryString, cb) {
        var _tables = this.tables;
        var results = queryString ? _tables.filter(this.createTableFilter(queryString)) : _tables;
        cb(results);
      },
      createTableFilter(queryString) {
        return (table) => {
          return (table.tablename.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
        };
      },
      closeDialog() {
        // this.$emit('refreshDataList')
      }
    },
    mounted() {
      this.$http({
        url: this.$http.adornUrl('/form/table/all'),
        method: 'get',
        params: this.$http.adornParams()
      }).then(({data}) => {
        if (data && data.code === 0) {
          this.tables = data.tables
        }
      })
    }
  }
</script>
