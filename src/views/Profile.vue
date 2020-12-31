<template>
    <v-container fluid class="profile">
        <template v-if="!loading">
            <template v-if="user">
                <v-card>
                    <v-card-title>Your Profile</v-card-title>
                    
                    <div class="d-flex align-content-center pa-4">
                        <v-avatar :size="$vuetify.breakpoint.mdAndUp ? 125 : 70">
                            <v-img :src="user.picture" alt="Profile Picture" />
                        </v-avatar>

                        <div class="grow">
                            <v-card-title
                                class="headline"
                                v-text="name"
                            />
                                
                            <v-card-subtitle>
                                <div>{{ user.email}}</div>
                                <div>{{ user.contactNumber }}</div>
                            </v-card-subtitle>
                        </div>

                        <v-btn
                            class="icon"
                            color="teal"
                            dark
                            outlined
                            v-bind="size"
                            @click.stop="profileDialog = true"
                        >
                            <v-icon v-bind="size">mdi-pencil</v-icon>
                        </v-btn>

                        <v-dialog
                            v-model="profileDialog"
                            scrollable
                            max-width="1000"
                        >
                            <ProfileEdit
                                :user="user"
                                @close="profileDialog = false; getProfile()"
                            />
                        </v-dialog>
                    </div>
                </v-card>

                <v-card v-if="user.jobCompany" class="mt-4">
                    <v-card-title>Company</v-card-title>

                    <div class="d-flex align-content-center pa-4">
                        <v-avatar :size="$vuetify.breakpoint.mdAndUp ? 125 : 70">
                            <v-img :src="user.jobCompany.logoUrl" alt="Company Logo" />
                        </v-avatar>

                        <div class="grow">
                            <v-card-title
                                class="headline"
                                v-text="user.jobCompany.name"
                            />
                                
                            <v-card-subtitle>
                                <div>{{ user.jobCompany.size}} Employees</div>
                            </v-card-subtitle>
                        </div>

                        <v-btn
                            class="icon"
                            color="teal"
                            dark
                            outlined
                            v-bind="size"
                            @click.stop="companyDialog = true"
                        >
                            <v-icon v-bind="size">mdi-pencil</v-icon>
                        </v-btn>

                        <v-dialog
                            v-model="companyDialog"
                            scrollable
                            max-width="1000"
                        >
                            <CompanyEdit
                                :company="user.jobCompany"
                                @close="companyDialog = false; getProfile()"
                            />
                        </v-dialog>
                    </div>
                </v-card>
            </template>

            <v-card v-else>
                <v-card-title>Error</v-card-title>
                <v-card-text>There was an error loading your profile. Please refresh the page.</v-card-text>
            </v-card>
        </template>
    </v-container>
</template>

<script>
import ProfileEdit from '@/components/ProfileEdit';
import CompanyEdit from '@/components/CompanyEdit';

export default {
    name: 'Profile',
    components: {
        ProfileEdit,
        CompanyEdit
    },
    data() {
        return {
            loading: false,
            error: null,
            user: null,

            profileDialog: false,
            companyDialog: false,

            axiosConfig: {
                headers: {
                    Authorization: 'Bearer ' + this.$auth.token
                }
            }
        }
    },
    computed: {
        name() {
            return this.user.firstName + " " + this.user.lastName;
        },
        size () {
            const size = {xs:'x-small',sm:'small'}[this.$vuetify.breakpoint.name];
            return size ? { [size]: true } : {}
        }
    },
    methods: {
        async getProfile() {
            this.loading = true;
            try {
                var response = await this.$axios.get(this.$apiBase + '/v1/users/' + this.$auth.userId, this.axiosConfig);
                this.user = response.data;
            } catch (e) {
                this.error = e;
            } finally {
                this.loading = false;
                this.$emit('cancel-loading');
            }
        }
    },
    created() {
        this.getProfile();
    },
    watch: {
        '$route': 'getProfile'
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