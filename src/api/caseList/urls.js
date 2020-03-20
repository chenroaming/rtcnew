import baseUrl from '../baseUrl'
export default {
  caseList: baseUrl + '/court/case/caseList.jhtml',//获取案件详情列表
  getCaseDetail: baseUrl + '/court/case/getCaseDetail.jhtml',//获取单个案件详情
  getMessageInfo:baseUrl + '/court/case/getMessageInfo.jhtml',//获取发送短信内容
  sendMessage:baseUrl + '/court/case/sendMessage.jhtml',//发送短信
  downRecord:baseUrl + '/court/case/downRecord.jhtml',//下载笔录
}