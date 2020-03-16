import api from '@/utils/apiList'//引入api列表文件
const user = {
    state:{
        isLogin:false,//登录状态
        userInfo:{}//用户信息
    },
    mutations:{
        SET_LOGIN:(state, status) => {
            state.isLogin = status
        },
        SET_USERINFO:(state, info) => {
            state.userInfo = info
        }
    },
    actions: {
        getUserInfo({ commit }){
            return new Promise((resolve,reject) => {
                api.user.getUserInfo().then(res => {
                    if(res.state == 100){
                        commit('SET_LOGIN',true)
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