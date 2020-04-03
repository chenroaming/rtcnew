<template>
    <div class="tabs-box">
        <h1>庭审笔录</h1>
        <el-button type="primary" @click="downLog">下载庭审笔录</el-button>
        <el-button type="primary" @click="upLog" v-if="isEdit">上传庭审笔录</el-button>
        <input type="file" style="display: none;" ref="upFile" @change="getFile">
        <a :href="downSrc" download ref="downLoad"></a>
    </div>
</template>
  
  <script>
    // import * as QNRTC from "pili-rtc-web";
    export default {
        name: 'log',
        props:['caseId'],
      data(){
        return {
          isEdit:false,
          downSrc:'',
          fileArr:[],
        }
      },
      computed:{
        
      },
      watch:{
        
      },
      mounted(){
        this.isEdit = this.$store.getters.getEditStatus;
      },
      methods:{
        downLog(){
          const params = {
            caseId:this.caseId
          }
          this.$api.roomItem.saveTrialRecord(params).then(res => {
            if(res.state == 100){
              this.downSrc = res.result[0];
              this.$refs.downLoad.click();
            }
          })
        },
        upLog(){
          const up = this.$refs.upFile;
          up.click();
          up.value = '';
          this.fileArr = [];
        },
        getFile(e){
          this.fileArr.push(e.target.files[0]);
          const data = {
            file:this.fileArr,
            caseId:this.caseId
          }
          this.$api.roomItem.uploadRecordFile(data);
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