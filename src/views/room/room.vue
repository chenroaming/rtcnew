<template>
    <div class="room">
      <h1>庭审房间</h1>
      <el-button type="text" @click="outRoom">退出</el-button>
      <!-- <el-button type="primary" @click="sendTest('open')">开庭</el-button>
      <el-button type="primary" @click="sendTest('close')">休庭</el-button> -->
      <video autoPlay muted ref="video" class="video"></video>
      <div id="remote-box">
        <!-- 本地自己的视频流 -->
        <div class="video-box">
            <div class="titie">
                <span>{{roleName}}</span>
                <span>{{name}}</span>
                <span>{{address}}</span>
                <el-button type="text" @click="fullScreen">放大</el-button>
            </div>
            <div id="video-box"></div>
        </div>
        <!-- 订阅的视频流 -->
        <remotePlay v-on:srcObj="receive" v-for="(item,index) in userList" :user="item"></remotePlay>
      </div>
    </div>
  </template>
  
  <script>
    import myRoom from '@/utils/pili.js'
    import { deviceManager } from 'pili-rtc-web'
    import remotePlay from '@/components/room/remotePlay.vue'
    import webSocketObj from '@/utils/websocket.js'
    export default {
        components:{
            remotePlay,
        },
      data(){
        return {
            stream:null,
            userList:[],
            roleName:'',
            name:'',
            address:'',
        }
      },
      computed:{
        
      },
      watch:{
        
      },
      async mounted(){
        console.log(this.$route.params)
        if(!this.$route.params.roomToken){
            this.$router.push({
                name:'caseList'
            })
            return;
        }
        try{
            this.websocketInit();
        }
        catch(e){
            console.log(e)
        }

        try {
            await myRoom.joinRoomWithToken(this.$route.params.roomToken.result);//加入房间
            console.log('加入房间成功！')
        }
        catch (e){
            console.log('加入失败！',e)
        }

        try {
            const stream = await deviceManager.getLocalStream({//本地采集
                audio: { enabled: true },
                video: { enabled: true, width: 1280, height: 720 },
            });
            console.log("get stream!", stream);
            this.stream = stream;
            setTimeout(()=> {//延迟后调用接口
                const params = {
                    adminId:stream.userId
                }
                this.$api.room.userDetail(params).then(res => {
                    if(res.state == 100){
                        this.roleName = res.result.roleName;
                        this.name = res.result.name;
                        this.address = res.result.address;
                    }
                })
            },500)
            const domElement = document.getElementById("video-box");
                // 其中第二个参数代表是否开启 静音播放
            stream.play(domElement, false);
        }
        catch(e){
            console.log(e)
        }

        try{
            await myRoom.publish(this.stream);//本地推流至云端
            console.log("publish sucess!");
        }
        catch(e){
            console.log(e)
        }
        const users = myRoom.users;

        for (const user of users) {
        // 每个用户当前是否发布
            if(user.published){
                if(user.userId != this.stream.userId){//如果是自己则不订阅，否则会报错
                    this.userList.push(user);
                }
            }
        }
        myRoom.on("user-publish", user => {
            // 房间里有新的用户发布
            console.log(user.userId, "publish");
            this.userList.push(user)
        });
        myRoom.on("user-unpublish", user => {
            // 房间里有新的用户取消发布
            console.log(user, "unpublish");
            for(let i = 0;i < this.userList.length;i++){
                if(user.userId == this.userList[i].userId){//将取消发布的用户从列表中删除
                    this.userList.splice(i,1);
                }
            }   
        });
      },
      methods:{
        websocketInit(){
            webSocketObj.onopen = () => {
                console.log("WebSocket:已连接");
                console.log(event);
            }
            webSocketObj.onmessage = (e) => {
                console.log(e.data)
            }
            webSocketObj.onerror = (e) => {
                console.log("WebSocket:发生错误 ");
                console.log(event);
            }
            webSocketObj.onclose = (e) => {
                console.log("WebSocket:已关闭");
                console.log(event);
            }
            // const data = {
            //     'name': '',
            //     'roleName': '',
            //     'type': 11,
            //     'wav': '',
            //     'content': 1,
            //     'createDate': ''
            // }
            // webSocketObj.send(data);
        },
        receive(e){//接收子组件消息后放大全屏
            const srcObj = document.getElementsByClassName('video');
            srcObj[0].srcObject = e;
        },
        outRoom(){
            this.$api.room.closeRoom().then(res => {})
            this.stream.release();//释放采集流
            myRoom.leaveRoom();//离开房间
            this.$router.push({
                name:'caseList'
            })
        },
        fullScreen(){//放大全屏
            const domElement = document.getElementById("video-box");
            console.log(domElement.children[1].srcObject)
            const srcObj = document.getElementsByClassName('video');
            srcObj[0].srcObject = domElement.children[1].srcObject;
        },
        sendTest(status){
            if(status == 'open'){
                const data = {
                    'name': '',
                    'roleName': '',
                    'type': 11,
                    'wav': '',
                    'content': 1,
                    'createDate': ''
                }
                webSocketObj.send(data);
            }else{
                const data = {
                    'name': '',
                    'roleName': '',
                    'type': 11,
                    'wav': '',
                    'content': 0,
                    'createDate': ''
                }
                webSocketObj.send(data);
            } 
        }
      }
    }
  </script>
  
  <style lang="less" scoped>
    .room {
        width: 100%;
        height: 100%;
    }
    #video-box {
        width: 300px;
        height: 200px;
    }
    .video-box {
        width: 300px;
        height: 200px;
        display: inline-block;
        position: relative;
    }
    #remote-box {
        width: 100%;
        height: 220px;
        position: absolute;
        bottom: 0;
    }
    video{
        width: 100%;
        height: 100%;
    }
    .titie {
        width: 100%;
        height: 35px;
        position: absolute;
        color: #fff;
        font-weight: bold;
        background-color: rgba(0,0,0,0.7);
        z-index: 999;
        span{
            margin-right: 10px;
        }
    }
  </style>