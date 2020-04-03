import baseUrl from '../baseUrl'
export default {
  caseList: baseUrl + '/court/case/caseList.jhtml',//获取案件详情列表
  getCaseDetail: baseUrl + '/court/case/getCaseDetail.jhtml',//获取单个案件详情
  getMessageInfo:baseUrl + '/court/case/getMessageInfo.jhtml',//获取发送短信内容
  sendMessage:baseUrl + '/court/case/sendMessage.jhtml',//发送短信
  downRecord:baseUrl + '/court/case/downRecord.jhtml',//下载笔录
  changeIsFace:baseUrl + '/main/changeIsFace.jhtml',//面部识别开关
  delLawCase: baseUrl + '/court/case/delLawCase.jhtml',//删除案件
  countTrial: baseUrl + '/court/case/countTrial.jhtml',//根据日期查询案件统计表格
}