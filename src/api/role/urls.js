import baseUrl from '../baseUrl'
export default {
    addJudge: baseUrl + '/court/case/addJudge.jhtml',//添加法官账号
    updateJudge: baseUrl + '/court/case/updateJudge.jhtml',//更新法官账号（类型不可改变）
    sendJudgeMessage: baseUrl + '/court/case/sendJudgeMessage.jhtml',//发送法官账号短信
    getJudges: baseUrl + '/court/case/getJudges.jhtml',//获取法官等管理员账号接口
}