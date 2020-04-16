<template>
    <div class="room">
        <header>
            <div style="width: 100%;">
                <el-row>
                    <el-col :span="5">
                        <span class="titile-text" style="font-weight: bold;font-size: 20px;">{{caseInfo.court}}</span>
                    </el-col>
                    <el-col :span="4">
                        <span class="titile-text">{{caseInfo.caseNo}}</span>
                    </el-col>
                    <el-col :span="4">
                        <span class="titile-text">当前主屏————{{caseInfo.name}}</span>
                    </el-col>
                    <el-col :span="4">
                        <nowTime></nowTime>
                    </el-col>
                    <el-col :span="4">
                        <chat ref="chat" v-on:showEvi="showEvi" v-on:getEviByCaseIds="getEviByCaseIds" v-on:changeLook="changeLook"></chat>
                    </el-col>
                    <el-col :span="3">
                        <el-button type="text" @click="outRoom" class="titile-text">退出</el-button>
                        <el-button type="text" @click="openChat" class="titile-text">语音识别</el-button>
                    </el-col>
                </el-row>
            </div>
        </header>
        <main>
            <div class="main-box">
                <video autoPlay muted ref="video" class="video"></video>
            </div>
            <div id="remote-box">
                <div class="video-box">
                    <div class="titie">
                        <span>{{roleName}}</span>
                        <span>{{name}}</span>
                        <span>{{address}}</span>
                        <el-button type="text" @click="fullScreen">放大</el-button>
                    </div>
                    <div id="video-box" ref="videoBox"></div>
                </div>
                <remotePlay v-on:srcObj="receive" ref="remotePlay" v-for="(item,index) in userList" :key="index" :user="item"></remotePlay>
            </div>
            <ul class="menu-list">
                <li class="menu-content" @click="nowSelect = 0;isVisible=true;">审辅人员</li>
                <li class="menu-content" @click="nowSelect = 1;isVisible=true;">起诉状</li>
                <li class="menu-content" @click="nowSelect = 2;isVisible=true;">证据列表</li>
                <li class="menu-content" @click="nowSelect = 3;isVisible=true;">庭审笔录</li>
                <li class="menu-content" @click="nowSelect = 4;isVisible=true;">签名确认</li>
            </ul>
        </main>
        <transition name="el-zoom-in-center">
            <div class="drawer" v-show="isVisible">
                <div class="close">
                    <el-button type="text" @click="isVisible = false;">关闭</el-button>
                    <!-- <i class="el-icon-circle-close" style="color: #fff;cursor: pointer;" @click="isVisible = false;"></i> -->
                </div>
                <clerkInfo :caseId="caseId" v-if="nowSelect == 0"></clerkInfo>
                <indictment :caseId="caseId" v-if="nowSelect == 1"></indictment>
                <evidence ref="evidence" v-on:send="send" :caseId="caseId" v-if="nowSelect == 2"></evidence>
                <log :caseId="caseId" v-on:send="send" v-if="nowSelect == 3"></log>
                <signature v-if="nowSelect == 4"></signature>
            </div>
        </transition>
        <showFile ref="toFile" :fileItem="fileItem"></showFile>
    </div>
  </template>
  
  <script>
    import myRoom from '@/utils/pili.js'
    import { deviceManager } from 'pili-rtc-web'
    import remotePlay from '@/components/room/remotePlay.vue'
    import chat from '@/components/room/chat.vue'
    import clerkInfo from '@/components/room/clerkInfo.vue'
    import evidence from '@/components/room/evidence.vue'
    import indictment from '@/components/room/indictment.vue'
    import log from '@/components/room/log.vue'
    import signature from '@/components/room/signature.vue'
    import showFile from '@/components/addCase/showFile.vue'
    import nowTime from '@/components/room/nowTime.vue'
    export default {
        components:{
            remotePlay,
            chat,
            clerkInfo,
            evidence,
            indictment,
            log,
            signature,
            showFile,
            nowTime,
        },
      data(){
        return {
            titleArr:['审辅人员','起诉状','证据列表','庭审笔录','签名确认'],
            nowSelect:0,
            isVisible:false,
            stream:null,
            userList:[],
            roleName:'',
            name:'',
            address:'',
            caseInfo:{
                court:'',
                caseNo:'',
                name:'',
                time:'测试时间',
            },
            caseId:'',
            isEdit:false,
            fileItem:{},
            // wsObj:null,
        }
      },
      computed:{
        
      },
      watch:{
        
      },
      async mounted(){
        if(!this.$route.params.roomToken){
            this.$router.push({
                name:'caseList'
            })
            return;
        }
        this.isEdit = this.$store.getters.getEditStatus;
        this.caseId = this.$route.params.caseInfo.caseId;
        const data = {
            lawCaseId:this.caseId.includes(',') ? this.caseId.split(',')[0] : this.caseId
        }
        this.$api.room.getLawCaseCourt(data).then(res => {
            if(res.state == 100){
                this.caseInfo.court = res.court;
            }
        })
        this.caseInfo.caseNo = this.$route.params.caseInfo.caseNo.includes(',') ? '批量开庭' : this.$route.params.caseInfo.caseNo;
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
                        if(this.roleName == '法官'){
                            this.fullScreen();
                        }
                    }
                })
            },500)
            const domElement = document.getElementById("video-box");
                // 其中第二个参数代表是否开启 静音播放
            stream.play(domElement, false);
        }
        catch(e){
            console.log(e)
            this.$message({
                message:'请检查摄像头等设备否正常！',
                type:'error'
            })
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
        receive(e){//接收子组件消息后放大全屏
            const srcObj = this.$refs.video;
            srcObj.srcObject = e.src;
            this.caseInfo.name = e.info.roleName + ' ' + e.info.name;
        },
        showEvi(e){//查看证据
            const name = e.split('/');
            this.fileItem = {
                name:name[name.length-1],
                addr:e
            };
            this.$refs.toFile.showEvidence();
        },
        getEviByCaseIds(e){//更新证据列表
            this.$refs.evidence.getEviByCaseIds();
        },
        changeLook(e){
            this.$refs.remotePlay.changeLook(e);
        },
        send(e){
            this.$refs.chat.sendMsg(e);
        },
        outRoom(){//退出房间
            this.$api.room.closeRoom();
            if(this.stream){
                this.stream.release();//释放采集流
            }
            myRoom.leaveRoom();//离开房间
            this.$router.push({
                name:'caseList'
            })
        },
        fullScreen(){//放大全屏
            const domElement = this.$refs.videoBox;
            const srcObj = this.$refs.video;
            srcObj.srcObject = domElement.children[1].srcObject;
            this.caseInfo.name = this.roleName + ' ' + this.name;
        },
        openChat(){//打开语音识别窗口
            this.$refs.chat.showChatWindow();
        },
      },
      destroyed(){
        this.$api.room.closeRoom();
        if(this.stream){
            this.stream.release();
        }
        myRoom.leaveRoom();
      },
    }
  </script>
  
  <style lang="less" scoped>
    header{
        width: 100%;
        height: 60px;
        line-height: 60px;
        background-color: #2367F6;
    }
    main{
        height: calc(100% - 60px);
    }
    .titile-text {
        color: #fff;
    }
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
        height: 225px;
        position: absolute;
        bottom: 0;
        overflow-x: scroll;
    }
    .main-box {
        position: absolute;
        top: 60px;
        bottom: 0px;
        left: 0px;
        right: 0px;
    }
    .video{
        width: 100%;
        height: 100%;
        object-fit: fill;
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
    .header-box {
        width: 100%;
        height: 60px;
        line-height: 60px;
    }
    .menu-list {
        width: 100px;
        height: 300px;
        position: fixed;
        right: 0;
        top: 100px;
        z-index: 99;
        padding: 0;
        list-style: none;
    }
    .menu-content {
        float: left;
        width: 100%;
        height: 50px;
        line-height: 50px;
        background-color: #40A9FF;
        cursor: pointer;
        border-top-left-radius: 20px;
        border-bottom-left-radius: 20px;
        margin-top: 10px;
        color: #fff;
        font-weight: bold;
    }
    .drawer {
        width: 500px;
        height: calc(100% - 60px);
        position: fixed;
        right: 0;
        top: 60px;
        background-color: rgba(0, 0, 0, 0.5);
        z-index: 99;
        .close{
            width: 50px;
            height: 50px;
            position: absolute;
            top:10px;
            right: 10px;
        }
    }
  </style>