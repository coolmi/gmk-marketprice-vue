import formcore from './core/formcore'
import formconfig from './core/formconfig'

import pagetablebase from './table/pagetablebase.js'
formconfig.add("pagetablebase", pagetablebase);

import tablebase from './table/tablebase.js'
formconfig.add("tablebase", tablebase);

import formbase from './form/formbase.js'
formconfig.add("formbase", formbase);

export default function(formName, form, type) {
  if(formconfig.has(formName)) {
    return formcore(formName, form, formconfig.get(formName));
  }
  else {
    return formcore(formName, form, formconfig.get(type + 'base'));
  }
}
