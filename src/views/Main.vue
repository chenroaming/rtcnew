<template>
  <div class="about">
    <!-- <h1>This is an about page</h1> -->
    <!-- <P>{{isLogin}}</P>
    <Button type="primary" @click="test">test</Button>
    <Button type="primary" @click="upfile">点击上传</Button>
    <Button type="warning" @click="logout">登出</Button> -->
    <input type="file" id="getFile" @change="fileChange" multiple style="display: none;">
    <el-container>
      <el-header>
        <!-- <el-button type="warning" @click="logout">登出</el-button> -->
        <div class="logo-box">
          <img src="../assets/img/logo-2.png" alt="">
        </div>
        <div class="search-box">
          <el-input
            placeholder="请输入案号"
            v-model="caseNo"
            @change="searchCase">
            <i slot="prefix" style="cursor: pointer;" class="el-input__icon el-icon-search" @click="searchCase"></i>
          </el-input>
        </div>
      </el-header>
      <el-container>
        <el-aside width="200px">
          <div class="item-left">
            <ul class="left-menu">
              <li></li>
              <li :class="{'isSelect':nowSelect == 1}" @click="go(1)">
                <img src="../assets/img/left-icon1.png" alt="">
                <p>案件管理</p>
              </li>
              <li :class="{'isSelect':nowSelect == 2}" @click="go(2)">
                <img src="../assets/img/left-icon2.png" alt="">
                <p>新增案件</p>
              </li>
              <li :class="{'isSelect':nowSelect == 3}" @click="go(3)">
                <img src="../assets/img/left-icon3.png" alt="">
                <p>角色管理</p>
              </li>
            </ul>
            <div>
              <img style="cursor: pointer;" @click="logout" src="../assets/img/out.png" alt="">
              <p style="color: #fff;font-size: 14px;">技术支持：纵横集团</p>
            </div>
          </div>
        </el-aside>
        <el-main>
          <div class="main-box">
            <router-view></router-view>
          </div>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
  export default {
    data(){
      return {
        value1: '1',
        file:[],
        isLogin:'已登录',
        theme2: 'dark',
        nowSelect:1,
        caseNo:'',
      }
    },
    computed:{
      getLoginStatus(){
        return this.$store.getters.isLogin//通过计算属性返回vuex中的状态值
      }
    },
    watch:{
      getLoginStatus(curval,oldVal){
        this.isLogin = curval ? '已登录' : '未登录'//监听变化改变页面数据
      }
    },
    mounted(){
      
    },
    methods:{
      go(index){
        this.nowSelect = index;
        switch(index){
          case 1:
            this.$router.push({
              name:'caseList'
            })
            break;
          case 2:
            this.$router.push({
              name:'addCase'
            })
            break;
          case 3:
            this.$router.push({
              name:'roleManage'
            })
            break;
        }
      },
      searchCase(){
        const params = {
          caseNo:this.caseNo,
          pageNumber:1
        }
        this.$api.caseList.caseList(params).then(res => {
          console.log(res)
        })
      },
      test(){
        console.log(222)
        // this.$store.dispatch('getUserInfo');
        // setTimeout(() => {
        //   console.log(this.getLoginStatus);
        // },1000)
        const params = {
          caseNo:'',
          pageNumber:1
        }
        this.$api.user.caseList(params).then(res => {
          console.log(res);
        });
        // this.$Loading.start();
        // setTimeout(() => {
        //   this.$Loading.finish();
        // },2000)
        // this.$http.get('main/getUserInfo.jhtml').then(res => {
        //   console.log(res.data);
        // })
        // getUserInfo().then(res => {
        //   console.log(res);
        // });
      },
      upfile(){
        document.getElementById('getFile').click();
      },
      fileChange(event){
        this.file = [];
        for(const item of event.target.files){
          this.file.push(item);
        }
        const data = {
          file:this.file,
          evidenceId: '8a96ea540b9649679a7f7b97e32e042e',
          lawCaseId: '3cb7dcf66d1d4afc9435fee804157cab'
        }
        this.$api.user.updateIndictment(data).then(res => {
          console.log(res);
          document.getElementById('getFile').value = '';
        })
      },
      logout(){
        this.$store.dispatch('logout').then(res => {
          if(res.state == 100){
            // this.$Message.success(res.message)
            this.$router.push({
              name:'Home'
            })
          }else{
            // this.$Message.warning(res.message)
          }
        });
      }
    }
  }
</script>

<style lang="less" scoped>
  .left-menu {
    width: 100%;
    list-style: none;
    padding: 0;
    position: relative;
    div{
      position: absolute;
      bottom: 0;
      left: 25px;
    }
    li{
      list-style: none;
      width: 65%;
      height: 120px;
      cursor: pointer;
      margin: 0 auto;
      img{
        margin-top: 25px;
      }
      p{
        color: #fff;
        font-weight: bold;
      }
    }
  }
  .about {
    width: 100%;
    height: 100vh;
    background-image: url('../assets/img/bigbg.png');
    background-size: 100% 100%;
  }
  .item-left {
    width: 100%;
    height: calc(100%-60px);
  }
  .isSelect {
    border: 1px solid #fff;
    border-radius: 15px;
    box-shadow: inset 0px 1px 1px 1px #fff;
  }
  .el-container {
    width: 100%;
    height: calc(100%-60px);
  }
  .el-aside {
    /* height: 100%; */
  }
  .logo-box{
    width: 330px;
    float: left;
  }
  .search-box {
    width: 300px;
    height: 100%;
    float: right;
    padding-top: 15px;
  }
  .main-box {
    width: 100%;
    height: 100%;
    background-color: #fff;
  }
</style>