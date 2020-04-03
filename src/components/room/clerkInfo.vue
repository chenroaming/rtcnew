<template>
    <div>
      <h1>审辅人员</h1>
      <div>
        <img :src="clerk.imagePath" alt="">
        <p>书记员：{{clerk.name}}</p>
      </div>
    </div>
</template>
  
  <script>
    export default {
        name: 'clerkInfo',
        props:['caseId'],
      data(){
        return {
          clerk:{
            name:'',
            imagePath:require('../../assets/img/none.jpg'),
          },
        }
      },
      computed:{
        
      },
      watch:{
        
      },
      mounted(){
        const params = {
          lawCaseId:this.caseId
        }
        this.$api.roomItem.getWorkers(params).then(res => {
          if(res.state == 100){
            console.log(res);
            this.clerk = res.clerk;
          }
        })  
      },
      methods:{
        
      }
    }
  </script>
  
  <style lang="less" scoped>
    .tabs-box {
      width: 95%;
      margin: 0 auto;
    }
  </style>