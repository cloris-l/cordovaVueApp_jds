<template>
<div class="diagnose-wrap">
    <div class="diagnose-main">
        <p class="mb20">近三个月电费成本降低空间</p>
        <p class="money"><span class="unit">¥</span><span class="value">{{diagnoseData.save | tenThousand}}</span>元/月</p>
        <div class="rist-wrap" v-if="diagnoseData.quality!='0,0,0'">
            <p class="title mb20">风险提示！</p>
            <p>您的站点下列电能质量指标未达国家标准，<br>存在安全生产隐患及经济损失风险！</p>
            <div class="rist-list">
                <div class="loading" v-if="diagnoseData.qualityArr.length>0&&diagnoseData.qualityArr[0]!=0">
                    电压偏差
                    <!-- <div class="left-circle"></div>
                    <div class="right-circle"></div> -->
                    <!-- <div class="progress">电压偏差</div> -->
                </div>
                <div class="loading" v-if="diagnoseData.qualityArr.length>0&&diagnoseData.qualityArr[1]!=0">
                    功率因数
                    <!-- <div class="left-circle"></div>
                    <div class="right-circle"></div> -->
                    <!-- <div class="progress">功率因数</div> -->
                </div>
                <div class="loading" v-if="diagnoseData.qualityArr.length>0&&diagnoseData.qualityArr[2]!=0">
                    谐波电压
                    <!-- <div class="left-circle"></div>
                    <div class="right-circle"></div>
                    <div class="progress">谐波电压</div> -->
                </div>
            </div>
        </div>
        <div class="rist-wrap"  v-if="diagnoseData.quality=='0,0,0'">
            <p>您的站点电能质量指标已达国家标准，<br>暂无安全生产隐患及经济损失风险。</p>
            <p class="icon"><i class="iconfont icon-xiaolian"></i></p>
        </div>
        <div class="optimiz-box">
            <div class="circle box1" @click="showPop">
                <p>能源管理</p>
                <p>优化意向</p>
                <p class="time" v-if="countdownTime>0">（{{countdownTime}}s）</p>
            </div>
            <div class="circle box2"></div>
            <div class="circle box3"></div>
        </div>
    </div>
    <footer>
        <div class="bottom"></div>
    </footer>
    <div class="pop-wrap" v-if="showForm">
        <div class="form-container">
            <p class="top"><span @click="showForm=false" class="right close">X</span></p>
            <div class="question-list">
                <div class="list" @click="choicePoint(list)" v-for="(list,index) in diagnosisPointList" :key="index">
                    <span  :class="{'on':params.attention.indexOf(list.value)>-1}">{{list.name}}</span>
                </div>
            </div>
            <div class="text">
                <textarea v-model="params.content" placeholder="请输入您的关注问题（可不填）" maxlength="50"></textarea>
                <p class="tip">最多50个字</p>
            </div>
            <div class="input-box"><input @focus="focus('name')" @blur="blur('name')" :class="{'bg-gray':nameBg}" v-model="params.name" type="text" placeholder="请输入姓名"></div>
            <div class="input-box"><input @focus="focus('phone')" @blur="blur('phone')" :class="{'bg-gray':phoneBg}" v-model="params.phone" type="text" placeholder="请输入电话"></div>
            <div class="input-box"><input @focus="focus('email')" @blur="blur('email')" :class="{'bg-gray':emailBg}" v-model="params.email" type="text" placeholder="请输入邮箱"></div>
            <p class="recomand">* 以上是您在系统预留的联系信息，可点击修改</p>
            <mt-button class="submit" @click="submitInfo" type="default" size="large">确认并提交</mt-button>
        </div>
    </div>
</div>
</template>
<script>
export default {
    data(){
        return{
            showForm:false,
            hasSubmit:false,
            params:{
                attention:[],
                content:'',
                name:Storage.get('user').username,
                phone:Storage.get('user').phone,
                email:Storage.get('user').email
            },
            diagnosisPointList:Storage.get('baseData').diagnosisPointList||[],
            countdownTime:0,
            nameBg:false,
            phoneBg:false,
            emailBg:false,
            diagnoseData:{qualityArr:[]}
        }
    },
    mounted(){
        this.nameBg = this.params.name?true:false;
        this.phoneBg = this.params.phone?true:false;
        this.emailBg = this.params.email?true:false;
        this.getData();
    },
    methods:{
        getData(){
            this.getDiagnose({siteId:Storage.get('site').value}).then(res=>{
                if(res.code==1){
                    res.data.qualityArr = res.data.quality.split(',')
                    this.diagnoseData = res.data;
                }
            })
        },
        getbaseINfo(){
            let attention = Storage.get('baseData').attention
            if(attention){
                this.params = attention;
                if(attention.attention){
                    this.params.attention = attention.attention.split(',')
                }else{
                    this.params.attention = []
                }               
            }else{
                this.params = {
                    attention:[],
                    content:'',
                    name:Storage.get('user').username,
                    phone:Storage.get('user').phone,
                    email:Storage.get('user').email
                }
            }
        },
        showPop(){
            if(this.countdownTime<=0){
                this.showForm = true;
                this.getbaseINfo();
            }
        },
        submitInfo(){
            let reg = /^[0-9\+\-]{1,20}$/;
            let reg2 = /^([a-zA-Z0-9_.-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/
            if(!this.params.content&&this.params.attention.length<0){
                Toast('请填写内容后提交！');
                return
            }
            if(!this.params.name){
                Toast('姓名不能为空');
                return
            }
            if(!reg.test(this.params.phone)){
                Toast('联系电话为20个以内的数字、+、-');
                return
            }
            if(!reg2.test(this.params.email)){
                Toast('邮箱格式不正确');
                return
            }
            let params={
                attention:this.params.attention.join(','),
                content:this.params.content,
                name:this.params.name,
                phone:this.params.phone,
                email:this.params.email
            }
            this.Optimization(params).then(res=>{
                if(res.code=='1'){
                    Toast('发送成功！您的服务商（租户名称）将尽快与您联系。')
                    this.showForm =false;
                    let baseData =  Storage.get('baseData')
                    baseData.attention = params
                    this.countdown()
                    Storage.set('baseData',baseData)
                }else{
                   Toast(res.msg) 
                }
            })
        },
        choicePoint(data){
            let index = this.params.attention.indexOf(data.value)
            if(index>-1){
                this.params.attention.splice(index,1)
            }else{
                this.params.attention.push(data.value)
            }
            
        },
        countdown(){
            this.countdownTime = 60;
            setInterval(()=>{
                this.countdownTime--;
            },1000)
        },
        focus(type){
            this[type+'Bg'] = false
        },
        blur(type){
            this[type+'Bg'] = this.params[type]?true:false
        }
    }
}
</script>

<style lang="scss">
@import "../../assets/scss/pagestyle/diagnose.scss";

</style>

