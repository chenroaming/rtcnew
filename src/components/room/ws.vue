<template>
    <div>
        <div style="display: none;"></div>
    </div>
</template>
  
  <script>
    export default {
        name: 'ws',
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
                if(getMsg.type === 0 || getMsg.type === 1){
                    const time = getMsg.createDate.split(' ')[3]
                    const data = {
                        name:getMsg.roleName + '  ' + getMsg.name + '  ' + time,
                        content:getMsg.content
                    }
                    this.$emit('newChat',data);
                }

                if(getMsg.type === 2){
                    this.$emit('getEviByCaseIds');
                }

                if(getMsg.type === 3){
                    
                    this.$emit('showEvi',getMsg.content);
                }

                if(getMsg.type === 10){
                    this.$emit('changeLook',getMsg.content)
                }

                if(getMsg.type === 11){
                    this.$emit('changeStatus');
                }

                if(getMsg.type == 12){
                    this.$emit('tips',getMsg.content)
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
        sendMsg(e){
            this.wsObj.send(e);
        },
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