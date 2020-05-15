<template>
  <div class="step1">
    <el-form ref="form" :rules="rules" label-position="right" :inline="true" size="mini" :model="form"
      label-width="120px">
      <el-form-item label="开庭类型" style="width: 100%;" prop="courtType">
        <el-radio-group v-model="form.courtType">
          <el-radio :disabled="!isEdit" label="在线调解">在线调解</el-radio>
          <el-radio :disabled="!isEdit" label="法庭调查">法庭调查</el-radio>
          <el-radio :disabled="!isEdit" label="在线庭审">在线庭审</el-radio>
          <el-radio :disabled="!isEdit" label="听证">听证</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="案件类型" style="width: 100%;" prop="caseType">
        <el-select v-model="form.caseType" :disabled="!isEdit" placeholder="请选择" style="width:380px;">
          <el-option v-for="(item,index) in options" :key="index" :label="item.name" :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="案号" style="width: 100%;" prop="caseNo">
        <el-input :disabled="!isEdit" v-model="form.caseNo" placeholder="请输入案号" style="width:380px;"></el-input>
      </el-form-item>
      <el-form-item label="案由" style="width: 100%;" prop="caseReason">
        <el-select :disabled="!isEdit" filterable v-model="form.caseReason" placeholder="请选择" style="width:380px;">
          <el-option v-for="(item,index) in options2" :key="index" :label="item.name" :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="开庭日期" style="width: 100%;" prop="openTime">
        <el-date-picker v-model="form.openTime" format="yyyy-MM-dd HH:mm" value-format="yyyy-MM-dd HH:mm"
          type="datetime" placeholder="选择日期时间" :disabled="!isEdit" style="width:380px;">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="法官" style="width: 45%;" prop="judge">
        <el-select :disabled="!isEdit" v-model="form.judge" placeholder="请选择" style="width:100px;">
          <el-option v-for="(item,index) in judgeList" :key="index" :label="item.name" :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="书记员" style="width: 42%;" prop="clerk">
        <el-select :disabled="!isEdit" v-model="form.clerk" placeholder="请选择" style="width:110px;">
          <el-option v-for="(item,index) in clerkList" :key="index" :label="item.name" :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="人民陪审员" style="width: 100%;" prop="juror">
        <el-select :disabled="!isEdit" v-model="form.juror" value-key="id" multiple placeholder="请选择"
          style="width:380px;">
          <el-option v-for="(item,index) in jurorList" :key="index" :label="item.name" :value="item">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="起诉状">
        <div style="width:380px;">
          <input type="file" @change="getFiles" ref="upFile" style="display: none;">
          <el-button type="primary" @click="upFile" v-if="isEdit">点击选择文件</el-button>
          <div style="height: 50px;overflow-y: scroll;width: 350px;" v-show="filesList.length > 0">
            <p v-for="(item,index) in filesList">
              <span>{{item.name}}</span>
              <el-button type="text" v-if="isEdit" @click="delFile(index,item.id)">删除</el-button>
              <el-button type="text" @click="showFile(item)">查看</el-button>
            </p>
          </div>
        </div>
      </el-form-item>
    </el-form>
    <showFile ref="toFile" :fileItem="fileItem"></showFile>
  </div>
</template>

