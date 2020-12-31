<template>
    <v-container fluid class="assessmentshow">
        <v-alert
            v-if="assessment && !canStart && !canContinue"
            text
            type="error"
        >
            Please try this test again after 3 months
        </v-alert>
        <v-card class="px-4 py-2" v-if="assessment">
            <v-row>
                <v-col cols="12" md="3">
                    <v-img
                        contain
                        :src="assessment.imageUrl"
                    ></v-img>
                </v-col>

                <v-col cols="12" md="9">
                    <v-card-title>
                        {{ assessment.name }}
                    </v-card-title>
                    <v-card-text>
                        <div>{{ subtitle }}</div>
                        <div class="font-weight-bold" v-if="assessment.timeAllowed">Allowed Time: {{ secondsToString(assessment.timeAllowed) }}</div>

                        <div>{{ assessment.description }}</div>

                        <div>{{ assessment.notes }}</div>
                    </v-card-text>
                </v-col>
            </v-row>

            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                    v-if="canStart"
                    class="px-4"
                    color="teal"
                    dark
                    @click="startAssessment"
                >Start</v-btn>
                <v-btn
                    v-if="canContinue"
                    class="px-4"
                    color="teal"
                    dark
                    @click="continueAssessment"
                >Continue</v-btn>
                <v-spacer v-if="$vuetify.breakpoint.smAndDown"></v-spacer>
            </v-card-actions>
        </v-card>
    </v-container>
</template>

<script>
import moment from 'moment';

export default {
    name: 'AssessmentShow',
    props: {
        id: {
            required: true,
            type: String
        }
    },
    data() {
        return {
            loading: false,
            error: null,
            assessment: null,

            axiosConfig: {
                headers: {
                    Authorization: 'Bearer ' + this.$auth.token
                }
            }
        }
    },
    computed: {
        subtitle() {
            var val = '';
            if (this.assessment.difficulty) {
                val = this.assessment.difficulty;
            }
            if (this.assessment.type) {
                if (val != '') {
                    val += ' | '
                }
                val += this.assessment.type;
            }
            return val;
        },
        questions() {
            var val = this.assessment.questions;
            if (this.assessment.randomise && val.length > 0) {
                this.shuffleArray(val);
            }
            if (this.assessment.numQuestions > 0) {
                let limit = Math.min(this.assessment.numQuestions, val.length);
                val = val.slice(0, limit);
            }
            return val;
        },
        canStart() {
            if (this.assessment && this.assessment.attempts.length > 0) {
                let now = moment();
                let lastStarted = moment(this.assessment.attempts[0].startedAt);
                return now.diff(lastStarted, 'months') > 3;
            }
            return true;
        },
        canContinue() {
            if (this.assessment && this.assessment.attempts.length > 0) {
                return this.assessment.attempts[0].status == 'In Progress';
            }
            return false;
        }
    },
    methods: {
        async getAssessment() {
            this.loading = true;
            try {
                var response = await this.$axios.get(this.$apiBase + '/v1/assessments/' + this.id, this.axiosConfig);
                this.assessment = response.data;
            } catch (e) {
                this.error = e;
            } finally {
                this.loading = false;
                this.$emit('cancel-loading');
            }
        },
        async startAssessment() {
            this.loading = true;
            let attempt = {
                assessmentId: this.id,
                candidateId: this.$auth.userId,
                status: 'In Progress',
                startedAt: new Date(),
                score: -1,
                questions: this.questions
            }
            try {
                var response = await this.$axios.post(this.$apiBase + '/v1/assessmentattempts', attempt, this.axiosConfig);
            } catch (e) {
                this.error = e;
            } finally {
                this.loading = false;
                this.$router.push('/assessmentattempts/' + response.data.id);
            }
        },
        continueAssessment() {
            this.$router.push('/assessmentattempts/' + this.assessment.attempts[0].id);
        },
        secondsToString(sec) {
            var days = Math.floor((sec % 31536000) / 86400); 
            var hours = Math.floor(((sec % 31536000) % 86400) / 3600);
            var minutes = Math.floor((((sec % 31536000) % 86400) % 3600) / 60);
            var seconds = (((sec % 31536000) % 86400) % 3600) % 60;

            var val = '';
            if (days) {
                val += days;
                if (days > 1) {
                    val += ' days ';
                } else {
                    val += ' day ';
                }
            }
            if (hours) {
                val += hours;
                if (hours > 1) {
                    val += ' hours ';
                } else {
                    val += ' hour ';
                }
            }
            if (minutes) {
                val += minutes;
                if (minutes > 1) {
                    val += ' minutes ';
                } else {
                    val += ' minute ';
                }
            }
            if (seconds) {
                val += seconds;
                if (seconds > 1) {
                    val += ' seconds';
                } else {
                    val += ' second';
                }
            }
            return val.trim();
        },
        shuffleArray(array) {
            for (let i = array.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [array[i], array[j]] = [array[j], array[i]];
            }
        }
    },
    created() {
        this.getAssessment();
    },
    watch: {
        '$route': 'getAssessment'
    }
}
</script>

<style scoped lang="scss">
</style>