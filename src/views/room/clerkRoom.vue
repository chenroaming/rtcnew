<template>
    <div class="room">
        <roomWs ref="ws" v-on:showEvi="showEvi"
            v-on:newChat="newChat"
            v-on:getEviByCaseIds="getEviByCaseIds"
            v-on:changeLook="changeLook"
            v-on:changeStatus="changeStatus"
            v-on:tips="tips"></roomWs>
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
                        <roomChat ref="chat" v-on:send="send"></roomChat>
                    </el-col>
                    <el-col :span="3">
                        <el-button type="text" @click="outRoom" class="titile-text">退出</el-button>
                    </el-col>
                </el-row>
            </div>
        </header>
        <main>
            <div class="big-box" style="width: calc(100% - 100px);height: calc(100vh - 60px);">
                <div class="remote-box" style="width: 28%;">
                    <clerkRoomChat ref="clerkChat" v-on:send="send"></clerkRoomChat>
                </div>
                <div class="remote-box" style="width: 42%;">
                    <clerkRoomNote></clerkRoomNote>
                </div>
                <div id="remote-box" class="remote-box" style="width: 30%;overflow-y: scroll;">
                    <remotePlay ref="remotePlay" v-on:srcObj="receive" v-for="(item,index) in userList" :key="index" :user="item"></remotePlay>
                </div>
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
                <roomClerkInfo :caseId="caseId" v-if="nowSelect == 0"></roomClerkInfo>
                <roomIndictment :caseId="caseId" v-if="nowSelect == 1"></roomIndictment>
                <roomEvidence ref="evidence" :caseId="caseId" v-if="nowSelect == 2"></roomEvidence>
                <roomLog :caseId="caseId" v-if="nowSelect == 3"></roomLog>
                <roomSignature v-if="nowSelect == 4"></roomSignature>
            </div>
        </transition>
        <showFile ref="toFile" :fileItem="fileItem"></showFile>
    </div>
  </template>
  
  <script>
    import myRoom from '@/utils/pili.js'
    import { deviceManager } from 'pili-rtc-web'
    import roomRemotePlayer from '@/components/room/roomRemotePlayer.vue'
    import roomWs from '@/components/room/roomWs.vue'
    import roomChat from '@/components/room/roomChat.vue'
    import roomClerkInfo from '@/components/room/roomClerkInfo.vue'
    import roomEvidence from '@/components/room/roomEvidence.vue'
    import roomIndictment from '@/components/room/roomIndictment.vue'
    import roomLog from '@/components/room/roomLog.vue'
    import roomSignature from '@/components/room/roomSignature.vue'
    import showFile from '@/components/addCase/showFile.vue'
    import roomNowTime from '@/components/room/roomNowTime.vue'
    import clerkRoomNote from '@/components/clerkRoom/clerkRoomNote.vue'
    import clerkRoomChat from '@/components/clerkRoom/clerkRoomChat.vue'
    export default {
        components:{
            roomRemotePlayer,
            roomWs,
            roomChat,
            roomClerkInfo,
            roomEvidence,
            roomIndictment,
            roomLog,
            roomSignature,
            showFile,
            roomNowTime,
            clerkRoomNote,
            clerkRoomChat,
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
        const userId = this.$store.getters.getUserInfo.result.id;
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
        const users = myRoom.users;

        for (const user of users) {
        // 每个用户当前是否发布
            if(user.published){
                if(user.userId != userId){//如果是自己则不订阅，否则会报错
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
        changeLook(e){//显示当事人查看证据中
            this.$refs.remotePlay.changeLook(e);
        },
        changeStatus(e){//改变开庭休庭状态
            this.$refs.chat.changeStatus();
        },
        newChat(e){
            this.$refs.clerkChat.chatItemPush(e);
        },
        send(e){//发送websocket消息
            this.$refs.ws.sendMsg(e);
        },
        tips(e){//当事人已签名消息
            this.$refs.chat.showNewTips(e);
        },
        outRoom(){
            this.$api.room.closeRoom();
            if(this.stream){
                this.stream.release();//释放采集流
            }
            myRoom.leaveRoom();//离开房间
            this.$router.push({
                name:'caseList'
            })
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
    .big-box{
        width: calc(100% - 100px);
        height: calc(100vh - 60px);
        float: left;
    }
    .remote-box {
        width: 33.333%;
        height: 100%;
        float: left;
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
        z-index: 999;
        .close{
            width: 50px;
            height: 50px;
            position: absolute;
            top:10px;
            right: 10px;
        }
    }
  </style>