const CODE_PUSH_DEPLOYMENT_KEY = {
    // android: 'JFaO59XWQSR8ofFyzd6rJpuy9mDm0d356a4b-7b69-4248-b10a-b5b5a185b423', //Production
    android: '0npQwasXEqb-8-FCekaIwWkPHbkU0d356a4b-7b69-4248-b10a-b5b5a185b423', //Staging
    // ios: 'KGapp3pnAv7Z7xdznfBWOG2FIC4D0d356a4b-7b69-4248-b10a-b5b5a185b423', //Production
    ios: '__1o0BBPK6OHrpDLGBkiZHnSCQCN0d356a4b-7b69-4248-b10a-b5b5a185b423', //Staging
}
const app = {
    init() {
        this.bindEvents()
    },
    bindEvents() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    onDeviceReady() {
        StatusBar.overlaysWebView(false);
        StatusBar.backgroundColorByHexString('#1c4156');
        navigator.splashscreen.hide();
        app.checkUpdata()
    },
    checkUpdata() {
        let deploymentKey = '';
        if (CODE_PUSH_DEPLOYMENT_KEY[cordova.platformId]) deploymentKey = CODE_PUSH_DEPLOYMENT_KEY[cordova.platformId]
        codePush.sync((status) => {
            console.log(status)
            console.log('ddd')
            if (status == SyncStatus.INSTALLING_UPDATE) {
                document.getElementById('mask-wrap').style.display = 'none';
                document.getElementById('process-value').innerHTML = 0 + '%'
                document.getElementById('current').style.width = 0 + '%';
                navigator.splashscreen.show();
            }
        }, {
            deploymentKey: deploymentKey,
            installMode: InstallMode.IMMEDIATE
        }, (downloadProgress) => {
            if (downloadProgress) {
                let value = (downloadProgress.receivedBytes / downloadProgress.totalBytes).toFixed(2);
                document.getElementById('mask-wrap').style.display = 'block';
                document.getElementById('process-value').innerHTML = value * 100 + '%'
                document.getElementById('current').style.width = value * 100 + '%'
            } else {
                document.getElementById('mask-wrap').style.display = 'none';
                document.getElementById('process-value').innerHTML = 0 + '%'
                document.getElementById('current').style.width = 0 + '%'
            }
        });
    }
}
app.init()