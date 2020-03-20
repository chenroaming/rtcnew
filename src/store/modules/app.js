import api from '@/api/apiList'//引入api列表文件
import routes from '@/router/router.js'
const app = {
    state:{
        menuList:[],
    },
    mutations:{
        SET_MENULIST:(state, list) => {
            state.menuList = list
        },
    },
    actions: {
        setMenuList({ commit }){//根据用户类型设置菜单
            return new Promise((resolve,reject) => {
                // console.log(this.$store.getters.getUserInfo);
                api.user.getUserInfo().then(res => {
                    // console.log(res.roleName)
                    // console.log(routes[1].children)
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
    }
}

export default app