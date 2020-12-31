<template>
    <v-container fluid class="joblistings">
        <template v-if="!loading">
            <template v-if="jobs && jobs.length > 0">
                <v-row>
                    <v-col cols="12" md="4">
                        <v-list three-line>
                            <template v-for="(item, index) in jobs">
                                <v-divider
                                    v-if="index > 0"
                                    :key="'divider-'+index"
                                    inset
                                ></v-divider>

                                <v-list-item
                                    :key="index"
                                    @click="clickJob(item)"
                                >
                                    <v-list-item-avatar>
                                        <v-img :src="item.company.logoUrl"></v-img>
                                    </v-list-item-avatar>

                                    <v-list-item-content>
                                        <v-list-item-title>{{ item.title }}</v-list-item-title>
                                        <v-list-item-subtitle>{{ item.company.name }} • {{ item.location }}</v-list-item-subtitle>
                                        <v-list-item-subtitle>{{ parseTimeAgo(item.updatedAt) }}</v-list-item-subtitle>
                                    </v-list-item-content>

                                    <v-icon
                                        v-if="item.remote"
                                        small
                                        color="red"
                                        class="icon"
                                    >mdi-remote</v-icon>
                                </v-list-item>
                            </template>
                        </v-list>
                    </v-col>

                    <v-col md="8" v-if="$vuetify.breakpoint.mdAndUp">
                        <Joblisting
                            v-if="selectedJob"
                            :job="selectedJob"
                        ></Joblisting>
                    </v-col>
                </v-row>
            </template>

            <v-card v-else-if="jobs && jobs.length < 1">
                <v-card-title>Create Your First Job Listing</v-card-title>
                <v-card-text>You have no job listings yet. Create one using the + button on the bottom right to attract candidates now!</v-card-text>
            </v-card>

            <v-card v-else>
                <v-card-title>Error</v-card-title>
                <v-card-text>There was an error loading job posts. Please refresh the page.</v-card-text>
            </v-card>
        </template>

        <v-btn
            fixed
            bottom
            right
            fab
            color="teal"
            dark
            @click="jobDialog = true"
        >
            <v-icon>mdi-plus</v-icon>
        </v-btn>

        <v-dialog
            v-model="jobDialog"
            scrollable
            max-width="1000"
        >
            <JobEdit
                :job="emptyJob"
                method="post"
                @close="jobDialog = false; getJobs"
            ></JobEdit>
        </v-dialog>
    </v-container>
</template>

<script>
import Joblisting from '@/components/Joblisting';
import JobEdit from '@/components/JobEdit';
import moment from 'moment';

export default {
    name: 'Joblistings',
    components: {
        Joblisting,
        JobEdit
    },
    data() {
        return {
            loading: false,
            error: null,
            jobs: null,
            selectedJob: null,
            emptyJob: {
                companyId: this.$auth.companyId,
                company: {},
                function: {
                    name: null
                },
                industry: {
                    name: null
                }
            },

            jobDialog: false,

            axiosConfig: {
                headers: {
                    Authorization: 'Bearer ' + this.$auth.token
                }
            }
        }
    },
    methods: {
        async getJobs() {
            this.loading = true;
            try {
                var response = await this.$axios.get(this.$apiBase + '/v1/joblistings?companyId=' + this.$auth.companyId, this.axiosConfig);
                this.jobs = response.data.jobPosts;
                if (this.jobs && this.jobs.length > 0) {
                    this.selectedJob = this.jobs[0];
                }
            } catch (e) {
                this.error = e;
            } finally {
                this.loading = false;
                this.$emit('cancel-loading');
            }
        },
        async getCompany() {
            try {
                var response = await this.$axios.get(this.$apiBase + '/v1/jobs/companies?id=' + this.$auth.companyId, this.axiosConfig);
                if (response.data && response.data.companies && response.data.companies.length > 0) {
                    this.emptyJob.company = response.data.companies[0];
                }
            } catch (e) {
                this.error = e;
            }
        },
        clickJob(job) {
            if (this.$vuetify.breakpoint.mdAndUp) {
                this.selectedJob = job;
            } else {
                this.$router.push('/joblistings/' + job.id);
            }
        },
        parseTimeAgo(date) {
            return moment(date).fromNow()
        }
    },
    created() {
        this.getJobs();
        this.getCompany();
    },
    watch: {
        '$route': 'getJobs'
    }
}
</script>

<style scoped lang="scss">
.icon {
    position: absolute;
    top: 8px;
    right: 8px;
}
</style>