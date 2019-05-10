import Vue from 'vue'

export default {
  formName: '',
  container: null,
  setContainer(container) {
    this.container = container;
  },
  getForm() {
    return this.container.$refs[this.formName];
  },

  init: function(formName) {
    this.formName = formName;
    var _this = this;

    return {
      key: this.formName,
      name: '表单模型',
      ui: {
        config: {
          labelWidth: '100px'
        },
        columns: [
          {
            key: 'name',
            name: '姓名',
            group: 'tab1',
            ui: {
              span: 12,
              type: 'text',
              placeholder: '请输入姓名',
              component: 'gmk-input'
            },
            state: {
              readonly: false,
              hidden: false
            },
            rules: [
              { required: true, message: '请输入姓名', trigger: 'blur' },
            ]
          },
          {
            key: 'age',
            name: '年龄',
            group: 'tab1',
            ui: {
              span: 12,
              type: 'number',
              placeholder: '请输入',
              component: 'gmk-input'
            }
          },
          {
            key: 'position',
            name: '岗位',
            group: 'tab1',
            ui: {
              span: 12,
              component: 'gmk-input'
            }
          },
          {
            key: 'department',
            name: '部门',
            group: 'tab1',
            ui: {
              span: 12,
              component: 'gmk-input'
            }
          },
          {
            key: 'sex',
            name: '性别',
            group: 'tab1',
            ui: {
              span: 12,
              datasource: {
                //type: 'static',
                //label: 'b',
                //value: 'v',
                // options: [
                //   {
                //     value: '0',
                //     label: '男'
                //   },
                //   {
                //     value: '1',
                //     label: '女'
                //   }
                // ]
                //dict数据源
                // type: 'dict',
                // label: 'keyname',
                // value: 'keyval',
                // dictgroupcode: 'sex'
                type: 'url',
                label: 'keyname',
                value: 'keyval',
                url: `/sys/dict/group/sex`,
                resultkey: 'dicts'
              },
              placeholder: '请输入性别',
              component: 'gmk-select'
            },
            event: {
              change: function(value) {
                console.log("select change value is " + value);
              }
            },
          },
          {
            key: 'other',
            name: '其他',
            group: 'tab1',
            ui: {
              span: 12,
              type: 'textarea',
              rows: 3,
              component: 'gmk-input'
            }
          },
          {
            key: 'passwd',
            name: '密码',
            group: 'tab1',
            ui: {
              span: 12,
              type: 'password',
              component: 'gmk-input'
            }
          },
          {
            key: 'tab1',
            name: '子表格',
            group: 'tab2',
            ui: {
              span: 24,
              config: {

              },
              columns: [
                {
                  key: 'book',
                  name: '书名',
                  width: 150
                },
                {
                  key: 'qianbi',
                  name: '铅笔',
                  width: 200
                }
              ],
              filters: {
                key: 'searchFrom',
                name: '查询',
                ui: {
                  config: {
                    labelWidth: '100px'
                  },
                  columns: [
                    {
                      key: 'name',
                      name: '姓名',
                      ui: {
                        span: 6,
                        type: 'string',
                        placeholder: '请输入姓名',
                        component: 'gmk-input'
                      },
                      rules: [
                        { required: true, message: '请输入姓名'},
                      ]
                    }
                  ]
                }

              },
              functions: {
                config: {
                  justify: 'end'
                },
                buttons: [
                  {
                    key: 'btn_add',
                    name: '新增',
                    ui: {
                      type: '',
                      component: 'gmk-button'
                    },
                    event: {
                      click: function() {

                      }
                    }
                  },
                  {
                    key: 'btn_edit',
                    name: '编辑',
                    ui: {
                      type: '',
                      component: 'gmk-button'
                    },
                    event: {
                      click: function() {

                      }
                    }
                  },
                  {
                    key: 'btn_delete',
                    name: '删除',
                    ui: {
                      type: '',
                      component: 'gmk-button'
                    },
                    event: {
                      click: function() {

                      }
                    }
                  }
                ]
              },
              component: 'gmk-table'
            }
          }
        ],
        functions: {
          config: {
            justify: 'center'
          },
          buttons: [
            {
              key: 'btn_tj',
              name: '提交',
              ui: {
                type: '',
                component: 'gmk-button'
              },
              event: {
                click: function() {
                  _this.getForm().validate((valid) => {
                    if (valid) {
                      console.log("submit form")
                    }
                  });
                }
              }
            },
            {
              key: 'btn_cz',
              name: '重置',
              ui: {
                type: '',
                component: 'gmk-button'
              },
              event: {
                click: function() {
                  _this.getForm().resetFields();
                }
              }
            }
          ]
        },
        //
        groups: [
          {
            name: 'tab1',
            title: '基本信息'
          },
          {
            name: 'tab2',
            title: '子表格'
          },
        ]
      }

    }
  }
}
