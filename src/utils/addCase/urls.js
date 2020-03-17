import baseUrl from '../baseUrl'
export default {
    getJudgeBriefCourt: baseUrl + '/main/getJudgeBriefCourt.jhtml',
    updateIndictment:baseUrl + '/court/case/updateIndictment.jhtml',//上传起诉状
    addIndictment:baseUrl + '/court/case/addIndictment.jhtml',//修改起诉状
    addLawCase:baseUrl + '/court/case/addLawCase.jhtml',//添加案件
    updateLawCase:baseUrl + '/court/case/updateLawCase.jhtml',//修改案件
    delFile:baseUrl + '/court/case/delFile.jhtml',//删除文件
    getLitigationStatus:baseUrl + '/court/case/getLitigationStatus.jhtml',//获取诉讼地位列表
    addTrialLitigant:baseUrl + '/court/case/addTrialLitigant.jhtml',//新增当事人
    updateTrialLitigant:baseUrl + '/court/case/updateTrialLitigant.jhtml',//修改当事人
    delTrialLitigant:baseUrl + '/court/case/delTrialLitigant.jhtml',//删除当事人
    delLawyer:baseUrl + '/court/case/delLawyer.jhtml',//删除代理人
}