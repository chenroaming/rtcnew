<template>
    <div>
        <el-tabs type="border-card" v-model="nowCase" style="background:none !important;" :before-leave="beforeChange" >
            <el-tab-pane v-for="(item,index) in clerkRooms" :name="item.caseId" :label="item.caseNo" :key="index">
            </el-tab-pane>
        </el-tabs>
        <div style="height:100%;width:100%;" :class="shouwup" v-show="isShowDoc">
            <iframe :src="callPhone" id="iframe" ref="iframe" frameborder="0"  width="100%" height="600px"></iframe>
            <el-button type="primary" @click="saveFile">保存笔录</el-button>
        </div>
    </div>
</template>
  
  <script>
    export default {
        name: 'note',
      data(){
        return {
            nowCase:'',
            clerkRooms:[],
            isShowDoc:true,
            callPhone:'',
            shouwup:"deil",
        }
      },
      computed:{

      },
      watch:{

      },
      mounted(){
        this.nowCase = this.$route.params.caseInfo.caseId;
        this.clerkRooms = this.$store.getters.getClerkRoomList;
        this.callPhone = '/UE/index.html?caseNo=' + this.nowCase;
        this.getHtml(this.nowCase);
      },
      methods:{
        saveFile(){//保存文本
            const iframe = document.getElementById("iframe");
            const iWindow = iframe.contentWindow;
            let obj = {
                type:"justSave",
                content:this.nowCase
            }
            iWindow.postMessage(obj , "*");
        },
        beforeChange(n,o){
            this.nowCase = n;
            if(o == undefined || o == 0){
            
            }else{
            //本地存储当前已编辑的文本
            this.saveLocalHtml(o)
            if(window.localStorage.getItem(n)){
                const content = window.localStorage.getItem(n);
                const iframe = document.getElementById("iframe");

                const iWindow = iframe.contentWindow;
                const obj = {
                    type:"update",
                    content:content
                }
                iWindow.postMessage(obj , "*");
            }else{
                //获得新案件的文本内容
                this.getHtml(n)
            }
            }
        },
        saveLocalHtml(caseid){//本地存储当前已编辑的文本
            const iframe = document.getElementById("iframe");
            const iWindow = iframe.contentWindow;
            const obj = {
                type:"saveLocalHtml",
                content:caseid
            }
            iWindow.postMessage(obj , "*");
        },
        getHtml(caseid){//获取初始文本
            const params = {
                caseId:caseid
            }
            this.$api.roomItem.getTrialRecord(params).then(res => {
                if(res.state == 100){
                    this.upFile(res.result)
                }
            })
        },
        upFile(ct){
            const iframe = document.getElementById("iframe");
            const iWindows = iframe.contentWindow;
            let cc = ct[0].html
            let obj = {
                type:"update",
                content:cc
            }
            window.setTimeout(function(){
                iWindows.postMessage(obj , "*")
            },1200)
        },
      },
      destroyed(){

      }
    }
  </script>
  
  <style lang="less" scoped>
    .deil{
      z-index: 3;
    }
    .upINdxex{
      z-index: 1;
    }
  </style>