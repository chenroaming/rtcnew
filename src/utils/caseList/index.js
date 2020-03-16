import api from '../index'
import urls from './urls'

let header = {}

export default {
  caseList(params) {
    // return出去了一个promise
    return api.get(urls.caseList, params, header)
  },
  getCaseDetail(params){
    return api.get(urls.getCaseDetail, params, header)
  },
  getMessageInfo(params){
    return api.get(urls.getMessageInfo, params, header)
  },
  sendMessage(params){
    return api.get(urls.sendMessage, params, header)
  },
  downRecord(params){
    return api.get(urls.downRecord,params,header)
  }
}