import api from '@/api/apiList'//引入api列表文件
const caseInfo = {
    state:{
        lawCaseId:'',//案件Id
        enterStatus:false,//进入状态
        caseType:'',
    },
    mutations:{
        SET_CASEID:(state, id) => {
            state.lawCaseId = id
        },
        SET_STATUS:(state,status) => {
            state.enterStatus = status
        },
        SET_CASETYPE:(state,type) => {
            state.caseType = type
        }
    },
    actions: {
        setCaseId({ commit },id){
            commit('SET_CASEID',id)
        },
        setStatus({ commit },status){
            commit('SET_STATUS',status)
        },
        setCaseType({ commit },type){
            commit('SET_CASETYPE',type)
        }
    }
}

export default caseInfo