import baseUrl from '../baseUrl'
export default {
  getUserInfo: baseUrl + '/main/getUserInfo.jhtml',//获取用户信息
  login: baseUrl + '/main/login.jhtml',//登录
  upfile:baseUrl + '/court/case/updateIndictment.jhtml',//上传文件
  logout:baseUrl + '/main/loginOut.jhtml',//登出
  optionRole:baseUrl + '/main/optionRole.jhtml'//设置用户信息
}