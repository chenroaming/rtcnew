<template>
    <div class="date-box">
        <el-button type="primary" @click="showDate">点击查询案件统计信息</el-button>
        <el-date-picker
            v-model="countDate"
            type="datetimerange"
            format="yyyy-MM-dd"
            value-format= "yyyy-MM-dd"
            @change="downCount"
            ref="dateBox">
        </el-date-picker>
        <a :href="fileUrl" download="" style="display: none;" ref="downFile"></a>
    </div>
  </template>
  
  <script>
    export default {
        name: 'caseListCount',
      data(){
        return {
            countDate:null,
            fileUrl:'',
        }
      },
      computed:{

      },
      watch:{

      },
      mounted(){

      },
      methods:{
        downCount(){
            if(!this.countDate){
                return this.$message.warning('请选择日期！');
            }
            const params = {
                startDate:this.countDate[0],
                endDate:this.countDate[1]
            }
            this.$api.caseList.countTrial(params).then(res => {
                if(res.state == 100){
                    this.fileUrl = location.origin + res.file;
                    this.$refs.downFile.click();
                }
            })
        },
        showDate(){
            this.$refs.dateBox.focus();
        },
      }
    }
  </script>
  
  <style lang="less" scoped>
      .date-box{
        display: inline-block;
        width: 190px;
        float: left;
        height: 50px;
        line-height: 50px;
        position: relative;
        span:nth-child(1){
            color:#0096FA;
            font-weight: bold;
        }
        .el-range-editor {
            width: 190px;
            background-color: rgba(0, 0, 0, 0);
            border: none;
            position: absolute;
            top: 5px;
            left: 0;
            z-index: -1;
        }
      }
      
  </style>