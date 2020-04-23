<template>
    <div>
        <div style="display: none;"></div>
    </div>
</template>
  
  <script>
    export default {
        name: 'roomWs',
      data(){
        return {
            wsObj:null,
            heartbeat:null,
            timeOut:55000,
        }
      },
      async mounted(){
        await this.websocketInit();
        this.heartbeat = setInterval(() => {
            this.wsObj.send('');
        },this.timeOut)
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
                this.msgType(getMsg.type,getMsg)
            }
            this.wsObj.onerror = (e) => {
                console.log("WebSocket:发生错误",e);
            }
            this.wsObj.onclose = (e) => {
                console.log("WebSocket:已关闭",e);
            }
        },
        sendMsg(e){
            this.wsObj.send(e);
        },
        msgType(MsgType,content){
            const sendChat = () => {
                const time = content.createDate.split(' ')[3]
                const data = {
                    name:`${content.roleName}${content.name}  ${time}`,
                    content:content.content
                }
                this.$emit('newChat',data)
            }
            const actions = new Map([
                [0,() => {
                    sendChat();
                }],
                [1,() => {
                    sendChat();
                }],
                [2,() => {
                    this.$emit('getEviByCaseIds')
                }],
                [3,() => {
                    this.$emit('showEvi',content.content)
                }],
                [10,() => {
                    this.$emit('changeLook',content.content)
                }],
                [11,() => {
                    this.$emit('changeStatus')
                }],
                [12,() => {
                    this.$emit('tips',content.content)
                }]
            ])
            return actions.get(MsgType)();
        }
      },
      destroyed(){
        clearInterval(this.heartbeat);
        this.wsObj.close();
        this.$store.dispatch('clearWebSocket');
      }
    }
  </script>

  <style lang="less" scoped>
    
  </style>