import api from '../index'
import urls from './urls'

let header = {}

export default {
    getJudgeBriefCourt(params) {//获取法官/书记员/陪审员列表
    // return出去了一个promise
    return api.get(urls.getJudgeBriefCourt, params, header)
  },
  updateIndictment(data){//更新起诉状
    header = {'Content-Type': 'multipart/form-data'}//文件传输时更改请求头为form-data类型
    return api.post(urls.updateIndictment,data,header,'',true)
  },
  addIndictment(data){//上传起诉状
    header = {'Content-Type': 'multipart/form-data'}
    return api.post(urls.addIndictment,data,header,'',true)
  },
  addLawCase(data){//增加案件
    header = {}
    return api.post(urls.addLawCase,'',header,data,true)
  },
  updateLawCase(data){//修改案件信息
    header = {}
    return api.post(urls.updateLawCase,'',header,data,true)
  },
  delFile(params){
    header = {}
    return api.get(urls.delFile,params,header,true)
  },
  getLitigationStatus(params){//获取诉讼地位
    header = {}
    return api.get(urls.getLitigationStatus,params,header)
  },
  addTrialLitigant(data){//添加当事人信息
    header = {}
    return api.post(urls.addTrialLitigant,'',header,data,true)
  },
  updateTrialLitigant(data){//修改当事人信息
    header = {}
    return api.post(urls.updateTrialLitigant,'',header,data,true)
  },
  delTrialLitigant(params){//删除当事人
    header = {}
    return api.get(urls.delTrialLitigant,params,header,true)
  },
  delLawyer(params){//代理人
    header = {}
    return api.get(urls.delLawyer,params,header,true)
  },
  addEvidence(data){//上传证据
    header = {'Content-Type': 'multipart/form-data'}//文件传输时更改请求头为form-data类型
    return api.post(urls.addEvidence,data,header,'',true)
  },
  updateEvidence(data){//更新证据
    header = {'Content-Type': 'multipart/form-data'}//文件传输时更改请求头为form-data类型
    return api.post(urls.updateEvidence,data,header,'',true)
  },
  delEvidence(params){//删除证据
    header = {}
    return api.get(urls.delEvidence,params,header,true)
  },
}