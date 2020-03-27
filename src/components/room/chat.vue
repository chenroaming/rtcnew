<template>
    <div>
        <el-button type="primary" @click="sendTest">{{status ? "休庭" : "开庭"}}</el-button>
    </div>
</template>
  
  <script>
    import HZRecorder from '@/utils/recorder-worker.js'
    import myRoom from '@/utils/pili.js'
    export default {
        name: 'chat',
      data(){
        return {
            rec:null,
            emptyData:true,
            emptyCheckCount:0,
            emptydatacount:0,
            bufferCount:0,
            wsObj:null,
            status:false,
        }
      },
      computed:{
        getStatus(){
            return this.status;
        }
      },
      watch:{
        getStatus(curval,oldval){
            if(curval){
                this.start();
            }else{
                this.stop();
            }
        }
      },
      async mounted(){
        await this.websocketInit();
        navigator.getUserMedia({ audio: true }, (stream) => {
            this.rec = new HZRecorder(stream, {})  //音频处理对象
            // console.log(this.rec)
            // 监听语音输入 是否为空
            this.rec.recorder.onaudioprocess = (e) => {    //音频采集
                let data = e.inputBuffer.getChannelData(0)
                this.rec.audioData.input(data)  // 存录音到 HZRecorder 录音处理对象
                if (!this.emptyData) {
                    // console.log('vol')
                }
                let l = Math.floor(data.length / 10)
                let vol = 0  //声音大小
                for (let i = 0; i < l; i++) {
                    vol += Math.abs(data[i * 10])   //计算出声音大小
                }
                this.emptyCheckCount++   //
                this.bufferCount++   //
                if (vol < 20) {   //如果声音小于20
                    this.emptydatacount++
                    if (this.emptydatacount > 10) {   //声音小于20的次数大于10的时候，把录音文件发送出去
                        if (!this.emptyData) {  //不为空
                            console.log('已采集语音信息')
                            // console.log(that.userInfo.name)
                            this.emptydatacount = 0
                            this.emptyData = true
                            let blob = this.rec.audioData.encodeWAV() //获取音频数据
                            console.log(blob)
                            this.wsObj.send(blob)
                            this.rec.audioData.buffer = []
                            this.rec.audioData.size = 0
                            this.bufferCount = 0
                            // if(that.userInfo.name != '开庭小助手'){
                            //     this.send(blob)
                            //     console.log(blob)
                            //     this.rec.audioData.buffer = []
                            //     this.rec.audioData.size = 0
                            //     this.bufferCount = 0
                            // }else{
                            //     console.log('不发送')
                            //     this.rec.audioData.buffer = []
                            //     this.rec.audioData.size = 0
                            //     this.bufferCount = 0
                            // }       
                        } 
                        else {
                            // console.log(this.bufferCount)
                            if (this.bufferCount > 5) {
                            this.rec.audioData.buffer = []
                            this.rec.audioData.size = 0
                            this.bufferCount = 0
                            }
                        }
                    return
                    }

                } else {
                    this.emptydatacount = 0
                    this.emptyData = false
                    // let blob = this.rec.audioData.encodeWAV()
                    // console.log(blob)
                    // this.send(blob)
                    // this.rec.audioData.buffer = []
                    // this.rec.audioData.size = 0
                }
                return
            }
            // this.start()
        }, (error) => {
            switch (error.name) {
            case 'PERMISSION_DENIED':
            case 'PermissionDeniedError':
                HZRecorder.throwError('用户拒绝提供信息。')
                break
            case 'NOT_SUPPORTED_ERROR':
            case 'NotSupportedError':
                HZRecorder.throwError('浏览器不支持硬件设备。')
                break
            case 'MANDATORY_UNSATISFIED_ERROR':
            case 'MandatoryUnsatisfiedError':
                HZRecorder.throwError('无法发现指定的硬件设备。')
                break
            default:
                this.$message.error('请检查麦克风设备是否有问题！');
                // HZRecorder.throwError('无法打开麦克风。异常信息:' + (error.name))
                break
            }
        })
      },
      methods:{
        websocketInit(){//ws初始化
            this.wsObj = this.$store.getters.getWebSocket;
            this.wsObj.onopen = () => {
                console.log("WebSocket:已连接");
            }
            this.wsObj.onmessage = (e) => {
                const getMsg = JSON.parse(e.data);
                console.log(JSON.parse(e.data))
                if(getMsg.type == 11){
                    this.status = !this.status;
                }
            }
            this.wsObj.onerror = (e) => {
                console.log("WebSocket:发生错误",e);
                console.log(e);
            }
            this.wsObj.onclose = (e) => {
                console.log("WebSocket:已关闭",e);
            }
        },
        async sendTest(status){
            if(this.status){
                this.status = !this.status;
                const data = {
                    'name': '',
                    'roleName': '',
                    'type': 11,
                    'wav': '',
                    'content': 0,
                    'createDate': ''
                }
                const data2 = {
                    'name': '',
                    'roleName': '',
                    'type': 6,
                    'wav': '',
                    'content': 0,
                    'createDate': ''
                }
                await myRoom.stopMergeStream()
                console.log('stopMergeStream')
                this.wsObj.send(JSON.stringify(data));
                this.wsObj.send(JSON.stringify(data2));
                // this.stop();
            }else{
                this.status = !this.status;
                const data = {
                    'name': '',
                    'roleName': '',
                    'type': 11,
                    'wav': '',
                    'content': 1,
                    'createDate': ''
                }
                const data2 = {
                    'name': '',
                    'roleName': '',
                    'type': 6,
                    'wav': '',
                    'content': 1,
                    'createDate': ''
                }
                await myRoom.setDefaultMergeStream(1280, 720)
                console.log('setDefaultMergeStream')
                this.wsObj.send(JSON.stringify(data));
                this.wsObj.send(JSON.stringify(data2));
                // this.start();
            }
        },
        start () {
            console.log('start')
            this.rec.start()
        },
        stop () {
            console.log('stop')
            this.rec.stop()
            this.rec.clear()
        },
      },
      destory(){
          this.wsObj.close();
          this.stop();
      }
    }
  </script>
  
  <style lang="less" scoped>
    
  </style>