<template>
    <div class="dynamic-wrap">
        <div class="no-bd-select fn-clear" @click="changeDevice"><span>{{selectPoint.name}}</span><i class="iconfont icon-left"></i></div>
        <div class="item-list">
            <div class="item" v-for="(point,index) in points" @click="choicePoint(point)" :key="index">
                <div class="con device" :class="{'on':pointArr==point[0]+','+point[1]}">{{point[2]}}</div>
            </div>
        </div>
        <div class="item-list mb20 current">
            <div class="item" v-for="(current,index) in currentArr" :key="index">
                <div class="con" :class="'bg'+(index+1)">
                    <p>{{current.name}}</p>
                    <p><span class="value">{{current.value}}{{unit}}</span> </p>
                </div>                
            </div>
        </div>
        <div class="no-bd-select fn-clear" @click="openDate"><span>{{dayjs(pickerValue).format('YYYY-MM-DD')}}</span><i class="iconfont icon-left"></i></div>
        <div id="echart"></div>

        <app-select :objData.sync="pointObj"></app-select>
        <mt-datetime-picker
        ref="picker"
        type="date"
        v-model="pickerValue"
        year-format="{value} 年"
        month-format="{value} 月"
        date-format="{value} 日"
        :endDate="endDate"
        @confirm="handleChange">
        </mt-datetime-picker>
    </div>
