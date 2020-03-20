const getters = {
    isLogin:state => state.user.isLogin,//用户是否登录
    getUserInfo:state => state.user.userInfo,//获取用户信息
    getCaseId:state => state.caseInfo.lawCaseId,//获取案件id
    getStatus:state => state.caseInfo.enterStatus,//获取进入状态
    getCaseType:state => state.caseInfo.caseType,//获取案件类型
    getMenuList:state => state.app.menuList,//获取角色动态菜单列表
}

export default getters