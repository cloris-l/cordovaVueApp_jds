import Vue from 'vue'
import appSelect from '../components/appSelect.vue'
Vue.component('appSelect', appSelect)

import 'mint-ui/lib/style.min.css';
import { Button, DatetimePicker, TabContainer, TabContainerItem, Popup, Toast, Actionsheet, Loadmore, Indicator, InfiniteScroll, Picker, Progress } from 'mint-ui';

Vue.component(Button.name, Button);
Vue.component(DatetimePicker.name, DatetimePicker);
Vue.component(TabContainer.name, TabContainer);
Vue.component(TabContainerItem.name, TabContainerItem);
Vue.component(Popup.name, Popup);
Vue.component(Actionsheet.name, Actionsheet);
Vue.component(Loadmore.name, Loadmore);
Vue.component(Picker.name, Picker);
Vue.component(Progress.name, Progress);
Vue.use(InfiniteScroll);
window.Toast = Toast;
import VueAwesomeSwiper from 'vue-awesome-swiper'
import 'swiper/dist/css/swiper.css'
Vue.use(VueAwesomeSwiper, /* { default global options } */ )