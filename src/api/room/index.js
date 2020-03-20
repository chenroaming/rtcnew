import api from '../index'
import urls from './urls'

let header = {}

export default {
    getRoomToken(params) {
        // return出去了一个promise
        return api.get(urls.getRoomToken, params, header)
    },
    closeRoom(params){
        return api.get(urls.closeRoom, params, header)
    },
    userDetail(params){
        return api.get(urls.userDetail, params, header)
    },
}