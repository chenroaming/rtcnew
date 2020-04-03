import baseUrl from '../baseUrl'
export default {
    getWorkers:baseUrl + '/court/case/getJudgeImage.jhtml',//获取工作人员信息
    getEviByCaseIds: baseUrl + '/qtw/evi/getEviByCaseIds.jhtml',//获取案件证据/起诉状信息
    createImg: baseUrl + '/online/createImg.jhtml',//获取签名二维码
    saveTrialRecord: baseUrl + '/online/saveTrialRecord.jhtml',//下载起诉状文件
    uploadRecordFile:baseUrl + '/online/uploadRecordFile.jhtml',//上传起诉状文件
    examineEvi: baseUrl + '/qtw/out/evi/examineEvi.jhtml',//是否通过证据
    uploadEvi: baseUrl + '/qtw/out/evi/editEvi.jhtml',//庭审房间中上传证据
}