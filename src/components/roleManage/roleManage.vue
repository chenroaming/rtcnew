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
                <el-button
                    type="text"
                    size="small"
                    @click="del(scope.row)">
                    删除
                </el-button>
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
        
      },
      methods:{
        edit(item){
            this.$emit('listenToChild',item);
        },
        del(item){
            // this.$emit('listenToChild',item);
        }
      }
    }
  </script>
  
  <style lang="less" scoped>
      
  </style>