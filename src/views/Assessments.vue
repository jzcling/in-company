<template>
    <v-container fluid class="assessments">
        <v-card>
            <v-card-title>
                Assessments
                <v-spacer></v-spacer>
                <v-btn
                    color="teal"
                    dark
                    fab
                    v-bind="size"
                    @click="filterDialog = true"
                >
                    <v-icon v-bind="size">mdi-filter</v-icon>
                </v-btn>

                <v-dialog
                    v-model="filterDialog"
                    scrollable
                    max-width="500"
                >
                    <AssessmentFilter
                        @close="filterDialog = false"
                        @filter="filters=>getAssessments(filters)"
                    />
                </v-dialog>
            </v-card-title>
        </v-card>

        <template v-if="assessments.length > 0">
            <v-row>
                <v-col cols="6" md="3"
                    v-for="(assessment, index) in assessments"
                    :key="index"
                >
                    <v-card>
                        <v-img
                            :height="$vuetify.breakpoint.mdAndUp ? 200 : 150"
                            contain
                            :src="assessment.imageUrl"
                        ></v-img>

                        <v-card-title align="center">
                            <div class="title">{{ assessment.name }}</div>
                        </v-card-title>

                        <v-card-subtitle>
                            <div v-if="assessment.difficulty">{{ assessment.difficulty }}</div>
                            <div v-if="assessment.type">{{ assessment.type }}</div>
                        </v-card-subtitle>

                        <v-card-text>
                            <div class="description">{{ assessment.description }}</div>
                        </v-card-text>

                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn
                                class="px-4"
                                color="blue"
                                dark
                                :to="'/assessments/' + assessment.id"
                            >
                                Show More
                            </v-btn>
                            <v-spacer></v-spacer>
                        </v-card-actions>
                    </v-card>
                </v-col>
            </v-row>
        </template>
    </v-container>
</template>

<script>
import AssessmentFilter from '@/components/AssessmentFilter';

export default {
    name: 'Assessments',
    components: {
        AssessmentFilter
    },
    data() {
        return {
            loading: false,
            error: null,
            assessments: [],

            filterDialog: false,
            
            axiosConfig: {
                headers: {
                    Authorization: 'Bearer ' + this.$auth.token
                }
            }
        }
    },
    computed: {
        size () {
            const size = {xs:'x-small',sm:'small'}[this.$vuetify.breakpoint.name];
            return size ? { [size]: true } : {}
        }
    },
    methods: {
        async getAssessments(filters = null) {
            this.loading = true;
            
            var endpoint = this.$apiBase + '/v1/assessments';
            endpoint += this.getParams(filters);
            
            try {
                var response = await this.$axios.get(endpoint, this.axiosConfig);
                this.assessments = response.data.assessments;
            } catch (e) {
                this.error = e;
            } finally {
                this.loading = false;
                this.$emit('cancel-loading');
            }
        },
        getParams(filters) {
            var params = '';
            if (filters) {
                params = '?';
                for (const key in filters) {
                    if (!Array.isArray(filters[key])) {
                        if (filters[key]) {
                            if (params != '?') {
                                params += '&';
                            }
                            params += key + "=" + encodeURIComponent(filters[key]);
                        }
                    } else {
                        for (const val of filters[key]) {
                            if (val) {
                                if (params != '?') {
                                    params += '&';
                                }
                                params += key + "=" + encodeURIComponent(val);
                            }
                        }
                    }
                }
            }
            return params;
        }
    },
    created() {
        this.getAssessments();
    },
    watch: {
        '$route': () => {
            if (this.assessments.length == 0) {
                this.getAssessments();
            }
        }
    }
}
</script>

<style scoped lang="scss">
.title {
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 1; /* number of lines to show */
    -webkit-box-orient: vertical;
    line-height: 2rem;
    height: 2rem;
}

.description {
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 3; /* number of lines to show */
    -webkit-box-orient: vertical;
    line-height: 1rem;
    height: 3rem;
}
</style>