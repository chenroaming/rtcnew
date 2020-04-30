<template>
    <div style="width: 90%;margin: 0 auto;">
        <el-table :data="getData" height="350" stripe style="width: 100%">
            <el-table-column type="index" label="序号"></el-table-column>
            <el-table-column prop="roleName" label="角色名称"></el-table-column>
            <el-table-column prop="name" label="姓名"></el-table-column>
            <el-table-column prop="phone" label="手机号码"></el-table-column>
            <el-table-column label="操作">
            <template slot-scope="scope">
                <el-button
                    type="text"
                    size="small"
                    @click="edit(scope.row)">
                    编辑
                </el-button>
                <i class="el-icon-chat-line-square" style="margin-left: 10px;cursor: pointer;" @click="send(scope.row)"></i>
            </template>
            </el-table-column>
        </el-table>
    </div>
  </template>
  
  <script>
    export default {
        name: 'roleManageTable',
        props:{
            data:Array,
        },
      data(){
        return {
            tableData:[],
            roleType:['法官','书记员','陪审员'],
        }
      },
      computed:{
        getData(){
            this.tableData = [];
            const newArr = this.data.map(item => {
                return {
                    roleName:this.roleType[item.judgeType],
                    name:item.name,
                    phone:item.phone,
                    id:item.id
                }
            })
            this.tableData.push(...newArr)
            return this.tableData;
        }
      },
      mounted(){

      },
      methods:{
        edit(item){
            this.$emit('listenToChild',item);
        },
        send(item){
            if(!item.phone) return this.$message.warning('请填写手机号码');
            const data = {
                judgeId:item.id,
                phone:item.phone
            }
            this.$api.role.sendJudgeMessage(data);
        }
      }
    }
  </script>