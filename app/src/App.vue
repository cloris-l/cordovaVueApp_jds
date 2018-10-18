<template>
  <div id="app" class="heightFull">
    <!-- <img src="./assets/logo.png"> -->
    <router-view/>
  </div>
</template>

<script>
// import codePush from '../'
export default {
  name: 'App',
  data(){
    return{
      popupVisible:true,
      value:0
    }
  },
  mounted(){
    console.log(window)
    console.log('222222wwwww')
    console.log(window.Window.CodePush)
    console.log('kkkkk')
    console.log(window.CodePush)
  },
  methods:{
    getAppVersion(){
      this.appVersion({appId:'enterprise'}).then(res=>{
        if(res.code==1){
          Storage.set('versionParams',res.data);
        }
      })
    },
  }
}
</script>

<style lang="scss">
@import "assets/scss/variate.scss";
@import "assets/scss/global.scss";
</style>


