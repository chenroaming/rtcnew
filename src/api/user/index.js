import api from '../index'
import urls from './urls'

let header = {}

export default {
  getUserInfo(params) {//获取用户信息接口
    // return出去了一个promise
    return api.get(urls.getUserInfo, params, header)
  },
  login(data){//登录接口
    header = {'Content-type' : 'application/json'}
    return api.post(urls.login, data,header,'',true)
  },
  updateIndictment(data){
    header = {'Content-Type': 'multipart/form-data'}//文件传输时更改请求头为form-data类型
    return api.post(urls.upfile,data,header,'',true)
  },
  logout(params){//登出接口
    header = {}
    return api.get(urls.logout, params, header,true)
  },
  optionRole(data){//设置角色信息接口
    header = {}
    return api.post(urls.optionRole, data, header,true)
  },
  faceRecognition(data){//面部识别接口
    header = {'Content-type' : 'application/json'}
    return api.post(urls.faceRecognition,'',header,data,true)//当使用非传参方式，也就是JSON格式直接post提交时，第二个参数需要置空，然后将需要传输的数据放最后一个参数
  },
}