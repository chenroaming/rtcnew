<template>
    <div>
        <span class="titile-text">{{nowTime}}</span>
    </div>
</template>
  
  <script>
    export default {
        name: 'roomNowTime',
      data(){
        return {
          nowTime:'',
          interval:null,
        }
      },
      computed:{
        
      },
      watch:{
        
      },
      mounted(){
        this.interval = setInterval(() => {
            this.nowTime = new Date().getFullYear() + '年' + (new Date().getMonth()+1) + '月' + new Date().getDate() + '日' + '  ' + new Date().getHours() + '时' + new Date().getMinutes() + '分' + new Date().getSeconds() + '秒';
        },1000);
      },
      methods:{

      },
      destroyed(){
        clearInterval(this.interval);
      }
    }
  </script>
  
  <style lang="less" scoped>
    .titile-text {
        color: #fff;
    }
  </style>