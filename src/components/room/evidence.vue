<template>
    <div>
        <h1>证据列表</h1>
        <div class="tabs-box">
          <el-tabs v-model="activeName" type="border-card" stretch @tab-click="handleClick">
            <el-tab-pane label="原告" name="first">
              <el-collapse v-model="activeNames">
                <el-collapse-item v-for="(item,index) in plaintiff" :key="index" :title="item.caseNo" :name="item.caseNo">
                  <el-table
                    :data="item.evidenceList"
                    style="width: 100%"
                    height="350">
                    <el-table-column prop="name" label="证据名称" width="100"></el-table-column>
                    <el-table-column prop="prove" label="证明对象" width="100"></el-table-column>
                    <el-table-column prop="source" label="证据来源" width="100"></el-table-column>
                    <el-table-column label="证据文件" width="100">
                      <template slot-scope="scope">
                          <p v-for="(item2,index) in scope.row.file">
                            {{item2.fileName}}
                            <el-button type="text" @click="showFile(item2)">查看</el-button>
                          </p>
                      </template>
                    </el-table-column>
                    <el-table-column label="操作" width="100">
                      <template slot-scope="scope">
                        <span v-if="scope.row.exmType == -1">已驳回</span>
                        <el-button type="text" v-if="scope.row.exmType===0 && isEdit" @click="examineEvi(scope.row.evidenceId,1)">通过</el-button>
                        <el-button type="text" v-if="scope.row.exmType===0 && isEdit" @click="examineEvi(scope.row.evidenceId,-1)">驳回</el-button>
                      </template>
                    </el-table-column>
                  </el-table>
                </el-collapse-item>
              </el-collapse>
            </el-tab-pane>
            <el-tab-pane label="被告" name="second">
              <el-collapse v-model="activeNames">
                <el-collapse-item v-for="(item,index) in defendant" :key="index" :title="item.caseNo" :name="item.caseNo">
                  <el-table
                    :data="item.evidenceList"
                    style="width: 100%"
                    height="350">
                    <el-table-column prop="name" label="证据名称" width="100"></el-table-column>
                    <el-table-column prop="prove" label="证明对象" width="100"></el-table-column>
                    <el-table-column prop="source" label="证据来源" width="100"></el-table-column>
                    <el-table-column label="证据文件" width="100">
                      <template slot-scope="scope">
                          <p v-for="(item2,index) in scope.row.file">
                            {{item2.fileName}}
                            <el-button type="text" @click="showFile(item2)">查看</el-button>
                          </p>
                      </template>
                  </el-table-column>
                  <el-table-column label="操作" width="100">
                    <template slot-scope="scope" v-if="scope.row.exmType === 0 && isEdit">
                      <span v-if="scope.row.exmType == -1">已驳回</span>
                      <el-button type="text" v-if="scope.row.exmType===0 && isEdit" @click="examineEvi(scope.row.evidenceId,1)">通过</el-button>
                      <el-button type="text" v-if="scope.row.exmType===0 && isEdit" @click="examineEvi(scope.row.evidenceId,-1)">驳回</el-button>
                    </template>
                  </el-table-column>
                  </el-table>
                </el-collapse-item>
              </el-collapse>
            </el-tab-pane>
          </el-tabs>
          <el-button type="primary" @click="openEviBox" v-if="!isEdit">点击选择证据上传</el-button>
        </div>
        <el-dialog append-to-body :close-on-click-modal="false" width="500px" title="添加证据" :visible.sync="dialogFormVisible">
          <el-form :model="form" ref="form">
              <el-form-item label="证据名称" prop="name" :label-width="formLabelWidth">
                  <el-input v-model="form.name"></el-input>
              </el-form-item>
              <el-form-item label="证明对象" prop="prove" :label-width="formLabelWidth">
                  <el-input v-model="form.prove"></el-input>
              </el-form-item>
              <el-form-item label="证据来源" prop="source" :label-width="formLabelWidth">
                  <el-input v-model="form.source"></el-input>
              </el-form-item>
              <el-form-item label="证据文件" prop="file" :label-width="formLabelWidth">
                  <p v-for="(item,index) in filesList">
                      <span>{{item.name}}</span>
                      <i class="el-icon-circle-close" style="cursor: pointer;" @click="delfiles(item,index,'online')"></i>
                  </p>
                  <input type="file" style="display: none;" ref="getFile" @change="getFile">
                  <el-button type="primary" size="mini" @click="upFile">点击选择证据文件</el-button>
              </el-form-item>
              <el-form-item :label-width="formLabelWidth">
                  <span v-for="(item,index) in form.eviList"></span>
              </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="upEvi">确 定</el-button>
          </div>
        </el-dialog>
        <showFile ref="toFile" :fileItem="fileItem"></showFile>
    </div>
