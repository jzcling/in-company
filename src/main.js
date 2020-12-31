import Vue from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify';

import Axios from 'axios'

import wysiwyg from "vue-wysiwyg";
Vue.use(wysiwyg, {});

Vue.prototype.$axios = Axios;
Vue.prototype.$apiBase = process.env.VUE_APP_API_BASE_URL;

// Import the Auth0 configuration
import { domain, clientId } from "../auth_config.json";

// Import the plugin here
import { Auth0Plugin } from "./auth";

// Install the authentication plugin here
Vue.use(Auth0Plugin, {
    domain,
    clientId,
    onRedirectCallback: appState => {
        router.push(
            appState && appState.targetUrl
            ? appState.targetUrl
            : window.location.pathname
        );
    }
});

Vue.config.productionTip = false

new Vue({
    router,
    vuetify,
    render: h => h(App)
}).$mount('#app')
