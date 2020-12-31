<template>
    <v-navigation-drawer 
        app
        v-model="drawer"
    >
        <v-list-item class="my-2">
            <v-list-item-content>
                <v-list-item-title class="d-flex justify-center">
                    <v-img
                        alt="HubbedIn Logo"
                        class="shrink mr-2"
                        contain
                        src="@/assets/logo.jpg"
                        transition="scale-transition"
                        width="150"
                    />
                </v-list-item-title>
                <v-list-item-subtitle class="d-flex justify-center">
                    Go get your dream candidates
                </v-list-item-subtitle>
            </v-list-item-content>
        </v-list-item>

        <v-divider></v-divider>

        <v-list
            dense
            nav
        >
            <v-list-item
                v-for="item in items"
                :key="item.title"
                link
                :to="item.link"
            >
                <v-list-item-icon>
                    <v-icon>{{ item.icon }}</v-icon>
                </v-list-item-icon>

                <v-list-item-content>
                    <v-list-item-title>{{ item.title }}</v-list-item-title>
                </v-list-item-content>
            </v-list-item>
        </v-list>

        <template v-slot:append v-if="$auth.isAuthenticated">
            <div class="pa-2 ma-2">
                <v-btn
                    color="primary" 
                    block
                    @click="logout"
                >
                    Logout
                </v-btn>
            </div>
        </template>
    </v-navigation-drawer>
</template>

<script>
export default {
    name: 'NavDrawer',
    props: {
        open: {
            required: true,
            type: Boolean
        }
    },
    data() {
        return {
            drawer: this.open,
            items: [
                // {
                // title: 'Dashboard', 
                // icon: 'mdi-view-dashboard',
                // link: '/'
                // },
                {
                    title: 'Profile',
                    icon: 'mdi-account',
                    link: '/'
                },
                {
                    title: 'Job Posts',
                    icon: 'mdi-format-list-text',
                    link: '/joblistings'
                },
            ]
        }
    },
    methods: {
        // Log the user out
        logout() {
            this.$auth.logout({
                returnTo: window.location.origin
            });
        }
    },
    watch: {
        drawer(val) {
            if (!val) {
                this.$emit('close-drawer');
            }
        },
        open(val) {
            this.drawer = val;
        }
    }
}
</script>
