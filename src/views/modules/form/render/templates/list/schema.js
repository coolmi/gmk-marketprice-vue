import Vue from 'vue'

export default {
  formName: '',
  container: null,
  setContainer(container) {
    this.container = container;
  },
  getSearchForm() {
    return this.container.$refs[this.formName + 'SearchFrom'];
  },

  init: function(formName) {
    this.formName = formName;
    var _this = this;

    return {
      key: this.formName,
      name: '表单模型',
      ui: {
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
            justify: 'start'
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
        component: 'gmk-pagetable'
      }

    }
  }
}
