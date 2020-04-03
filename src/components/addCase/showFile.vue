<template>
    <div>
        <el-dialog
            title="查看证据"
            :visible.sync="centerDialogVisible"
            width="50%"
            center 
            append-to-body>
            <div style="height: 350px;" v-if="showType == 1">
                <img :src="picSrc" style="width: 100%;height: 100%;" alt="">
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
        props:['fileItem'],
      data(){
        return {
          centerDialogVisible:false,
          picSrc:'',
          showType:0,
        }
      },
      computed:{

      },
      watch:{

      },
      mounted(){
        // console.log(this.fileItem)
      },
      methods:{
        async showEvidence(){
            await this.fileItem;
            console.log(this.fileItem)
            const it = this.fileItem;
            const picture = ['jpg','png','jpeg','bmp','gif'];
            const pdf = ['pdf'];
            const word = ['doc','docx'];
            const fileType = it.name.split('.')[1].toLowerCase();
            if(picture.some(res => {
            return res == fileType;
            })){
            // this.picSrc = 'https://trialtest.olcourt.cn' + it.addr;
            this.picSrc = it.addr;
            this.showType = 1;
            this.centerDialogVisible = true;
            }
            if(pdf.some(res => {
            return res == fileType;
            })){
            // this.picSrc = 'https://trialtest.olcourt.cn' + it.addr;
            this.picSrc = it.addr;
            this.showType = 2;
            this.centerDialogVisible = true;
            }
            if(word.some(res => {
            return res == fileType;
            })){
            this.picSrc = 'https://view.officeapps.live.com/op/view.aspx?src=' + location.origin + it.addr;
            this.showType = 3;
            this.centerDialogVisible = true;
            }
        },
      }
    }
  </script>
  
  <style lang="less" scoped>
      
  </style>