<template>
    <header class="header-wrap">
        <div class="header mb10">
            <p  v-if="path.indexOf('user')<=-1" class="site-wrap" @click="choiceSite">
                <span>{{pointObj.selectVal.name}}</span><i class="iconfont" :class="{'icon-left':pointObj.optionList.length>2}"></i>
            </p>
            <p class="goBack" v-if="path.indexOf('user')>-1" @click="back">
                <i class="iconfont icon-left left"></i>
                <span>{{pathName}}</span>
            </p>
            <router-link to="/user" class="user">
                <i class="iconfont icon-touxiang"></i>
            </router-link>
        </div>
        <app-select :objData.sync="pointObj"></app-select>
    </header>
</template>
<script>
export default {
    data(){
        return{
            pointObj:{
                selectVal:Storage.get("site")||{},
                showPop:false,
                optionList:Storage.get("user")&&Storage.get("user").siteList?Storage.get("user").siteList:[]
            },
            pathName:'',
            path:'',
            old:{}
        }
    },
    watch:{
        pointObj:{
            handler(){
                let old=Storage.get("site");
                if(old&&(old.value!=this.pointObj.selectVal.value)){
                    window.location.reload();
                }
                Storage.set("site",this.pointObj.selectVal)
            },
            deep:true
        },
        $route:{
            handler(){
                this.pathName = this.$route.name;
                this.path = this.$route.path;
            },
            deep:true
        }
    },
    mounted(){   
        this.pathName = this.$route.name;
        this.path = this.$route.path;
    },
    methods:{
        choiceSite(){
            if(this.pointObj.optionList.length<2){
                return
            }
            this.pointObj.showPop = true;
        },
        back(){
            this.$router.go(-1)
        }
    }
}
</script>

<style lang="scss">
@import "../assets/scss/global.scss";
.header-wrap{
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    z-index:99;
    .header{
        width: 100%;
        height: .88rem;
        background: #1c4156;
        line-height: .88rem;
        text-align: center;
        color: #fff;
        font-size: .28rem;
        position: relative;
        @extend .com-padding;
        .site-wrap{
            text-align: center;
            font-size: .3rem;
            height: 100%;
            span{              
                max-width: 4rem;
                display: inline-block;
                overflow: hidden;
            }
            i{
                display: inline-block;
                color: #bbb;
                -webkit-transform: rotate(-90deg);
                transform: rotate(-90deg);
                margin: 0 0 .7rem .2rem;
                vertical-align: middle;
            }
        }
        .goBack{
            color: #fff;
            text-align: center;
            position: relative;
            .icon-left{
                color: #fff;
                position: absolute;
                top: 0;
                left: 0;
            }
            span{
                color: #fff;
            }
        }
        .user{
            color: #fff;
            position: absolute;
            right: .33rem;
            top: 0;
            i{
                font-size: .38rem;
            }
        }
    }
}
</style>
