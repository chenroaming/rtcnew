import api from '../index'
import urls from './urls'

let header = {}

export default {
  getUserInfo(params) {
    // return出去了一个promise
    return api.get(urls.getUserInfo, params, header)
  },
  login(data){
    header = {'Content-type' : 'application/json'}
    return api.post(urls.login, data, header)
  },
  updateIndictment(data){
    header = {'Content-Type': 'multipart/form-data'}//文件传输时更改请求头为form-data类型
    return api.post(urls.upfile,data,header)
  },
  logout(params){
    return api.get(urls.logout, params, header)
  },
  optionRole(data){
    return api.post(urls.optionRole, data, header)
  },
}