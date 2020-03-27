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
        name: 'roleTable',
        props:['data'],
      data(){
        return {
            tableData:[],
            roleType:['法官','书记员','陪审员'],
        }
      },
      computed:{
        getData(){
            return this.data;
        }
      },
      watch:{
        getData(curval,oldval){
            // this.tableData.push(curval);
            this.tableData = [];
            // console.log(curval)
            if(curval == oldval) return;
            for(const item of curval){
                const data = {
                    roleName:this.roleType[item.judgeType],
                    name:item.name,
                    phone:item.phone,
                    id:item.id
                }
                this.tableData.push(data);
            }
        }
      },
      mounted(){
        this.$api.role.getJudges().then(res => {
            this.$emit('getPage',res)
            for (const item of res.judgeList){
                const data = {
                    roleName:this.roleType[item.judgeType],
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
                this.$message.warning('请填写手机号码');
                return;
            }
            const data = {
                judgeId:item.id,
                phone:item.phone
            }
            this.$api.role.sendJudgeMessage(data);
        }
      }
    }
  </script>
  
  <style lang="less" scoped>
      
  </style>