import api from '../index'
import urls from './urls'

let header = {}

export default {
    addJudge(params) {
    // return出去了一个promise
    return api.get(urls.addJudge, params, header,true)
  },
  updateJudge(params) {
    // return出去了一个promise
    return api.get(urls.updateJudge, params, header,true)
  },
  sendJudgeMessage(params) {
    // return出去了一个promise
    return api.get(urls.sendJudgeMessage, params, header,true)
  },
  getJudges(params){
    return api.get(urls.getJudges, params,header)
  }
}