export function type(obj){
  return Object.prototype.toString.call(obj);
}

export function isArray(obj) {
  return Object.prototype.toString.call(obj) == '[object Array]';
}

/**
 * object转化成url拼接样式
 * @param obj 需要转化的参数
 */
export function objToUrl(obj) {
  let arr = [];
  for(let i in obj){
    if (obj.hasOwnProperty(i)) {
      arr.push(encodeURIComponent(i) + "=" + encodeURIComponent(obj[i]));
    }
  }
  return arr.join("&");
}

/**
 * url转化成object拼接样式
 * @param url 需要转化的参数
 */
export function  urlToObj(url) {
  let string = url.split('&');
  let res = {};
  for(let i = 0;i<string.length;i++){
    let str = string[i].split('=');
    if(str[0]!=''){
      res[str[0]]=str[1];
    }
  }
  return res;
}
