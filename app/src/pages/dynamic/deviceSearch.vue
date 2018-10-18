<template>
    <div class="device-search-wrap">
        <div class="top-wrap fn-clear">
            <div class="back left" @click="goBack">
                <i class="iconfont icon-left"></i>
            </div>
            <div class="input-box">
                <input type="text" v-model="key" @keyup="getDevice">
            </div>
            <div class="clear">
                <i class="iconfont icon-close"></i>
            </div>
        </div>
        <div class="device-list">
            <p v-for="(list,index) in deviceData" @click="choice(list)" :key="index">{{list.name}}</p>
        </div>
    </div>
</template>
<script>
export default {
    data(){
        return{
            deviceData:[],
            key:''
        }
    },
    mounted(){
        this.getDevice()
    },
    methods:{
        getDevice(){
            let params = {
                siteId:Storage.get('site').value,
                key:this.key,
                isApp:1,
            }
            this.ElementsBySite(params).then(res=>{
                if(res.code==1){
                    this.deviceData = res.data;
                }
            })
        },
        choice(list){
            Storage.set('deviceD',list,true)
            this.$router.go(-1);
        },
        goBack(){
            this.$router.go(-1);
        }
    }
}
</script>

<style lang="scss" scoped>
.device-search-wrap{
    min-height: 100vh;
    width: 100%;
    background: #fff;
    padding: .33rem;
    .top-wrap{
        position: relative;
        .input-box{
            float:right;
            width: calc(100% - .5rem);
            width: -webkit-calc(100% - .5rem);
            input{
                width: 100%;
                border: 0;
                border-bottom: 1px solid #959595;
                line-height: .5rem;
            }
        }
        .clear{
            position:absolute;
            right: 0;
            bottom: 0;
            color: #dcdddd;
        }
    }
    .device-list{
        width: 100%;
        padding-left: .5rem;
        p{
            width: 100%;
            border-bottom: 1px solid #d2d2d2;
            padding: .2rem 0;
            font-size: .3rem;
            color: #5d5d5d;
        }
    }
}
</style>
