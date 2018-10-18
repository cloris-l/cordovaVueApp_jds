<template>
    <div class="contaniner">
        <app-header></app-header>
        <div class="main">
            <router-view/>
        </div>
        <app-menu v-if="!path"></app-menu>
    </div>
</template>
<script>
import appHeader from '../../components/appHeader'
import appMenu from '../../components/appMenu'
export default {
    data(){
        return{
            path:false
        }
    },
    mounted(){
        this.path = (this.$route.path).indexOf('user')>-1?true:false;
    },
    watch:{
        $route:{
            handler:function(){
                this.path = (this.$route.path).indexOf('user')>-1?true:false;
            },
            deep:true
        }
    },
    components:{
        appHeader,appMenu
    },
    methods:{
    }
}
</script>

