<template>
    <v-card>
        <v-card-title>
            Profile
        </v-card-title>

        <v-card-text
            max-height="600"
        >
            <div class="d-flex flex-no-wrap align-content-space-around pa-4">
                <div class="d-flex flex-column align-center" style="width: 230px;">
                    <v-avatar size="125">
                        <v-img :src="edit.picture" alt="Profile Picture" />
                    </v-avatar>
                    <v-text-field
                        class="mt-4"
                        v-model="edit.picture"
                        label="Profile Pic URL"
                        outlined
                        dense
                        hide-details="auto"
                        prepend-icon="mdi-camera"
                        @blur="$v.edit.picture.$touch()"
                        :error-messages="validationErrors($v.edit.picture, 'Profile Pic URL')"
                    ></v-text-field>
                    <!-- <v-file-input
                        class="mt-4"
                        :rules="avatarRules"
                        accept="image/png, image/jpeg, image/bmp"
                        prepend-icon="mdi-camera"
                        label="Profile Picture"
                        hide-details="auto"
                        outlined
                        dense
                    ></v-file-input> -->
                </div>

                <div
                    v-if="$vuetify.breakpoint.mdAndUp" 
                    class="grow mx-4"
                >
                    <div class="d-flex">
                        <v-text-field
                            v-model="edit.firstName"
                            label="First Name"
                            outlined
                            dense
                            hide-details="auto"
                            @blur="$v.edit.firstName.$touch()"
                            :error-messages="validationErrors($v.edit.firstName, 'First Name')"
                        ></v-text-field>
                        <v-text-field
                            v-model="edit.lastName"
                            class="ml-2"
                            label="Last Name"
                            outlined
                            dense
                            hide-details="auto"
                            @blur="$v.edit.lastName.$touch()"
                            :error-messages="validationErrors($v.edit.lastName, 'Last Name')"
                        ></v-text-field>
                    </div>
                        
                    <div>
                        <v-text-field
                            v-model="edit.email"
                            class="mt-3"
                            label="Email"
                            outlined
                            dense
                            hide-details="auto"
                            @blur="$v.edit.email.$touch()"
                            :error-messages="validationErrors($v.edit.email, 'Email')"
                        ></v-text-field>
                        <v-text-field
                            v-model="edit.contactNumber"
                            class="mt-3"
                            label="Contact Number"
                            outlined
                            dense
                            hide-details="auto"
                            @blur="$v.edit.contactNumber.$touch()"
                            :error-messages="validationErrors($v.edit.contactNumber, 'Contact Number')"
                        ></v-text-field>
                    </div>
                </div>
            </div>

            <div
                v-if="$vuetify.breakpoint.smAndDown"
            >
                <v-text-field
                    v-model="edit.firstName"
                    label="First Name"
                    outlined
                    dense
                    hide-details="auto"
                    @blur="$v.edit.firstName.$touch()"
                    :error-messages="validationErrors($v.edit.firstName, 'First Name')"
                ></v-text-field>
                <v-text-field
                    v-model="edit.lastName"
                    class="mt-3"
                    label="Last Name"
                    outlined
                    dense
                    hide-details="auto"
                    @blur="$v.edit.lastName.$touch()"
                    :error-messages="validationErrors($v.edit.lastName, 'Last Name')"
                ></v-text-field>
                    
                <v-text-field
                    v-model="edit.email"
                    class="mt-3"
                    label="Email"
                    outlined
                    dense
                    hide-details="auto"
                    @blur="$v.edit.email.$touch()"
                    :error-messages="validationErrors($v.edit.email, 'Email')"
                ></v-text-field>
                <v-text-field
                    v-model="edit.contactNumber"
                    class="mt-3"
                    label="Contact Number"
                    outlined
                    dense
                    hide-details="auto"
                    @blur="$v.edit.contactNumber.$touch()"
                    :error-messages="validationErrors($v.edit.contactNumber, 'Contact Number')"
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
        user: {
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
        async updateUser() {
            this.loading = true;
            try {
                await this.$axios.put(this.$apiBase + '/v1/users/' + this.edit.id, this.edit, this.axiosConfig);
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
                await this.updateUser();
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
        this.edit = JSON.parse(JSON.stringify(this.user));
    },
    validations: {
        edit: {
            firstName: { required },
            lastName: { required },
            email: { required },
            contactNumber: { 
                required,
                internationalNumber(contactNumber) {
                    return /^\+[0-9]*$/.test(contactNumber);
                }
            },
            picture: { urlValidator }
        }
    }
}
</script>

<style scoped lang="scss">
</style>