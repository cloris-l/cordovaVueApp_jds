import Vue from 'vue'
document.addEventListener("backbutton", onBackKeyDown, false);
let exitAppTicker=0;
function onBackKeyDown(){
    let url = location.href
    let index = url.indexOf('#');
    let path = url.substring(index+1)
    if(path=='/'||path=='/amountFF'||path=='/dynamic'||path=='/eleEnergy'||path=='/diagnose'){
        if(exitAppTicker == 0){
            exitAppTicker++;
            Toast("再点一次退出");
            setTimeout(function(){
                    exitAppTicker = 0;
            },2000);
        }else if(exitAppTicker == 1){
                navigator.app.exitApp(); //退出app
        } 
    }else if(path=='/login'){
        navigator.app.exitApp(); //退出app
    }
    else{
        history.back();
    }
}