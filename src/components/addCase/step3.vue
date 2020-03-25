<template>
    <div class="step1">
        <el-button type="primary" @click="addEvi('form')"><i class="el-icon-circle-plus"></i>新增证据</el-button>
        <el-table
            :data="tableData"
            height="300"
            stripe
            style="width: 100%">
            <el-table-column
            type="index"
            label="序号">
            </el-table-column>
            <el-table-column
            prop="litigantName"
            label="当事人">
            </el-table-column>
            <el-table-column
            prop="name"
            label="证据名称">
            </el-table-column>
            <el-table-column
            prop="prove"
            label="证明对象">
            </el-table-column>
            <el-table-column
            prop="source"
            label="证据来源"
            width="180">
            </el-table-column>
            <el-table-column
            label="证据文件">
            <template slot-scope="scope">
                <p v-for="(item,index) in scope.row.filePaths">{{item.name}}</p>
            </template>
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
                    @click="delEvi(scope.row)">
                    删除
                </el-button>
            </template>
            </el-table-column>
        </el-table>
        <el-dialog :close-on-click-modal="false" width="500px" :title="form.litigantId ? '编辑证据':'新增证据'" :visible.sync="dialogFormVisible">
            <el-form :model="form" ref="form">
                <el-form-item label="当事人" prop="litigationType" :label-width="formLabelWidth">
                    <el-select v-model="form.litigantId" placeholder="请选择当事人">
                        <el-option v-for="(item,index) in litigantList" :key="index" :label="item.name" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
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
                        <span @click="showFile(item)">{{item.name}}</span>
                        <i class="el-icon-circle-close" style="cursor: pointer;" @click="delfiles(item,index,'online')"></i>
                    </p>
                    <p v-for="(item,index) in fileList2">
                        <span>{{item.name}}</span>
                        <i class="el-icon-circle-close" style="cursor: pointer;" @click="delfiles(item,index,'noline')"></i>
                    </p>
                    <input type="file" style="display: none;" id="getFiles" @change="getFile">
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
        name: 'step3',
        components: {
          showFile
        },
      data(){
        return {
            fileItem:{},
            dialogFormVisible:false,
            formLabelWidth:'100px',
            tableData:[],
            litigantList:[],
            form:{
                litigantId:'',
                name:'',
                prove:'',
                source:'',
                file:'',
                eviList:[]
            },
            lawCaseId:'',
            filesList:[],
            fileList2:[],
            evidenceId:'',
        }
      },
      computed:{
        
      },
      watch:{
        
      },
      mounted(){
        this.lawCaseId = this.$store.getters.getCaseId;
        this.getCaseDetail();
      },
      methods:{
        submit(){
            console.log(333);
            this.$emit('listenToChildEvent',3);
        },
        addEvi(name){
            this.form = {
                litigantId:'',
                name:'',
                prove:'',
                source:'',
                file:'',
                eviList:[]
            };//清空表单函数偶尔失效，暂时先用赋值方式解决
            this.filesList = [];
            this.evidenceId = '';
            // if (this.$refs[name] !== undefined) {
            //     this.$refs[name].resetFields();
            //     this.form.eviList = [];
            // }
            this.dialogFormVisible = true;
        },
        upEvi(){//上传证据
            if(!this.evidenceId){
                const data = {
                    name:this.form.name,
                    prove:this.form.prove,
                    source:this.form.source,
                    lawCaseId:this.lawCaseId,
                    litigantId:this.form.litigantId,
                    file:this.fileList2
                }
                this.$api.addCase.addEvidence(data).then(res => {
                    console.log(res)
                    if(res.state == 100){
                        this.dialogFormVisible = false;
                        this.getCaseDetail();
                    }
                })
                return;
            }
            console.log(this.form);
            const data = {
                name:this.form.name,
                prove:this.form.prove,
                source:this.form.source,
                lawCaseId:this.lawCaseId,
                litigantId:this.form.litigantId,
                evidenceId:this.evidenceId,
                file:this.fileList2
            }
            this.$api.addCase.updateEvidence(data).then(res => {
                if(res.state == 100){
                    this.dialogFormVisible = false;
                    this.getCaseDetail();
                }
            }) 
        },
        upFile(){
            const button = document.getElementById('getFiles');
            button.click();
            button.value = '';
        },
        getFile(e){//获取证据文件
            this.fileList2.push(e.target.files[0]);
        },
        delfiles(item,index,str){//删除证据文件
            if(str == 'online'){
                if(!item.id){
                    this.filesList.splice(index,1);
                }else{
                    this.$confirm('确认删除该证据文件？', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        const data = {
                            fileId:item.id
                        }
                        this.$api.addCase.delFile(data).then(res => {
                            if(res.state == 100){
                                this.getCaseDetail();
                                this.filesList.splice(index,1);
                            }
                        })
                    }).catch(() => {
                        
                    });
                }
                return;
            }
            this.fileList2.splice(index,1);
        },
        edit(item){
            console.log(item)
            this.fileList2 = [];
            this.evidenceId = item.id;
            this.form.litigantId = item.litigantId;
            this.form.name = item.name;
            this.form.prove = item.prove;
            this.form.source = item.source;
            this.filesList = item.filePaths;
            this.dialogFormVisible = true;
        },
        delEvi(item){//删除证据
            this.$confirm('确认删除该证据？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                const data = {
                    eviId:item.id
                }
                this.$api.addCase.delEvidence(data).then(res => {
                    if(res.state == 100){
                        this.getCaseDetail();
                    }
                })
            }).catch(() => {
                
            });
        },
        getCaseDetail(){//获取所有当事人信息
            const type = ['原告','申请人','上诉人','再审申请人','原审原告','原审申请人','被告','被申请人','被上诉人','再审被申请人','原审被告','原审被申请人'];
            const data= {
                lawCaseId:this.lawCaseId
            }
            this.$api.caseList.getCaseDetail(data).then(res => {
                this.litigantList = [];
                this.tableData = [];
                for(const item of res.litigants){
                    if(
                        type.some(res => {
                            return res == item.litigant.litigationStatus.name;
                        })
                    ){
                        const data = {
                            name:item.litigant.litigantName,
                            id:item.litigant.id
                        }
                        this.litigantList.push(data);
                    }
                    if(item.evidence.length > 0){
                        for(const item2 of item.evidence){
                            item2.litigantId = item.litigant.id;
                            item2.litigantName = item.litigant.litigantName;
                            this.tableData.push(item2)
                        }
                    }
                }
            })
        },
        showFile(item){
          this.fileItem = item;
          this.$refs.toFile.showEvidence();
        },
      }
    }
  </script>
  
  <style lang="less" scoped>
      .step1{
          width: 80%;
          margin: 0 auto;
      }
  </style>