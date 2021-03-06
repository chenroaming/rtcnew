import axios from 'axios'
import Vue from 'vue'
import { Loading,Message } from 'element-ui'//引入加载效果组件
const service = axios.create({
    // headers:{'Content-Type': 'application/json'},
    timeout:60000
})
const options = {
    lock: true,
    text: 'Loading',
    spinner: 'el-icon-loading',
    background: 'rgba(255, 255, 255, 0.7)'
}
let loadingInstance
let loadingCount = 0//全局加载效果计数器
let showTips = false//消息提示开关
service.defaults.headers.post['Content-Type'] = 'application/json'
service.defaults.headers.put['Content-Type'] = 'application/json'
// 添加请求拦截器
service.interceptors.request.use(
    (config) => {
        if(loadingCount == 0){
            loadingInstance = Loading.service(options);//全局添加请求时的加载效果=
        }
        loadingCount ++
        if (config.method === 'post' || config.method === 'put') {
            // post、put 提交时，将对象转换为string, 为处理Java后台解析问题
            config.data = JSON.stringify(config.data)
        }
        if(config.showTips){
            showTips = true;
        }
        // 请求发送前进行处理,判断是否使用form-data进行文件传输
        if(config.headers['Content-Type'] == 'multipart/form-data'){
            const data = config.params
            let fd = new FormData()
            for (const key in data) {
                if(Array.isArray(data[key])){
                    for(const item of data[key]){
                        if(item['type']){
                            console.log(item['type'])
                            fd.append('file',item)
                        }
                    }
                }
            }
            config.data = fd
        }
        return config
    },
    (error) => {
        // 请求错误处理
        loadingInstance.close();//去除加载效果
        return Promise.reject(error)
    }
)

// 添加响应拦截器
service.interceptors.response.use(
    (response) => {
        loadingCount --
        if(loadingCount == 0){
            loadingInstance.close();//收到回复后隐藏加载效果
        }
        const { data } = response//对象解构，直接获取回复消息中的data
        if(showTips){//是否需要弹出消息提示
            if(data.state == 100){
                Message.success(data.message)
                showTips = false
                return data
            }
            Message.warning(data.message)
            showTips = false
        }
        return data
    },
    (error) => {``
        loadingCount --
        if(loadingCount == 0){
            loadingInstance.close();//收到回复后隐藏加载效果
        }
        Message.warning('网络错误，请稍后重试！')
        let info = {},
        { status, statusText, data } = error.response

        if (!error.response) {
            info = {
                code: 5000,
                msg: 'Network Error'
            }
        } else {
            //此处整理错误信息格式
            info = {
                code: status,
                data: data,
                msg: statusText
            }
        }
    }
)

/**
 * 创建统一封装过的 axios 实例
 * @return {AxiosInstance}
 */
export default function() {
    return service
}