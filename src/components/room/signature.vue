<template>
    <div class="tabs-box">
        <h1>签名确认</h1>
        <img style="width: 300px;height: 300px;" :src="codeSrc" alt="">
    </div>
</template>
  
  <script>
    export default {
        name: 'signature',
      data(){
        return {
          codeSrc:'',
        }
      },
      computed:{
        
      },
      watch:{
        
      },
      mounted(){
        this.$api.roomItem.createImg().then(res => {
          if(res.state == 100){
            this.codeSrc = location.origin + res.path;
          }
        })  
      },
      methods:{
        
      }
    }
  </script>
  
  <style lang="less" scoped>
    h1{
      color: #fff;
    }
    .tabs-box {
      width: 95%;
      margin: 0 auto;
    }
  </style>