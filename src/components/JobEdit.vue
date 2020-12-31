<template>
    <v-card>
        <v-row class="no-gutters">
            <v-col cols="auto">
                <v-img
                    height="80px"
                    width="80px"
                    contain
                    :src="edit.company.logoUrl"
                    class="ma-4"
                ></v-img>
            </v-col>

            <v-col cols="grow">
                <v-card-title>
                    <v-text-field
                        v-model="edit.title"
                        label="Job Title"
                        outlined
                        dense
                        hide-details="auto"
                        @blur="$v.edit.title.$touch()"
                        :error-messages="validationErrors($v.edit.title, 'Job Title')"
                    ></v-text-field>    
                </v-card-title>

                <v-card-subtitle>
                    <div class="d-flex align-center mt-4">
                        {{ edit.company.name }} • 
                        <v-text-field
                            class="ml-2"
                            v-model="edit.location"
                            label="Location"
                            outlined
                            dense
                            hide-details="auto"
                            @blur="$v.edit.location.$touch()"
                            :error-messages="validationErrors($v.edit.location, 'Location')"
                        ></v-text-field>
                    </div>
                </v-card-subtitle>
            </v-col>
        </v-row>

        <v-card-text>
            <v-row>
                <v-col cols="12">
                    <v-combobox
                        v-model="edit.skills"
                        :items="skills"
                        item-text="name"
                        label="Skills"
                        outlined
                        multiple
                        chips
                        dense
                        hide-details
                    ></v-combobox>
                </v-col>
                <v-col cols="12">
                    <wysiwyg v-model="edit.description"></wysiwyg>
                </v-col>

                <v-col cols="12" md="6">
                    <v-menu
                        v-model="startAtMenu"
                        :close-on-content-click="false"
                        :nudge-right="40"
                        transition="scale-transition"
                        offset-y
                        min-width="290px"
                    >
                        <template v-slot:activator="{ on, attrs }">
                            <v-text-field
                                v-model="startAt"
                                label="Start On"
                                prepend-icon="mdi-calendar"
                                readonly
                                v-bind="attrs"
                                v-on="on"
                                outlined
                                dense
                                hide-details="auto"
                                clearable
                                @blur="$v.edit.startAt.$touch()"
                                :error-messages="validationErrors($v.edit.startAt, 'Start At')"
                            ></v-text-field>
                        </template>
                        <v-date-picker
                            ref="picker"
                            v-model="startAt"
                            @input="startAtMenu = false"
                            :min="new Date().toISOString().substr(0, 10)"
                        ></v-date-picker>
                    </v-menu>
                </v-col>

                
                <v-col cols="12" md="6">
                    <v-menu
                        v-model="expireAtMenu"
                        :close-on-content-click="false"
                        :nudge-right="40"
                        transition="scale-transition"
                        offset-y
                        min-width="290px"
                    >
                        <template v-slot:activator="{ on, attrs }">
                            <v-text-field
                                v-model="expireAt"
                                label="Expire On"
                                prepend-icon="mdi-calendar"
                                readonly
                                v-bind="attrs"
                                v-on="on"
                                outlined
                                dense
                                hide-details="auto"
                                clearable
                            ></v-text-field>
                        </template>
                        <v-date-picker
                            ref="picker"
                            v-model="expireAt"
                            @input="expireAtMenu = false"
                            :min="new Date().toISOString().substr(0, 10)"
                        ></v-date-picker>
                    </v-menu>
                </v-col>

                <v-col cols="12" md="6">
                    <div>Salary</div>
                    <div class="d-flex align-center">
                        <v-text-field
                            v-model="edit.salaryCurrency"
                            label="Currency"
                            outlined
                            dense
                            hide-details="auto"
                        ></v-text-field>
                        
                        <v-text-field
                            class="ml-2"
                            v-model="edit.minSalary"
                            label="Min"
                            outlined
                            dense
                            hide-details="auto"
                        ></v-text-field>
                        
                        <div class="mx-2"> to </div>

                        <v-text-field
                            v-model="edit.maxSalary"
                            label="Max"
                            outlined
                            dense
                            hide-details="auto"
                        ></v-text-field>
                    </div>
                </v-col>

                <v-col cols="12" md="6">
                    <div>Seniority Level</div>
                    <div>
                        <v-select
                            v-model="edit.seniorityLevel"
                            :items="seniorityLevels"
                            single-line
                            outlined
                            dense
                            hide-details
                        ></v-select>
                    </div>
                </v-col>

                <v-col cols="12" md="6">
                    <div>Experience (Years)</div>
                    <div>    
                        <v-text-field
                            v-model="edit.yearsExperience"
                            outlined
                            dense
                            hide-details="auto"
                            type="number"
                        ></v-text-field>  
                    </div>
                </v-col>

                <v-col cols="12" md="6">
                    <div>Employment Type</div>
                    <div>
                        <v-select
                            v-model="edit.employmentType"
                            :items="employmentTypes"
                            single-line
                            outlined
                            dense
                            hide-details="auto"
                            @blur="$v.edit.employmentType.$touch()"
                            :error-messages="validationErrors($v.edit.employmentType, 'Employment Type')"
                        ></v-select>
                    </div>
                </v-col>
                
                <v-col cols="12" md="6">
                    <div>Job Function</div>
                    <div>
                        <v-combobox
                            v-model="edit.function"
                            :items="jobFunctions"
                            item-text="name"
                            outlined
                            dense
                            hide-details
                        ></v-combobox>
                    </div>
                </v-col>
                
                <v-col cols="12" md="6">
                    <div>Industry</div>
                    <div>
                        <v-combobox
                            v-model="edit.industry"
                            :items="industries"
                            item-text="name"
                            outlined
                            dense
                            hide-details
                        ></v-combobox>
                    </div>
                </v-col>

                <v-col cols="12" md="6">
                    <div>Remote Position Available?</div>
                    <div>
                        <v-select
                            v-model="edit.remote"
                            :items="yesNo"
                            single-line
                            outlined
                            dense
                            hide-details
                        ></v-select>
                    </div>
                </v-col>
                
                <v-col cols="12" md="6">
                    <div>Company Size</div>
                    <div>{{ edit.company.size }}</div>
                </v-col>
            </v-row>
        </v-card-text>

        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
                color="error"
                @click="$emit('close')"
            >Cancel</v-btn>
            <v-btn
                color="teal"
                dark
                @click="save"
            >Save</v-btn>
        </v-card-actions>
    </v-card>
