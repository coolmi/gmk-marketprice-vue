import gmkinput from './input/gmk-input'
import gmkselect from './select/gmk-select'
import gmkradio from './radio/gmk-radio'
import gmkcheckbox from './checkbox/gmk-checkbox'
import gmkdate from './datetime/gmk-date'
import gmkfile from './file/gmk-file'
import gmkbutton from './button/gmk-button'
import gmkbuttonlink from './button/gmk-button-link'
import gmkbuttonupload from './button/gmk-button-upload'
import gmkbuttonarea from './button/gmk-button-area'
import gmktable from './table/gmk-table'
import gmkpagetable from './table/gmk-pagetable'
import gmkform from './form/gmk-form'
import gmksearchform from './form/gmk-search-form'
import gmkospchoosetree from './gmk-osp/gmk-osp-choosetree'
import gmkosp from './gmk-osp/gmk-osp'
import gmkinfoselect from './select/gmk-infoselect'
import remotescript from './remote/remote-script'

const gmkcomponents = {
  install: function (Vue) {
    Vue.component('gmk-input', gmkinput);
    Vue.component('gmk-select', gmkselect);
    Vue.component('gmk-radio', gmkradio);
    Vue.component('gmk-checkbox', gmkcheckbox);
    Vue.component('gmk-date', gmkdate);
    Vue.component('gmk-file', gmkfile);
    Vue.component('gmk-button', gmkbutton);
    Vue.component('gmk-button-link', gmkbuttonlink);
    Vue.component('gmk-button-upload', gmkbuttonupload);
    Vue.component('gmk-button-area', gmkbuttonarea);
    Vue.component('gmk-table', gmktable);
    Vue.component('gmk-pagetable', gmkpagetable);
    Vue.component('gmk-form', gmkform);
    Vue.component('gmk-search-form', gmksearchform);
    Vue.component('gmk-osp-choosetree', gmkospchoosetree);
    Vue.component('gmk-osp', gmkosp);
    Vue.component('gmk-infoselect', gmkinfoselect);
  }
}
export default gmkcomponents;
