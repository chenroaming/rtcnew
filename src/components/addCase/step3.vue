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
            prop="evi.name"
            label="证据名称">
            </el-table-column>
            <el-table-column
            prop="evi.prove"
            label="证明对象">
            </el-table-column>
            <el-table-column
            prop="evi.source"
            label="证据来源"
            width="180">
            </el-table-column>
            <el-table-column
            prop="evi.files"
            label="证据文件">
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
        <el-dialog width="500px" title="新增证据" :visible.sync="dialogFormVisible">
            <el-form :model="form" ref="form">
                <el-form-item label="当事人" prop="litigationType" :label-width="formLabelWidth">
                    <el-select v-model="form.litigantId" placeholder="请选择当事人">
                        <el-option v-for="(item,index) in litigantList" :label="item.name" :value="item.id"></el-option>
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
                    <el-button type="primary" size="mini">上传证据</el-button>
                </el-form-item>
                <el-form-item :label-width="formLabelWidth">
                    <span v-for="(item,index) in form.eviList"></span>
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
        name: 'step3',
      data(){
        return {
            dialogFormVisible:false,
            formLabelWidth:'100px',
            tableData:[],
            litigantList:[{name:'zhangsan',id:'dafasfasdf'}],
            form:{
                litigantId:'',
                name:'',
                prove:'',
                source:'',
                file:'',
                eviList:[]
            }
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
            console.log(333);
            this.$emit('listenToChildEvent',3);
        },
        addEvi(name){

            if (this.$refs[name] !== undefined) {
                this.$refs[name].resetFields();
                this.form.eviList = [];
            }
            this.dialogFormVisible = true;
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