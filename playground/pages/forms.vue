<script setup lang="ts">
const form = reactive({
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
  country: null,
  interests: [],
  newsletter: false,
  notifications: true,
  bio: '',
})

const countries = [
  'United States',
  'Canada',
  'United Kingdom',
  'Germany',
  'France',
  'Japan',
  'Australia',
]

const interestOptions = [
  'Technology',
  'Design',
  'Business',
  'Science',
  'Arts',
  'Sports',
]

const rules = {
  required: (v: string) => !!v || 'Required',
  email: (v: string) => /.+@.+\..+/.test(v) || 'Invalid email',
  min: (v: string) => v.length >= 8 || 'Min 8 characters',
}

const valid = ref(false)

const submit = () => {
  console.log('Form submitted:', form)
}

const reset = () => {
  form.name = ''
  form.email = ''
  form.password = ''
  form.confirmPassword = ''
  form.country = null
  form.interests = []
  form.newsletter = false
  form.notifications = true
  form.bio = ''
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
                    :rules="[rules.required, rules.min]"
                    prepend-inner-icon="mdi-lock"
                  />
                </v-col>
                
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="form.confirmPassword"
                    label="Confirm Password"
                    type="password"
                    :rules="[rules.required, (v) => v === form.password || 'Passwords must match']"
                    prepend-inner-icon="mdi-lock-check"
                  />
                </v-col>
                
                <v-col cols="12" md="6">
                  <v-select
                    v-model="form.country"
                    label="Country"
                    :items="countries"
                    :rules="[rules.required]"
                    prepend-inner-icon="mdi-earth"
                  />
                </v-col>
                
                <v-col cols="12" md="6">
                  <v-autocomplete
                    v-model="form.interests"
                    label="Interests"
                    :items="interestOptions"
                    multiple
                    chips
                    closable-chips
                    prepend-inner-icon="mdi-tag-multiple"
                  />
                </v-col>
                
                <v-col cols="12">
                  <v-textarea
                    v-model="form.bio"
                    label="Bio"
                    rows="3"
                    auto-grow
                    prepend-inner-icon="mdi-text"
                  />
                </v-col>
                
                <v-col cols="12">
                  <v-switch
                    v-model="form.newsletter"
                    label="Subscribe to newsletter"
                    color="primary"
                  />
                  
                  <v-checkbox
                    v-model="form.notifications"
                    label="Receive email notifications"
                    color="primary"
                  />
                </v-col>
              </v-row>
              
              <v-divider class="my-4" />
              
              <div class="d-flex gap-2">
                <v-btn
                  type="submit"
                  color="primary"
                  :disabled="!valid"
                >
                  Submit
                </v-btn>
                <v-btn
                  variant="outlined"
                  @click="reset"
                >
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
        
        <v-card class="mt-4">
          <v-card-title>Input Variants</v-card-title>
          <v-card-text>
            <v-text-field
              label="Outlined (default)"
              variant="outlined"
              class="mb-4"
            />
            <v-text-field
              label="Filled"
              variant="filled"
              class="mb-4"
            />
            <v-text-field
              label="Solo"
              variant="solo"
              class="mb-4"
            />
            <v-text-field
              label="Underlined"
              variant="underlined"
            />
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>
