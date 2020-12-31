<template>
    <v-card>
        <v-row class="no-gutters">
            <v-col cols="auto">
                <v-img
                    height="80px"
                    width="80px"
                    contain
                    :src="data.company.logoUrl"
                    class="ma-4"
                ></v-img>
            </v-col>

            <v-col cols="grow">
                <v-card-title>
                    {{ data.title }}    
                </v-card-title>

                <v-card-subtitle>
                    <div>{{ data.company.name }} • {{ data.location }}</div>
                    <div>{{ parseTimeAgo(data.updatedAt) }}</div>
                </v-card-subtitle>
            </v-col>

            <v-btn
                class="icon"
                color="teal"
                dark
                outlined
                v-bind="size"
                @click.stop="editDialog = true"
            >
                <v-icon v-bind="size">mdi-pencil</v-icon>
            </v-btn>

            <v-dialog
                v-model="editDialog"
                scrollable
                max-width="1000"
            >
                <JobEdit
                    :job="job"
                    method="put"
                    @close="editDialog = false; getJob()"
                />
            </v-dialog>
        </v-row>

        <v-chip-group column class="mx-4">
            <v-chip
                v-for="skill in data.skills"
                :key="skill.id"
                color="indigo lighten-1"
                dark
            >{{ skill.name }}</v-chip>
        </v-chip-group>
            
        <v-card-text v-html="data.description"></v-card-text>

        <v-card-text>
            <v-row>
                <v-col cols="12" md="6" v-if="salaryRange">
                    <div>Salary</div>
                    <div>{{ salaryRange }}</div>
                </v-col>

                <v-col cols="12" md="6" v-if="data.seniorityLevel">
                    <div>Seniority Level</div>
                    <div>{{ data.seniorityLevel }}</div>
                </v-col>

                <v-col cols="12" md="6" v-if="data.employmentType">
                    <div>Employment Type</div>
                    <div>{{ data.employmentType }}</div>
                </v-col>

                <v-col cols="12" md="6" v-if="data.company.size > 0">
                    <div>Company Size</div>
                    <div>{{ data.company.size }}</div>
                </v-col>
                
                <v-col cols="12" md="6" v-if="data.function">
                    <div>Job Function</div>
                    <div>{{ data.function.name }}</div>
                </v-col>
                
                <v-col cols="12" md="6" v-if="data.industry">
                    <div>Industry</div>
                    <div>{{ data.industry.name }}</div>
                </v-col>

                <v-col cols="12" md="6">
                    <div>Remote Position Available</div>
                    <div>{{ data.remote ? 'Yes' : 'No' }}</div>
                </v-col>
            </v-row>
        </v-card-text>
    </v-card>
</template>

<script>
import JobEdit from '@/components/JobEdit';
import moment from 'moment';

export default {
    name: 'Joblisting',
    components: {
        JobEdit
    },
    props: {
        job: {
            required: true,
            type: Object
        }
    },
    data() {
        return {
            loading: false,
            error: null,
            data: null,

            editDialog: false,

            axiosConfig: {
                headers: {
                    Authorization: 'Bearer ' + this.$auth.token
                }
            }
        }
    },
    computed: {
        salaryRange() {
            var range = '';
            if (this.data.salaryCurrency) {
                range += this.data.salaryCurrency + " ";
            }
            if (this.data.minSalary > 0) {
                range += this.data.minSalary;
            }
            if (this.data.maxSalary > 0) {
                if (this.data.minSalary > 0) {
                    range += ' - ' + this.data.maxSalary;
                } else {
                    range += this.data.maxSalary;
                }
            }
            return range;
        },
        
        size () {
            const size = {xs:'x-small',sm:'small'}[this.$vuetify.breakpoint.name];
            return size ? { [size]: true } : {}
        }
    },
    methods: {
        async getJob() {
            this.loading = true;
            try {
                var response = await this.$axios.get(this.$apiBase + '/v1/joblistings/' + this.job.id, this.axiosConfig);
                this.data = response.data;
            } catch (e) {
                this.error = e;
            } finally {
                this.loading = false;
                this.$emit('cancel-loading');
            }
        },
        parseTimeAgo(date) {
            return moment(date).fromNow()
        }
    },
    created() {
        this.data = JSON.parse(JSON.stringify(this.job));
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