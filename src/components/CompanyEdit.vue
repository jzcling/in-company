<template>
    <v-card>
        <v-card-title>
            Company
        </v-card-title>

        <v-card-text
            max-height="600"
        >
            <div class="d-flex flex-no-wrap align-content-space-around pa-4">
                <div class="d-flex flex-column align-center" style="width: 230px;">
                    <v-avatar size="125">
                        <v-img :src="edit.logoUrl" alt="Company Logo" />
                    </v-avatar>
                    <v-text-field
                        class="mt-4"
                        v-model="edit.logoUrl"
                        label="Company Logo URL"
                        outlined
                        dense
                        hide-details="auto"
                        prepend-icon="mdi-camera"
                        @blur="$v.edit.logoUrl.$touch()"
                        :error-messages="validationErrors($v.edit.logoUrl, 'Company Logo URL')"
                    ></v-text-field>
                    <!-- <v-file-input
                        class="mt-4"
                        :rules="avatarRules"
                        accept="image/png, image/jpeg, image/bmp"
                        prepend-icon="mdi-camera"
                        label="Company Logo"
                        hide-details="auto"
                        outlined
                        dense
                    ></v-file-input> -->
                </div>

                <div
                    v-if="$vuetify.breakpoint.mdAndUp" 
                    class="grow mx-4"
                >
                    <v-text-field
                        v-model="edit.name"
                        label="Company Name"
                        outlined
                        dense
                        hide-details="auto"
                        @blur="$v.edit.name.$touch()"
                        :error-messages="validationErrors($v.edit.name, 'Company Name')"
                    ></v-text-field>
                        
                    <v-text-field
                        v-model="edit.size"
                        class="mt-3"
                        label="Company Size"
                        outlined
                        dense
                        hide-details="auto"
                    ></v-text-field>
                </div>
            </div>

            <div
                v-if="$vuetify.breakpoint.smAndDown"
            >
                <v-text-field
                    v-model="edit.name"
                    label="Company Name"
                    outlined
                    dense
                    hide-details="auto"
                    @blur="$v.edit.name.$touch()"
                    :error-messages="validationErrors($v.edit.name, 'Company Name')"
                ></v-text-field>
                <v-text-field
                    v-model="edit.size"
                    class="mt-3"
                    label="Company Size"
                    outlined
                    dense
                    hide-details="auto"
                ></v-text-field>
            </div>
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
import { required, helpers } from 'vuelidate/lib/validators'
const urlValidator = helpers.regex('url', /^https{0,1}:\/\/.*/i);

export default {
    name: 'ProfileEdit',
    mixins: [validationMixin],
    props: {
        company: {
            required: true,
            type: Object
        }
    },
    data() {
        return {
            loading: false,
            error: null,
            edit: {},

            axiosConfig: {
                headers: {
                    Authorization: 'Bearer ' + this.$auth.token
                }
            }
        }
    },
    methods: {
        async updateCompany() {
            this.loading = true;
            try {
                await this.$axios.put(this.$apiBase + '/v1/jobs/companies/' + this.edit.id, this.edit, this.axiosConfig);
            } catch (e) {
                this.error = e;
            } finally {
                this.loading = false;
            }
        },
        async save() {
            this.$v.$touch();
            if (this.$v.$invalid) {
                return;
            }
            
            try {
                await this.updateCompany();
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
            test.internationalNumber === false && errors.push(name + ' needs an international calling code, e.g. +65');
            return errors;
        }
    },
    created() {
        this.edit = JSON.parse(JSON.stringify(this.company));
    },
    validations: {
        edit: {
            name: { required },
            logoUrl: { required, urlValidator },
        }
    }
}
</script>

<style scoped lang="scss">
</style>