</template>

<script>
import { validationMixin } from 'vuelidate'
import { required } from 'vuelidate/lib/validators'

export default {
    name: 'JobEdit',
    mixins: [validationMixin],
    props: {
        job: {
            required: true,
            type: Object
        },
        method: {
            required: true,
            type: String
        }
    },
    data() {
        return {
            loading: false,
            error: null,
            edit: {},

            skills: [],
            jobFunctions: [],
            industries: [],

            seniorityLevels : ["Entry", "Experienced", "Manager", "Director", "Top Management"],
            employmentTypes: ["Full-Time", "Part-Time", "Contract", "Temporary", "Freelance"],

            yesNo: [
                {
                    text: 'Yes',
                    value: true
                },
                {
                    text: 'No',
                    value: false
                }
            ],

            startAt: null,
            expireAt: null,
            startAtMenu: false,
            expireAtMenu: false,

            axiosConfig: {
                headers: {
                    Authorization: 'Bearer ' + this.$auth.token
                }
            }
        }
    },
    methods: {
        getData() {
            this.getSkills();
            this.getJobFunctions();
            this.getIndustries();
        },
        async getSkills() {
            try {
                var response = await this.$axios.get(this.$apiBase + '/v1/skills', this.axiosConfig);
                this.skills = response.data.skills;
            } catch (e) {
                this.error = e;
            }
        },
        async getJobFunctions() {
            try {
                var response = await this.$axios.get(this.$apiBase + '/v1/jobfunctions', this.axiosConfig);
                this.jobFunctions = response.data.jobFunctions;
            } catch (e) {
                this.error = e;
            }
        },
        async getIndustries() {
            try {
                var response = await this.$axios.get(this.$apiBase + '/v1/industries', this.axiosConfig);
                this.industries = response.data.industries;
            } catch (e) {
                this.error = e;
            }
        },
        
        async updateOrCreateJob() {
            var existingSkills = this.skills.map(skill => skill.name);
            for (var skill of this.edit.skills) {
                // if skill does not exist, create it
                if (!skill.id && !existingSkills.includes(skill)) {
                    skill = await this.createSkill(skill);
                    this.edit.skillId.push(skill.id);
                }
            }

            var existingJobFunctions = this.jobFunctions.map(jobFunction => jobFunction.name);
            // if job function does not exist, create it
            if (!this.edit.function.id && !existingJobFunctions.includes(this.edit.function)) {
                let jobFunction = await this.createJobFunction(this.edit.function);
                this.edit.jobFunctionId = jobFunction.id;
            }
            
            var existingIndustries = this.industries.map(industry => industry.name);
            // if industry does not exist, create it
            if (!this.edit.industry.id && !existingIndustries.includes(this.edit.industry)) {
                let industry = await this.createIndustry(this.edit.industry);
                this.edit.industryId = industry.id;
            }

            if (this.method == 'put') {
                await this.updateJob();
            } else if (this.method == 'post') {
                await this.createJob();
            }
        },
        async createJob() {
            try {
                var response = await this.$axios.post(this.$apiBase + '/v1/joblistings', this.edit, this.axiosConfig);
                return response.data;
            } catch (e) {
                this.error = e;
            }
        },
        async updateJob() {
            try {
                var response = await this.$axios.put(this.$apiBase + '/v1/joblistings/' + this.edit.id, this.edit, this.axiosConfig);
                return response.data;
            } catch (e) {
                this.error = e;
            }
        },
        async createSkill(skill) {
            try {
                var response = await this.$axios.post(this.$apiBase + '/v1/skills', {
                    name: skill
                }, this.axiosConfig);
                return response.data;
            } catch (e) {
                this.error = e;
            }
        },
        async createJobFunction(jobFunction) {
            try {
                var response = await this.$axios.post(this.$apiBase + '/v1/jobfunctions', {
                    name: jobFunction
                }, this.axiosConfig);
                return response.data;
            } catch (e) {
                this.error = e;
            }
        },
        async createIndustry(industry) {
            try {
                var response = await this.$axios.post(this.$apiBase + '/v1/industries', {
                    name: industry
                }, this.axiosConfig);
                return response.data;
            } catch (e) {
                this.error = e;
            }
        },
        async save() {
            this.$v.$touch();
            if (this.$v.$invalid) {
                return;
            }
            
            try {
                await this.updateOrCreateJob();
            } catch (e) {
                this.error = e;
            } finally {
                this.$emit('close');
            }
        },
        
        validationErrors(test, name) {
            const errors = [];
            if (!test.$dirty) return errors;
            test.required === false && errors.push(name + ' is required.');
            return errors;
        }
    },
    created() {
        this.getData();
        this.edit = JSON.parse(JSON.stringify(this.job));
        if (this.edit.startAt) {
            this.startAt = new Date(this.edit.startAt).toISOString().substr(0, 10);
        }
        if (this.edit.expireAt) {
            this.expireAt = new Date(this.edit.expireAt).toISOString().substr(0, 10);
        }
    },
    watch: {
        'edit.skills': {
            handler(val) {
                this.edit.skillId = [];
                for (let skill of val) {
                    if (skill.id) {
                        this.edit.skillId.push(Number(skill.id));
                    }
                }
            }
        },
        'edit.function': {
            handler(val) {
                if (val.id) {
                    this.edit.functionId = val.id
                }
            }
        },
        'edit.industry': {
            handler(val) {
                if (val.id) {
                    this.edit.industryId = val.id
                }
            }
        },
        startAt: {
            handler(val) {
                this.edit.startAt = new Date(val);
            }
        },
        expireAt: {
            handler(val) {
                this.edit.expireAt = new Date(val);
            }
        }
    },
    validations: {
        edit: {
            title: { required },
            location: { required },
            description: { required },
            startAt: { required },
            employmentType: { required }
        }
    }
}
</script>

<style scoped lang="scss">
</style>