<template>
    <div class="alarm-wrap">
        <div class="filter-wrap com-content fn-clear">
            <div class="item left" :class="{'active':statusType.indexOf(0)>-1}" @click="handleChoice(0)">已告警 </div>
            <div class="item left" :class="{'active':statusType.indexOf(1)>-1}" @click="handleChoice(1)"> 处理中 </div>
            <div class="item left" :class="{'active':statusType.indexOf(2)>-1}" @click="handleChoice(2)">已处理</div>
            <div class="item left" :class="{'active':statusType.indexOf(3)>-1}" @click="handleChoice(3)">误告警</div>
            <div class="right filter" @click="filterShow = true">
                <i class="iconfont icon-shaixuan"></i>
            </div>
        </div>
        <mt-loadmore :bottom-all-loaded="allLoaded" ref="loadmore" style="width:7.5rem"> 
            <div class="list-wrap"  v-infinite-scroll="loadMore"
                    infinite-scroll-immediate-check="true"
                    infinite-scroll-disabled="loading"
                    infinite-scroll-distance="0">
                <div class="list com-content" v-for="(list,index) in allData.resultList" :key=index @click="showMore(index)" :class="{'active':active==index+1}">
                    <span class="type" :class="{'warning':eventLevel[list.level]=='预警','alarm':eventLevel[list.level]=='告警','fault':eventLevel[list.level]=='故障'}"></span>
                    <span class="operation">{{list.flagName}}</span>
                    <div class="fn-clear">
                        <span class="title left">站点名称</span>
                        <div class="content left">{{list.siteName}}</div>
                    </div>
                    <div class="fn-clear" v-if="active==index+1">
                        <span class="title left">配电房名称</span>
                        <div class="content left">{{list.roomName}}</div>
                    </div>
                    <div class="fn-clear" v-if="active==index+1">
                        <span class="title left">设备名称</span>
                        <div class="content left">{{list.mdmidName}}</div>
                    </div>
                    <div class="fn-clear" v-if="active==index+1">
                        <span class="title left">告警级别</span>
                        <div class="content left">{{eventLevel[list.level]}}</div>
                    </div>
                    <div class="fn-clear">
                        <span class="title left">告警内容</span>
                        <div class="content left blue">{{list.codeDesc}}</div>
                    </div>
                    <div class="fn-clear">
                        <span class="title left">发生时间</span>
                        <div class="content left">{{list.occurTime}}</div>
                    </div>
                    <div class="fn-clear" v-if="active==index+1">
                        <span class="title left">当前状态</span>
                        <div class="content left">{{list.flagName}}<span v-if="list.flag==2||list.flag==3">（恢复时间 {{list.confirmTime}}）</span></div>
                    </div>
                    <div class="fn-clear" v-if="active==index+1">
                        <span class="title left">备注</span>
                        <div class="content left">{{list.responsiblePerson||'-'}}</div>
                    </div>
                    <div class="iconfont icon-left"></div>
                </div>
            </div>
        </mt-loadmore>
        <div class="filter-pop" :class="{'show':filterShow}">
            <div class="filter-pop-con">
                <div>
                    <div class="item" @click="choice('site')">
                        <p class="name">站点名称 </p>
                        <p class="value">{{site.name}}</p>
                        <div class="arrow">
                            <i class="iconfont icon-left"></i>
                        </div>
                    </div>
                    <div class="item" @click="choice('room')">
                        <p class="name">配电房名称 </p>
                        <p class="value">{{room.name}}</p>
                        <div class="arrow">
                            <i class="iconfont icon-left"></i>
                        </div>
                    </div>
                    <div class="item">
                        <p class="name">发生时间</p>
                        <!-- <div class="radius-box fn-clear mb20">
                            <span @click="timeTypeHandler(false)" :class="{'blue':!hasTime}"><i class="iconfont icon-yuancircle46 mr10" :class="{'icon-danxuan':!hasTime}"></i>默认时间</span>
                            <span @click="timeTypeHandler(true)" class="ml20" :class="{'blue':hasTime}"><i class="iconfont icon-yuancircle46 mr10" :class="{'icon-danxuan':hasTime}"></i>时间范围</span>
                        </div> -->
                        <div class="date-wrap">
                            <span class="value" @click="datepicker('start')">{{startTime}}</span>
                            <span class="ml20">至</span>
                            <span class="value ml20" @click="datepicker('end')">{{endTime}}</span>
                        </div>
                    </div>
                    <div class="item">
                        <p class="name">告警级别 </p>
                        <p>
                            <span @click="params.enentLevel =''" :class="{'blue':!params.enentLevel}">全部</span>
                            <span class="ml20" v-for="(list,index) in eventLevelList" :key="index" @click="params.enentLevel = list.value"  :class="{'blue':params.enentLevel ==list.value}">{{list.name}}</span>
                        </p>
                    </div>
                </div>
                <div class="button-box">
                    <div class="btn" @click="cancle">取消</div>
                    <div class="btn submit" @click="getList(true)">确定</div>
                </div>
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
                <!-- <app-select :objData.sync="pointObj"></app-select> -->
            </div>
        </div>
         <mt-popup
          v-model="showPop"
          position="bottom" class="pick-pop">
          <p class="handel-btn fn-clear"><span class="left" @click="showPop=false">取消</span><span @click="handelPicker" class="right">确定</span></p>
          <mt-picker :slots="slots" value-key="name" @change="onValuesChange"></mt-picker>
        </mt-popup>
    </div>