<script>
  import showFile from '@/components/addCase/showFile.vue'
  export default {
    name: 'addCaseStep1',
    props: {
      nextStr: String,
    },
    components: {
      showFile
    },
    data() {
      return {
        fileItem: {},
        options: [
          { name: '民事一审', id: '民事一审' },
          { name: '民事二审', id: '民事二审' },
          { name: '申诉', id: '申诉' },
          { name: '民事再审', id: '民事再审' },
          { name: '其他', id: '其他' }
        ],
        options2: [],
        judgeList: [],
        clerkList: [],
        jurorList: [],
        form: {
          courtType: '在线调解',
          caseType: '',
          caseNo: '',
          caseReason: '',
          openTime: '',
          judge: '',
          clerk: '',
          juror: '',
        },
        filesList: [],
        rules: {
          caseType: [{ required: true, message: '请选择案件类型', trigger: 'change' }],
          caseNo: [{ required: true, message: '请输入案号', trigger: 'change' }],
          caseReason: [{ required: true, message: '请选择案由', trigger: 'change' }],
          openTime: [{ required: true, message: '请选择开庭时间', trigger: 'change' }],
          judge: [{ required: true, message: '请选择法官', trigger: 'change' }],
          clerk: [{ required: true, message: '请选择书记员', trigger: 'change' }],
          // juror:[{required: true, message: '请选择陪审员', trigger: 'change'}],
        },
        indictmentId: '',//证据id
        isEdit: false,
      }
    },
    computed: {
      getId() {
        return this.lawCaseId;
      }
    },
    watch: {
      getId(curval, oldVal) {
        this.lawCaseId = curval;
        this.getCaseDetail();
      }
    },
    mounted() {
      this.isEdit = this.$store.getters.getEditStatus;
      if (this.$store.getters.getCaseId) {
        this.lawCaseId = this.$store.getters.getCaseId;
        this.getCaseDetail();
      }
      if (this.isEdit) {
        this.$api.addCase.getJudgeBriefCourt().then(res => {
          const { briefList, judgeList, clerkList, jurorList } = res;
          this.options2 = briefList;
          this.judgeList = judgeList;
          this.clerkList = clerkList;
          this.jurorList = jurorList;
        })
      }
    },
    methods: {
      submit() {//提交案件信息或者修改案件信息
        if (!this.isEdit) {
          this.$emit('listenToChildEvent', 2);
          return;
        }
        this.$refs['form'].validate((valid) => {
          if (valid) {
            const arr = [];
            if (this.form.juror.length > 0) {
              for (const item of this.form.juror) {
                arr.push(item.id)
              }
            }
            const { caseType, caseReason, courtType, caseNo, judge, clerk, openTime } = this.form;
            const data = { caseType: caseType, briefId: caseReason, trialType: courtType, caseNo: caseNo, judgeId: judge, clerkId: clerk, openDate: openTime, lawCaseId: '', jurorId: arr.join(',') }
            if (!this.lawCaseId) {
              this.$api.addCase.addLawCase(data).then(res => {
                if (res.state == 100) {
                  this.lawCaseId = res.id;
                  this.$store.dispatch('setCaseId', res.id);
                  if (this.filesList.length > 0) {
                    const fileData = {
                      file: this.filesList,
                      name: '起诉状',
                      type: 2,
                      lawCaseId: this.lawCaseId
                    }
                    this.$store.dispatch('setCaseType', this.form.caseType);
                    this.$api.addCase.addIndictment(fileData).then(res => {
                      if (res.state == 100) {
                        this.goWhere();
                      }
                    })
                    return;
                  }
                  this.goWhere();
                }
              })
            } else {
              data.lawCaseId = this.lawCaseId;
              const exchange = new Date(data.openDate);
              data.openDate = `${exchange.getFullYear()}-${(exchange.getMonth() + 1)}-${exchange.getDate()} ${exchange.getHours()}:${exchange.getMinutes()}`;
              this.$api.addCase.updateLawCase(data).then(res => {
                if (res.state == 100) {
                  this.lawCaseId = res.id;
                  this.$store.dispatch('setCaseId', res.id);
                  this.$store.dispatch('setCaseType', this.form.caseType);
                  if (this.indictmentId) {
                    const fileData = {
                      file: this.filesList,
                      evidenceId: this.indictmentId,
                      lawCaseId: this.lawCaseId
                    }
                    this.$api.addCase.updateIndictment(fileData).then(res => {
                      if (res.state == 100) {
                        this.goWhere();
                      }
                    })
                    return;
                  } else {
                    if (this.filesList.length > 0) {
                      const fileData = {
                        file: this.filesList,
                        name: '起诉状',
                        type: 2,
                        lawCaseId: this.lawCaseId
                      }
                      this.$api.addCase.addIndictment(fileData).then(res => {
                        if (res.state == 100) {
                          this.goWhere();
                        }
                      })
                      return;
                    }
                  }
                  this.goWhere();
                }
              })
            }
          } else {
            this.$message.warning('请确保选项填写完整！');
            return false;
          }
        });
      },
      upFile() {//获取文件按钮点击事件
        const button = this.$refs.upFile;
        button.value = '';
        button.click();
      },
      getFiles(e) {//获取文件
        this.filesList.push(e.target.files[0]);
      },
      delFile(index, id) {//删除文件
        if (id) {
          const data = {
            fileId: id
          }
          this.$api.addCase.delFile(data).then(res => {
            if (res.state == 100) {
              this.filesList.splice(index, 1);
            }
          })
        } else {
          this.filesList.splice(index, 1);
        }
      },
      getCaseDetail() {//获取案件详情
        const data = {
          lawCaseId: this.lawCaseId
        }
        this.$api.caseList.getCaseDetail(data).then(res => {
          if (res.state == 100) {
            const { caesType, brief, trialType, caseNo, judge, clerk, jurors } = res.lawCase;
            this.form = {
              caseType: caesType,
              caseReason: this.isEdit ? brief.id : brief.name,
              courtType: trialType,
              caseNo: caseNo,
              judge: this.isEdit ? judge.id : judge.name,
              clerk: this.isEdit ? clerk.id : clerk.name,
              openTime: new Date(res.openDate),
              juror: []
            }
            if (jurors.length > 0 && this.isEdit) {
              this.form.juror.push(...jurors.map(item => item))
            }
            if (jurors.length > 0 && !this.isEdit) {
              this.form.juror.push(...jurors.map(item => item.name))
            }
            if (res.indictment.length > 0 && res.indictment[res.indictment.length - 1].filePaths.length > 0) {
              this.filesList = res.indictment[res.indictment.length - 1].filePaths;
              this.indictmentId = res.indictment[res.indictment.length - 1].id;
            }
          }
        })
      },
      showFile(item) {
        this.fileItem = item;
        this.$refs.toFile.showEvidence();
      },
      goWhere() {//判断是否进行下一步还是直接返回案件列表页
        if (this.nextStr == 'next') {
          this.$emit('listenToChildEvent', 2);
        } else {
          this.$emit('listenToChildEvent', 4);
        }
      },
    }
  }
</script>

<style lang="less" scoped>
  .step1 {
    width: 50%;
    margin: 0 auto;
  }
</style>