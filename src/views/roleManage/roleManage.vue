<template>
    <div class="role-box">
      <p>角色管理</p>
      <div class="select-box">
        <el-button-group>
          <el-button type="primary" plain :class="nowRole === 3 ? 'isSelect' : ''" @click="changeRole(3)">全部</el-button>
          <el-button type="primary" plain :class="nowRole === 0 ? 'isSelect' : ''" @click="changeRole(0)">法官</el-button>
          <el-button type="primary" plain :class="nowRole === 1 ? 'isSelect' : ''" @click="changeRole(1)">书记员</el-button>
          <el-button type="primary" plain :class="nowRole === 2 ? 'isSelect' : ''" @click="changeRole(2)">人民陪审员</el-button>
        </el-button-group>
      </div>
      <div class="select-box-right">
        <el-button type="primary" @click="newRole"><i class="el-icon-circle-plus"></i>新增角色</el-button>
      </div>
      <roleTable :data="data" v-on:listenToChild="receive" v-on:getPage="getPage"></roleTable>
      <div class="page-box">
        <el-pagination
          @current-change="handleCurrentChange"
          :current-page.sync="currentPage"
          :page-size="10"
          layout="total, prev, pager, next, jumper"
          :total="totalPage">
        </el-pagination>
      </div>
      <el-dialog :close-on-click-modal="false" width="500px" :title="form.id ? '编辑角色' : '新增角色'" :visible.sync="dialogFormVisible">
        <el-form :model="form" ref="form">
          <el-form-item label="角色名称" prop="roleName" :label-width="formLabelWidth">
              <el-radio-group v-model="form.roleName">
                  <el-radio :disabled="noChoice" label="0">法官</el-radio>
                  <el-radio :disabled="noChoice" label="1">书记员</el-radio>
                  <el-radio :disabled="noChoice" label="2">人民陪审员</el-radio>
              </el-radio-group>
          </el-form-item>
          <el-form-item label="姓名" prop="name" :label-width="formLabelWidth">
              <el-input v-model="form.name"></el-input>
          </el-form-item>
          <el-form-item prop="phone" label="手机号码" :label-width="formLabelWidth">
              <el-input v-model="form.phone"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="submit">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </template>
  
  <script>
    import roleTable from '@/components/roleManage/roleTable.vue'
    export default {
        name: 'rolyManage',
        components:{
          roleTable
        },
      data(){
        return {
          data:null,
          dialogFormVisible:false,
          formLabelWidth:'100px',
          form:{
            roleName:'',
            name:'',
            phone:'',
            id:'',
          },
          totalPage:5,
          currentPage:1,
          noChoice:false,
          nowRole:3,
        }
      },
      computed:{
        
      },
      watch:{
        
      },
      mounted(){        
        this.$emit('getMessage',2);
      },
      methods:{
        getPage(e){
          this.totalPage = e.total;
        },
        receive(e){
          this.form.name = e.name;
          this.form.roleName = e.roleName;
          this.form.phone = e.phone;
          this.form.id = e.id;
          this.dialogFormVisible = true;
          this.noChoice = true;
        },
        newRole(){
          this.form = {
            roleName:'',
            name:'',
            phone:'',
            id:''
          },
          this.noChoice = false;
          this.dialogFormVisible = true;
        },
        submit(){
          // console.log(this.form)
          if(this.form.id){
            const data = {
              name:this.form.name,
              phone:this.form.phone,
              judgeId:this.form.id
            }
            this.$api.role.updateJudge(data).then(res => {
              if(res.state == 100){
                this.dialogFormVisible = false;
                this.changeRole(3);
              }
            })
            return;
          }
          const data = {
            name:this.form.name,
            type:this.form.roleName,
            phone:this.form.phone
          }
          this.$api.role.addJudge(data).then(res => {
            // console.log(res)
            if(res.state == 100){
              this.dialogFormVisible = false;
              this.changeRole(3);
            }
          })
          // this.data = data;
        },
        handleCurrentChange(e){
          if(this.nowRole === 3){
            const data = {
              pageNumber:e
            }
            this.$api.role.getJudges(data).then(res => {
              this.data = res.judgeList;
              this.totalPage = res.total;
            })
            return;
          }
          const data = {
            pageNumber:e,
            type:this.nowRole
          }
          this.$api.role.getJudges(data).then(res => {
            this.data = res.judgeList;
            this.totalPage = res.total;
          })
        },
        changeRole(index){
          // console.log(index)

          if(index == this.nowRole) return;
          this.nowRole = index;
          const data = {
            type:this.nowRole
          }
          if(index === 3){
            this.$api.role.getJudges().then(res => {
              this.data = res.judgeList;
              this.totalPage = res.total;
            })
          }else{
            this.$api.role.getJudges(data).then(res => {
              this.data = res.judgeList;
              this.totalPage = res.total;
            })
          }
          this.currentPage = 1;
        },
        search(params){
          this.$emit('getMessage',1);
          this.$router.push({
            name:'caseList',
            params:params
          })
        },
      }
    }
  </script>
  
  <style lang="less" scoped>
    .role-box{
      width: 100%;
      height: 100%;
    }
    .select-box {
      width: 30%;
      margin-top: 20px;
      float: left;
    }
    .select-box-right {
      width: 15%;
      margin-top: 20px;
      float: right;
    }
    p{
      text-align: left;
      font-weight: bold;
      font-size: 18px;
      margin: 0;
      padding-top: 20px;
      padding-left: 15px;
    }
    .page-box{
      text-align: right;
      width: 80%;
      margin: 0 auto;
      margin-top: 20px;
    }
    .isSelect {
      background: #409EFF;
      border-color: #409EFF;
      color: #FFF;
    }
  </style>