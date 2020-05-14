<template>
    <div class="tabs-box">
      <h1>起诉状</h1>
      <el-collapse v-model="activeNames">
        <el-collapse-item v-for="(item,index) in caseList" :key="index" :title="item.caseNo" :name="item.caseNo">
          <p v-for="(item2,index) in item.indictment.filePaths" :key="index">
            {{item2.name}}
            <el-button size="mini" type="text" @click="showInd(item2)">查看</el-button>
          </p>
        </el-collapse-item>
      </el-collapse>
      <showFile ref="toFile" :fileItem="fileItem"></showFile>
    </div>
</template>
  
  <script>
    import showFile from '@/components/addCase/showFile.vue'
    export default {
        name: 'roomIndictment',
        props:{
          caseId:String
        },
        components: {
          showFile
        },
      data(){
        return {
          caseList:{},
          fileItem:{},
          activeNames:[],
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
            if(res.result.length > 0){
              this.caseList = [];
              for(const item of res.result){
                const data = {
                  caseNo:item.caseNo,
                  indictment:[...item.indictment].pop()
                }
                this.caseList.push(data);
              }
            }
          }
        })
      },
      methods:{
        showInd(item){//查看起诉状
          this.fileItem = item;
          this.$refs.toFile.showEvidence();
        },
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