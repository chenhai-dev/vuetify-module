<script setup lang="ts">
import {ref,reactive} from "vue";

const form = reactive({
  name: '',
  email: '',
  password: '',
  country: null as string | null,
  interests: [] as string[],
  newsletter: false,
  bio: '',
})

const countries = ['United States', 'Canada', 'United Kingdom', 'Germany', 'France', 'Japan']
const interestOptions = ['Technology', 'Design', 'Business', 'Science', 'Arts']

const rules = {
  required: (v: string) => !!v || 'Required',
  email: (v: string) => /.+@.+\..+/.test(v) || 'Invalid email',
}

const valid = ref(false)

const submit = () => {
  console.log('Form submitted:', form)
}

const reset = () => {
  Object.assign(form, {
    name: '',
    email: '',
    password: '',
    country: null,
    interests: [],
    newsletter: false,
    bio: '',
  })
}
</script>

<template>
  <div>
    <h1 class="text-h4 mb-6">Forms Demo</h1>

    <v-row>
      <v-col cols="12" lg="8">
        <v-card>
          <v-card-title>Registration Form</v-card-title>
          <v-card-text>
            <v-form v-model="valid" @submit.prevent="submit">
              <v-row>
                <v-col cols="12" md="6">
                  <v-text-field
                      v-model="form.name"
                      label="Full Name"
                      :rules="[rules.required]"
                      prepend-inner-icon="mdi-account"
                  />
                </v-col>

                <v-col cols="12" md="6">
                  <v-text-field
                      v-model="form.email"
                      label="Email"
                      type="email"
                      :rules="[rules.required, rules.email]"
                      prepend-inner-icon="mdi-email"
                  />
                </v-col>

                <v-col cols="12" md="6">
                  <v-text-field
                      v-model="form.password"
                      label="Password"
                      type="password"
                      :rules="[rules.required]"
                      prepend-inner-icon="mdi-lock"
                  />
                </v-col>

                <v-col cols="12" md="6">
                  <v-select
                      v-model="form.country"
                      label="Country"
                      :items="countries"
                      prepend-inner-icon="mdi-earth"
                  />
                </v-col>

                <v-col cols="12">
                  <v-autocomplete
                      v-model="form.interests"
                      label="Interests"
                      :items="interestOptions"
                      multiple
                      chips
                      closable-chips
                  />
                </v-col>

                <v-col cols="12">
                  <v-textarea
                      v-model="form.bio"
                      label="Bio"
                      rows="3"
                      auto-grow
                  />
                </v-col>

                <v-col cols="12">
                  <v-switch
                      v-model="form.newsletter"
                      label="Subscribe to newsletter"
                      color="primary"
                  />
                </v-col>
              </v-row>

              <v-divider class="my-4" />

              <div class="d-flex gap-2">
                <v-btn type="submit" color="primary" :disabled="!valid">
                  Submit
                </v-btn>
                <v-btn variant="outlined" @click="reset">
                  Reset
                </v-btn>
              </div>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" lg="4">
        <v-card>
          <v-card-title>Form Data</v-card-title>
          <v-card-text>
            <pre class="text-body-2">{{ JSON.stringify(form, null, 2) }}</pre>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>