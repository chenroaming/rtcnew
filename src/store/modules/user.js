import api from '@/api/apiList'//引入api列表文件
const user = {
    state:{
        isLogin:false,//登录状态
        userInfo:{},//用户信息
        canEdit:false,//编辑状态
    },
    mutations:{
        SET_LOGIN:(state, status) => {
            state.isLogin = status
        },
        SET_USERINFO:(state, info) => {
            state.userInfo = info
        },
        SET_EDIT:(state, status) => {
            state.canEdit = status
        },
    },
    actions: {
        getUserInfo({ commit }){
            return new Promise((resolve,reject) => {
                api.user.getUserInfo().then(res => {
                    if(res.state == 100){
                        commit('SET_LOGIN',true)
                        commit('SET_USERINFO',res)
                        if(res.roleName == '法官' || res.roleName == '书记员'){
                            commit('SET_EDIT',true)
                        }else{
                            commit('SET_EDIT',false)
                        }
                    }else{
                        commit('SET_LOGIN',false)
                    }
                    resolve(res)
                })
                .catch(err => {
                    if(err){
                        reject(err)
                    }
                })
            })
        },
        login({commit},userInfo){
            return new Promise((resolve, reject) => {
                api.user.login(userInfo).then(res => {
                    if(res.state == 100){
                        commit('SET_LOGIN',true)
                        commit('SET_USERINFO',res)
                    }else{
                        commit('SET_LOGIN',false)
                    }
                    resolve(res)
                })
                .catch(err => {
                    reject(err)
                })
            })
        },
        logout({commit}){
            return new Promise((resolve,reject) => {
                api.user.logout().then(res => {
                    if(res.state == 100){
                        commit('SET_LOGIN',false)
                    }
                    resolve(res)
                })
                .catch(err => {
                    reject(err)
                })
            })
        }
    }
}

export default user