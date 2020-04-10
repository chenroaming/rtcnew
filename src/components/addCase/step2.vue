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
        <el-dialog :close-on-click-modal="false" width="500px" title="新增诉讼参与人" :visible.sync="dialogFormVisible">
            <el-form :rules="rules" :model="form" ref="form">
                <el-form-item label="诉讼地位" prop="litigationType" :label-width="formLabelWidth">
                    <el-select v-model="form.litigationType" placeholder="请选择诉讼地位">
                        <el-option v-for="(item,index) in litigationStatusArr" :key="index" :label="item.name" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="类型" prop="litigationStatus" :label-width="formLabelWidth">
                    <el-radio-group v-model="form.litigationStatus">
                        <el-radio :label="0">自然人</el-radio>
                        <el-radio :label="1">法人</el-radio>
                        <el-radio :label="2">非法人组织</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="名称" prop="name" :label-width="formLabelWidth">
                    <el-input v-model="form.name"></el-input>
                </el-form-item>
                <el-form-item prop="phone" label="手机号码" :label-width="formLabelWidth">
                    <el-input v-model.number="form.phone"></el-input>
                </el-form-item>
                <el-form-item v-show="form.litigationStatus == 0" label="证件类型" prop="idCardType" :label-width="formLabelWidth">
                    <el-select v-model="form.idCardType" filterable placeholder="请选择">
                        <el-option
                          v-for="(ite,ind) in idCardType"
                          :key="ind"
                          :label="ite.name"
                          :value="ite.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="证件号码" prop="idCard" :label-width="formLabelWidth">
                    <el-input v-model="form.idCard"></el-input>
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
        name: 'step2',
      data(){
        return {
            rules: {
                litigationType: [
                {required: true, message: '请选择诉讼地位', trigger: 'change'}
                ],
                litigationStatus: [
                {required: true, message: '请选择诉讼类型', trigger: 'change'}
                ],
                name: [
                {required: true, message: '请填写名称', trigger: 'change'}
                ],
                phone: [
                {required: true, message: '请填写号码', trigger: 'change'},
                ],
                idCardType: [
                ],
                idCard: [
                {required: true, message: '请填写证件号码', trigger: 'change'},
                ]
            },
            lawCaseId:'',
            tableData:[],
            dialogFormVisible:false,
            form:{
                litigationType:'',
                name:'',
                litigationStatus:'',
                phone:'',
                idCardType:'',
                idCard:'',
                layerList:[]
            },
            formLabelWidth:'100px',
            idCardType:[{name:'大陆身份证',id:1},{name:'其他',id:2}],
            litigationStatusArr:[],
            caseType:'',
            litigantId:'',
            visible2:false,
            isEdit:false,
        }
      },
      computed:{
        getCaseId(){
            return this.$store.getters.getCaseId//通过计算属性返回vuex中的状态值
        }
      },
      watch:{
        getCaseId(curval,oldVal){//当前值和原来的值
            console.log(curval);
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
            this.form = {
                litigationType:'',
                name:'',
                litigationStatus:'',
                phone:'',
                idCardType:'',
                idCard:'',
                layerList:[]
            };//清空表单函数偶尔失效，暂时先用赋值方式解决
            // if (this.$refs[name] !== undefined) {
            //     this.$refs[name].resetFields();
            //     this.form.layerList = [];
            // }
            this.dialogFormVisible = true;
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
                    name:this.form.name,
                    idCard:this.form.idCard,
                    phone:this.form.phone,
                    litigantType:this.form.litigationStatus,
                    litigationStatus:this.form.litigationType,
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
            if(
                this.litigationStatusArr.some(res => {
                    return res.id == item.litigant.litigationStatus.id
                })
            ){
                this.form.litigationType = item.litigant.litigationStatus.id;
            }else{
                this.form.litigationType = '';
            }
            this.litigantId = item.litigant.id;
            this.form.name = item.litigant.litigantName;
            this.form.idCard = item.litigant.identityCard;
            this.form.phone = item.litigant.litigantPhone;
            this.form.litigationStatus = item.litigant.litigantType;
            this.form.idCardType = '';
            this.form.layerList = [];
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
        }
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