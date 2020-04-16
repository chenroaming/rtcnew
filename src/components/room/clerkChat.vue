<template>
    <div>
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
</template>
  
  <script>
    export default {
        name: 'clerkChat',
      data(){
        return {
            chatItem:[],
            textarea:'',
            wsObj:null,
        }
      },
      computed:{
        
      },
      watch:{
        
      },
      mounted(){
        // this.wsObj = this.$store.getters.getWebSocket;
        // this.wsObj.onmessage = (e) => {
        //     const getMsg = JSON.parse(e.data);
        //     console.log(JSON.parse(e.data))
        //     if(getMsg.type == 11){
        //         this.$emit('changeStatus',11)
        //     }

        //     if(getMsg.type == 3){
        //         this.$emit('showEvi',getMsg.content);
        //     }

        //     if(getMsg.type === 0 || getMsg.type === 1){
        //         const time = getMsg.createDate.split(' ')[3]
        //         const data = {
        //             name:getMsg.roleName + '  ' + getMsg.name + '  ' + time,
        //             content:getMsg.content
        //         }
        //         this.chatItem.push(data);
        //     }
        // }
      },
      methods:{
        send(){
            const sendObj = { 'name': '', 'roleName': '', 'type': 1, 'wav': '', 'content': this.textarea, 'createDate': '' }
            const sendJSON = JSON.stringify(sendObj)
            this.$emit('send',sendJSON);
            // this.wsObj.send(sendJSON)
            this.textarea = '';
        },
        chatItemPush(msg){//新消息推送
            this.chatItem.push(msg);
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

      }
    }
  </script>
  
  <style lang="less" scoped>
    .chat-box{
        width: 100%;
        height: 450px;
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
            color: #000;
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