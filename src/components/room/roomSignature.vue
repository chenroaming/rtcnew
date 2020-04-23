<template>
    <div class="tabs-box">
      <h1>签名确认</h1>
      <el-image
        style="width: 300px; height: 300px"
        :src="codeSrc"
        fit="fill">
      </el-image>
    </div>
</template>
  
  <script>
    export default {
        name: 'roomSignature',
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
            if(res.path[0] == '/'){
              this.codeSrc = location.origin + res.path;
              return;
            }
            this.codeSrc = location.origin + '/' + res.path;
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