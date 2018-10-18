<template>
    <div class="eleEnergy-wrap">
        <h4>疑似存在电能质量问题的监测点<span class="right" @click="showBox=true">参考标准</span></h4>
        <div class="com-padding target mb10">
            <div class="item col-3">
                <p>电压偏差</p>
                <p class="value"><span>{{allData.type1||'0'}}</span> / {{allData.sum}}</p>
            </div>
            <div class="item col-3">
                <p>功率因数</p>
                <p class="value"><span>{{allData.type2||'0'}}</span> / {{allData.sum}}</p>
            </div>
            <div class="item col-3">
                <p>谐波电压</p>
                <p class="value"><span>{{allData.type3||'0'}}</span> / {{allData.sum}}</p>
            </div>
        </div>
        <div class="question-wrap">
            <div class="tab-wrap fn-clear">
                <span class="col-3" @click="changeType(0) " :class="{'on':!questionType}">电压偏差</span>
                <span class="col-3" @click="changeType(1)" :class="{'on':questionType==1}">功率因数</span>
                <span class="col-3" @click="changeType(2)" :class="{'on':questionType==2}">谐波电压</span>
                <em class="line col-3" :class="{'left33':questionType==1,'left66':questionType==2}"></em>
            </div>
            <div>
                <div class="title"><span class="item1">监测点名称</span><span class="item2">问题描述</span><span class="item3">最近六个月状态</span><span></span></div>
                <mt-loadmore :bottom-all-loaded="allLoaded" ref="loadmore" style="width:7.5rem"> 
                    <div  v-infinite-scroll="loadMore"
                    infinite-scroll-immediate-check="true"
                    infinite-scroll-disabled="loading"
                    infinite-scroll-distance="0">                  
                    <ul>
                        <li v-for="(item,index) in listData" :key="index">
                            <div class="com-padding fn-clear">
                                <span class="item1">{{item.name||'-'}}</span>
                                <span class="item2"><span class="name">{{item.index_name}}</span><em>{{item.index_data}}</em></span>
                                <span class="item3">
                                    <em v-for="(status,index) in item.status" :class="{'red':status.monthCount}"  :key="index"></em>
                                </span>
                                <span v-if="item.remark" class="item4" @click="openDetail(item)"> <i class="iconfont icon-beizhu"></i></span>
                            </div>
                            <div class="message" :class="{'show':item.contentShow}"><div>{{item.remark}}</div></div>
                        </li>
                    </ul>
                    </div>
                </mt-loadmore>
            </div>
        </div>
        <div class="gray-pop" v-if="showBox"> 
            <div class="pop-content pop-middle">
            <div class="pop-main">
                <p class="close"><span class="right" @click="showBox=false">X</span></p>
                <h2>电能质量参数正常范围标准值</h2>
                <div class="standard-wrap">
                    <ul>
                        <li>
                            <p class="info mb10">电压合格率<span class="right">≥99.9%</span></p>
                            <p>参考国家电网公司电能质量管理规范</p>
                        </li>
                        <li>
                            <p class="info mb10">功率因数<span class="right">≥0.9%</span></p>
                            <p>力率标准</p>
                        </li>
                        <li>
                            <p class="info mb10">电压总谐波畸变率<span class="right">≤5%</span></p>
                            <p>参考GB/T14549-93《电能质量公用电网谐波》</p>
                        </li>
                    </ul>
                </div>
            </div>
            </div>
        </div>
    </div>
</template>
<script>
import {Indicator} from 'mint-ui'
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
                    slideChangeTransitionEnd: ()=>{
                       this.changeSlider()    
                    }
                }
            },
            questionType:0,
            showBox:false,
            allData:{l:{}},
            loading:false,
            params:{
                siteId:Storage.get('site').value,
                index_type:1,
                isApp:1,
                page:1,
            },
            listData:[],
            allLoaded: true,
            totalList:[],

        }
    },
    computed: {
      swiper() {
        return this.$refs.mySwiper.swiper
      }
    },
    watch:{
        questionType:{
            handler(){
                this.params.index_type = this.questionType+1;
                this.getAllData();
            }
        }
    },
    mounted(){
        this.getAllData();
    },
    methods:{
        changeSlider(){
            this.questionType = this.swiper.activeIndex;
            this.params.page =1;
            console.log(this.questionType+'ddd')
        },
        getAllData(){
            if(this.params.page==1){
                this.listData =[]
            }
            this.eleEnergyData(this.params).then(res=>{
                this.loading = false
                Indicator.close();
                if(res.code==1){
                    res.data.group.forEach((item,index)=>{
                        res.data['type'+item.index_type] = item.failCount
                    })
                    if(res.data.l&&res.data.l.list.length>0){
                        res.data.l.list.forEach(item=>{
                            let data1 = item.index_data;
                            if(this.questionType==0){
                                data1 = item.index_data*100
                            }
                            let data = data1.toString();
                            item.index_data = data.substring(0,data.lastIndexOf('.')+3);
                            if(this.questionType!=1){
                                item.index_data +='%'
                            }
                        })
                    }
                    
                    this.allData = res.data;
                    if(this.params.page!=1){
                        this.listData = this.listData.concat((res.data.l.list||[]))
                    }else{
                        this.listData = res.data.l.list||[];
                    }                    
                }
            }).catch(data => {
                Indicator.close()
                this.loading = false
            })
        },
        openDetail(data){
            this.listData.forEach(item=>{
                if(item==data&&!data.contentShow){
                    this.$set(item,'contentShow',true)
                }else{
                    this.$set(item,'contentShow',false)
                }               
            })
        },
        changeType(type){
            this.questionType = type;
            this.params.page=1;
        },
        // 加载更多
        loadMore () {
            this.loading = true;
            this.params.page = this.params.page+1;
            if(this.allData.l&&this.allData.l.lastPage<this.params.page){
                Toast({
                    message: '没有更多数据了',
                    duration: 3000
                })
                return;
            }else{
                Indicator.open({
                    spinnerType: 'fading-circle'
                })
                this.getAllData(this.params)
            }
            
        }
    }
}
</script>

<style lang="scss">
@import '../../assets/scss/pagestyle/eleEnergy.scss';
</style>
