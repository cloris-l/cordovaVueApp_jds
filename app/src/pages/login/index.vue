<template>
    <div class="login-wrap">
        <div class="title">联元节度使</div>
        <div class="login-form">
            <div class="form">
                <input @focus="isShow=false" @blur="isShow=true" v-model="params.userName" type="text" placeholder="用户名">
            </div>
            <div class="form">
                <input @focus="isShow=false" @blur="isShow=true" v-model="params.password" type="password" placeholder="密码">
            </div>
            <mt-button class="btn" @click="submit" type="default" size="large">确定</mt-button>
        </div>
        <footer>
            <div v-if="isShow">
                <img src="../../assets/img/login_logo.png">
            </div>
        </footer>
    </div>
</template>
<script>
import sha256 from 'sha256'
export default {
    data(){
        return{
           params:{
               userName:(Storage.get('user')&&Storage.get('user').username)?Storage.get('user').username:'',
               password:(Storage.get('user')&&Storage.get('user').password)?Storage.get('user').password:''
           },
           isShow:true
        }
    },
    mounted(){
        let params = {
            userName:'admin',
            password:sha256('123456')
        }
        // this.login(params).then(data=>{

        // })
    },
    methods:{
        submit(){
            if(!this.params.userName){
                Toast('请填写用户名！')
            }else if(!this.params.password){
                Toast('请填写密码！')
            }else{
                let data = {
                    userName:this.params.userName,
                    password:sha256(this.params.password.toLowerCase()),
                    isApp:1
                }
                this.login(data).then(res=>{
                    if(res.code==1){
                        res.data.password = this.params.password;
                        Storage.set("user",res.data);
                        if(res.data.siteList&&res.data.siteList.length>0){
                            // for(let i=0;i<res.data.siteList.length;i++){
                            //     res.data.siteList[i].name= res.data.siteList[i].site_name
                            // }
                            let defaultSite =res.data.siteList[0];
                            res.data.siteList.forEach(item=>{
                                if(item.default==item.value){
                                    defaultSite = item;
                                }
                            })
                            Storage.set("site",defaultSite);
                        }                                              
                        this.$router.push({path: '/'})
                    }else{
                        Toast(res.msg)
                    }
                })
            }
        },
    }
}
</script>
<style lang="scss">
.login-wrap{
    position: relative;
    width: 100%;
    height: 100vh;
    background: url("../../assets/img/login_bg.png");
    background-size: cover;
    padding-top: 1rem;
    .title{
        width: 2.75rem;
        height: 3.02rem;
        margin: 0 auto .5rem;
        line-height: 3.02rem;
        color: #fff;
        font-size: .36rem;
        background: url("../../assets/img/login_top.png");
        background-size: 100%;
        text-align: center;
    }
    .login-form{
        width: 5.85rem;
        margin:0 auto;
        .form{
            input{
                width: 100%;
                line-height: .3rem;
                padding: .29rem 0;
                color: #b9b9b9;
                font-size: .3rem;
                padding-left: .3rem;
                border: 0;
                margin-bottom: .2rem;
                border-radius: 4px;
            }
        }
        .btn{
            background: #58e4f5;
            color: #0f6878;
            font-size: .3rem;
        }
    }
    footer{
        position: absolute;
        bottom: .7rem;
        text-align: center;
        width: 100%;
        &>div{
            width: 2.16rem;
            height: .61rem;
            margin: 0 auto;
            img{
                max-width: 100%;
            }
        }
    }
}
</style>

