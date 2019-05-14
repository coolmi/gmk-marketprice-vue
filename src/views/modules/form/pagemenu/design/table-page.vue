<template>
  <el-dialog
    title="列表页面"
    :close-on-click-modal="false" width="100%"
    :visible.sync="visible" :append-to-body="true" @close="closeDialog">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" label-width="80px">
      <el-tabs tab-position="left">
        <el-tab-pane label="通用">
          <el-row>
            <el-col :span="18">
              <el-row>
                <el-col :span="12">
                  <el-form-item label="页面编号" prop="wcode">
                    <el-input v-model="dataForm.wcode" placeholder=""></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="页面名称" prop="wname">
                    <el-input v-model="dataForm.wname" placeholder=""></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <el-form-item label="模版" prop="templateid">
                    <el-select v-model="dataForm.templateid" placeholder="">
                      <el-option
                        v-for="item in templates"
                        :key="item.mtcode"
                        :label="item.mtname"
                        :value="item.id">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24">
                  <el-form-item label="备注" prop="biz">
                    <el-input type="textarea" v-model="dataForm.biz" placeholder="备注"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24">
                  <el-form-item label="存储模型">
                    <el-button @click="addPageTable">添加存储模型</el-button>
                    <el-table :data="dataForm.pagetables" border>
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
            </el-col>
            <el-col :span="6">
              <el-card class="box-card">
                <div slot="header" class="clearfix">
                  <span>通用设置</span>
                  <!--<el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button>-->
                </div>
                <div>
                  <el-form :model="globalForm" ref="globalForm" label-width="80px">
                    <el-row v-for="(item, index) in globalForm.attributes" :key="index">
                      <el-form-item :label="item.atrname" >
                        <el-input v-model="item.templateatrval" placeholder=""></el-input>
                      </el-form-item>
                    </el-row>
                    <el-row type="flex" justify="center">
                      <el-button type="primary" size="mini" round @click="saveGlobalForm" :disabled="globalSaveButtonDisabled">Save</el-button>
                    </el-row>
                  </el-form>
                </div>
              </el-card>
            </el-col>
          </el-row>


        </el-tab-pane>
        <el-tab-pane label="UI" v-if="dataForm.id">
          <el-row>
            <el-button @click="addPageUI">添加</el-button>
          </el-row>
          <el-row>
            <el-col :span="18">
              <el-table border
                        :data="dataForm.pageuis" height="350" @row-click="handleUIRowClick"
                        style="width: 100%">
                <el-table-column label="字段名称" fixed="left" width="180">
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.colname" placeholder=""></el-input>
                  </template>
                </el-table-column>
                <el-table-column label="字段KEY" width="180">
                  <template slot-scope="scope">
                    <!--<el-autocomplete class="inline-input" v-model="scope.row.colkey" value-key="colkey"-->
                    <!--:fetch-suggestions="querySearchColumn" placeholder=""></el-autocomplete>-->
                    <el-input v-model="scope.row.colkey" placeholder=""></el-input>
                  </template>
                </el-table-column>
                <el-table-column label="存储模型" width="200">
                  <template slot-scope="scope">
                    <el-autocomplete class="inline-input" v-model="scope.row.tablename" value-key="tablename"
                                     :fetch-suggestions="querySearchTable" placeholder=""></el-autocomplete>
                  </template>
                </el-table-column>
                <el-table-column label="排序" width="80">
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.sort" placeholder=""></el-input>
                  </template>
                </el-table-column>

                <el-table-column label="表格列设置">
                  <el-table-column label="是否表格列" width="80">
                    <template slot-scope="scope">
                      <el-checkbox v-model="scope.row.istablecol" true-label="1" false-label="0">是</el-checkbox>
                    </template>
                  </el-table-column>
                  <el-table-column label="列宽度" width="80">
                    <template slot-scope="scope">
                      <el-input v-model="scope.row.colwidth" placeholder=""></el-input>
                    </template>
                  </el-table-column>
                  <!--<el-table-column label="数据格式化" width="200">-->
                    <!--<template slot-scope="scope">-->

                    <!--</template>-->
                  <!--</el-table-column>-->
                </el-table-column>
                <el-table-column label="查询设置">
                  <el-table-column label="是否查询" width="80">
                    <template slot-scope="scope">
                      <el-checkbox v-model="scope.row.isfiltercol" true-label="1" false-label="0">是</el-checkbox>
                    </template>
                  </el-table-column>
                  <el-table-column label="是否隐式查询" width="80">
                    <template slot-scope="scope">
                      <el-checkbox v-model="scope.row.isxsfilter" true-label="1" false-label="0">是</el-checkbox>
                    </template>
                  </el-table-column>
                  <el-table-column label="组件" width="120">
                    <template slot-scope="scope">
                      <el-select v-model="scope.row.colcomponent" placeholder="">
                        <el-option key="-999" label="无" value="-999"></el-option>
                        <el-option
                          v-for="item in components"
                          :key="item.clabel"
                          :label="item.cname"
                          :value="item.clabel">
                        </el-option>
                      </el-select>
                    </template>
                  </el-table-column>
                  <el-table-column label="占比(24列)" width="80">
                    <template slot-scope="scope">
                      <el-input v-model="scope.row.colspan" placeholder=""></el-input>
                    </template>
                  </el-table-column>
                  <el-table-column label="过滤类型" width="140">
                    <template slot-scope="scope">
                      <el-select clearable v-model="scope.row.filtertype" placeholder="请选择">
                        <el-option key="0" label="精确查询" value="0"></el-option>
                        <el-option key="1" label="模糊查询" value="1"></el-option>
                        <el-option key="2" label="大于" value="2"></el-option>
                        <el-option key="3" label="大于等于" value="3"></el-option>
                        <el-option key="4" label="小于" value="4"></el-option>
                        <el-option key="5" label="小于等于" value="5"></el-option>
                        <el-option key="6" label="间于" value="6"></el-option>
                      </el-select>
                    </template>
                  </el-table-column>
                  <el-table-column label="过滤默认值" width="120">
                    <template slot-scope="scope">
                      <el-input v-model="scope.row.filterdefaultval" placeholder=""></el-input>
                    </template>
                  </el-table-column>
                </el-table-column>

                <el-table-column label="导入导出设置">
                  <el-table-column label="是否导入" width="80">
                    <template slot-scope="scope">
                      <el-checkbox v-model="scope.row.isimport" true-label="1" false-label="0">是</el-checkbox>
                    </template>
                  </el-table-column>
                  <el-table-column label="是否导出" width="80">
                    <template slot-scope="scope">
                      <el-checkbox v-model="scope.row.isexport" true-label="1" false-label="0">是</el-checkbox>
                    </template>
                  </el-table-column>
                </el-table-column>

                <el-table-column label="是否入参" width="80">
                  <template slot-scope="scope">
                    <el-checkbox v-model="scope.row.isparam" true-label="1" false-label="0">是</el-checkbox>
                  </template>
                </el-table-column>
                <el-table-column label="操作" fixed="right">
                  <template slot-scope="scope">
                    <el-button
                      size="mini"
                      type="danger" @click="delPageUI(scope.$index, scope.row)">删除
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-col>
            <el-col :span="6">
              <el-card class="box-card">
                <div slot="header" class="clearfix">
                  <span>详细信息(先保存UI后再维护)</span>
                  <!--<el-button style="float: right; padding: 3px 0" type="text">保存</el-button>-->
                </div>
                <div>
                  <el-form :model="detailForm" ref="detailForm" label-width="80px">
                    <el-row>
                      <el-form-item label="字段KEY" >
                        <el-input v-model="detailForm.colkey" placeholder=""></el-input>
                      </el-form-item>
                    </el-row>
                    <el-row>
                      <el-form-item label="字段名称" >
                        <el-input v-model="detailForm.colname" placeholder=""></el-input>
                      </el-form-item>
                    </el-row>
                    <el-row v-for="(item, index) in detailForm.attributes" :key="index">
                      <el-form-item :label="item.atrname" >
                        <el-input v-model="item.atrval" placeholder=""></el-input>
                      </el-form-item>
                    </el-row>
                    <el-row type="flex" justify="center">
                      <el-button type="primary" size="mini" round @click="saveDetailFrom" :disabled="detailSaveButtonDisabled">Save</el-button>
                    </el-row>
                  </el-form>
                </div>
              </el-card>
            </el-col>
          </el-row>

        </el-tab-pane>

        <el-tab-pane label="功能按钮" v-if="dataForm.id">
          <el-row>
            <el-button @click="addPageFunction">添加</el-button>
          </el-row>
          <el-row>
            <el-table border :data="dataForm.pagefunctions" height="350"
                      style="width: 100%">
              <el-table-column label="按钮编号" width="100">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.funccode" placeholder=""></el-input>
                </template>
              </el-table-column>
              <el-table-column label="按钮名称" width="120">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.funcname" placeholder=""></el-input>
                </template>
              </el-table-column>
              <el-table-column label="顺序" width="80">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.sort" placeholder=""></el-input>
                </template>
              </el-table-column>
              <el-table-column label="是否隐藏" width="180">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.hidden" placeholder=""></el-input>
                </template>
              </el-table-column>
              <el-table-column label="按钮类型" width="160">
                <template slot-scope="scope">
                  <el-select v-model="scope.row.functype" placeholder="">
                    <el-option key="0" label="普通按钮" value="0"></el-option>
                    <el-option key="1" label="链接按钮" value="1"></el-option>
                    <el-option key="2" label="上传按钮" value="2"></el-option>
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column label="UI类型" width="120">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.uitype" placeholder=""></el-input>
                </template>
              </el-table-column>
              <el-table-column label="方法定义" width="400">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.funcdefition" type="textarea" rows="5" placeholder=""></el-input>
                </template>
              </el-table-column>
              <el-table-column label="操作">
                <template slot-scope="scope">
                  <el-button
                    size="mini"
                    type="danger" @click="delPageFunction(scope.$index, scope.row)">删除
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-row>
        </el-tab-pane>

        <el-tab-pane label="状态管理" v-if="dataForm.id">
          <el-row>
            <el-button @click="addPageState">添加</el-button>
          </el-row>
          <el-table border
                    :data="dataForm.pagestates" height="350"
                    style="width: 100%">
            <el-table-column label="状态编号" width="180">
              <template slot-scope="scope">
                <el-input v-model="scope.row.statecode" placeholder=""></el-input>
              </template>
            </el-table-column>
            <el-table-column label="状态名称" width="180">
              <template slot-scope="scope">
                <el-input v-model="scope.row.statename" placeholder=""></el-input>
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="danger" @click="delPageState(scope.$index, scope.row)">删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="数据源" v-if="dataForm.id">
          <el-row>
            <el-col :span="24">
              <el-form-item label="类型" prop="dtype">
                <el-radio-group v-model="dataForm.pagedatasource.dtype">
                  <el-radio label="0">默认</el-radio>
                  <el-radio label="1">自定义SQL</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="SQL" prop="sqltext">
                <el-input type="textarea" rows="5" v-model="dataForm.pagedatasource.sqltext" placeholder="SQL中的表别名需要与存储模型一致"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="ORDER" prop="ordersqltext">
                <el-input type="textarea" rows="3" v-model="dataForm.pagedatasource.ordersqltext" placeholder=""></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-tab-pane>
        <el-tab-pane label="JS" v-if="dataForm.id">
          <el-row>
            <div v-if="dataForm.jstext != null && dataForm.jstext != ''">有代码，点击一下就能查看（此处有个不自动显示代码的bug）</div>
            <codemirror ref="jsEditor" :options="{
                    mode: 'javascript'
                  }" v-model="dataForm.jstext == null ? '' : dataForm.jstext"></codemirror>
          </el-row>
        </el-tab-pane>
      </el-tabs>

      <el-row type="flex" justify="center">
        <el-button type="primary" @click="dataFormSubmit()">保存</el-button>
      </el-row>
    </el-form>
  </el-dialog>
