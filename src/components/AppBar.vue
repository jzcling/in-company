<template>
    <v-app-bar
        app
        color="primary"
        dark
    >
        <v-app-bar-nav-icon
            v-if="$vuetify.breakpoint.smAndDown"
            @click.stop="$emit('toggle-nav-drawer')"
        ></v-app-bar-nav-icon>

        <div class="d-flex align-center">
            <h2>HubbedIn</h2>
        </div>

        <v-spacer></v-spacer>
    </v-app-bar>
</template>

<script>
export default {
    name: 'AppBar',
    props: {
        // title: {
        //     required: true,
        //     type: String
        // }
    },

    data() {
        return {

        }
    }
}
</script>