</template>
  <script>
    import showFile from '@/components/addCase/showFile.vue'
    export default {
        name: 'evidence',
        props:['caseId'],
        components: {
          showFile
        },
      data(){
        return {
          isEdit:false,
          activeName:'first',
          activeNames:[],
          fileItem:{},
          wsObj:'',
          plaintiff:[],
          defendant:[],
          dialogFormVisible:false,
          formLabelWidth:'100px',
          form:{
            litigantId:'',
            name:'',
            prove:'',
            source:'',
            file:'',
            eviList:[]
          },
          filesList:[],
        }
      },
      computed:{
        
      },
      watch:{
        
      },
      mounted(){
        this.isEdit = this.$store.getters.getEditStatus;
        this.wsObj = this.$store.getters.getWebSocket;
        this.getEviByCaseIds();
        this.wsObj.onmessage = (e) => {
          const getMsg = JSON.parse(e.data);
          if(getMsg.type == 2){
            this.getEviByCaseIds();
          }
        }
      },
      methods:{
        getEviByCaseIds(){
          const params = {
            lawCaseId:this.caseId
          }
          this.plaintiff = [];
          this.defendant = [];
          this.$api.roomItem.getEviByCaseIds(params).then(res => {
            if(res.state == 100){
              if(res.result.length > 0){
                for(const item of res.result){
                  const plaintiff = {
                    caseNo:item.caseNo,
                    evidenceList:[]
                  }
                  const defendant = {
                    caseNo:item.caseNo,
                    evidenceList:[]
                  }
                  for(const item2 of item.evidence){
                    if(item2.dsrStatus == '原告'){
                      plaintiff.evidenceList.push(item2);
                    }else if(item2.dsrStatus == '被告'){
                      defendant.evidenceList.push(item2)
                    }
                  }
                  this.plaintiff.push(plaintiff);
                  this.defendant.push(defendant);
                }
              }
            }
          })
        },
        handleClick(tab, event) {

        },
        showFile(item){
          const {fileName,fileAddr} = item;
          const sendObj = { 'name': '', 'roleName': '', 'type': 3, 'wav': '', 'content': fileAddr, 'createDate': '' };
          this.wsObj.send(JSON.stringify(sendObj));//发送证据同步投屏
          this.fileItem = {
            name:fileName,
            addr:fileAddr
          };
          this.$refs.toFile.showEvidence();
        },
        examineEvi(id,isPass){
          const params = {
            evidenceId:id,
            exm:isPass
          }
          this.$api.roomItem.examineEvi(params).then(res => {
            if(res.state == 100){
              this.getEviByCaseIds();
            }
          })
        },
        upFile(){
          const button = this.$refs.getFile;
          button.click();
          button.value = '';
        },
        getFile(e){//获取证据文件
          this.filesList.push(e.target.files[0]);
        },
        upEvi(){//上传证据
          const {name,prove,source} = this.form;
          const data = {
            lawCaseId:this.caseId,
            eviname:name,
            eviprove:prove,
            evisource:source,
            file:this.filesList
          }
          this.$api.roomItem.uploadEvi(data).then(res => {
            if(res.state == 100){
              this.getEviByCaseIds();
            }
          });
        },
        openEviBox(){
          this.dialogFormVisible = true;
          this.filesList = [];
          this.form = {
            litigantId:'',
            name:'',
            prove:'',
            source:'',
            file:'',
            eviList:[]
          };
        },
      }
    }
  </script>
  
  <style lang="less" scoped>
    h1{
      color: #fff;
    }
    .tabs-box {
      width: 95%;
      margin: 0 auto;
    }
  </style>