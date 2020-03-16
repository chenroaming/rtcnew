import api from '../index'
import urls from './urls'

let header = {}

export default {
    getJudgeBriefCourt(params) {
    // return出去了一个promise
    return api.get(urls.getJudgeBriefCourt, params, header)
  },
}