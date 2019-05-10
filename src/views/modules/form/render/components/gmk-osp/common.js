import request from '@/utils/httpRequest'

export default {
  /**
   * 获取 ztree 初始化数据
   */
  // getInitZtreeData: function () {
  //   return request({
  //     url: request.adornUrl('/api/hr/orgbox/json/layoutTreePers?urlTarget=true&date=&bmmc=&otype=&isinitpost=true&rootorg=&route=1&isxskg=true&isonlyxskg='),
  //     method: 'get',
  //     params: request.adornParams()
  //   })
  // },
  /**
   * 获取 ztree 初始化数据
   */
  getInitZtreeParamData: function (rootorg = '', isinitpost = true, isxskg = false, isonlyxskg=false) {
    return request({
      url: request.adornUrl('/api/hr/orgbox/json/layoutTreePers?urlTarget=true&date=&bmmc=&otype=&isinitpost='+isinitpost+'&rootorg=' + rootorg + '&route=1&isxskg=' + isxskg + '&isonlyxskg=' + isonlyxskg),
      method: 'get',
      params: request.adornParams()
    })
  },

  /**
   * 根据岗位信息获取itcode
   */
  getItcodeByPostid: function (objid) {
    return request({
      url: request.adornUrl('/api/hr/orgbox/json/getRepLPersonLoginNameByPosition/' + objid),
      method: 'get',
      params: request.adornParams()
    })
  },
  /**
   * 根据节点获取数据
   * @param node
   */
  getZtreeDataParmByNode: function (id, rootorg = '', isinitpost = true, isxskg = false, isonlyxskg = false) {
    return request({
      url: request.adornUrl('/api/hr/orgbox/json/layoutTreePers?id=' + id + '&level=0&urlTarget=true&date=&bmmc=&otype=&isinitpost='+isinitpost+'&rootorg=' + rootorg + '&route=1&isxskg=' + isxskg + '&isonlyxskg=' + isonlyxskg),
      method: 'get',
      params: request.adornParams()
    })
  },
  /**
   *  根据itcode获取数据
   * @param id
   */
  getZtreeDataPramByItcode: function (itcode, rootorg = '', isinitpost = true, isxskg = false, isonlyxskg = false) {
    return request({
      url: request.adornUrl('/api/hr/orgbox/json/layoutTreePers?urlTarget=true&date=&bmmc=' + itcode + '&otype=P&isinitpost='+isinitpost+'&rootorg=' + rootorg + '&route=1&isxskg=' + isxskg + '&isonlyxskg=' + isonlyxskg),
      method: 'get',
      params: request.adornParams()
    })
  },
  getZtreeDataPramByOrg: function (org, rootorg = '', isinitpost = true, isxskg = false, isonlyxskg = false) {
    return request({
      url: request.adornUrl('/api/hr/orgbox/json/layoutTreePers?urlTarget=true&date=&bmmc=' + org + '&otype=O&isinitpost='+isinitpost+'&rootorg=' + rootorg + '&route=1&isxskg=' + isxskg + '&isonlyxskg=' + isonlyxskg),
      method: 'get',
      params: request.adornParams()
    })
  }
}
