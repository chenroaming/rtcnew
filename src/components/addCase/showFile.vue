<template>
    <div>
        <el-dialog
            title="查看"
            :visible.sync="centerDialogVisible"
            width="50%"
            center 
            append-to-body>
            <div style="height: 350px;" v-if="showType == 1">
              <el-image
                style="width: 100%;height: 100%;"
                :src="picSrc"
                fit="fill">
              </el-image>
            </div>
            <div style="height: 350px;"  v-if="showType == 2">
              <iframe :src="picSrc" width="100%" height="100%" frameborder="0" style="object-fit: fill;"></iframe>
            </div>
            <div style="height: 350px;"  v-if="showType == 3">
                <iframe :src="picSrc" width="100%" height="100%" frameborder="0" style="object-fit: fill;"></iframe>
            </div>
            <span slot="footer" class="dialog-footer">
            <el-button @click="centerDialogVisible = false">关闭</el-button>
            </span>
        </el-dialog>
    </div>
  </template>
  
  <script>
    export default {
        name: 'showFile',
        props:{
          fileItem:Object,
        },
      data(){
        return {
          centerDialogVisible:false,
          picSrc:'',
          showType:0,
        }
      },
      mounted(){

      },
      methods:{
        async showEvidence(){
          await this.fileItem;
          const it = this.fileItem;
          const picture = ['jpg','png','jpeg','bmp','gif'];
          const pdf = ['pdf'];
          const word = ['doc','docx'];
          const fileType = it.name.split('.')[1].toLowerCase();
          if(this.judgType(picture,fileType)){
            this.picSrc = it.addr;
            this.showType = 1;
            this.centerDialogVisible = true;
            return;
          }
          if(this.judgType(pdf,fileType)){
            this.picSrc = it.addr;
            this.showType = 2;
            this.centerDialogVisible = true;
            return;
          }
          if(this.judgType(word,fileType)){
            this.picSrc = location.origin.includes('trialtest') ? 
            `https://ow365.cn/?i=21049&ssl=1&furl=${location.origin}${it.addr}` :
            `https://ow365.cn/?i=21037&ssl=1&furl=${location.origin}${it.addr}`;
            this.showType = 3;
            this.centerDialogVisible = true;
          }
        },
        judgType(typeArr,fileType){
          return typeArr.some(item => {
            return item == fileType;
          })
        },
      }
    }
  </script>
  
  <style lang="less" scoped>
      
  </style>