</template>
<script>
import echarts from "echarts";
export default {
    data(){
        return{
            nowDate:this.dayjs().format('YYYY-MM-DD'),
            pointObj:{
                selectVal:{},
                showPop:false,
                optionList:[]
            },
            deviceList:{selectVal:{name:'1#低压总线',id:1},data:[{name:'1#低压总线',id:1},{name:'2#变压器',id:2},{name:'测试配电柜1温度',id:3}]},
            // dateList:{
            //     selectVal:(Common.getWeekArr(7).reverse())[0],
            //     data:Common.getWeekArr(7).reverse()
            // },
            showSel:false,//是否显示底部选择
            points:[],//站点的参数
            params:{
                showTypeArr:'',
                type:2,
                date:(Common.getWeekArr(7).reverse())[0].id,
                isApp:1
            },
            pointArr:'',//选择的参数
            currentArr:[],
            showtypePointList:Storage.get('baseData').showtypePointList,
            unit:'',
            time:'',
            pickerValue:new Date(),
            endDate:new Date(),
            selectPoint:''
        }
    },
    watch:{
        pointObj:{
            handler(){
                // if(this.pointObj.optionList==this.dateList.data){
                //     this.dateList.selectVal = this.pointObj.selectVal;
                //     this.params.date = this.dateList.selectVal.id;
                //     this.getData();
                // }else{
                //     this.deviceList.selectVal = this.pointObj.selectVal;
                // }
                this.deviceList.selectVal = this.pointObj.selectVal;
            },
            deep:true
        },
        selectPoint:{
            handler(){
                this.points = [];
                if(this.selectPoint.pointArr){
                    let arr = this.selectPoint.pointArr.split('#').slice(1);
                    for(let i =0;i<arr.length;i++){
                        let newArr = arr[i].split(',')
                        this.showtypePointList.forEach(item=>{
                            if(item.showTypeId==newArr[1]){
                                if (item.showTypeName=='视在功率')
                                {
                                    item.showTypeName='负载率'
                                }
                                this.points.push([newArr[0],newArr[1],item.showTypeName])
                            }
                        })
                    }
                    // let sec = this.points[1]?`${this.points[1][0]},${this.points[1][1]}`:''
                    this.pointArr = `${this.points[0][0]},${this.points[0][1]}`
                    this.params.showTypeArr = this.pointArr;                    
                    this.getData();
                }
            },
            deep:true
        }
    },
    mounted(){
       if(Storage.get('deviceD',true)){
            this.selectPoint = Storage.get('deviceD',true)
        }else{
            this.getDevice();
        }
        
    },
    methods:{
        handleChange(value){
            this.params.date = this.dayjs(value).format('YYYY-MM-DD')
            this.getData()
        },
        openDate(){
            this.$refs.picker.open();
        },
        getDevice(){
            let params = {
                siteId:Storage.get("site").value,
                isApp:1
            }
            this.ElementsBySite(params).then(res=>{
                if(res.code==1){
                    if(res.data.length<1)return;
                    this.selectPoint = res.data[0];
                    // this.deviceList = {
                    //     selectVal:res.data[0],
                    //     data:res.data
                    // }
                }
            })
        },
        getArr(length){
            let arr1 = []
            for(let i=0;i<length;i++){
                arr1.push(i)
            }
            return arr1;
        },
        getData(){
            this.currentArr=[]
            let obj = {legendData:[],data:[]};
            let $this = this;
            this.mdmidDetail(this.params).then(res=>{
                if(res.code=="1"){
                    let current = [];
                    this.currentArr=[]
                    this.unit = res.data.unit=='kVA'?'%':res.data.unit;
                    let allData = [];

                    if(Object.keys(res.data).length>0){
                        for(let key in res.data){
                            if(key.indexOf('resultList_')>-1&&key.indexOf('PFtotal')<=-1&&key.indexOf('Meter.Stotal')<=-1&&key.indexOf('APProductionKWHHourUse')<=-1){
                                allData.push(res.data[key])
                            }
                            if(key.indexOf('currValueMeter.')>-1){
                                current.push({
                                    key:key.split('.')[1],
                                    value:Number(res.data[key]).toFixed(1)
                                })
                            }
                        }
                        allData.forEach(item=>{
                            let key = item[0].point.split('.')[1];                        
                            if(!item[0].name)
                               {item[0].name='负载率';}
                            for(let i=0;i<current.length;i++){
                                let index = current[i].key.indexOf(key);                           
                                if(index>-1||current[i].key=='Stotal'){
                                    this.currentArr.push({
                                        name:item[0].name,
                                        value : current[i].value
                                    })
                                }
                            }                           
                            if(item.length<1)return;
                            obj.legendData.push(item[0].name)
                            let name = item[0].name;
                            obj.data.push(Common.chartData(item))

                        })
                        /*---如果查的是当天的数据，x轴是截止到当前时间；如果是历史数据，x轴就是24小时的---- */
                        // if(this.dayjs(this.params.date.replace(/-/g,"/")).date()!=this.dayjs(this.nowDate.replace(/-/g,"/")).date()){
                        //     obj.xAxisData1=this.getArr(25)
                        //     obj.xAxisData2 = Common.chartxAxis(`${this.params.date} 00:00:00`,`${this.params.date} 23:59:59`,'m')
                        // }else{
                        //     /*当天时间 */
                        //     let hours = this.dayjs().hour();
                        //     let minute = parseInt(this.dayjs().minute()/5)*5;
                        //     obj.xAxisData1=this.getArr(hours+2)
                        //     obj.xAxisData2 = Common.chartxAxis(`${this.params.date} 00:00:00`,`${this.params.date} ${hours}:${minute}:00`,'m');
                        // }
                        obj.xAxisData1=this.getArr(25)
                        obj.xAxisData2 = Common.chartxAxis(`${this.params.date} 00:00:00`,`${this.params.date} 23:59:59`,'m')


                    }else{
                        Toast('该检测点，暂无数据')
                    }
                }else{
                  Toast('网络异常，请稍微再试')  
                }
                this.initEcharts(obj)
            }).catch(err=>{
                Toast('网络异常，请稍微再试')
            })
        },
        initEcharts(obj){
            let series = []
            for(let i=0;i<obj.data.length;i++){
                let serie = {
                    name: obj.legendData[i],
                    type: "line",
                    showSymbol: false,
                    xAxisIndex: 1,
                    data: obj.data[i]
                }
                series.push(serie)
            }
            let myechart = echarts.init(document.getElementById("echart"));
            let option = {
                tooltip: {
                    trigger: 'axis',
                    formatter:function(params){
                        let tool ='';
                        let time = '';
                        params.forEach((item, index) => {
                        tool +=
                            item.value[0]+"</br>"+item.marker + item.seriesName + ":" + item.value[1] + "</br>";
                        });
                        return tool;
                    }
                },
                grid: {
                    right: '8%',
                    left: '15%',
                    bottom:'25%',
                    top:'20%'
                },
                legend: {
                    data: obj.legendData,
                    bottom: 0,
                    textStyle: {
                        color: '#353535'
                    },
                },
                dataZoom: [
                    {
                    type: 'inside',
                    realtime: true,
                    start: 0,
                    end: 100,
                    xAxisIndex: [0,1]
                    }
                ],
                xAxis: [{
                    name:'h',
                    type: 'category',
                    boundaryGap: false,
                    data: obj.xAxisData2,
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
                    axisPointer: {
                        show: false
                    }
                },
                {
                    type: 'category',
                    show: false,
                    data: obj.xAxisData2
                }
                ],
                color:['#ff7e37','#51de83','#ffcc66'],
                yAxis: [{
                    name:this.unit,
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
                series:series
            }
            myechart.setOption(option,{notMerge:true})
        },
        choice(key){
            this.pointObj={
                optionList : this[key].data,
                showPop :true,
                selectVal:this[key].selectVal
            }
        },
        choicePoint(todo){
            this.pointArr = [];
            let value = `${todo[0]},${todo[1]}`;
            this.pointArr=`${todo[0]},${todo[1]}`;
            this.params.showTypeArr = this.pointArr;
            this.getData();
        },
        changeDevice(){
            this.$router.push({path:'/deviceSearch'})
        }
    }
}
</script>

<style lang="scss" scoped>
@import '../../assets/scss/pagestyle/dynamic.scss';
</style>
