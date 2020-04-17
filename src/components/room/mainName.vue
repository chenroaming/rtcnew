<template>
  <div ref="textBox" style="width: 100%;height: 100%;overflow: hidden;">
    <el-tooltip class="item" effect="dark" :content="mainName" placement="bottom">
        <span ref="textContent" style="position: relative;" :style="{ left:setLeft + 'px' }" class="title-text">当前主屏：{{mainName}}</span>
    </el-tooltip>
  </div>
</template>
  
  <script>
    export default {
      name: 'mainName',
      props:['mainInfo'],
      data(){
        return {
          dynamic:0,
          scrollAuto:null,
        }
      },
      computed:{
        mainName(){
          return this.mainInfo
        },
        setLeft(){
          return this.dynamic
        },
      },
      mounted(){
        this.leftRightScroll();
      },
      methods:{
        leftRightScroll(){
          const parentW = this.$refs.textBox.clientWidth;//父元素宽度
          const childW = this.$refs.textContent.clientWidth;//子元素宽度
          const difference = parentW - childW;//差值
          let lrSw = false;//左右滚动开关
          this.scrollAuto = setInterval(() => {
            if(Math.abs(this.dynamic) <= difference && !lrSw){
                if(Math.abs(this.dynamic) == difference){
                  lrSw = true;
                }
                this.dynamic --;
            }
            if(lrSw){
                if(Math.abs(this.dynamic) == 0){
                  lrSw = false;
                }
                this.dynamic ++;
            }
          },100)
        },
      },
      destroyed(){
        clearInterval(this.scrollAuto);
      }
    }
  </script>
  
  <style lang="less" scoped>
      .title-text {
        display: inline-block;
        width: auto;
        color: #fff;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
  </style>