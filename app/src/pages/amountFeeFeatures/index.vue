<template>
    <div class="amoutFF-wrap">
        <h4 class="title fn-clear">
            <div class="base-select left" @click="showSelect('typeList')">
                <span>{{typeList.selectVal.name}}</span>
                <div class="arrow"><i class="iconfont icon-left"></i></div>
            </div>
            <span class="right">{{nowDate}}</span>
        </h4>
        <div class="com-content mt10 mb10 amoutFF-content">
            <div class="tab-wrap fn-clear base-bd">
                <span class="col-2" @click="tabChangeSwiper(0)" :class="{'on':!indexSwiper}">本月</span>
                <span class="col-2" @click="tabChangeSwiper(1)" :class="{'on':indexSwiper}">历史</span>
                <em class="line col-2" :class="{'left50':indexSwiper}"></em>
            </div>
            <swiper class="com-content mt10 mb10 amoutFF-content" :options="swiperOption" ref="mySwiper">
                <swiper-slide>
                    <!--本月统计-->
                    <div class="total-wrap fn-clear com-padding">
                        <div class="item fn-clear">
                            <!-- <span class="left icon">
                                <i class="iconfont icon-zongdianfei"></i>
                            </span> -->
                            <div class="detail">
                                <p class="sub-title icon"><i class="iconfont icon-zongdianfei"></i>本月累计电费</p>
                                <p class="info base-value"><span class="value big">{{nowData.eleFeeMonth | tenThousand}}</span> 元
                                <i class="iconfont icon-jiantou" :class="[(nowData.map&&nowData.map.lastMonthFee<0) ? 'down' : 'up']"></i>
                                </p>
                            </div>
                        </div>
                        <div class="item fn-clear pl15">
                            <!-- <span class="left icon">
                                <i class="iconfont icon-dian"></i>
                            </span> -->
                            <div class="detail">
                                <p class="sub-title icon"><i class="iconfont icon-dian"></i>本月累计电量</p>
                                <p class="info base-value"><span class="value big">{{nowData.eleMonth | tenThousand}}</span> kWh
                                    <i class="iconfont icon-jiantou" :class="[(nowData.map&&nowData.map.lastMonthEle<0) ? 'down' : 'up']"></i>
                                </p>
                            </div>
                        </div>
                    </div>
                    <div class="com-padding">
                        <div class="button-tab fn-clear mt10">
                            <span v-if="typeList.selectVal.id!=1" class="item" @click="active='baseFee'" :class="{'on':active=='baseFee'}">基本电费</span>
                            <span class="item" @click="changeFeeType('eleFee')"  :class="{'on':active=='eleFee'}">电度电费</span>
                            <span v-if="typeList.selectVal.isforce" class="item" @click="active='forceFee'" :class="{'on':active=='forceFee'}">力调电费</span>
                        </div>
                    </div>
                    <mt-tab-container v-model="active" class="detail-wrap">
                        <!--本月基本电费-->
                        <mt-tab-container-item id="baseFee">                    
                            <div class="now-info fn-clear">
                                <div class="item">
                                    <p class="sub-title">全月基本电费</p>
                                    <p class="mt10  base-value"><span class="value">{{nowData.baseFee | tenThousand}}</span> 元</p>
                                </div>
                                <div class="item">
                                    <p class="sub-title">最大需量</p>
                                    <p class="mt10  base-value"><span class="value">{{nowData.maxQuota | tenThousand}}</span> kW</p>
                                </div>
                                <div class="item">
                                    <p class="sub-title">本月申报量
                                        <em v-if="nowData.capContractName&&nowData.capContractName.indexOf('需量')>-1">需</em>
                                        <em v-if="nowData.capContractName&&nowData.capContractName.indexOf('容量')>-1">容</em>
                                    </p>
                                    <p class="mt10  base-value">
                                        <span class="value">{{nowData.capContract||'-'}}</span> 
                                        <em v-if="nowData.capContractName&&nowData.capContractName.indexOf('需量')>-1">kW</em>
                                        <em v-if="nowData.capContractName&&nowData.capContractName.indexOf('容量')>-1">kVA</em>
                                    </p>
                                </div>
                            </div>
                            <div class="tip mt20" v-if="nowData.capContractName&&nowData.capContractName.indexOf('容量')<=-1">
                                <p v-if="nowData.fine"><i class="iconfont icon-kulian"></i>本月已产生基本电费罚款<span>{{nowData.fine | tenThousand}}</span>元</p>
                                <p v-if="!nowData.fine"><i class="iconfont icon-xiaolian"></i>本月尚未产生基本电费罚款</p>
                            </div>
                            <div id="baseFeeEcharts" class="echarts"></div>
                        </mt-tab-container-item>
                        <!--本月电度电费-->
                        <mt-tab-container-item id="eleFee">
                            <div class="eleFee-wrap">
                                <div class="info" :class="{'noTime':typeList.selectVal.istime==0}">
                                    <p class="sub-title">累计电度电费</p>
                                    <p class="base-value"><span class="value big">{{nowData.eleFeeSum | tenThousand}}</span>元</p>
                                </div>
                                <div id="nowElefee"  v-if="typeList.selectVal.istime==1" class="eleFee-echarts"></div>
                            </div>
                        </mt-tab-container-item>
                        <!--本月力调电费-->
                        <mt-tab-container-item id="forceFee">
                            <div class="force-wrap">
                                <div class="fn-clear mb20">
                                
                                    <p>当前功率因数</p>
                                    <div class="col-2 left mt10">
                                        <p v-for="(list,index) in nowData.factorsArr" :key="index"><span class="device-tlt">{{list[0]}}  </span><span class="rate">{{list[1]}}</span></p>
                                    </div>
                                    <div class="col-2 left">
                                        <p class="statu-icon"><i class="iconfont icon-xiaolian" :class="{'icon-kulian':nowData.noFine}"></i></p>
                                    </div>
                                </div>
                                <!-- <p class="rate">{{nowData.factor}}</p> -->
                                <p class="fee" v-if="!nowData.noFine">无力调电费罚款风险</p>
                                <p class="fee" v-if="nowData.noFine" :class="{'red':nowData.factorFine!='0.00'}">有力调电费罚款风险</p>
                            </div>
                        </mt-tab-container-item>
                    </mt-tab-container>
                </swiper-slide>
                <swiper-slide class="history-container">
                    <div class="button-tab fn-clear">
                        <span class="item" @click="showSelect('oneMonth')" :class="{'on':historyType=='oneMonth'}">{{oneMonth.selectVal.name}}<em class="arrow"><i class="iconfont icon-left"></i></em></span>
                        <span class="item" @click="historyType='sixMonth'"  :class="{'on':historyType=='sixMonth'}">过去六个月累计</span>
                    </div>
                    <mt-tab-container v-model="historyType">
                        <!--查看历史某一个月-->
                        <mt-tab-container-item id="oneMonth">
                            <div class="single-month">
                                <div class="fee-wrap">
                                    <div class="fee-left">
                                        <p class="sub-title">总电费</p>
                                        <p class="base-value"><span class="value big">{{historySingle.allFeeSum | tenThousand}}</span> 元</p>
                                    </div>
                                    <div class="fee-right">
                                        <p v-if="typeList.selectVal.id!=1">基本电费<span class="base-value"><span class="value ml20">{{historySingle.baseFeeSum | tenThousand}}</span>元</span><span class="percentage">{{historySingle.basePer}}%</span></p>
                                        <p :class="{'noBase':typeList.selectVal.id==1}">电度电费<span class="base-value"><span class="value ml20">{{historySingle.eleFeeSum | tenThousand}}</span>元</span><span class="percentage">{{historySingle.elePer}}%</span></p>
                                        <p :class="{'noBase':typeList.selectVal.id==1}">力调电费<span class="base-value"><span class="value ml20">{{historySingle.forceFeeSum | tenThousand}}</span>元</span><span class="percentage">{{historySingle.forcePer}}%</span></p>
                                    </div>
                                </div>
                                <div class="eleFee-wrap">
                                    <div class="info history">
                                        <p class="sub-title">平均单价</p>
                                        <p class="base-value mb20"><span class="value big">{{historySingle.allFee}}</span>元/kWh</p>
                                        <p class="sub-title">用电量</p>
                                        <p class="base-value"><span class="value big">{{historySingle.eleNum | tenThousand}}</span>kWh</p>
                                    </div>
                                    <div class="eleFee-echarts" id="monthSingle"></div>
                                </div>
                            </div>
                        </mt-tab-container-item>
                        <!--查看过去6个月累计-->
                        <mt-tab-container-item id="sixMonth"> 
                            <div class="total-month">
                                <div class="echarts" id="hisEchart"></div>
                                <div class="list-wrap">
                                    <div class="name item">
                                        <span>&nbsp;</span>
                                        <span v-for="(list,index) in beforeMonthArr" :key="index">{{list}}月</span>
                                    </div>
                                    <div class="value item">
                                        <span>月平均单价<br>(元/kWh)</span>
                                        <span v-for="(list,index) in historyData.dataList" :key="index">{{list.allFee||'-'}}</span>
                                    </div>
                                </div>
                            </div> 
                        </mt-tab-container-item>
                    </mt-tab-container>
                </swiper-slide>
            </swiper>
        </div>
        
        <app-select :objData.sync="pointObj"></app-select>
    </div>
