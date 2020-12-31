<template>
    <v-app>
        <NavDrawer 
            v-if="navdrawer"
            :open="openDrawer"
            @close-drawer="openDrawer = false"
        ></NavDrawer>

        <AppBar 
            v-if="appbar"
            @toggle-nav-drawer="openDrawer = !openDrawer"
        ></AppBar>

        <v-main>
            <v-overlay 
                v-if="loading"
                absolute
                opacity="0.2"
            >
                <v-progress-circular
                    :size="50"
                    :width="5"
                    color="indigo lighten-1"
                    indeterminate
                ></v-progress-circular>
            </v-overlay>

            <router-view
                @cancel-loading="loading = false"
                @close-drawer="navdrawer = false"
                @open-drawer="navdrawer = true"
            ></router-view>
        </v-main>
    </v-app>
</template>

<script>
import NavDrawer from './components/NavDrawer';
import AppBar from './components/AppBar';

export default {
    name: 'App',

    components: {
        NavDrawer,
        AppBar
    },

    data() {
        return {
            loading: true,
            navdrawer: true,
            appbar: true,

            openDrawer: this.$vuetify.breakpoint.mdAndUp
        }
    }
};
</script>

<style>
@import "~vue-wysiwyg/dist/vueWysiwyg.css";
</style>
