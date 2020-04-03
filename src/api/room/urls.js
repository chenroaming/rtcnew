import baseUrl from '../baseUrl'
export default {
    getRoomToken: baseUrl + '/online/getRoomToken.jhtml',//获取房间token
    closeRoom:baseUrl + '/online/closeRoom.jhtml',//退出房间
    userDetail:baseUrl + '/online/userDetail.jhtml',//获取用户详情信息
    getLawCaseCourt:baseUrl + '/main/getLawCaseCourt.jhtml',//获取法院信息
}