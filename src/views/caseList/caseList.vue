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
        <caseListCount v-if="canCount"></caseListCount>
        <caseListItem ref="caseListItem" v-on:rePage="rePage" v-on:getMessage="getMessage" v-on:selectItem="selectItem" v-on:submitAll="submitAll" :isShow="isShow" :nowPage="nowPage" :nowRole="nowRole"></caseListItem>
        <div class="right-footer">
            <div style="width: 200px;float: left;" v-if="isShow">
                <el-checkbox v-model="allSelect" @change="selectAll($event)" style="margin-right: 10px;">
                    全选
                </el-checkbox>
                <el-badge class="selectedBtn" :value="isSelect">
                    <el-button type="primary" @click="dialogFormVisible = true" size="small">已选择的案件</el-button>
                </el-badge>
            </div>
            <el-pagination
                @current-change="handleCurrentChange"
                :current-page.sync="currentPage"
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
                <el-button @click="handleClick(scope.row,scope.$index)" type="text" size="small">删除</el-button>
            </template>
            </el-table-column>
        </el-table>
        <div slot="footer" class="dialog-footer">
            <el-button type="warning" @click="empty">清空</el-button>
            <el-button type="primary" @click="openCourt">批量开庭</el-button>
        </div>
    </el-dialog>
    <caseListVideo ref="videos" :videoList="videoList"></caseListVideo>
    </div>
  </template>
  
  <script>
    import Calendar from 'vue-calendar-component'
    import caseListCount from '@/components/caseList/caseListCount.vue'
    import caseListVideo from '@/components/caseList/caseListVideo.vue'
    import caseListItem from '@/components/caseList/caseListItem.vue'
    export default {
    name: 'caseList',
    components: {
        Calendar,
        caseListCount,
        caseListVideo,
        caseListItem,
    },
      data(){
        return {
            time:'',
            count:3,
            selectList:[],
            allSelect:false,
            dialogFormVisible:false,
            currentPage:1,
            total:1,
            totalPage:1,
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
            videoList:[],
        }
      },
      computed:{
        isSelect(){
            return this.selectList.length;
        }
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
            this.$refs.caseListItem.search(params);
            return;
        }
        const params = {
            caseNo:'',
            pageNumber:1
        }
        this.$refs.caseListItem.search(params);
      },
      methods:{
        getMessage(e){
            this.$emit('getMessage',1);
        },
        rePage(e){
            this.totalPage = e;
            this.caseCount.total = e;
        },
        selectItem(e){
            if(e.isChoice){
                this.selectList.push(e.item);
            }else{
                for(let i in this.selectList){
                    if(e.item.caseNo == this.selectList[i].caseNo){
                        this.selectList.splice(i,1);
                    }
                }
            }
            this.allSelect = this.isSelect == e.length ? true : false;
        },
        submitAll(e){
            this.selectList = [];
            for(const item of e){
                this.selectList.push(item);
            }
        },
        selectAll(e){
            if(e){
                this.$refs.caseListItem.selectAll();
                return;
            }
            this.selectList = [];
            this.$refs.caseListItem.cancelAll();
        },
        handleClick(e,index){
            this.allSelect = false;
            this.selectList.splice(index,1);
            this.$refs.caseListItem.cancelItem(e);
        },
        empty(){
            this.selectList = [];
            this.allSelect = false;
            this.$refs.caseListItem.cancelAll();
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
            this.$refs.caseListItem.search(params);
        },
        clickDay(data) { //选中某天
            const choiceDay = data.split('/');
            this.time = choiceDay[0] + '年' + choiceDay[1] + '月' + choiceDay[2] + '日';
            const ch = '/';
            this.startDate = data.replace(new RegExp(ch,'g'),"-") + ' 00:00';
            const startDate = {
                startDate:this.startDate
            }
            this.$refs.caseListItem.search(startDate);
        },
        searchAll(){
            this.startDate = '';
            this.currentPage = 1;
            this.$refs.caseListItem.search();
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
    .right-footer {
        float: left;
        width: 100%;
        height: 100px;
    }
</style>