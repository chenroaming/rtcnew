<template>
    <div>
        <el-button type="primary" @click="sendTest" v-if="isEdit">{{status ? "休庭" : "开庭"}}</el-button>
        <div v-if="!isEdit" style="width: 240px;height: 60px;"></div>
        <transition name="el-zoom-in-center">
            <div class="drawer" v-show="drawer">
                <div class="close">
                    <el-button type="text" @click="drawer = false;">关闭</el-button>
                    <!-- <i class="el-icon-circle-close" style="color: #fff;cursor: pointer;" @click="drawer = false;"></i> -->
                </div>
                <div class="chat-box" ref="chatBox">
                    <div v-for="(item,index) in chatItem" class="chatItem-content">
                        <p>{{item.name}}</p>
                        <p>{{item.content}}</p>
                    </div>
                </div>
                <div class="text-box">
                    <el-input type="textarea" :rows="5" placeholder="请输入文字" v-model="textarea"></el-input>
                    <el-button @click="send" type="primary" style="margin-top: 10px;">发送</el-button>
                </div>
            </div>
        </transition>
    </div>
</template>
  
  <script>
    import HZRecorder from '@/utils/recorder-worker.js'
    import myRoom from '@/utils/pili.js'
    export default {
        name: 'chat',
      data(){
        return {
            chatItem:[],
            needModal:false,
            textarea:'',
            drawer:false,
            isEdit:false,
            rec:null,
            emptyData:true,
            emptyCheckCount:0,
            emptydatacount:0,
            bufferCount:0,
            wsObj:null,
            status:false,
            heartbeat:null,
            timeOut:55000,
            roleName:'',
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
        this.heartbeat = setInterval(() => {
            this.wsObj.send('');
        },this.timeOut)
        this.isEdit = this.$store.getters.getEditStatus;
        this.roleName = this.$store.getters.getUserInfo.roleName;
        navigator.getUserMedia({ audio: true }, (stream) => {
            this.rec = new HZRecorder(stream, {})  //音频处理对象
            // console.log(this.rec)
            // 监听语音输入 是否为空
            this.status = this.$store.getters.getIsVoice;
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
                            if(this.roleName != '开庭小助手'){
                                this.wsObj.send(blob)
                            }
                            this.rec.audioData.buffer = []
                            this.rec.audioData.size = 0
                            this.bufferCount = 0    
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
            this.start();
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
        console.log(111)
      },
      methods:{
        websocketInit(){//ws初始化
            this.wsObj = this.$store.getters.getWebSocket;
            // console.log(this.wsObj);
            this.wsObj.onopen = () => {
                console.log("WebSocket:已连接");
            }
            this.wsObj.onmessage = (e) => {
                const getMsg = JSON.parse(e.data);
                console.log(JSON.parse(e.data))
                if(getMsg.type == 11){
                    this.status = !this.status;
                }
                if(getMsg.type == 3){
                    this.$emit('showEvi',getMsg.content);
                }
                if(getMsg.type === 0 || getMsg.type === 1){
                    const time = getMsg.createDate.split(' ')[3]
                    const data = {
                        name:getMsg.roleName + '  ' + getMsg.name + '  ' + time,
                        content:getMsg.content
                    }
                    this.chatItem.push(data);
                }
            }
            this.wsObj.onerror = (e) => {
                console.log("WebSocket:发生错误",e);
                console.log(e);
            }
            this.wsObj.onclose = async (e) => {
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
        showChatWindow(){
            this.drawer = !this.drawer;
        },
        send(){
            const sendObj = { 'name': '', 'roleName': '', 'type': 1, 'wav': '', 'content': this.textarea, 'createDate': '' }
            const sendJSON = JSON.stringify(sendObj)
            this.wsObj.send(sendJSON)
            this.textarea = '';
        },
        changeStatus(){
            this.status = !this.status;
        },
        scrollToBottom(){
            this.$nextTick(() =>{
                this.$refs.chatBox.scrollTop = this.$refs.chatBox.scrollHeight;
            })
        },
      },
      updated(){
        this.scrollToBottom();
      },
      destroyed(){
        clearInterval(this.heartbeat);
        console.log(this.heartbeat)
        this.wsObj.close();
        this.$store.dispatch('clearWebSocket');
        this.stop();
      }
    }
  </script>

  <style lang="less" scoped>
    .drawer {
        width: 500px;
        height: calc(100% - 60px);
        position: fixed;
        left: 0;
        top: 60px;
        background-color: rgba(0, 0, 0, 0.5);
        z-index: 2;
        .close{
            width: 50px;
            height: 50px;
            position: absolute;
            top:10px;
            right: 10px;
        }
    }
    .chat-box{
        width: 100%;
        height: 500px;
        /* overflow-y: scroll; */
        overflow: auto;
    }
    .chatItem-content{
        padding: 0 20px;
        p:nth-child(1){
            margin: 0;
            height: 30px;
            line-height: 30px;
            text-align: left;
            font-size: 14px;
            font-weight: bold;
            color: #0684FF;
        }
        p:nth-child(2){
            margin: 0;
            height: auto;
            text-align: left;
            font-size: 14px;
            font-weight: bold;
            color: #fff;
            word-break: break-all;
            line-height: 30px;
        }
    }
    .text-box{
        text-align: center;
        margin-top: 10px;
        padding: 0 20px;
    }
  </style>