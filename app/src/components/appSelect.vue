<template>
    <div class="bottom-list" v-if="objData.showPop" @click="objData.showPop=false">
        <div class="select-content">
            <div class="select-main" v-for="(list,index) in objData.optionList" :key="index">
                <span class="mt10" :class="{'active':objData.selectVal.name==list.name}" @click="choice(list)">{{list.name}}</span>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    data(){
        return{
            showPop:true
        }
    },
    props:{
        objData:{
            typpe:Object,
            default:function(){
                return{
                    showPop:false,
                    selectVal:{},
                    optionList:[],
                }
            }
            
        }
    },
    mounted(){
    },
    watch:{
        objData:{
            handler(){        
                // if(this.objData.optionList.length>0&&!this.objData.selectVal.id){
                //     this.objData.selectVal = this.objData.optionList[0]
                // }
            },
            deep:true
        }
    },
    methods:{
        choice(data){
            this.objData.selectVal = data;
            let obj = this.objData
            this.$emit('update:objData',obj)
        }
    }
}
</script>

<style lang="scss" scoped>
@import '../assets/scss/global.scss';
.bottom-list{
    @extend .gray-pop;
    .select-content{
        @extend .pop-content;
        // min-height: 3.1rem;
        max-height: 10rem;
        overflow: auto;
        .select-main{
           padding-right: .1rem;
           span{
               display: block;
               text-align: center;
               background: #eceff4;
               border: 1px solid #cad3df;
               border-radius: 3px;
               line-height: .6rem;
               height: .6rem;
               overflow: hidden;
               color: #9d9d9d;
               &.active{
                   background: $bg-blue;
                   border: 1px solid $border-blue;
                   color: #fff;
               }
           }
        }
    }
    @keyframes animate{
        0% {
            bottom: -2.6rem
        }
        100% {
            bottom: 0
        }
    }
}
</style>
