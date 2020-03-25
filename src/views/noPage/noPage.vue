<template>
    <div class="role-box">
      <h1>你似乎来到了什么都没有的荒原。。。</h1>
      <el-button type="primary" @click="toHome">点我返回首页吧~</el-button>
    </div>
  </template>
  
  <script>
    export default {
        name: 'noPage',
        
      data(){
        return {
          
        }
      },
      computed:{
        
      },
      watch:{
        
      },
      mounted(){        
        
      },
      methods:{
        toHome(){
            this.$router.push({
                name:'Home'
            })
        }
      }
    }
  </script>
  
  <style lang="less" scoped>
    
  </style>