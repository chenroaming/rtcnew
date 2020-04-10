<template>
    <div class="case-main">
      <div class="item-left">
        <p>我的庭审
            <!-- <img src="@/assets/img/today-icon.png" alt=""> -->
            <el-button type="text" @click="searchAll">查询全部</el-button>
        </p>
        <Calendar
            v-on:choseDay="clickDay"
        ></Calendar>
        <p>共{{caseCount.total}}件案件</p>
        <!-- <p>未开庭<span>{{caseCount.un}}</span>件</p>
        <p>已开庭<span>{{caseCount.ed}}</span>件</p> -->
      </div>
      <div class="item-right">
        <div class="time-box">
            <img src="@/assets/img/time-icon.png" alt="">
            <span>{{time}}</span>
            <span>{{caseCount.total}}个案件</span>
        </div>
        <countCase v-if="canCount"></countCase>
        <ul class="case-box">
            <p v-if="caseList.length == 0">暂无数据</p>
            <li v-for="(item,index) in caseList">
                <img src="@/assets/img/state-3.png" v-if="!item.isOpen" class="isOpen" alt="">
                <img src="@/assets/img/state-2.png" v-if="item.isOpen" class="isOpen" alt="">
                <div style="text-align: left;padding: 0px 15px;">
                    <el-checkbox v-if="isShow" @change="selectItem($event,item)" v-model="item.isChecked">
                        <span style="font-size: 20px;font-weight: bold;color: #282828;">
                            {{item.caseNo}}
                        </span>
                    </el-checkbox>
                    <span v-else style="font-size: 20px;font-weight: bold;color: #282828;">
                        {{item.caseNo}}
                    </span>
                    <el-button type="text" style="position: absolute;top: 20px;right: 100px;" @click="del(item)" v-if="isShow">删除</el-button>
                    <el-button type="text" style="position: absolute;top: 20px;right: 139px;" @click="edit(item)">编辑</el-button>
                </div>
                <p class="title-box">
                    <span>开庭时间：{{item.openDate}}</span>
                    <span>开庭类型：{{item.trialType}}</span>
                    <span>案件类型：{{item.caseType}}</span>
                </p>
                <div class="feature-box">
                    <div class="feature-content">
                        <img src="@/assets/img/role-icon1.png" alt="">
                        <div>
                            <p style="margin: 0;">法官</p>
                            <p style="padding: 0;margin: 0;">{{item.judge}}</p>
                        </div>
                    </div>
                    
                    <div class="feature-content">
                        <img src="@/assets/img/role-icon2.png" alt="">
                        <div>
                            <p style="margin: 0;">书记员</p>
                            <p style="padding: 0;margin: 0;">{{item.clerk}}</p>
                        </div>
                    </div>
                    
                    <div class="feature-content" style="width: 115px;">
                        <img src="@/assets/img/role-icon3.png" alt="">
                        <div style="width: 78px;">
                            <p style="margin: 0;">人民陪审员</p>
                            <p style="padding: 0;margin: 0;">{{item.juror}}</p>
                        </div>
                    </div>
                    
                    <div class="download-box" @click="downRecord(item)">
                        <img src="@/assets/img/down-icon.png" alt="">
                        <span>庭审笔录</span>
                    </div>
                    
                    <div class="download-box">
                        <img src="@/assets/img/down-icon.png" alt="">
                        <span>庭审录像</span>
                    </div>
                    <div style="width: 175px;" class="button-box">
                        <el-button type="success" size="mini" @click="intoRoom(item,0)">测试房间</el-button>
                        <el-button type="primary" size="mini" @click="intoRoom(item,1)">进入房间</el-button>
                    </div>
                    <img style="display: inline-block;
                    width: 10px;
                    height: 15px;
                    margin-right: 55px;
                    cursor: pointer;position: absolute;top: 115px;right: 0;" src="@/assets/img/arrow-down.png" class="icon_arrowDown" :class="{'icon_arrowUp':nowIndex == index && item.isShow,'icon_arrowDown':nowIndex == index && !item.isShow}" @click="item.isShow = !item.isShow;getRecord(item.caseId,item.isShow,index)" alt="">
                </div>
                <transition name="el-zoom-in-top">
                    <el-table
                        :data="tableData"
                        stripe
                        style="width: 100%"
                        v-show="item.isShow && nowIndex == index">
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
                        label="操作" width="50px" v-if="isShow">
                            <template slot-scope="scope">
                                <!-- <img style="cursor: pointer;" title="发送短信" src="@/assets/img/message-btn.png" @click="sendM(scope.row,item)" alt=""> -->
                                <i class="el-icon-chat-line-square" style="cursor: pointer;" @click="sendM(scope.row,item)"></i>
                            </template>
                        </el-table-column>
                        <el-table-column
                        label="面部识别开关" width="120px" v-if="isShow">
                            <template slot-scope="scope">
                                <el-switch
                                v-model="scope.row.litigant.faceCheck"
                                widht="10"
                                @change="changeIsFace(scope.row)"
                                active-color="#13ce66"
                                inactive-color="#ff4949">
                                </el-switch>
                            </template>
                        </el-table-column>
                    </el-table>
                </transition>
            </li>
        </ul>
        <div class="right-footer">
            <div style="width: 200px;float: left;" v-if="isShow">
                <el-checkbox v-model="allSelect" @change="selectAll($event)" style="margin-right: 10px;">
                    全选
                </el-checkbox>
                <el-badge class="selectedBtn" :value="selectList.length">
                    <el-button type="primary" @click="dialogFormVisible = true" size="small">已选择的案件</el-button>
                </el-badge>
            </div>
            <el-pagination
                @current-change="handleCurrentChange"
                :current-page="currentPage"
                :page-size="7"
                layout="total, prev, pager, next, jumper"
                :total="totalPage">
            </el-pagination>
        </div>
    </div>
    <el-dialog width="30%" title="已选择案件" :visible.sync="dialogFormVisible">
        <el-table
            :data="selectList"
            stripe
            >
            <el-table-column
            prop="caseNo"
            label="案号">
            </el-table-column>
            <el-table-column
            label="操作">
            <template slot-scope="scope">
                <el-button @click="handleClick(scope.row)" type="text" size="small">删除</el-button>
              </template>
            </el-table-column>
        </el-table>
        <div slot="footer" class="dialog-footer">
            <el-button type="warning" @click="empty">清空</el-button>
            <el-button type="primary" @click="openCourt">批量开庭</el-button>
        </div>
    </el-dialog>
    </div>
  </template>
  
  <script>
    import Calendar from 'vue-calendar-component'
    import countCase from '@/components/caseList/countCase.vue'
    export default {
    name: 'caseList',
    components: {
        Calendar,
        countCase,
    },
      data(){
        return {
            time:'',
            count:3,
            caseList:[],
            isSelect:0,
            selectList:[],
            allSelect:false,
            dialogFormVisible:false,
            currentPage:1,
            total:1,
            totalPage:1,
            tableData:[],
            nowIndex:null,
            caseCount:{
                total:0,
                un:0,
                ed:0,
            },
            roleArr:['法官','书记员'],
            isShow:false,
            nowPage:1,
            startDate:'',
            nowRole:'',
            canCount:false,
        }
      },
      computed:{
        
      },
      watch:{
        
      },
      mounted(){
        this.nowRole = this.$store.getters.getUserInfo.roleName;
        this.canCount = this.$store.getters.getUserInfo.result.name.includes('审管办');
        if(this.roleArr.some(res => {
            return res == this.nowRole;
        })){
            this.isShow = true;
        }
        const today = new Date();
        this.time = today.getFullYear() + '年' + (today.getMonth()+1) + '月' + today.getDate() + '日';
        if(this.$route.params){
            this.search(this.$route.params)
            return;
        }
        const params = {
            caseNo:'',
            pageNumber:1
        }
        this.search(params);
      },
      methods:{
        selectItem(e,item){
            if(e){
                this.selectList.push(item);
                this.isSelect ++;
            }else{
                this.isSelect --;
                for(let i = 0;i < this.selectList.length;i++){
                    if(item.caseNo == this.selectList[i].caseNo){
                        this.selectList.splice(i,1);
                    }
                }
            }
            if(this.isSelect == this.caseList.length){
                this.allSelect = true;
            }else{
                this.allSelect = false;
            }
        },
        selectAll(e){
            if(e){
                this.selectList = this.caseList;
                for(let i = 0;i < this.caseList.length;i++){
                    this.caseList[i].isChecked = true;
                }
            }else{
                this.selectList = []
                for(let i = 0;i < this.caseList.length;i++){
                    this.caseList[i].isChecked = false;
                }
            }
        },
        handleClick(e){
            for(let i = 0;i < this.selectList.length;i++){
                if(e.caseNo == this.selectList[i].caseNo){
                    this.selectList.splice(i,1);
                }
            }
            for(let i = 0;i < this.caseList.length;i++){
                if(e.caseNo == this.caseList[i].caseNo){
                    this.caseList[i].isChecked = false;
                }
            }
        },
        empty(){
            this.selectList = [];
            for(let i = 0;i < this.caseList.length;i++){
                this.caseList[i].isChecked = false;
                this.allSelect = false;
            }
        },
        openCourt(){
            if(this.selectList.length < 1){
                return this.$message.warning('请选择案件');
            }
            const caseIdArr = [];
            const caseNoArr = [];
            for(const item of this.selectList){
                caseIdArr.push(item.caseId);
                caseNoArr.push(item.caseNo);
            }
            const params = {
                caseId:caseIdArr.join(','),
                caseNo:caseNoArr.join(',')
            }
            this.intoRoom(params,1);
        },
        handleCurrentChange(val){
            this.nowPage = val;
            const params = {
                caseNo:'',
                pageNumber:val,
                startDate:this.startDate
            }
            this.search(params);
        },
        getRecord(id,isShow,index){//获取案件详情
            if(isShow){
                this.nowIndex = index;
                const params = {
                    lawCaseId:id
                }
                this.$api.caseList.getCaseDetail(params).then(res => {
                    if(res.state == 100){
                        this.tableData = [];
                        for(const item of res.litigants){
                            this.tableData.push(item)
                            if(item.litigant.lawyer.length > 0){
                                for(const item2 of item.litigant.lawyer){
                                    const data = {
                                        litigant:{
                                            litigationStatus:{name:'代理人'},
                                            litigantName:item2.agentName,
                                            identityCard:item2.agentIdentiCard,
                                            litigantPhone:item2.agentMobile,
                                            faceCheck:item2.faceCheck,
                                            id:item2.id,
                                        }
                                    }
                                    this.tableData.push(data);
                                }
                            }
                        }
                    }else{
                        this.$message.warning(res.message);
                    }
                })
            }
        },
        sendM(row,item){//发送信息
            let sendType = 3;
            if(row.litigant.litigationStatus.name == '代理人'){
                sendType = 8;
            }
            const params = {
                lawCaseId:item.caseId,
                openDate:item.openDate,
                name:row.litigant.litigantName,
                phone:row.litigant.litigantPhone,
                idCard:row.litigant.identityCard,
                type:sendType,
            }
            this.$api.caseList.getMessageInfo(params).then(res => {
                if(res.state == 100){
                    this.$confirm(res.info, '短信内容预览', {
                        confirmButtonText: '确认发送',
                        cancelButtonText: '取消', 
                        center:true,
                        type:'info'   
                    }).then(() => {
                        this.$api.caseList.sendMessage(params);
                    })
                    .catch(() => {

                    }) 
                }
            })
        },
        downRecord(item){
            const data = {
                lawCaseId:item.caseId
            }
            this.$api.caseList.downRecord(data).then(res => {
                if(res.state == 100){
                    const link = document.createElement('a');
                    // 设置下载的文件名
                    link.download = '';
                    link.style.display = 'none';
                    //设置下载路径
                    link.href = location.origin + res.file;
                    //触发点击
                    document.body.appendChild(link);
                    link.click();
                    //移除节点
                    document.body.removeChild(link);
                }else{
                    this.$message.error(res.message);
                }
            })
        },
        clickDay(data) { //选中某天
            const choiceDay = data.split('/');
            this.time = choiceDay[0] + '年' + choiceDay[1] + '月' + choiceDay[2] + '日';
            const ch = '/';
            this.startDate = data.replace(new RegExp(ch,'g'),"-") + ' 00:00';
            const startDate = {
                startDate:this.startDate
            }
            this.search(startDate);
        },
        edit(item){
            this.$store.dispatch('setCaseId',item.caseId);
            this.$emit('getMessage',1);
            this.$router.push({
              name:'addCase'
            })
        },
        del(item){
            this.$confirm('确认删除该案件？', '提示', {
                confirmButtonText: '确定',
                type: 'warning'
            }).then(() => {
                const data = {
                    lawCaseId:item.caseId
                }
                this.$api.caseList.delLawCase(data).then(res => {
                    if(res.state == 100){
                        const params = {
                            caseNo:'',
                            pageNumber:this.nowPage
                        }
                        this.search(params);
                    }
                })
                
            })
            .catch(() => {

            })
        },
        searchAll(){
            this.startDate = '';
            this.search();
        },
        search(params){
            this.$api.caseList.caseList(params).then(res => {
                if(res.state == 100){
                    this.caseList = [];
                    if(res.result.length > 0){
                        for(const item of res.result){
                        const params = {
                            caseNo:item.caseNo,
                            openDate:item.openDate,
                            judge:item.judge,
                            clerk:item.clerk,
                            juror:item.juror.length > 0 ? item.juror[0] : '暂无',
                            isShow:false,
                            caseId:item.caseId,
                            isOpen:item.isOpen,
                            trialType:item.trialType,
                            caseType:item.caseType,
                        }
                        this.caseList.push(params);
                    } 
                    }
                    this.totalPage = res.total;
                    this.caseCount.total = res.total;
                }
            })
        },
        intoRoom(item,type){
            const params = {
                caseId:item.caseId,
                type:type,
                caseNo:item.caseNo
            }
            // this.$store.dispatch('setCaseInfo',item);
            this.$api.room.getRoomToken(params).then(res => {
                if(res.state == 100){
                    this.$store.dispatch('setWebSocket');
                    this.$store.dispatch('setVoice',res.voice);
                    if(this.nowRole == '书记员'){
                        const arr = [];
                        let caseId = [];
                        let caseNo = [];
                        if(params.caseId.includes(',')){
                            caseId = params.caseId.split(',');
                            caseNo = params.caseNo.split(',');
                            for(let i = 0;i < caseId.length;i++){
                                const newArr = {
                                    caseId:caseId[i],
                                    type:type,
                                    caseNo:caseNo[i]
                                }
                                arr.push(newArr);
                            }
                        }else{
                            arr.push(params);
                        }
                        this.$store.dispatch('setClerkRoom',arr);
                        this.$router.push({
                            name:'ClerkRoom',
                            params:{
                                roomToken:res,
                                caseInfo:item
                            }
                        })
                        return;
                    }
                    this.$router.push({
                        name:'Room',
                        params:{
                            roomToken:res,
                            caseInfo:item
                        }
                    })
                }else{
                    this.$message.warning(res.message);
                }
            })
        },
        changeIsFace(item){
            const params = {
                idCard:item.litigant.identityCard,
                check:item.litigant.faceCheck ? 1 : 0,
                litigantId:item.litigant.litigationStatus.name == '代理人' ? '' : item.litigant.id,
                lawyerId:item.litigant.litigationStatus.name == '代理人' ? item.litigant.id : '',
            }
            this.$api.caseList.changeIsFace(params);
        },
      }
    }
