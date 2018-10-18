<template>
    <div class="user-wrap">
        <div class="com-padding com-content mt10">
            <div class="item">
                <span class="left">用户名</span>
                <span class="right">{{user.username}}</span>
            </div>
            <div class="item">
                <span class="left">企业名称</span>
                <span class="right">{{user.companyName}}</span>
            </div>
            <div class="item">
                <span class="left">工商注册号</span>
                <span class="right">{{user.regisId}}</span>
            </div>
            <!-- <div class="item">
                <span class="left">站点名称</span>
                <span class="right">孝昌一号主站</span>
            </div>
            <div class="item">
                <span class="left">站点地址</span>
                <span class="right">孝感市孝昌县华阳大道350号</span>
            </div> -->
        </div>
        <div class="com-padding com-content mt10">
            <div class="item">
                <router-link to="/user/modifyPw">修改密码</router-link>
            </div>
            <div class="item" @click="sheetVisible=true">
                退出登录
            </div>

        </div>
        <mt-actionsheet :actions= "data" v-model="sheetVisible">
            <p>退出登录</p>
        </mt-actionsheet>
    </div>
</template>
<script>
export default {
    data(){
        return{
            data: [{  
                name: '退出登录',  
                method : this.logOut// 调用methods中的函数  
            }],
            sheetVisible:false,
            user:Storage.get('user')
        }
    },
    methods:{
        logOut(){
            let user={
                username:this.user.username,
                password:this.user.password
            }
            localStorage.clear()
            Storage.set('user',user)
            Storage.set('deviceD',null,true)
            this.$router.push({path:'/login'})
        }
    }
}
</script>

<style lang="scss">
@import '../../assets/scss/global.scss';
.user-wrap{
   .item{
       line-height: .9rem;
       color: $font-blackColor;
       font-size: .3rem;
       border-bottom: 1px solid $border-gray;
       overflow: hidden;
       span{
           &.right{
               color: #979797;
           }
       }       
       &:last-child{
           border: 0;
       }
       a{
           display: block;
           color: $font-blackColor
       }
   }
}
</style>