</template>

<script>
  // JavaScript 和 vue 语法高亮和 JavaScript 代码提示
  import { codemirror } from 'vue-codemirror-lite'
  require('codemirror/mode/javascript/javascript')
  require('codemirror/mode/vue/vue')

  require('codemirror/addon/hint/show-hint.js')
  require('codemirror/addon/hint/show-hint.css')
  require('codemirror/addon/hint/javascript-hint.js')

  export default {
    name: 'table-page',
    components: {
      codemirror
    },
    data() {
      return {
        visible: false,
        dataForm: {
          id: 0,
          wcode: '',
          wname: '',
          pagemenuid: 0,
          templateid: '',
          wtype: '0',
          biz: '',
          pagetables: [],
          pageuis: [],
          pagefunctions: [],
          pagestates: [],
          pagedatasource: {}
        },
        detailForm: {
          pageinfoid: 0,
          pageuiid: 0,
          colkey: '',
          colname: '',
          attributes: []
        },
        globalForm: {
          attributes: []
        },
        dataRule: {
          wcode: [
            {required: true, message: '页面编号不能为空', trigger: 'blur'}
          ],
          wname: [
            {required: true, message: '页面名称不能为空', trigger: 'blur'}
          ],
          templateid: [
            {required: true, message: '模版不能为空', trigger: 'blur'}
          ]
        },
        components: [],
        templates: [],
        tables: [],
        detailSaveButtonDisabled: true,
        globalSaveButtonDisabled: true
      }
    },
    computed: {
      editor: function() {
        return this.$refs.jsEditor.editor;
      },
    },
    methods: {
      getDataList() {
        this.init(this.dataForm.pagemenuid, this.dataForm.parentpageuiid, this.dataForm.id);
      },
      init(pagemenuid, parentpageuiid, id) {
        this.dataForm = {};
        this.dataForm.wtype = '0';
        this.dataForm.parentpageuiid = parentpageuiid;
        this.dataForm.pagetables = [];
        this.dataForm.pageuis = [];
        this.dataForm.pagefunctions = [];
        this.dataForm.pagestates = [];
        this.dataForm.pagedatasource = {};

        this.dataForm.id = id || 0;
        this.dataForm.pagemenuid = pagemenuid;

        this.visible = true;

        this.$nextTick(() => {

          if (this.dataForm.id) {
            this.$http({
              url: this.$http.adornUrl(`/form/pageinfo/info/${this.dataForm.id}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm = data.formPageInfo;
                if (this.dataForm.pagetables == null || typeof this.dataForm.pagetables == 'undefined') {
                  this.dataForm.pagetables = [];
                }
                if (this.dataForm.pageuis == null || typeof this.dataForm.pageuis == 'undefined') {
                  this.dataForm.pageuis = [];
                }
                if (this.dataForm.pagefunctions == null || typeof this.dataForm.pagefunctions == 'undefined') {
                  this.dataForm.pagefunctions = [];
                }
                if (this.dataForm.pagestates == null || typeof this.dataForm.pagestates == 'undefined') {
                  this.dataForm.pagestates = [];
                }
                if (this.dataForm.pagedatasource == null || typeof this.dataForm.pagedatasource == 'undefined') {
                  this.dataForm.pagedatasource = {};
                }
              }
            })

            this.$http({
              url: this.$http.adornUrl(`/form/pageinfoattribute/attribute/${this.dataForm.id}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.globalForm.attributes = data.attributes;
                this.globalSaveButtonDisabled = false;
              }
            })

          }
        })
      },
      addPageTable() {
        this.dataForm.pagetables.push({});
      },
      delPageTable(index, row) {
        this.$confirm('确认删除吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.dataForm.pagetables.splice(index, 1);
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          });
        });
      },
      addPageUI() {
        this.dataForm.pageuis.push({});
      },
      delPageUI(index, row) {
        this.$confirm('确认删除吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.dataForm.pageuis.splice(index, 1);
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          });
        });
      },
      addPageFunction() {
        this.dataForm.pagefunctions.push({
          functype: '0'
        });
      },
      delPageFunction(index, row) {
        this.$confirm('确认删除吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.dataForm.pagefunctions.splice(index, 1);
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          });
        });
      },
      addPageState() {
        this.dataForm.pagestates.push({});
      },
      delPageState(index, row) {
        this.$confirm('确认删除吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.dataForm.pagestates.splice(index, 1);
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
      // querySearchColumn(queryString, cb) {
      // this.$http({
      //   url: this.$http.adornUrl('/form/table/infoByTable/' + this.dataForm),
      //   method: 'get',
      //   params: this.$http.adornParams()
      // }).then(({data}) => {
      //   if (data && data.code === 0) {
      //     this.templates = data.templates
      //   }
      // })
      // },
      dataFormSubmit() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl('/form/pageinfo/save'),
              method: 'post',
              data: this.$http.adornData(this.dataForm)
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.id = data.id;

                this.$message({
                  message: '操作成功',
                  type: 'success',
                  duration: 1500,
                  onClose: () => {
                    this.getDataList();
                    // this.visible = false
                    // this.$emit('refreshDataList')
                  }
                })
              } else {
                this.$message.error(data.msg)
              }
            })
          }
        })
      },
      saveDetailFrom() {
        if(this.detailForm.attributes) {
          this.detailSaveButtonDisabled = true;
          this.$http({
            url: this.$http.adornUrl('/form/pageuiattribute/save'),
            method: 'post',
            data: this.$http.adornData(this.detailForm)
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 1500,
                onClose: () => {

                }
              })
            } else {
              this.$message.error(data.msg)
            }
          })
        }
        else {
          this.$message.warn("没有要保存的数据");
        }
      },
      handleUIRowClick(row, column, event) {
        this.detailForm.colkey = row.colkey;
        this.detailForm.colname = row.colname;
        this.detailForm.pageinfoid = row.pageinfoid;
        this.detailForm.pageuiid = row.id;
        this.detailForm.attributes = [];
        var _pageuiid = row.id;
        var _pageinfoid = row.pageinfoid;
        var _colcomponent = row.colcomponent;

        if (_pageuiid && _pageinfoid && _colcomponent) {
          this.$http({
            url: this.$http.adornUrl('/form/pageuiattribute/attribute/' + _pageinfoid + '/' + _pageuiid + '/' + _colcomponent),
            method: 'get',
            params: this.$http.adornParams()
          }).then(({data}) => {
            if (data && data.code === 0) {
              if (data.attributes) {
                this.detailSaveButtonDisabled = false;
                this.detailForm.attributes = data.attributes
              }
            }
          })
        }
      },
      saveGlobalForm() {
        if(this.globalForm.attributes) {
          this.globalSaveButtonDisabled = true;
          this.$http({
            url: this.$http.adornUrl('/form/pageinfoattribute/save'),
            method: 'post',
            data: this.$http.adornData(this.globalForm)
          }).then(({data}) => {
            if (data && data.code === 0) {
              //保存成功后，需要把按钮禁止，要不然id还没有，再点击一次保存会有重复数据
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 1500,
                onClose: () => {

                }
              })
            } else {
              this.$message.error(data.msg)
            }
          })
        }
        else {
          this.$message.warn("没有要保存的数据");
        }
      },
      closeDialog() {
        this.$emit('refreshDataList')
      }
    },
    mounted() {
      this.$http({
        url: this.$http.adornUrl('/form/template/all/0'),
        method: 'get',
        params: this.$http.adornParams()
      }).then(({data}) => {
        if (data && data.code === 0) {
          this.templates = data.templates
        }
      })

      this.$http({
        url: this.$http.adornUrl('/form/table/all'),
        method: 'get',
        params: this.$http.adornParams()
      }).then(({data}) => {
        if (data && data.code === 0) {
          this.tables = data.tables
        }
      })

      this.$http({
        url: this.$http.adornUrl('/form/component/all'),
        method: 'get',
        params: this.$http.adornParams()
      }).then(({data}) => {
        if (data && data.code === 0) {
          this.components = data.components
        }
      })

    }
  }
</script>

<style scoped>

</style>
