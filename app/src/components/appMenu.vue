<template>
    <nav class="menu-wrap">
        <ul class="fn-clear">
            <li v-for="(list,index) in menu" :key="index">
                <a :class="{'on':list.link==router||(router=='/'&&list.name=='量费特性')}" :href="(list.link&&('#'+list.link)) || 'javascript:;' ">
                    <p><i class="iconfont" :class="list.icon"></i></p>
                    <p class="mt10">{{list.name}}</p>
                </a>
                
            </li>
        </ul>
    </nav>
</template>
<script>
export default {
    data(){
        return{
            menu:[
            // {link:'',name:'概览',icon:'icon-nengyuanjiashicang'},
            {link:'/amountFF',name:'量费特性',icon:'icon-zongdianfei'},
            {link:'/eleEnergy',name:'电能质量',icon:'icon-zongdianliang'},
            {link:'/alarmSearch',name:'告警查询',icon:'icon-baojingguize'},
            {link:'/dynamic',name:'运行动态',icon:'icon-mingxichaxun'},
            {link:'/diagnose',name:'节度诊断',icon:'icon-jihuayongdianpeizhi'},
            ],
            router:''
        }
    },
    watch:{
        $route:function(){
            this.router = this.$route.path;
        }
    },
    mounted(){
        this.router = this.$route.path;
    }
}
</script>

<style lang="scss" scoped>
@import "../assets/scss/global.scss";
    .menu-wrap{
        width: 100%;
        position: fixed;
        bottom: 0;
        left: 0;
        border-top:1px solid $border-gray;
        z-index: 98;
        &>ul{
            @extend .com-padding;
            height: 1.3rem;
            padding-top: .15rem;
            padding-bottom: .15rem;
            background: #fff;
            display: flex;
            display: -webkit-flex; /* Safari */
            &>li{
                flex: 1;
                text-align: center;
                font-size: $fontSize20;
                a{
                    color: $font-grayColor;
                    display: block;
                        &.on{
                        color: $font-greenColor;
                    }
                    i{
                        font-size: .5rem;
                    }
                }
            }
        } 
    }
</style>

