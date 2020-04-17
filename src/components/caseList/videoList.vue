<template>
    <div>
        <el-dialog title="录像列表" :visible.sync="dialogTableVisible" center width="500px">
            <el-table :data="updateList">
              <el-table-column prop="name" label="文件名"></el-table-column>
              <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button
                        type="text"
                        size="small"
                        @click="show(scope.row)">
                        查看
                    </el-button>
                </template>
              </el-table-column>
            </el-table>
        </el-dialog>
        <!-- <el-dialog title="录像列表" :visible.sync="dialogTableVisible2" center width="800px">
            <iframe :src="videoSrc" frameborder="0" width="750px" height="500px">
            </iframe>
        </el-dialog> -->
    </div>
  </template>
  
  <script>
    export default {
        name: 'videoList',
        props:['videoList'],
      data(){
        return {
            dialogTableVisible:false,
            gridData:[],
            videoSrc:'',
        }
      },
      computed:{
        updateList(){
          this.gridData = this.videoList;
          return this.gridData;
        },
      },
      mounted(){
        
      },
      methods:{
        showBox(){
            this.dialogTableVisible = true;
        },
        show(item){
            this.videoSrc = item.addr;
            window.open(this.videoSrc,'_blank');
            // this.dialogTableVisible2 = true;
            // console.log(this.videoSrc)
            // window.open(item.addr,'_blank')
        },
      }
    }
  </script>
  
  <style lang="less" scoped>
    
  </style>