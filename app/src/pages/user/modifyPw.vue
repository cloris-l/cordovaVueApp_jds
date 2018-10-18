<template>
    <div class="modify-wrap">
        <div class="com-padding com-content mt10">
            <div class="item">
                <span class="left">当前密码</span>
                <input class="right" v-model="params.password" type="password" placeholder="请输入">
            </div>
            <div class="item">
                <span class="left">新密码</span>
                <input class="right" v-model="params.newPassword" type="password" placeholder="请输入">
            </div>
            <div class="item">
                <span class="left">确认密码</span>
                <input class="right" v-model="params.newPassword2" type="password" placeholder="请输入">
            </div>
        </div>
        <p class="tip">密码长度8-16位，数字、字母、符号至少包含两种。</p>
        <mt-button class="submit" @click="submit" type="default" size="large">确定</mt-button>
    </div>
</template>
<script>
export default {
    data(){
        return{
            params:{
                password:'',
                newPassword:'',
                newPassword2:'',
                userName:Storage.get('user').username||''
            },
        }
    },
    methods:{
        submit(){
            let isCheck =true;
            // let reg = /^(?!^(\d+|[a-zA-Z]+|[~!@#$%^&*?]+)$)^[\w~!@#$%\^&*?]+$/; 
            var pattern = new RegExp("['#*\"{}\\\\/]");
            for(let key in this.params){
                if(!this.params[key]){
                    Toast('密码不能为空！')
                    isCheck = false;
                    return;
                }
            }
             if(this.params.newPassword.length>16||this.params.newPassword.length<8||pattern.test(this.params.newPassword)){                
                 Toast('新密码格式不正确')
                 return
             }else if(this.params.newPassword!=this.params.newPassword2){
                 Toast('两次密码不一样！')
                 return
             }
            this.updatePwd(this.params).then(res=>{
                Toast('提交成功！')
            })
        }
    }
}
</script>

<style lang="scss">
@import '../../assets/scss/global.scss';
.modify-wrap{
    .item{
        line-height: .9rem;
        color: $font-blackColor;
        font-size: .3rem;
        border-bottom: 1px solid $border-gray;
        overflow: hidden;
        &:last-child{
           border: 0;
       }
        span{
            width: 1.2rem;
        }
        input{
            width: calc(100% - 1.2rem);
            width: -webkit-calc(100% - 1.2rem);
            border: 0;
            line-height: .9rem;
            padding-left: .3rem;
            color: #979797;
        }
    }
    .tip{
        text-align: center;
        font-size: .2rem;
        color: #979797;
        line-height: 1.1rem;
    }
    .submit{
        width: calc(100% - .66rem);
        width: -webkit-calc(100% - .66rem);
        margin: 0 auto;
        height: .8rem;
    }
}
</style>

