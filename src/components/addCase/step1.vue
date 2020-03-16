<template>
    <div class="step1">
      <el-form ref="form" label-position="right" :inline="true" size="mini" :model="form" label-width="120px">
        <el-form-item label="开庭类型" style="width: 100%;">
          <el-radio-group v-model="form.courtType">
            <el-radio :label="1">在线调解</el-radio>
            <el-radio :label="2">法庭调查</el-radio>
            <el-radio :label="3">在线庭审</el-radio>
            <el-radio :label="4">听证</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="案件类型" style="width: 100%;">
            <el-select v-model="form.caseType" placeholder="请选择" style="width:380px;">
                <el-option
                    v-for="item in options"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                </el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="案号" style="width: 100%;">
            <el-input v-model="form.caseNo" placeholder="请输入案号" style="width:380px;"></el-input>
        </el-form-item>
        <el-form-item label="案由" style="width: 100%;">
            <el-select v-model="form.caseReason" placeholder="请选择" style="width:380px;">
                <el-option
                    v-for="item in options2"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                </el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="开庭日期" style="width: 100%;">
            <el-date-picker
                v-model="form.openTime"
                type="datetime"
                placeholder="选择日期时间" style="width:380px;">
            </el-date-picker>
        </el-form-item>
        <el-form-item label="法官" style="width: 45%;">
            <el-select v-model="form.judge" placeholder="请选择" style="width:100px;">
                <el-option
                    v-for="item in judgeList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                </el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="书记员" style="width: 45%;">
            <el-select v-model="form.clerk" placeholder="请选择" style="width:100px;">
                <el-option
                    v-for="item in clerkList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                </el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="人民陪审员" style="width: 100%;">
            <el-select v-model="form.juror" placeholder="请选择" style="width:380px;">
                <el-option
                    v-for="item in jurorList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                </el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="起诉状">
            <el-button type="primary">点击选择文件</el-button>
        </el-form-item>
      </el-form>
    </div>
  </template>
  
  <script>
    export default {
        name: 'step1',
      data(){
        return {
          options:[
            {name:'民事一审',id:'民事一审'},
            {name:'民事二审',id:'民事二审'},
            {name:'申诉',id:'申诉'},
            {name:'民事再审',id:'民事再审'},
            {name:'其他',id:'其他'}
        ],
          options2:[],
          judgeList:[],
          clerkList:[],
          jurorList:[],
          form:{
            courtType:1,
            caseType:'',
            caseNo:'',
            caseReason:'',
            openTime:'',
            judge:'',
            clerk:'',
            juror:'',
          },
        }
      },
      computed:{
        
      },
      watch:{
        
      },
      mounted(){
        this.$api.addCase.getJudgeBriefCourt().then(res => {
            console.log(res)
            this.options2 = res.briefList;
            this.judgeList = res.judgeList;
            this.clerkList = res.clerkList;
            this.jurorList = res.jurorList;
        })
      },
      methods:{
        submit(){
            console.log(111);
            this.$emit('listenToChildEvent',1);
        },
      }
    }
  </script>
  
  <style lang="less" scoped>
      .step1{
          width: 50%;
          margin: 0 auto;
      }
  </style>