<template>
  <div class="about">
    <el-container>
      <el-header>
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
        <el-aside width="150px">
          <div class="item-left">
            <ul class="left-menu">
              <li></li>
              <li v-for="(item,index) in getMenuList" :class="{'isSelect':nowSelect == index}" @click="go(index,item.name)">
                <img :src="item.meta.imgSrc" alt="">
                <p>{{item.meta.title}}</p>
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
            <router-view @getMessage="showMsg" ref="caseList"></router-view>
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
        nowSelect:0,
        caseNo:'',
        menuList:[],
      }
    },
    computed:{
      getMenuList(){
        this.menuList = this.$store.getters.getMenuList;
        return this.menuList;
      }
    },
    mounted(){
      this.$store.dispatch('setMenuList');
    },
    methods:{
      showMsg(msg){
        this.nowSelect = msg;
      },
      go(index,name){
        this.nowSelect = index;
        this.$router.push({
          name:name
        })
        if(index == 1){
          this.$store.dispatch('setCaseId','');
          this.$store.dispatch('setStatus',true);
        }
      },
      searchCase(){
        const params = {
          caseNo:this.caseNo,
          pageNumber:1
        }
        this.$refs['caseList'].search(params)
        this.nowSelect = 0;
      },
      logout(){
        this.$store.dispatch('logout').then(res => {
          if(res.state == 100){
            this.$router.push({
              name:'Home'
            })
          }
        });
      }
    }
  }
</script>

<style lang="less" scoped>
  .el-main{
    overflow: hidden;
  }
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
    height: 650px;
    background-color: #fff;
  }
</style>