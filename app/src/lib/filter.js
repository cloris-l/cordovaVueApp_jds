import Vue from 'vue'
Vue.filter('tenThousand', (data) => {
    data = Number(data)
    if (data) {
        if (data >= 10000) {
            data = (data / 10000).toFixed(2) + '万'
        } else {
            data = data.toFixed(2)
        }
    } else data = 0

    return data
})