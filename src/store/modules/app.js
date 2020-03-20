import api from '@/api/apiList'//引入api列表文件
import routes from '@/router/router.js'
import wsurl from '@/utils/websocket.js'
const app = {
    state:{
        menuList:[],
        websocketObj:null,
    },
    mutations:{
        SET_MENULIST:(state, list) => {
            state.menuList = list
        },
        SET_WSOBJ:(state, obj) => {
            state.websocketObj = obj
        }
    },
    actions: {
        setMenuList({ commit }){//根据用户类型设置菜单
            return new Promise((resolve,reject) => {
                api.user.getUserInfo().then(res => {
                    const menuList = [];
                    for(const item of routes[1].children){
                        if(
                            item.access.some(res2 => {
                                return res2 == res.roleName;
                            })
                        ){
                           menuList.push(item); 
                        }
                    }
                    commit('SET_MENULIST',menuList)
                    resolve(res)
                })
                .catch(err => {
                    if(err){
                        reject(err)
                    }
                })
            })
        },
        setWebSocket({ commit }){//设置ws
            commit('SET_WSOBJ',new WebSocket(wsurl));
        },
    }
}

export default app