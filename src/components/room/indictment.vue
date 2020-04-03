<template>
    <div class="tabs-box">
      <h1>起诉状</h1>
      <p v-for="(item,index) in indictment" :key="index">
        {{item.name}}
        <el-button size="mini" type="text" @click="showInd(item)">查看</el-button>
      </p>
      <showFile ref="toFile" :fileItem="fileItem"></showFile>
    </div>
</template>
  
  <script>
    import showFile from '@/components/addCase/showFile.vue'
    export default {
        name: 'indictment',
        props:['caseId'],
        components: {
          showFile
        },
      data(){
        return {
          indictment:{},
          fileItem:{},
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
        this.$api.roomItem.getEviByCaseIds(params).then(res => {
          if(res.state == 100){
            this.indictment = res.result[0].indictment;
          }
        })
      },
      methods:{
        showInd(item){
          console.log(item.filePaths[0])
          this.fileItem = item.filePaths[0];
          this.$refs.toFile.showEvidence();
        },
      }
    }
  </script>
  
  <style lang="less" scoped>
    .tabs-box {
      width: 95%;
      margin: 0 auto;
    }
  </style>