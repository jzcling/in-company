<template>
    <v-container class="unauthorized">
        <h2 class="text-center red lighten-4 mb-10 rounded">Unauthorized</h2>

        <v-img
            class="mx-auto"
            transition="scale-transition"
            src="@/assets/unauthorized.png"
            contain
            max-height="400"
            max-width="400"
        ></v-img>

        <div class="mt-4 d-flex justify-center">
            <v-btn
                color="teal"
                dark
                @click="redirectToHome"
            >Back To Home</v-btn>
        </div>
    </v-container>
</template>

<script>
export default {
    name: 'Unauthorized',
    data() {
        return {
        }
    },
    created() {
        this.$emit('cancel-loading');
        this.$emit('close-drawer');
    },
    methods: {
        redirectToHome() {
            this.$router.push('/');
            this.$emit('open-drawer');
        }
    }
}
</script>