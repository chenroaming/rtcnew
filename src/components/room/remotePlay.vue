<template>
    <div class="video-box">
        <div class="titie">
            <span>{{info.roleName}}</span>
            <span>{{info.name}}</span>
            <span>{{info.address}}</span>
            <el-button v-if="roleName != '书记员'" type="text" @click="fullScreen">放大</el-button>
        </div>
        <div v-show="isLook" class="isLook">查看证据中。。。</div>
        <div class="player" ref="player"></div>
    </div>
</template>
  
  <script>
    import myRoom from '@/utils/pili.js'
    export default {
        name: 'remotePlay',
        props:['user'],
      data(){
        return {
            wsObj:null,
            isLook:false,
            roleName:'',
            info:{
                roleName:'',
                name:'',
                address:'',
            }
        }
      },
      computed:{
        
      },
      watch:{
        
      },
      async mounted(){
        this.wsObj = this.$store.getters.getWebSocket;
        this.roleName = this.$store.getters.getUserInfo.roleName;
        const domElement = this.$refs.player;
        if(this.user.userId){
            const params = {
                adminId:this.user.userId
            }
            const stream = await myRoom.subscribe(this.user.userId);
            stream.play(domElement, false);//获取用户id后推流
            this.$api.room.userDetail(params).then(res => {
                if(res.state == 100){
                    this.info = res.result;
                    if(res.result.roleName == '法官'){
                        this.fullScreen();
                    }
                }
            })
        }
        this.wsObj.onmessage = (e) => {
            const getMsg = JSON.parse(e.data);
            if(getMsg.type == 10){//微信小程序是否正在查看证据
                if(this.user.userId == getMsg.content){
                    this.isLook = !this.isLook;
                }
            }
        }
      },
      methods:{
        fullScreen(){//向父组件传递视频信息
            const domElement = this.$refs.player.children[1].srcObject;
            const obj = {
                src:domElement,
                info:this.info
            }
            this.$emit('srcObj',obj);
        },
      }
    }
  </script>
  
  <style lang="less" scoped>
    .video-box {
        width: 300px;
        height: 200px;
        display: inline-block;
        position: relative;
    }
    .player {
        width: 300px;
        height: 200px;
        display: inline-block;
    }
    .isLook{
        position: absolute;
        width: 95%;
        height: 35px;
        color: #fff;
        bottom: 35%;
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