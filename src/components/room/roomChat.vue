<template>
    <div>
        <el-radio-group v-model="radio" style="margin-right: 5px;" @change="changeAiType">
            <el-radio :label="1">阿里</el-radio>
            <el-radio :label="2">讯飞</el-radio>
        </el-radio-group>
        <el-button :type="buttonType" @click="sendTest" v-if="isEdit">{{getStatus}}</el-button>
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
        name: 'roomChat',
      data(){
        return {
            radio:1,
            buttonType:'primary',
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
            this.buttonType = this.status ? 'warning' : 'primary';
            this.status ? this.start() : this.stop();
            return this.status ? "休庭" : "开庭";
        },
      },
      async mounted(){
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
                                // this.wsObj.send(blob)
                                this.$emit('send',blob);
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
      },
      methods:{
        async sendTest(status){
            if(this.status){
                this.$confirm('确定结束庭审？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(async () => {
                    this.status = !this.status;
                    const data = {'name': '','roleName': '','type': 11,'wav': '','content': 0,'createDate': ''}
                    const data2 = {'name': '','roleName': '','type': 6,'wav': '','content': 0,'createDate': ''}
                    await myRoom.stopMergeStream()
                    console.log('stopMergeStream')
                    this.$emit('send',JSON.stringify(data));
                    this.$emit('send',JSON.stringify(data2));
                }).catch(() => {
                    
                });
            }else{
                this.status = !this.status;
                const data = {'name': '','roleName': '','type': 11,'wav': '','content': 1,'createDate': ''}
                const data2 = {'name': '','roleName': '','type': 6,'wav': '','content': 1,'createDate': ''}
                await myRoom.setDefaultMergeStream(1280, 720)
                console.log('setDefaultMergeStream')
                this.$emit('send',JSON.stringify(data));
                this.$emit('send',JSON.stringify(data2));
            }
        },
        start () {//开始语音识别
            if(this.rec){
                this.rec.start()
            }
            console.log('start')
        },
        stop () {//停止语音识别
            if(this.rec){
                this.rec.stop()
                this.rec.clear()
            }
            console.log('stop')
        },
        showChatWindow(){
            this.drawer = !this.drawer;
        },
        send(){
            if(this.textarea){
                const sendObj = { 'name': '', 'roleName': '', 'type': 1, 'wav': '', 'content': this.textarea, 'createDate': '' }
                const sendJSON = JSON.stringify(sendObj);
                this.$emit('send',sendJSON);
                this.textarea = '';
                return;
            }
            this.$message.warning('发送内容为空！');
        },
        changeStatus(){//改变开庭休庭状态
            this.status = !this.status;
        },
        chatItemPush(msg){//新消息推送
            this.chatItem.push(msg);
        },
        showNewTips(msg){//当事人签名消息推送
            if(this.roleName == '法官'){
                this.$notify({
                    title: '提示',
                    message: msg,
                    type: 'success'
                });
            }
        },
        scrollToBottom(){
            this.$refs.chatBox.scrollTop = this.$refs.chatBox.scrollHeight;
        },
        changeAiType(e){//改变语音识别类型
            const sendObj = { 'name': '', 'roleName': '', 'type': 8, 'wav': '', 'content': e, 'createDate': '' }
            this.$emit('send',JSON.stringify(sendObj))
        },
      },
      updated(){
        this.$nextTick(() =>{
            this.scrollToBottom();//总是下拉显示最新的消息
        })
      },
      destroyed(){
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
        z-index: 9999;
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