<template>
    <div class="video-box">
        <div class="titie">
            <span>{{roleName}}</span>
            <span>{{name}}</span>
            <span>{{address}}</span>
            <el-button type="text" @click="fullScreen">放大</el-button>
        </div>
        <div class="palyer"></div>
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
            name:'',
            address:'',
        }
      },
      computed:{
        
      },
      watch:{
        
      },
      async mounted(){
        const domElement = document.getElementsByClassName("palyer");
        console.log(this.user.userId);
        if(this.user.userId){
            const params = {
                adminId:this.user.userId
            }
            this.$api.room.userDetail(params).then(res => {
                console.log(res)
                if(res.state == 100){
                    this.roleName = res.result.roleName;
                    this.name = res.result.name;
                    this.address = res.result.address;
                }
            })
            const stream = await myRoom.subscribe(this.user.userId);
            stream.play(domElement[0], false)
        }
      },
      methods:{
        fullScreen(){
            const domElement = document.getElementsByClassName("palyer")[0].children[1].srcObject;
            this.$emit('srcObj',domElement);
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
    .palyer {
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