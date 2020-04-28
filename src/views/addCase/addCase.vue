<template>
    <div class="addCase-main">
      <p>{{status ? '案件编辑' : '新增案件'}}</p>
      <div class="step-box">
        <el-steps :active="nowActive" align-center>
          <el-step title="基本信息"></el-step>
          <el-step title="诉讼参与人"></el-step>
          <el-step title="证据"></el-step>
        </el-steps>
      </div>
      <div>
        <addCaseStep1 ref="step1" v-if="nowActive == 1" :nextStr="nextStr" @listenToChildEvent="receive"></addCaseStep1>
        <addCaseStep2 ref="step2" v-if="nowActive == 2" @listenToChildEvent="receive"></addCaseStep2>
        <addCaseStep3 ref="step3" v-if="nowActive == 3" @listenToChildEvent="receive"></addCaseStep3>
      </div>
      <div style="text-align: right;padding:0 80px;margin: 20px 0px;">
        <el-button type="warning" size="mini" @click="upStep" v-show="nowActive != 1">上一步</el-button>
        <el-button type="primary" size="mini" @click="nextStep('next')" v-show="nowActive != 3">下一步</el-button>
        <el-button type="warning" size="mini" v-show="status && isEdit && nowActive == 1" @click="nextStep('back')">修改</el-button>
        <el-button type="primary" size="mini" @click="nextStep" v-show="nowActive == 3">完成</el-button>
      </div>
    </div>
  </template>
  
  <script>
    import addCaseStep1 from '@/components/addCase/addCaseStep1.vue'
    import addCaseStep2 from '@/components/addCase/addCaseStep2.vue'
    import addCaseStep3 from '@/components/addCase/addCaseStep3.vue'

    export default {
        name: 'addCase',
        components:{
          addCaseStep1,
          addCaseStep2,
          addCaseStep3,
        },
      data(){
        return {
          nowActive:1,
          courtType:1,
          status:false,
          nextStr:'',
          isEdit:false,
        }
      },
      computed:{
        
      },
      watch:{
        
      },
      mounted(){
        this.isEdit = this.$store.getters.getEditStatus;
        if(this.$store.getters.getCaseId){
          this.status = true;
        }else{
          this.status = false;
        }
        if(!this.$store.getters.getCaseId && !this.$store.getters.getStatus){
          this.$router.push({
            name:'caseList'
          })
        }
      },
      methods:{
        receive(e){
          if(e){
            this.nowActive  = e;
            if(this.nowActive > 3){
              this.$emit('getMessage',0);
              this.$router.push({
                name:'caseList'
              })
            }
          }
        },
        nextStep(status){
          this.nextStr = status;
          if(this.nowActive == 1){
            this.$refs.step1.submit();
          }else if(this.nowActive == 2){
            this.$refs.step2.submit();
          }else{
            this.$refs.step3.submit();
          }
        },
        upStep(){
          this.nowActive --;
        },
        search(params){
          this.$emit('getMessage',1);
          this.$router.push({
            name:'caseList',
            params:params
          })
        }
      }
    }
  </script>
  
  <style lang="less" scoped>
    p{
      text-align: left;
      font-weight: bold;
      font-size: 18px;
      margin: 0;
      padding-top: 20px;
      padding-left: 15px;
    }
    .step-box {
      width: 95%;
      height: 70px;
      padding-top: 15px;
      background-color: #F9F9F9;
      margin: 0 auto;
    }
    .addCase-main{
      width: 100%;
      height: 100%;
    }
  </style>