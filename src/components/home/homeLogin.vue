<template>
    <div class="login-form">
        <p>
            <el-button type="primary" @click="loginType = 'court'" size="mini" :plain="loginType != 'court'">法院工作人员</el-button>
            <el-button type="primary" @click="loginType = 'litigant'" size="mini" :plain="loginType != 'litigant'">当事人/诉讼代理人</el-button>
        </p>
        <!-- <p><span style="cursor: pointer;" @click="loginType = 'court'">法官登录</span><span style="margin-left: 10px;cursor: pointer;" @click="loginType = 'litigant'">当事人/诉讼代理人登录</span></p> -->
        <el-form label-width="0px" ref="formLabelAlign" :rules="rules" :model="formLabelAlign">
            <el-form-item prop="userName">
            <el-input v-model="formLabelAlign.userName" placeholder="请输入账号">
                <i slot="prefix" class="el-icon-user-solid"></i>
            </el-input>
            </el-form-item>
            <el-form-item prop="passWord">
            <el-input v-model="formLabelAlign.passWord" type="password" placeholder="请输入密码">
                <i slot="prefix" class="el-icon-user"></i>
            </el-input>
            </el-form-item>
            <el-form-item prop="checkCode">
            <el-input v-model="formLabelAlign.checkCode" placeholder="请输入验证码">
                <i slot="prefix" class="el-icon-picture"></i>
            </el-input>
            <img class="code" :src="getCode" @click="changeCode" alt="">
            </el-form-item>
            <el-form-item>
            <el-button type="primary" @click="login" native-type="submit">登录</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
    import md5 from 'md5'
    export default {
        name:'homeLogin',
        data () {
            return {
                codeSrc:'/api/main/code.jhtml?tm=' + Math.random(),
                formLabelAlign:{
                    userName:'',
                    passWord:'',
                    checkCode:''
                },
                loginType:'court',
                rules:{
                    userName:[{required: true, message: '请输入用户名', trigger: 'change'}],
                    passWord:[{required: true, message: '请输入密码', trigger: 'change'}],
                    checkCode:[
                    {required: true, message: '请输入验证码', trigger: 'change'},
                    { min: 4, max: 4, message: '请输入正确的验证码', trigger: 'change' }
                    ]
                },
            }
        },
        computed:{
            getCode(){
                return this.codeSrc;
            }
        },
        methods:{
            changeCode(){
                this.codeSrc = '/api/main/code.jhtml?tm=' + Math.random();
            },
            login(){
                this.$refs['formLabelAlign'].validate((valid) => {
                    if(!valid){
                    return this.$message.warning('请输入正确的用户名/密码/验证码');
                    }
                    const {userName,passWord,checkCode} = this.formLabelAlign;
                    const data = {
                    username:userName,
                    password:md5(passWord),
                    loginType:this.loginType,
                    code:checkCode
                    }
                    this.$store.dispatch('login',data).then(res => {
                    if(res.state == 100){
                        const setType = {
                        roleType : res.data.roles[0].type
                        }
                    this.$api.user.optionRole(setType).then(res => {
                        if(res.state == 100 && !res.data.isFace){
                        this.$router.push({
                            name:'caseList'
                        })
                        }
                        if(res.state == 100 && res.data.isFace){
                        this.$refs.faceCheck.show();
                        }
                    })//调用设置用户类型接口
                    return ;
                    }
                    this.changeCode();
                    });
                })
            },
        }
    }

</script>

<style scoped lang="less">
    .login-form{
        width: 300px;
        height: 280px;
        position: absolute;
        top: 190px;
        right: 225px;
        border: 1px solid #DEDEDE;
        border-radius: 10px;
        padding: 10px 30px;
        background-color: #fff;
        p {
        color: #202020;
        font-weight: bold;
        font-size:16px;
        margin-top: 0;
        }
    }
    .code{
        position: absolute;
        top: 6px;
        right: 15px;
        z-index: 3;
    }
</style>