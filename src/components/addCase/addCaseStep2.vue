<template>
    <div class="step1">
        <el-button v-if="isEdit" type="primary" @click="addLitigant('form')"><i class="el-icon-circle-plus"></i>新增诉讼参与人</el-button>
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
            prop="litigant.litigationStatus.name"
            label="诉讼地位">
            </el-table-column>
            <el-table-column
            prop="litigant.litigantName"
            label="名称">
            </el-table-column>
            <el-table-column
            prop="litigant.identityCard"
            label="证件号码"
            width="180">
            </el-table-column>
            <el-table-column
            prop="litigant.litigantPhone"
            label="手机号码">
            </el-table-column>
            <el-table-column
            label="操作" v-if="isEdit">
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
        <el-dialog :close-on-click-modal="false" width="500px" :title="titleText" :visible.sync="dialogFormVisible">
            <el-form ref="form" :rules="rules" :model="form">
                <el-form-item label="诉讼地位" prop="litigationStatus" :label-width="formLabelWidth">
                    <el-select v-model="form.litigationStatus" placeholder="请选择诉讼地位">
                        <el-option v-for="(item,index) in litigationStatusArr" :key="index" :label="item.name" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="类型" prop="litigantType" :label-width="formLabelWidth">
                    <el-radio-group v-model="form.litigantType">
                        <el-radio :label="0">自然人</el-radio>
                        <el-radio :label="1">法人</el-radio>
                        <el-radio :label="2">非法人组织</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="名称" prop="litigantName" :label-width="formLabelWidth">
                    <el-input v-model="form.litigantName"></el-input>
                </el-form-item>
                <el-form-item prop="litigantPhone" label="手机号码" :label-width="formLabelWidth">
                    <el-input v-model.number="form.litigantPhone"></el-input>
                </el-form-item>
                <el-form-item v-show="form.litigantType == 0" label="证件类型" prop="idCardType" :label-width="formLabelWidth">
                    <el-select v-model="form.idCardType" filterable placeholder="请选择">
                        <el-option
                          v-for="(ite,ind) in idCardType"
                          :key="ind"
                          :label="ite.name"
                          :value="ite.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="证件号码" prop="identityCard" :label-width="formLabelWidth">
                    <el-input v-model="form.identityCard"></el-input>
                </el-form-item>
                <el-form-item :label-width="formLabelWidth">
                    <el-button type="primary" @click="addLayer" v-show="form.layerList.length < 2"><i class="el-icon-circle-plus"></i>新增代理人</el-button>
                </el-form-item>
            </el-form>
            <el-form v-for="(item,index) in form.layerList" :key="index">
                <el-form-item :label-width="formLabelWidth">
                    <span>代理人{{index + 1}}</span>
                    <el-button type="text" siz="mini" @click="delLayer(index,item)">删除</el-button>
                </el-form-item>
                <el-form-item label="名称" :label-width="formLabelWidth">
                    <el-input v-model="item.name"></el-input>
                </el-form-item>
                <el-form-item label="手机号码" :label-width="formLabelWidth">
                    <el-input v-model="item.phone"></el-input>
                </el-form-item>
                <el-form-item label="证件号码" :label-width="formLabelWidth">
                    <el-input v-model="item.idCard"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="submitLitigant">确 定</el-button>
            </div>
        </el-dialog>
    </div>
  </template>
  
  <script>
    export default {
        name: 'addCaseStep2',
      data(){
        return {
            rules: {
                litigationType: [
                {required: true, message: '请选择诉讼地位', trigger: 'change'}
                ],
                litigationStatus: [
                {required: true, message: '请选择诉讼类型', trigger: 'change'}
                ],
                litigantName: [
                {required: true, message: '请填写名称', trigger: 'change'}
                ],
                litigantPhone: [
                {required: true, message: '请填写号码', trigger: 'change'},
                ],
                identityCard: [
                {required: true, message: '请填写证件号码', trigger: 'change'},
                ]
            },
            lawCaseId:'',
            tableData:[],
            dialogFormVisible:false,
            form:{
                litigantType:'',
                litigantName:'',
                litigationStatus:'',
                litigantPhone:'',
                idCardType:'',
                identityCard:'',
                layerList:[]
            },
            formLabelWidth:'100px',
            idCardType:[{name:'大陆身份证',id:1},{name:'其他(港澳通行证、护照号等)',id:2}],
            litigationStatusArr:[],
            caseType:'',
            litigantId:'',
            visible2:false,
            isEdit:false,
        }
      },
      mounted(){
        this.isEdit = this.$store.getters.getEditStatus;
        this.caseType = this.$store.getters.getCaseType;
        this.lawCaseId = this.$store.getters.getCaseId;
        const data = {
            caseType:this.caseType
        }
        this.getCaseDetail();
        this.$api.addCase.getLitigationStatus(data).then(res => {
            if(res.state == 100){
                this.litigationStatusArr = res.litigationStatus;
            }
        })
      },
      computed:{
        titleText(){
          return this.litigantId ? '编辑诉讼参与人' : '新增诉讼参与人';
        },
      },
      methods:{
        submit(){//进入下一步
            if(!this.isEdit){
                this.$emit('listenToChildEvent',3);
                return;
            }
            if(this.tableData.length < 1){
                this.$message.warning('请添加诉讼参与人！');
                return false;
            }
            this.$emit('listenToChildEvent',3);
        },
        addLitigant(name){//添加当事人
            this.litigantId = '';
            this.form.layerList = [];
            this.form = {
                litigationType:'',
                name:'',
                litigationStatus:'',
                phone:'',
                idCardType:'',
                idCard:'',
                layerList:[]
            };//清空表单函数偶尔失效，暂时先用赋值方式解决
            this.dialogFormVisible = true;
            // this.$nextTick(() => {
            //     console.log(name)
            //     if(this.$refs[name]){
            //         this.$refs[name].resetFields();
            //     }
            //     this.form.layerList = [];
            // })
        },
        addLayer(){//添加代理人
            const data = {
                name:'',
                phone:'',
                idCard:''
            }
            if(this.litigantId){
                data.litigantId = this.litigantId;
            }
            this.form.layerList.push(data);
        },
        delLayer(index,item){//删除代理人
            // console.log(item);
            if(item.id){
                this.$confirm('确认删除该代理人？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    const data = {
                        litigantId:this.litigantId,
                        lawyerId:item.id
                    }
                    this.$api.addCase.delLawyer(data).then(res => {
                        if(res.state == 100){
                            this.form.layerList.splice(index,1);
                            this.getCaseDetail();
                        }
                    })
                }).catch(() => {
                    
                });
            }else{
                this.form.layerList.splice(index,1);
            }
        },
        submitLitigant(){//新增或修改当事人
            this.$refs['form'].validate((valid) => {
                if(!valid){
                    return this.$message.warning('请确保选项填写完整正确！');
                }
                const data = {
                    name:this.form.litigantName,
                    idCard:this.form.identityCard,
                    phone:this.form.litigantPhone,
                    litigantType:this.form.litigantType,
                    litigationStatus:this.form.litigationStatus,
                    idCardType:this.form.idCardType,
                    litigantId:'',
                    lawCaseId:this.lawCaseId,
                    lawyers:this.form.layerList
                }
                if(!this.litigantId){
                    this.$api.addCase.addTrialLitigant(data).then(res => {
                        if(res.state == 100){
                            this.dialogFormVisible = false;
                            const data2= {
                                lawCaseId:this.lawCaseId
                            }
                            this.$api.caseList.getCaseDetail(data2).then(res => {
                                this.tableData = res.litigants;
                            })
                            return;
                        }
                    })
                }else{
                    data.litigantId = this.litigantId;
                    this.$api.addCase.updateTrialLitigant(data).then(res => {
                        if(res.state == 100){
                            this.dialogFormVisible = false;
                            this.getCaseDetail();
                            return;
                        }
                    })
                }
            })
        },
        edit(item){//编辑当事人
            console.log(item)
            this.litigantId = item.litigant.id;
            this.form = {litigationStatus:'',layerList:[],...item.litigant};
            if(
                this.litigationStatusArr.some(res => {
                    return res.id == item.litigant.litigationStatus.id
                })
            ){
                this.form.litigationStatus = item.litigant.litigationStatus.id;
            }
            if(item.litigant.lawyer.length > 0){
                for(const item of item.litigant.lawyer){
                    const data = {
                        name:item.agentName,
                        phone:item.agentMobile,
                        idCard:item.agentIdentiCard,
                        id:item.id
                    }
                    this.form.layerList.push(data);
                }
            }
            this.dialogFormVisible = true;
        },
        del(item){//删除当事人
            this.$confirm('确认删除该当事人？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                const data = {
                litigantId:item.litigant.id 
                }
                this.$api.addCase.delTrialLitigant(data).then(res => {
                    if(res.state == 100){
                        this.getCaseDetail();
                    }
                })
            }).catch(() => {
                  
            });
        },
        getCaseDetail(){//获取诉讼参与人信息
            const data= {
                lawCaseId:this.lawCaseId
            }
            this.$api.caseList.getCaseDetail(data).then(res => {
                this.tableData = res.litigants;
            })
        },
        clearForm(){
            console.log(this.litigantId ? true : false)
            this.litigantId || this.$refs['form'].resetFields();
        },
      }
    }
  </script>
  
  <style lang="less" scoped>
      .step1{
          width: 80%;
          margin: 0 auto;
          margin-bottom: 20px;
      }
  </style>