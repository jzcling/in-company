<template>
    <v-container fluid class="joblistings">
        <template v-if="!loading">
            <Joblisting
                v-if="job"
                :job="job"
            ></Joblisting>

            <v-card v-else>
                <v-card-title>Error</v-card-title>
                <v-card-text>There was an error loading this job. Please refresh the page.</v-card-text>
            </v-card>
        </template>
    </v-container>
</template>

<script>
import Joblisting from '@/components/Joblisting';

export default {
    name: 'Joblistings',
    components: {
        Joblisting
    },
    data() {
        return {
            loading: false,
            error: null,
            job: null,

            axiosConfig: {
                headers: {
                    Authorization: 'Bearer ' + this.$auth.token
                }
            }
        }
    },
    methods: {
        async getJob() {
            this.loading = true;
            try {
                var response = await this.$axios.get(this.$apiBase + '/v1/joblistings/' + this.$route.params.id, this.axiosConfig);
                this.job = response.data;
            } catch (e) {
                this.error = e;
            } finally {
                this.loading = false;
                this.$emit('cancel-loading');
            }
        },
    },
    created() {
        this.getJob();
    },
    watch: {
        '$route': 'getJob'
    }
}
</script>

<style scoped lang="scss">
</style>