import httpRequest from './httpRequest'
import Vue from 'vue'

export function post(url, data, callback) {
  httpRequest({
    url: httpRequest.adornUrl(url),
    method: 'post',
    data: httpRequest.adornData(data)
  }).then(({data}) => {
    if(callback) {
      callback(data);
    }
  })
}

export function get(url, params, callback) {
  httpRequest({
    url: httpRequest.adornUrl(url),
    method: 'get',
    params: httpRequest.adornParams(params)
  }).then(({data}) => {
    if(callback) {
      callback(data);
    }
  })
}
export function adornUrl(url) {
  if(url.indexOf('?') != -1) {
    return httpRequest.adornUrl(url+'&token=' + Vue.cookie.get('token'));
  }
  else {
    return httpRequest.adornUrl(url+'?token=' + Vue.cookie.get('token'));
  }
}