</template>
<script>
import {Indicator} from 'mint-ui'
export default {
    data(){
        return{
            params:{
                accountId:Storage.get('user').accountId,
                conAndFal:'0,1,2,3',//已告警:0，处理中：1，已处理：2，误告警：3
                startTime:'',
                endTime:'',
                eventSiteId:Storage.get('site').value,
                page:1,
                isApp:1,
                enentLevel:''
            },
            statusType:[0,1,2,3],
            allData:{resultList:[]},
            eventLevel:Storage.get('baseData').eventLevel,
            active:'',
            filterShow:false,
            siteList:Storage.get('user').siteList,
            site:Storage.get('site'),
            roomArr:[],
            room:{},
            hasTime:false,
            eventLevelList:Storage.get('baseData').eventLevelList,
            pickerValue:new Date(),
            endDate:new Date(),
            dateType:'',
            startTime:this.dayjs(Date.now() - 24 * 60 * 60 * 1000*6).format('YYYY-MM-DD'),
            endTime:this.dayjs(Date.now()).format('YYYY-MM-DD'),
            popType:'',
            showPop:false,
            slots:[{
                flex: 1,
                values: [],
                className: 'slot1',
                textAlign: 'center'
            }],
            Slot:'<span>取消</span>',
            choicePickValue:'',
            allLoaded: true,
            loading:false,
        }
    },
    mounted(){
        this.getList();
        this.getDevice();
    },
    methods:{
        getList(filter){
            this.filterShow = false;
            this.params.startTime = this.startTime;
            this.params.endTime = this.endTime;
            this.params.conAndFal = this.statusType.length>0?this.statusType.join(','):'';
            this.params.eventSiteId = this.site.value;
            this.params.room = this.room.value;
            if(filter)this.params.page = 1;
            if(!this.params.conAndFal){
                Indicator.close();
                this.allData = {};
                Toast.info('暂无数据');
                return;
            }
            Indicator.open({
                text: '加载中...',
                spinnerType: 'fading-circle'
            });
            this.findEventList(this.params).then(res=>{
                this.loading = false
                Indicator.close();
                if(res.code==1){
                    if(res.data.resultList.length>0){
                      res.data.resultList.forEach(item=>{
                          switch(item.flag){
                              case 0:item.flagName = '已告警';break
                              case 1:item.flagName = '处理中';break
                              case 2:item.flagName = '已处理';break
                              case 3:item.flagName = '误告警';break
                          }
                      })  
                    }else Toast('暂无数据');
                    let num = res.data.total%10;
                    res.data.lastPage = parseInt(res.data.total/10)
                    if(num>0){
                        res.data.lastPage++;
                    }
                    if(this.params.page!=1){
                        this.allData.resultList = this.allData.resultList.concat(res.data.resultList)
                    }else this.allData = res.data||{};
                    
                }
            }).catch(data => {
                Indicator.close()
                this.loading = false
            })
        },
        //根据站点获取设备
        getDevice(){
            let params = {
                objectId:this.site.objectId,
                // isApp:1,
            }
            this.roomArr =[]
            this.getRoomData(params).then(res=>{
                if(res.code==1){
                    if(res.data.length>0){
                        res.data.forEach(item=>{
                            item.text = item.name;
                        })
                        res.data.unshift({'name':'全部',value:''})                        
                        this.roomArr = res.data;
                        this.room = this.roomArr[0]
                    }
                }
            })
        },
        //展开显示更多
        showMore(index){
            this.active = this.active==index+1?'':index+1
        },
        cancle(){
            this.params.enentLevel = '';
            this.startTime=this.dayjs(Date.now() - 24 * 60 * 60 * 1000*6).format('YYYY-MM-DD'),
            this.endTime=this.dayjs(Date.now()).format('YYYY-MM-DD'),
            this.site=Storage.get('site');
            this.room = {};
            this.filterShow = false;
        },
        //选择站点或者配电房
        choice(type){
            this.selectType = type;
            this.showPop = true;
            if(type=='site')this.slots[0].values = this.siteList;
            else this.slots[0].values = this.roomArr;
        },
        //显示时间控件
        datepicker(type){
            this.dateType = type;
            this.pickerValue = this[type+'Time']
            this.$refs.picker.open();
        },
        //确认选择的时间
        handleChange(value){
            this[this.dateType+'Time'] = this.dayjs(value).format('YYYY-MM-DD')
        },
        //选择头部状态
        handleChoice(status){
            let i = this.statusType.contains(status);
            if(i){
                this.statusType.splice(i,1)
            }else{
                this.statusType.push(status)
            }
            this.params.page = 1;
            this.getList();
        },
        onValuesChange(picker, values){
            this.choicePickValue = values[0]
        },
        handelPicker(){
            if(this.selectType=='site'){
                this.site = this.choicePickValue;
                this.getDevice()
            }else if(this.selectType=='room'){
                this.room = this.choicePickValue
            }
            this.showPop = false;
        },
        loadMore(){
            this.loading = true;
            this.params.page = this.params.page+1;
            if(this.allData&&this.allData.lastPage<this.params.page){
                Toast.info('没有更多数据了')
                return;
            }else{            
                this.getList();
            }
        },
        timeTypeHandler(has){
            this.hasTime = has;
            this.startTime=this.dayjs(Date.now() - 24 * 60 * 60 * 1000*6).format('YYYY-MM-DD');
            this.endTime=this.dayjs(Date.now()).format('YYYY-MM-DD');
        }
    }
}
</script>

<style lang="scss" scoped>
@import '../../assets/scss/pagestyle/alarmSearch.scss';
</style>

