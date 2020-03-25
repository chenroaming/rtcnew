<template>
    <div style="width: 90%;margin: 0 auto;">
        <el-table
            :data="tableData"
            height="350"
            stripe
            style="width: 100%">
            <el-table-column
                type="index"
                label="序号">
            </el-table-column>
            <el-table-column
                prop="roleName"
                label="角色名称">
            </el-table-column>
            <el-table-column
                prop="name"
                label="姓名">
            </el-table-column>
            <el-table-column
                prop="phone"
                label="手机号码">
            </el-table-column>
            <el-table-column
            label="操作">
            <template slot-scope="scope">
                <el-button
                    type="text"
                    size="small"
                    @click="edit(scope.row)">
                    编辑
                </el-button>
                <!-- <el-button
                    type="text"
                    size="small"
                    @click="del(scope.row)">
                    删除
                </el-button> -->
                <i class="el-icon-chat-line-square" style="margin-left: 10px;cursor: pointer;" @click="send(scope.row)"></i>
            </template>
            </el-table-column>
        </el-table>
    </div>
  </template>
  
  <script>
    export default {
        name: 'roleManage',
        props:['data'],
      data(){
        return {
            tableData:[],
        }
      },
      computed:{
        getData(){
            return this.data;
        }
      },
      watch:{
        getData(curval,oldval){
            this.tableData.push(curval);
        }
      },
      mounted(){
        this.$api.addCase.getJudgeBriefCourt().then(res => {
            console.log(res)
            this.tableData = [];
            for(const item of res.judgeList){
                const data = {
                    roleName:'法官',
                    name:item.name,
                    phone:item.phone,
                    id:item.id
                }
                this.tableData.push(data);
            }
            for(const item of res.jurorList){
                const data = {
                    roleName:'陪审员',
                    name:item.name,
                    phone:item.phone,
                    id:item.id
                }
                this.tableData.push(data);
            }
            for(const item of res.clerkList){
                const data = {
                    roleName:'书记员',
                    name:item.name,
                    phone:item.phone,
                    id:item.id
                }
                this.tableData.push(data);
            }
        })
      },
      methods:{
        edit(item){
            this.$emit('listenToChild',item);
        },
        send(item){
            // this.$emit('listenToChild',item);
            console.log(item)
            if(!item.phone){
                this.$message({
                    message:'请填写手机号码',
                    type:'warning'
                })
                return;
            }
            const data = {
                judgeId:item.id,
                phone:item.phone
            }
            this.$api.role.sendJudgeMessage(data).then(res => {
                // if(res.state == 100){
                //     this.$message({
                //         message:res.message,
                //         type:'success'
                //     })
                // }else{
                //     this.$message({
                //         message:res.message,
                //         type:'warning'
                //     })
                // }
            })
        }
      }
    }
  </script>
  
  <style lang="less" scoped>
      
  </style>