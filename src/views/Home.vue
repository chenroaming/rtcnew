<template>
  <div class="home">
    <!-- <img alt="Vue logo" src="../assets/logo.png"> -->
    <!-- <HelloWorld msg="Welcome to Your Vue.js App"/> -->
    <div class="header">
      <faceCheck ref="faceCheck"></faceCheck>
      <div class="login-form">
        <p>
          <el-button type="primary" @click="loginType = 'court'" size="mini" :plain="loginType != 'court'">法院工作人员</el-button>
          <el-button type="primary" @click="loginType = 'litigant'" size="mini" :plain="loginType != 'litigant'">当事人/诉讼代理人</el-button>
        </p>
        <!-- <p><span style="cursor: pointer;" @click="loginType = 'court'">法官登录</span><span style="margin-left: 10px;cursor: pointer;" @click="loginType = 'litigant'">当事人/诉讼代理人登录</span></p> -->
        <el-form label-width="0px" ref="formLabelAlign" :rules="rules" :model="formLabelAlign">
          <el-form-item prop="userName">
            <el-input v-model="formLabelAlign.userName" placeholder="请输入账号">
              <i slot="prefix" class="el-icon-user-solid"></i>
            </el-input>
          </el-form-item>
          <el-form-item prop="passWord">
            <el-input v-model="formLabelAlign.passWord" type="password" placeholder="请输入密码">
              <i slot="prefix" class="el-icon-user"></i>
            </el-input>
          </el-form-item>
          <el-form-item prop="checkCode">
            <el-input v-model="formLabelAlign.checkCode" placeholder="请输入验证码">
              <i slot="prefix" class="el-icon-picture"></i>
            </el-input>
            <img class="code" :src="codeSrc" @click="changeCode" alt="">
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="login">登录</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div class="carousel-box">
      <el-carousel :interval="4000" type="card" height="300px">
        <el-carousel-item v-for="item in 3" :key="item">
          <!-- <h3 class="medium">{{ item }}</h3> -->
          <img src="../assets/img/pt_img1.png" alt="">
        </el-carousel-item>
      </el-carousel>
    </div>
    <div class="features">
      <p style="font-size: 22px;font-weight: bold;">平台功能</p>
      <ul>
        <li v-for="(item,index) in featuresList" :class="{'float':nowIndex==index}" @mouseover="changeActive(index)" v-on:mouseout="removeActive()">
          <img :src="item.src" alt="">
          <p style="font-weight: bold;">{{item.title}}</p>
          <p style="font-size: 14px;">{{item.des}}</p>
        </li>
      </ul>
    </div>
    <div class="information">
      <p style="font-size: 22px;font-weight: bold;">最新资讯</p>
      <ul>
        <li v-for="(item,index) in infoList">
          <img :src="item.src" alt="">
          <p style="font-weight: bold;color: #aaa;text-align: left;margin: 18px auto;width: 90%;">{{item.date}}</p>
          <p style="font-weight: bold;text-align: left;margin: 18px auto;width: 90%;">{{item.title}}</p>
          <p style="font-size: 14px;text-align: left;margin: 18px auto;width: 90%;">{{item.content}}</p>
        </li>
      </ul>
    </div>
    <div class="case-box">
      <p style="font-size: 22px;font-weight: bold;">经典案件</p>
      <ul>
        <li v-for="(item,index) in caseList">
          <img :src="item.src" alt="">
          <p style="font-weight: bold;margin: 18px auto;width: 90%;">{{item.title}}</p>
        </li>
      </ul>
    </div>
    <div class="footer">
      <div class="footer-box">
        <div>
          <p>互联网+全在线庭审，从此开始</p>
          <p>
            <span>技术支持：纵横集团</span>
            <span>联系我们：hlqzxpt@163.com</span>
          </p>
        </div>
        <div>
          <p>
            <img src="../assets/img/google.png" alt="">
          </p>
          <p>推荐使用Chrome浏览器</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import md5 from 'md5'