</template>
<script>

import echarts from "echarts";
let activeIndex;
export default {
    data(){
        return{
            swiperOption: {
                pagination: {
                    el: '.swiper-pagination',
                    type:'custom',
                    //  bulletActiveClass: 'my-bullet-active',
                },
                on:{
                    transitionEnd: ()=>{
                       this.changeSlider()  
                    }
                }
            },
            indexSwiper:0,//本月与历史切换
            active:'baseFee',//本月中，基本电费、电度电费、力调电费切换
            pointObj:{
                selectVal:{},
                showPop:false,
                optionList:[]
            },//底部选择弹出框组件传值数据
            historyType:'sixMonth',//历史中，累计6月与单月切换
            nowDate:'',
            nowData:{},//本月所有数据
            historyData:{},//历史所有数据
            typeList:{selectVal:{},data:[]},
            oneMonth:{selectVal:{},data:[]},//过去6个月数组
            historyParams:{
                startTime:'',
                endTime:''
            },//获取历史数据的参数
            historySingle:{},//历史某个月数据
            dayArr:[],//本月截止到当天
            siteId:Storage.get("site")&&Storage.get("site").value?Storage.get("site").value:'',
            beforeMonthArr : Common.getMonthbeforeNow(6),
            maxQuotaOfDay:0
        }
    },
    watch:{
        indexSwiper:{
            handler(){
                if(this.indexSwiper){
                    setTimeout(()=>{
                        this.getHistoryData();
                        
                    },200)
                }
            }
        },
        pointObj:{
            handler(){
                if(this.pointObj.optionList==this.oneMonth.data){
                   this.oneMonth.selectVal = this.pointObj.selectVal;
                   this.historyParams.startTime = this.pointObj.selectVal.id;
                   this.historyParams.endTime = this.pointObj.selectVal.id;
                   this.getHistoryData(true);
                }else{
                    this.typeList.selectVal = this.pointObj.selectVal;
                    this.getNowData();
                    if(this.historyType=='sixMonth'){
                        this.getHistoryData();
                    }else{
                        this.getHistoryData(true);
                    }
                    
                    if(this.typeList.selectVal.id==1){
                        this.active="eleFee"
                    }else{
                        this.active='baseFee'
                    }
                }
            },
            deep:true
        }
    },
    computed: {
      swiper() {
        return this.$refs.mySwiper.swiper
      }
    },
    created(){
        
    },
    mounted(){
        this.baseDate();
        this.nowDate = this.dayjs().format('YYYY年MM月')
        this.getFeePoint().then(()=>{
            this.getNowData();
            
        })        
        /*---初始化历史6个月数组--- */
        let arr = Common.getMonthbeforeNow(6,true).reverse()
        for(let i=0;i<arr.length;i++){
            this.oneMonth.data.push({name:arr[i],id:arr[i]})
        }
        /*---初始化当月的日期数组---- */
        this.oneMonth.selectVal = this.oneMonth.data[0];  
        let day = this.dayjs().date();
        for(let i=1;i<parseInt(day);i++){
            this.dayArr.push(i)
        }
    },
    methods:{
        /*滑动来切换本月和历史 */
        changeSlider(){
            this.indexSwiper = this.swiper.activeIndex;
        },
        /*--------根据站点查计费点------- */
        getFeePoint(){
           return new Promise((resolve, reject) => {
                this.getPackFee({siteId:Storage.get("site").value}).then(res=>{
                if(res.code==1){
                    if(res.data.datelist.length>0){
                        res.data.datelist.forEach(item=>{
                            item.id = Number(item.electype)
                            item.name = item.pointName;
                        })
                        this.typeList={
                            data:res.data.datelist,
                            selectVal:res.data.datelist[0]
                        }
                        if(this.typeList.selectVal.id==1){
                            setTimeout(()=>{
                                this.changeFeeType('eleFee')
                            },200)
                        }
                    }
                }
                resolve()
            })
            })
            
        },
        /*---获取基本信息---- */
        baseDate(){
            let params={
                level:Storage.get('user').level
            }
            this.baseDateLoad(params).then(res=>{
                if(res.code==1){
                    res.data.eventLevel = {}
                    res.data.eventLevelList.forEach(item=>{
                        res.data.eventLevel[item.value] = item.name;
                    })
                    Storage.set('baseData',res.data)
                }
            })
        },
        /*----获取本月数据---- */
        getNowData(){
            let params = {
                time:this.dayjs().format('YYYY-MM-DD'),
                siteId:this.siteId,
                type:'2',
                pointId:this.typeList.selectVal.billingId
            }
            this.nowElwAndFee(params).then(res=>{
                this.maxQuotaOfDay = 0;
                if(res.code==1){
                    this.nowData = res.data;
                    let arr = res.data.capacityContract?res.data.capacityContract.split(':'):''
                    this.nowData.capContractName = arr[0];
                    this.nowData.capContract = arr[1];
                    this.nowData.maxQuotaList=[],this.nowData.capacityContract =[],this.nowData.xAxis =[];
                    if(this.nowData.dataList.length>0){
                        let firstTime = this.dayjs(this.nowData.dataList[0].dateTime).date();
                        this.maxQuotaOfDay = Math.max.apply(Math, this.nowData.dataList.map(function(o) {return o.maxQuota}))
                        for(let i=0;i<this.nowData.dataList.length;i++){
                            // if(firstTime!=){}
                            if(this.maxQuotaOfDay>=900000){
                                this.nowData.dataList[i].maxQuota = this.nowData.dataList[i].maxQuota/10000;
                                this.nowData.dataList[i].capacityContract = this.nowData.dataList[i].capacityContract/10000;
                            }
                            this.nowData.maxQuotaList.push(this.nowData.dataList[i].maxQuota);
                            this.nowData.capacityContract.push(this.nowData.dataList[i].capacityContract)
                            let dd = this.nowData.dataList[i].dateTime.split('-');
                            let time = this.nowData.dataList[i].dateTime;
                            this.nowData.xAxis.push(parseInt(dd[2]))
                        }  
                    }
                    this.nowData.factorsArr =  res.data.factors? res.data.factors.split(','):[];
                    this.nowData.noFine = false;
                    if(this.nowData.factorsArr.length>0){
                        for(let i = 0;i<this.nowData.factorsArr.length;i++){
                            this.nowData.factorsArr[i] = this.nowData.factorsArr[i].split(':')
                            if(this.nowData.factorsArr[i][1]&&this.nowData.factorsArr[i][1]<this.nowData.factorFine){
                                this.nowData.noFine =true
                            }
                        }
                    }   
                    if(this.active=='baseFee'){
                        this.initEchart();
                    }else if(this.active=='eleFee'){
                        this.changeFeeType('eleFee')
                    }
                    
                }
            })
        },
        /*----获取历史数据---- */
        getHistoryData(month){
            let startTime = Common.getMonthbeforeNow(6,true)[0];
            let endTime = Common.getMonthbeforeNow(6,true)[5];
            let params={
                startTime:startTime,
                endTime:endTime,
                siteId:this.siteId,
                pointId:this.typeList.selectVal.billingId
            }
            if(month){
                params.startTime = this.historyParams.startTime;
                params.endTime = this.historyParams.endTime;
            }
            this.allEleAndFeeList(params).then(res=>{
                if(res.code==1){
                    if(month){//历史某一个月
                        this.historySingle = {};
                        let obj= {
                                id:'monthSingle'
                            }
                        if(res.data.dataList.length>0){
                            this.historySingle = res.data.dataList[0]||{};
                            this.historySingle.basePer = (this.historySingle.baseFeeSum/this.historySingle.allFeeSum*100).toFixed(2);
                            this.historySingle.elePer = (this.historySingle.eleFeeSum/this.historySingle.allFeeSum*100).toFixed(2)
                            this.historySingle.forcePer = (this.historySingle.forceFeeSum/this.historySingle.allFeeSum*100).toFixed(2)
                            obj.peak=this.historySingle.elePeak,
                            obj.flat=this.historySingle.eleFlat,
                            obj.valley=this.historySingle.eleValley                         
                            this.inintPie(obj)
                        }else{
                            this.inintPie(obj)
                        }
                    }else{//6个月累计
                        this.historyData = res.data;
                        this.historyData.eleFeeSum = [],this.historyData.eleNum=[]
                        if(this.historyData.dataList.length>0){
                            let prevTime = startTime;
                            for(let i=0;i<this.historyData.dataList.length;i++){
                                let differNum = Common.getMonthbetweenNum(prevTime , this.historyData.dataList[i].dateTime)
                                if (differNum != 0 && prevTime == startTime && i==0) {
                                    this.historyData.dataList.unshift({allFee:''})
                                }
                                if (differNum > 1) {
                                    for (let n = 0; n < differNum - 1; n++) {
                                        this.historyData.dataList.unshift({allFee:''})
                                    }
                                }
                                prevTime = res.data.dataList[i].dateTime;
                                this.historyData.eleNum.push((this.historyData.dataList[i].eleNum/10000).toFixed(2))
                                this.historyData.eleFeeSum.push((this.historyData.dataList[i].allFeeSum/10000).toFixed(2))
                            }
                        }
                        this.initHisEchart()
                    }

                }
            })
        },
        /*----初始化本月基本电费折线图----- */
        initEchart(){
            let $this= this;
            let myechart = echarts.init(document.getElementById("baseFeeEcharts"));
            let unit = this.maxQuotaOfDay>=900000?'万kW':'kW'
            let series = [
                {
                    name: '日最大需量',
                    type: "line",
                    // showSymbol: false,
                    symbolSize:4,
                    data: $this.nowData.maxQuotaList
                },
            ]
            if(this.nowData.capContractName&&this.nowData.capContractName.indexOf('需量')>-1){
                series.push(
                    {
                        name: '本月申报量',
                        type: "line",
                        symbolSize:4,
                        // showSymbol: false,
                        data: $this.nowData.capacityContract
                    }
                )
            }
            let option = {
                tooltip: {
                    trigger: 'axis'
                },
                legend: {
                    bottom: 0,
                    data:['日最大需量','本月申报量']
                },
                grid: {
                    right: '3%',
                    left: '15%',
                    bottom:'25%',
                    top:'20%'
                },
                color:['#13b5b1','#f4a41e'],
                xAxis: {
                    type: 'category',
                    boundaryGap: false,
                    data: $this.nowData.xAxis,
                    axisLine: {
                        lineStyle: {
                            color: '#d9d9d9'
                        }
                    },
                    itemStyle: {
                        normal: {
                            color: '#9e9e9e'
                        }
                    },
                },
                yAxis: [{
                    name:unit,
                    nameTextStyle:{
                        color:'#dfdfdf'
                    },
                    type: "value",
                    axisLabel: {                        
                        textStyle: {
                            color: "#dfdfdf"
                        }
                    },
                    axisLine: {
                        show:false, 
                    },
                    axisTick:{show:false},
                    splitLine: {
                        lineStyle: {
                            type: "solid"
                        }
                    }
                }],
                series: series
            };
            myechart.setOption(option)
        },
        /*----初始化峰谷平饼图----- */
        inintPie(obj){
            let myechart = echarts.init(document.getElementById(obj.id));
            let option={
                title:{
                    text:'分时电量',
                    textStyle:{
                        color:'#546a79',
                        fontSize:'18',
                        fontWeight:'nomal'
                    }
                },
                tooltip: {
                    trigger: 'item',
                    formatter: function(params){
                        let tool = ''
                        if(params.value>10000){
                            tool = `${params.name}：${(params.value/10000).toFixed(2)}万kWh`
                        }else{
                            tool = `${params.name}：${params.value.toFixed(2)}kWh`
                        }
                        return tool
                    }
                },
                legend: {
                    left:'center',
                    bottom:0,
                    data:['峰','平','谷']
                },
                color:['#f39800','#3a8dda','#4ada8b'],
                series: [
                    {
                        name:obj.name,
                        type:'pie',
                        radius: ['15%', '30%'],
                        // avoidLabelOverlap: false,
                        label: {
                            normal: {
                                formatter:'{d}%',
                                lineHeight:30,
                                // position: 'center'
                            },
                            emphasis: {
                                show: true,
                                textStyle: {
                                    // fontSize: '20',
                                    // fontWeight: 'bold'
                                }
                            }
                        },
                        labelLine: {
                            normal: {
                                show: false
                            }
                        },
                        data:[
                            {name:'峰',value:obj.peak},
                            {name:'平',value:obj.flat},
                            {name:'谷',value:obj.valley}
                        ]
                    }
                ]
            }
            myechart.setOption(option)
        },
        /*---初始化历史——累计6个月图表---- */
        initHisEchart(){
            let hisEchart = echarts.init(document.getElementById('hisEchart'));
            let option = {
                tooltip: {
                    trigger: 'axis',
                },
                grid: {
                    right: '15%',
                    left: '15%',
                    bottom:'25%',
                    top:'20%'
                },
                legend: {
                    data: ['用电量','电费'],
                    bottom: 0,
                    textStyle: {
                        color: '#353535'
                    },
                },
                xAxis: {
                    type: 'category',
                    boundaryGap: false,
                    data: Common.getMonthbeforeNow(6),
                    itemStyle: {
                        normal: {
                            color: '#9e9e9e'
                        }
                    },
                    axisLine: {
                        lineStyle: {
                            color: '#d9d9d9'
                        }
                    },
                },
                color:['#fecc66','#3a8dda'],
                yAxis: [
                    {
                    name:'万元',
                    nameTextStyle:{
                        color:'#fecc66'
                    },
                    type: "value",
                    axisLabel: {                        
                        textStyle: {
                            color: "#fecc66"
                        }
                    },
                    axisLine: {
                        show:false, 
                    },
                    axisTick:{show:false},
                    splitLine: {
                        lineStyle: {
                            type: "solid",
                            color:'#fecc66'
                        }
                    }
                },
                {
                    name:'万kW',
                    nameTextStyle:{
                        color:'#3a8dda'
                    },
                    type: "value",
                    position:'right',
                    axisLabel: {                        
                        textStyle: {
                            color: "#3a8dda"
                        }
                    },
                    axisLine: {
                        show:false, 
                    },
                    axisTick:{show:false},
                    splitLine: {
                        lineStyle: {
                            type: "solid",
                            color:'#3a8dda'
                        }
                    }
                }
                ],
                series:[
                    {
						name: '电费',
                        type: "line",
                        symbolSize:5,
						data: this.historyData.eleFeeSum||[]
                    },
                    {
						name: '用电量',
                        type: "bar",
                        barWidth:'20%',
                        yAxisIndex:1,
						data: this.historyData.eleNum||[]
                    },
                ]
            }
            hisEchart.setOption(option)
        },
        /*---显示本月——电度电费----- */
        changeFeeType(type){
            this.active = type;         
            if(this.typeList.selectVal.istime==0)return; //不分时，没有峰谷平
            let obj = {
                id:'nowElefee',
                name:'',
                peak:this.nowData.peakEle,
                flat:this.nowData.flatEle,
                valley:this.nowData.valleyEle
            }
            setTimeout(() => {
                this.inintPie(obj)
            }, 200);
        },
        /*---显示底部选择框----- */
        showSelect(type){
            if(type=='oneMonth'){
                this.historyType=type;
                this.historyParams.startTime = this.oneMonth.selectVal.id;
                this.historyParams.endTime = this.oneMonth.selectVal.id;
                this.getHistoryData(true)
            }
            this.pointObj={
                selectVal:this[type].selectVal,
                showPop:true,
                optionList:this[type].data
            }
        },
        tabChangeSwiper(index){
            this.indexSwiper = index;
            this.swiper.slideTo(index, 1000, false);
        }
    }
}
</script>

<style lang="scss">
@import '../../assets/scss/pagestyle/amoutFF.scss';

</style>