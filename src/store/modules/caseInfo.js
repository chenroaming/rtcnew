import api from '@/api/apiList'//引入api列表文件
const caseInfo = {
    state:{
        lawCaseId:'',//案件Id
        enterStatus:false,//进入状态
        caseType:'',
        caseInfo:{},
        clerkRoomList:[],
        isVoice:false,
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
        },
        SET_CASEINFO:(state,info) => {
            state.caseInfo = info
        },
        SET_CLERKLIST:(state,list) => {
            state.clerkRoomList = list
        },
        SET_VOICE:(state,status) => {
            state.isVoice = status
        },
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
        },
        setCaseInfo({ commit },info){
            commit('SET_CASEINFO',info)
        },
        setClerkRoom({ commit },list){
            commit('SET_CLERKLIST',list)
        },
        setVoice({ commit },status){
            commit('SET_VOICE',status)
        },
    }
}

export default caseInfo