import faceCheck from '@/components/faceCheck/faceCheck.vue'
export default {
  name: 'Home',
  components: {
    faceCheck
  },
  data(){
    return {
      nowIndex:6,
      isLogin:'未登录',
      codeSrc:'/api/main/code.jhtml?tm=' + Math.random(),
      width:300,
      formLabelAlign:{
        userName:'',
        passWord:'',
        checkCode:''
      },
      featuresList:[
        {src:require('../assets/img/icon1.png'),title:'人脸识别核验身份',des:'当事人身份在线认证'},//动态渲染图片需要添加require
        {src:require('../assets/img/icon2.png'),title:'证据材料同屏展示',des:'实时传输，证据材料同屏开示'},
        {src:require('../assets/img/icon3.png'),title:'语音识别同步记录',des:'解放书记员双手'},
        {src:require('../assets/img/icon4.png'),title:'庭审同步录音录像',des:'提高庭审流畅性'},
        {src:require('../assets/img/icon5.png'),title:'庭审笔录在线签署',des:'全程留痕，自动归档'},
      ],
      infoList:[
        {src:require('../assets/img/news-img.png'),date:'2020.03.12',title:'庭审笔录在线签署庭审笔录在线签署庭审笔录在线签署庭审笔录在线签署庭审笔录在线签署',content:'全程留痕，自动归档全程留痕，自动归档全程留痕，自动归档全程留痕，自动归档全程留痕，自动归档全程留痕，自动归档全程留痕，自动归档全程留痕，自动归档'},
        {src:require('../assets/img/news-img.png'),date:'2020.03.12',title:'庭审笔录在线签署庭审笔录在线签署庭审笔录在线签署庭审笔录在线签署庭审笔录在线签署',content:'全程留痕，自动归档全程留痕，自动归档全程留痕，自动归档全程留痕，自动归档全程留痕，自动归档全程留痕，自动归档全程留痕，自动归档全程留痕，自动归档'},
        {src:require('../assets/img/news-img.png'),date:'2020.03.12',title:'庭审笔录在线签署庭审笔录在线签署庭审笔录在线签署庭审笔录在线签署庭审笔录在线签署',content:'全程留痕，自动归档全程留痕，自动归档全程留痕，自动归档全程留痕，自动归档全程留痕，自动归档全程留痕，自动归档全程留痕，自动归档全程留痕，自动归档'},
      ],
      caseList:[
        {src:require('../assets/img/case-logo.png'),title:'同安法院'},
        {src:require('../assets/img/case-logo.png'),title:'同安法院'},
        {src:require('../assets/img/case-logo.png'),title:'同安法院'},
        {src:require('../assets/img/case-logo.png'),title:'同安法院'},
        {src:require('../assets/img/case-logo.png'),title:'同安法院'},
        {src:require('../assets/img/case-logo.png'),title:'同安法院'},
        {src:require('../assets/img/case-logo.png'),title:'同安法院'},
        {src:require('../assets/img/case-logo.png'),title:'同安法院'},
      ],
      loginType:'court',
      rules:{
        userName:[{required: true, message: '请输入用户名', trigger: 'change'}],
        passWord:[{required: true, message: '请输入密码', trigger: 'change'}],
        checkCode:[
          {required: true, message: '请输入验证码', trigger: 'change'},
          { min: 4, max: 4, message: '请输入正确的验证码', trigger: 'change' }
        ]
      },
    }
  },
    computed:{

    },
    watch:{
      
    },
  methods:{
    changeActive(e){
      this.nowIndex = e;
    },
    removeActive(e){
      this.nowIndex = 6;
    },
    changeCode(){
      this.codeSrc = '/api/main/code.jhtml?tm=' + Math.random();
    },
    login(){
      this.$refs['formLabelAlign'].validate((valid) => {
        if(!valid){
          return this.$message.warning('请输入正确的用户名/密码/验证码');
        }
        const {userName,passWord,checkCode} = this.formLabelAlign;
        const data = {
          username:userName,
          password:md5(passWord),
          loginType:this.loginType,
          code:checkCode
        }
        this.$store.dispatch('login',data).then(res => {
          if(res.state == 100){
            const setType = {
              roleType : res.data.roles[0].type
            }
          this.$api.user.optionRole(setType).then(res => {
            if(res.state == 100 && !res.data.isFace){
              this.$router.push({
                name:'caseList'
              })
            }
            if(res.state == 100 && res.data.isFace){
              this.$refs.faceCheck.show();
            }
          })//调用设置用户类型接口
          return ;
          }
          this.changeCode();
        });
      })
    },
  }
}
</script>


<style scoped lang="less">
  .float {
    box-shadow: 1px 1px 5px #E5F7FC;
  }
  .header {
    width: 100%;
    height: 565px;
    background-image: url('../assets/img/banner.png');
    background-size: 100% 100%;
    position: relative;
  }
  .carousel-box {
    width: 1200px;
    height: 300px;
    margin: 0 auto;
  }
  .login-form{
    width: 300px;
    height: 280px;
    position: absolute;
    top: 190px;
    right: 225px;
    border: 1px solid #DEDEDE;
    border-radius: 10px;
    padding: 10px 30px;
    background-color: #fff;
    p {
      color: #202020;
      font-weight: bold;
      font-size:16px;
      margin-top: 0;
    }
  }
  .features {
    ul{
      list-style: none;
      width: 1200px;
      margin: 0 auto;
      li{
        list-style: none;
        float: left;
        width: 20%;
        height: 250px;
        p:nth(1){
          font-size: 16px;
          font-weight: bold;
        }
      }
    }
    width: 100%;
    height: 300px;
    margin-top: 50px;
  }
  .information {
    ul{
      list-style: none;
      width: 1200px;
      margin: 0 auto;
      li{
        list-style: none;
        float: left;
        width: 33%;
        height: 250px;
        p:nth(1){
          font-size: 16px;
          font-weight: bold;
        }
      }
    }
    width: 100%;
    height: 450px;
    margin-top: 50px;
  }
  .case-box {
    ul{
      list-style: none;
      width: 1200px;
      margin: 0 auto;
      li{
        list-style: none;
        float: left;
        width: 24%;
        height: 135px;
        padding-top: 50px;
        border: 1px solid #F5F5F5;
        p:nth(1){
          font-size: 16px;
          font-weight: bold;
        }
      }
    }
    width: 100%;
    height: 460px;
    margin-top: 50px;
  }
  .code{
    position: absolute;
    top: 6px;
    right: 15px;
    z-index: 3;
  }
  .footer {
    width: 100%;
    height: 200px;
    background-image: url('../assets/img/footer.png');
    background-size: 100% 100%;
  }
  .footer-box {
    width: 1200px;
    margin: 0 auto;
    height: 100%;
    div:nth-child(1){
      width: 50%;
      height: 100%;
      float: left;
      p:nth-child(1){
        margin-top: 65px;
        font-size: 22px;
        color: #fff;
        padding: 0px 120px;
        text-align: left;
      }
      p:nth-child(2){
        padding: 0px 120px;
        text-align: left;
      }
    }
    div:nth-child(2){
      width: 50%;
      height: 100%;
      float: left;
      p:nth-child(1){
        margin-top: 65px;
      }
      p:nth-child(2){
        color: #fff;
        font-size: 14px;
      }
    }
    span{
      color: #fff;
      margin-right: 20px;
      font-size: 14px;
    }
  }
</style>