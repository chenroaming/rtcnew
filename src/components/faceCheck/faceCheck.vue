<template>
    <div>
        <el-dialog
            title="人脸识别检测"
            :visible.sync="centerDialogVisible"
            width="550px"
            center>
            <p style="height: 50px;text-align: center;">{{noHave ? '未检测到人脸' : ''}}</p>
            <video autoplay width="500" height="300" ref="video" id="video"></video>
            <canvas id="canvas" ref="canvas" width="500" height="300" class="canvas" style="display: none;"></canvas>
            <span slot="footer" class="dialog-footer">
                <el-button @click="centerDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="submit">提 交</el-button>
            </span>
        </el-dialog>
        <!-- <video autoplay playsinline ref="video" id="video"></video>
        <canvas id="canvas" width="500" height="400" class="canvas"></canvas> -->
    </div>
</template>
<script>
    import tracking from '@/utils/tracking.js'
    import '@/utils/face-min.js'
    export default {
        name: 'faceCheck',
        data () {
            return {
                centerDialogVisible: false,
                trackerTask:null,
                noHave:true,
            }
        },
        computed:{
            change(){
                this.centerDialogVisible = true;
                return this.centerDialogVisible;
            }
        },
        watch:{
            
        },
        methods:{
            async openCamera () {
                await this.change;
                const video = this.$refs.video;
                if (navigator.getUserMedia) {//将摄像头数据流放video标签里播放
                    navigator.getUserMedia({ audio: false, video: { width: 1280, height: 720 } },
                        (stream) => {
                            video.srcObject = stream
                            video.onloadedmetadata = function (e) {
                                video.play()
                            }
                        },
                        (error) => {
                        console.log(error)
                        }
                    )
                } else {
                    console.log('getUserMedia not supported')
                }
                const tracker = new window.tracking.ObjectTracker('face')
                tracker.setStepSize(2);
                // //  转头角度影响识别率
                tracker.setEdgesDensity(0.13)
                tracker.setInitialScale(5)
                this.trackerTask = window.tracking.track('#video', tracker, {camera: true})
                tracker.on('track', (event) => {
                    if (event.data.length > 0) {
                        this.noHave = false;
                        //人脸位置矩形顶点
                        // console.log(event.data)
                    } else {
                        this.noHave = true;
                    }
                })
            },
            show(){
                this.openCamera()
            },
            submit () {
                const canvas = this.$refs.canvas;
                const context = canvas.getContext('2d')
                const video = this.$refs.video;
                context.drawImage(video, 0,0, canvas.width, canvas.height)
                const imgURL = canvas.toDataURL('image/jpeg')
                const data = {
                    file:imgURL
                }
                this.$api.user.faceRecognition(data).then(res => {
                    if(res.state == 100){
                        this.$message({
                            message:res.message,
                            type:'success'
                        })
                        this.$router.push({
                            name:'caseList'
                        })
                    }else{
                        this.$message({
                            message:res.message,
                            type:'warning'
                        })
                    }
                })     
            },
        },
        mounted () {

        },
        destroyed () {
            // // 停止侦测
            // this.trackerTask.stop()
            // // 关闭摄像头
            // window.tracking.closeCamera()
        }
    }
</script>

<style lang="less" scoped>
      
</style>