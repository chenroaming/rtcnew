<template>
    <div class="step1">
        <el-button type="primary" @click="addLitigant('form')">新增诉讼参与人</el-button>
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
            label="操作">
            <template slot-scope="scope">
                <el-button
                    type="text"
                    size="small">
                    编辑
                </el-button>
                <el-button
                    type="text"
                    size="small">
                    删除
                </el-button>
            </template>
            </el-table-column>
        </el-table>
        <el-dialog width="500px" title="新增诉讼参与人" :visible.sync="dialogFormVisible">
            <el-form :rules="rules" :model="form" ref="form">
                <el-form-item label="诉讼地位" prop="litigationType" :label-width="formLabelWidth">
                    <el-select v-model="form.litigationType" placeholder="请选择活动区域">
                        <el-option v-for="(item,index) in litigationStatusArr" :label="item.name" :value="item.id"></el-option>
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
                    <el-input v-model="form.phone"></el-input>
                </el-form-item>
                <el-form-item label="证件类型" prop="idCardType" :label-width="formLabelWidth">
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
            <el-form v-for="(item,index) in form.layerList">
                <el-form-item :label-width="formLabelWidth">
                    <span>代理人{{index + 1}}</span>
                    <el-button type="text" siz="mini" @click="delLayer(index)">删除</el-button>
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
                <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
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
                ],
                litigationStatus: [
                ],
                name: [
                ],
                phone: [
                ],
                idCardType: [
                ],
                idCard: [
                ]
            },
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
            litigationStatusArr:[
                {name:'原告',id:1},
                {name:'被告',id:2},
            ],
        }
      },
      computed:{
        
      },
      watch:{
        
      },
      mounted(){

      },
      methods:{
        submit(){
            console.log(222);
            this.$emit('listenToChildEvent',2);
        },
        addLitigant(name){
            if (this.$refs[name] !== undefined) {
                this.$refs[name].resetFields();
                this.form.layerList = [];
            }
            this.dialogFormVisible = true;
        },
        addLayer(){
            const data = {
                name:'',
                phone:'',
                idCard:''
            }
            this.form.layerList.push(data);
        },
        delLayer(index){
            this.form.layerList.splice(index,1);
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