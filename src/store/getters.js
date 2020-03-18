const getters = {
    isLogin:state => state.user.isLogin,
    getUserInfo:state => state.user.userInfo,
    getCaseId:state => state.caseInfo.lawCaseId,
    getStatus:state => state.caseInfo.enterStatus,
    getCaseType:state => state.caseInfo.caseType,
    getMenuList:state => state.app.menuList,
}

export default getters