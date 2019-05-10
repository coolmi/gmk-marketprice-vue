import customPagetable from './custom-pagetable'
import customTable from './custom-table'
import customForm from './custom-form'
import customDialogForm from './custom-dialog-form'
import customDialogPagetable from './custom-dialog-pagetable'
import customDialogTable from './custom-dialog-table'
import infoDialogTable from './info-dialog-table'

const gmktemplates = {
  install: function (Vue) {
    Vue.component('custom-pagetable', customPagetable);
    Vue.component('custom-table', customTable);
    Vue.component('custom-form', customForm);
    Vue.component('custom-dialog-form', customDialogForm);
    Vue.component('custom-dialog-pagetable', customDialogPagetable);
    Vue.component('custom-dialog-table', customDialogTable);
    Vue.component('info-dialog-table', infoDialogTable);
  }
}
export default gmktemplates;
