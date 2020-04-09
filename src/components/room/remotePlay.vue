<template>
    <div class="video-box">
        <div class="titie">
            <span>{{info.roleName}}</span>
            <span>{{info.name}}</span>
            <span>{{info.address}}</span>
            <el-button v-if="roleName != '书记员'" type="text" @click="fullScreen">放大</el-button>
        </div>
        <div class="player" ref="player"></div>
    </div>
</template>
  
  <script>
    // import * as QNRTC from "pili-rtc-web";
    import myRoom from '@/utils/pili.js'
    export default {
        name: 'remotePlay',
        props:['user'],
      data(){
        return {
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
        this.roleName = this.$store.getters.getUserInfo.roleName;
        const domElement = this.$refs.player;
        console.log(this.user.userId);
        if(this.user.userId){
            const params = {
                adminId:this.user.userId
            }
            const stream = await myRoom.subscribe(this.user.userId);
            stream.play(domElement, false)
            this.$api.room.userDetail(params).then(res => {
                console.log(res)
                if(res.state == 100){
                    this.info = res.result;
                    if(res.result.roleName == '法官'){
                        this.fullScreen();
                    }
                }
            })
        }
      },
      methods:{
        fullScreen(){
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