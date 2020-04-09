import api from '../index'
import urls from './urls'

let header = {}

export default {
    getWorkers(params){
        header = {}
        return api.get(urls.getWorkers,params,header)
    },
    getEviByCaseIds(params){
        header = {}
        return api.get(urls.getEviByCaseIds,params,header)
    },
    createImg(params){
        header = {}
        return api.get(urls.createImg,params,header)
    },
    saveTrialRecord(params){
        header = {}
        return api.get(urls.saveTrialRecord,params,header,true)
    },
    uploadRecordFile(data){
        header = {'Content-Type': 'multipart/form-data'}//文件传输时更改请求头为form-data类型
        return api.post(urls.uploadRecordFile,data,header,'',true)
    },
    examineEvi(params){
        header = {}
        return api.get(urls.examineEvi,params,header,true)
    },
    uploadEvi(data){
        header = {'Content-Type': 'multipart/form-data'}//文件传输时更改请求头为form-data类型
        return api.post(urls.uploadEvi,data,header,'',true)
    },
    getTrialRecord(params){
        header = {}
        return api.get(urls.getTrialRecord,params,header)
    },
}