</script>

<style>
    .wh_content_all {
        background-color: #E6F4FF!important;
    }
    .wh_content_item {
        color:#199CFA!important;
        font-weight: bold;
    }
    .wh_content_li {
        color: #199CFA!important;
        font-weight: bold;
    }
    .wh_jiantou1 {
        border-top: 2px solid #199CFA!important;
        border-left: 2px solid #199CFA!important;
    }
    .wh_jiantou2 {
        border-top: 2px solid #199CFA!important;
        border-right: 2px solid #199CFA!important;
    }
</style>

<style lang="less" scoped> 
    .case-main{
        width: 100%;
        height: 100%;
    }
    .item-left {
        width: 29%;
        height: 100%;
        float: left;
        background-color: #E6F4FF;
        span{
        color:#FE7175;
        }
        p:nth-child(1){
            color: #199CFA;
            font-weight: bold;
            text-align: left;
            padding: 0 20px;
        }
        p:nth-child(3){
            color: #199CFA;
            font-weight: bold;
            text-align: left;
            padding: 0 20px;
        }
        p:nth-child(4){
            color: #199CFA;
            text-align: left;
            padding: 0 20px;
            font-size: 14px;
        }
        p:nth-child(5){
            color: #199CFA;
            text-align: left;
            padding: 0 20px;
            font-size: 14px;
        }
        .el-button--text{
            float: right;
            padding: 0;
        }
    }

    .item-right {
        width: 69%;
        height: 100%;
        float: left;
    }
    .time-box {
        width: 250px;
        float: left;
        height: 50px;
        line-height: 50px;
        img{
            vertical-align: middle;
        }
        span{
            color: #0096FA;
            font-size: 16px;
            font-weight: bold;
            margin-left: 10px;
        }
    }
    .case-box {
        list-style: none;
        float: left;
        padding: 0;
        width: 100%;
        height: 500px;
        overflow-y: scroll;
        li{
            width: 98%;
            list-style: none;
            height: auto;
            border: 1px solid #CDECFA;
            margin: 0 auto;
            padding-top: 20px;
            margin-bottom: 10px;
            position: relative;
            overflow: hidden;
            p:nth-child(2){
                text-align: left;
                padding: 0px 50px;
                color: #818181;
                font-size: 14px;
                span{
                    margin-right: 10px;
                }
            }
        }
    }
    .feature-box {
        width: 100%;
        height: 50px;
        font-size: 12px;
        margin-top: 30px;
        div{
            float: left;
            width: 70px;
            p{

            }
        }
        .feature-content{
            text-align: left;
            width: 107px;
            height: 50px;
            margin-left: 10px;
            img{
                display: block;
                float: left;
            }
        }
    }
    .button-box {
        text-align: left;
        width: 175px;
        height: 50px;
        line-height: 39px;
        margin-left: 10px;
    }
    .download-box {
        width: 80px;
        height: 40px;
        line-height: 40px;
        margin-left: 10px;
        color: #26A0FB;
        font-weight: bold;
        font-size: 14px;
        cursor: pointer;
    }
    .right-footer {
        float: left;
        width: 100%;
        height: 100px;
    }
    .title-box{
        text-align: left;
        font-size: 14px;
        color: #7F7F7F;
        span{
            margin-left: 30px;
        }
    }
    .isOpen {
        position: absolute;
        top: -15px;
        right: 0px;
    }
    /* 上下箭头按钮 */
    .icon_arrowDown{
        transition: 0.8s;
        transform-origin:center center;
        transform: rotateZ(0deg);
    }
    .icon_arrowUp{
        transition: 0.8s;
        transform-origin:center center;
        transform: rotateZ(180deg);
    }
</style>