<template>
    <div class="tabs-box">
        <h1>庭审笔录</h1>
        <el-button type="primary" @click="downLog">查看庭审笔录</el-button>
        <el-button type="primary" @click="upLog" v-if="isEdit">上传庭审笔录</el-button>
        <input type="file" style="display: none;" ref="upFile" @change="getFile">
        <!-- <a :href="downSrc" download ref="downLoad"></a> -->
        <el-dialog
          title="查看庭审笔录"
          :visible.sync="dialogVisible"
          width="50%"
          :modal="false"
          append-to-body
          center>
          <iframe :src="iframeSrc" width="90%" height="400px" frameborder="0"></iframe>
          <div slot="footer">
            <el-button @click="dialogVisible = false">关闭</el-button>
          </div>
        </el-dialog>
    </div>
</template>
  
  <script>
    // import * as QNRTC from "pili-rtc-web";
    export default {
        name: 'log',
        props:['caseId'],
      data(){
        return {
          wsObj:null,
          dialogVisible:false,
          iframeSrc:'',
          isEdit:false,
          fileArr:[],
          wsObj:null,
        }
      },
      computed:{
        
      },
      watch:{
        
      },
      mounted(){
        this.isEdit = this.$store.getters.getEditStatus;
        this.wsObj = this.$store.getters.getWebSocket;
      },
      methods:{
        downLog(){
          const params = {
            caseId:this.caseId
          }
          this.$api.roomItem.saveTrialRecord(params).then(res => {
            if(res.state == 100){
              this.showLog(location.origin + res.result[0]);
              if(this.isEdit){
                const sendObj = { 'name': '', 'roleName': '', 'type': 3, 'wav': '', 'content': res.result[0], 'createDate': '' }
                const sendJSON = JSON.stringify(sendObj)
                // console.log(sendJSON)
                // this.wsObj.send(sendJSON)
                this.$emit('send',sendJSON);
              }
            }else{
              this.$message.warning(res.message);
            }
          })
        },
        upLog(){
          const up = this.$refs.upFile;
          up.click();
          up.value = '';
          this.fileArr = [];
        },
        showLog(url){
          this.iframeSrc = location.origin.includes('trialtest') ? 
            'https://ow365.cn/?i=21049&ssl=1&furl=' + url: 
            'https://ow365.cn/?i=21037&ssl=1&furl=' + url;
          this.dialogVisible = true;
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
    h1{
      color: #fff;
    }
    .tabs-box {
      width: 95%;
      margin: 0 auto;
    }
  </style>