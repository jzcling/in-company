<template>
    <v-card>
        <v-card-title>
            Filter Assessments
        </v-card-title>

        <v-card-text>
            <v-text-field
                class="pt-1"
                v-model="filters.name"
                label="Search"
                prepend-inner-icon="mdi-magnify"
                outlined
                dense
                hide-details="auto"
            ></v-text-field>

            <v-row class="mt-4">
                <v-col cols="12" md="3" class="pb-0">Difficulty</v-col>
                <v-col cols="12" md="9" class="pt-0">
                    <v-chip-group
                        active-class="indigo white--text"
                        v-model="filters.difficulty"
                        column
                        multiple
                    >
                        <v-chip
                            v-for="level in difficultyLevels"
                            :key="level"
                            :value="level"
                        >{{ level }}</v-chip>
                    </v-chip-group>
                </v-col>

                <v-col cols="12" md="3" class="pb-0">Type</v-col>
                <v-col cols="12" md="9" class="pt-0">
                    <v-chip-group
                        active-class="indigo white--text"
                        v-model="filters.type"
                        column
                        multiple
                    >
                        <v-chip
                            v-for="type in types"
                            :key="type"
                            :value="type"
                        >{{ type }}</v-chip>
                    </v-chip-group>
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
                @click="filter"
            >Filter</v-btn>
        </v-card-actions>
    </v-card>
</template>

<script>
export default {
    name: 'AssessmentFilter',
    data() {
        return {
            loading: false,
            error: null,
            filters: {
                name: null,
                difficulty: [],
                type: []
            },

            difficultyLevels: ['Junior', 'Senior', 'Expert'],
            types: ['Multiple Choice', 'Coding', 'Open', 'Mixed'],

            axiosConfig: {
                headers: {
                    Authorization: 'Bearer ' + this.$auth.token
                }
            }
        }
    },
    methods: {
        async filter() {
            this.$emit('close');
            this.$emit('filter', this.filters);
        },
    }
}
</script>

<style scoped lang="scss">
</style>