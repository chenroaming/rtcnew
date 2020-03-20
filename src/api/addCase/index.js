import api from '../index'
import urls from './urls'

let header = {}

export default {
    getJudgeBriefCourt(params) {
    // return出去了一个promise
    return api.get(urls.getJudgeBriefCourt, params, header)
  },
  updateIndictment(data){//更新起诉状
    header = {'Content-Type': 'multipart/form-data'}//文件传输时更改请求头为form-data类型
    return api.post(urls.updateIndictment,data,header)
  },
  addIndictment(data){//上传起诉状
    header = {'Content-Type': 'multipart/form-data'}
    return api.post(urls.addIndictment,data,header)
  },
  addLawCase(data){//增加案件
    header = {}
    return api.post(urls.addLawCase,data,header)
  },
  updateLawCase(data){//修改案件信息
    header = {}
    return api.post(urls.updateLawCase,data,header)
  },
  delFile(params){
    header = {}
    return api.get(urls.delFile,params,header)
  },
  getLitigationStatus(params){//获取诉讼地位
    header = {}
    return api.get(urls.getLitigationStatus,params,header)
  },
  addTrialLitigant(data){//获取诉讼地位
    header = {}
    return api.post(urls.addTrialLitigant,data,header)
  },
  updateTrialLitigant(data){//获取诉讼地位
    header = {}
    return api.post(urls.updateTrialLitigant,data,header)
  },
  delTrialLitigant(params){//删除当事人
    header = {}
    return api.get(urls.delTrialLitigant,params,header)
  },
  delLawyer(params){//代理人
    header = {}
    return api.get(urls.delLawyer,params,header)
  },
  addEvidence(data){//上传证据
    header = {'Content-Type': 'multipart/form-data'}//文件传输时更改请求头为form-data类型
    return api.post(urls.addEvidence,data,header)
  },
  updateEvidence(data){//更新证据
    header = {'Content-Type': 'multipart/form-data'}//文件传输时更改请求头为form-data类型
    return api.post(urls.updateEvidence,data,header)
  },
  delEvidence(params){//删除证据
    header = {}
    return api.get(urls.delEvidence,params,header)
  },
}