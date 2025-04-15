<script setup>
import AuthProvider from '@/views/pages/authentication/AuthProvider.vue'
import authV1BottomShape from '@images/svg/auth-v1-bottom-shape.svg?url'
import authV1TopShape from '@images/svg/auth-v1-top-shape.svg?url'
import { AuthenticationDetails, CognitoUser, CognitoUserPool } from 'amazon-cognito-identity-js'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

// Import the Pinia store
import { useAuthStore } from '@/auth'

// Configure your Cognito User Pool
const poolData = {
  UserPoolId: 'ap-south-1_lCMCna2RL',
  ClientId: '7mdvqnncbbn2s8m668ip9jus5o',
}

const userPool = new CognitoUserPool(poolData)

const form = ref({
  email: '',
  password: '',
  remember: false,
})

const isPasswordVisible = ref(false)
const router = useRouter()

// Get an instance of the auth store
const authStore = useAuthStore()


const userEmail = ref('')


// Function to log user name and group after login
const handleSubmit = () => {
  // Create authentication details using form values
  const authData = new AuthenticationDetails({
    Username: form.value.email,
    Password: form.value.password,
  })

  const userData = {
    Username: form.value.email,
    Pool: userPool,
  }

  const cognitoUser = new CognitoUser(userData)

  // Authenticate the user
  cognitoUser.authenticateUser(authData, {
    onSuccess: result => {
      console.log('User successfully signed in.')
      console.log('Access token:', result.getAccessToken().getJwtToken())

      // Decode the ID Token (JWT) to extract group information
      const idToken = result.getIdToken().getJwtToken()
      const payload = JSON.parse(atob(idToken.split('.')[1]))
      let group = 'Standard' // default if groups not found
      if (payload["cognito:groups"]) {
        if (payload["cognito:groups"].includes("Gold")) {
          group = "Gold"
        } else if (payload["cognito:groups"].includes("Silver")) {
          group = "Silver"
        } else {
          group = payload["cognito:groups"][0]
        }
      }
      console.log("User group:", group)

      // Retrieve user attributes to get the user's name
      cognitoUser.getUserAttributes((err, attributes) => {
        let email
        if (err) {
          console.error('Error getting user attributes:', err)

          // Fallback: Log the username
          console.log('User name (fallback):', cognitoUser.getUsername())
        } else {
          // Look for the attribute named "name"
          const nameAttr = attributes.find(attr => attr.getName() === 'name')
          const name = nameAttr ? nameAttr.getValue() : cognitoUser.getUsername()

          console.log('User name:', name)

          // Look for the attribute named "email"
          const emailAttr = attributes.find(attr => attr.getName() === 'email')

          const email = emailAttr ? emailAttr.getValue() : form.value.email
          
          userEmail.value = email
          console.log('User email:', userEmail.value)

          authStore.setUserInfo(name, email, group)
        }
      })

      // Optionally, redirect to the dashboard if needed.
      router.push('/dashboard')
    },
    onFailure: error => {
      console.error('Error during sign-in:', error)
    },
  })
}

definePageMeta({ layout: 'blank' })
</script>

<template>
  <div class="auth-wrapper d-flex align-center justify-center pa-4">
    <div class="position-relative my-sm-16">
      <!-- Top and Bottom shapes -->
      <VImg
        :src="authV1TopShape"
        class="text-primary auth-v1-top-shape d-none d-sm-block"
      />
      <VImg
        :src="authV1BottomShape"
        class="text-primary auth-v1-bottom-shape d-none d-sm-block"
      />
      <!-- Auth Card -->
      <VCard
        class="auth-card"
        max-width="460"
        :class="$vuetify.display.smAndUp ? 'pa-6' : 'pa-0'"
      >
        <VCardItem class="justify-center">
          <NuxtLink
            to="/"
            class="app-logo"
          >
            <div
              class="d-flex"
            >
              <img
                src="/favicon.ico"
                alt="Logo"
                style=" block-size: 24px;inline-size: 24px;"
              >
            </div>
            <h1 class="app-logo-title">
              TallyFy.AI
            </h1>
          </NuxtLink>
        </VCardItem>
        <VCardText>
          <h4 class="text-h4 mb-1">
            Welcome to TallyFy.AI! 👋🏻
          </h4>
          <p class="mb-0">
            Please sign-in to your account and start the adventure
          </p>
        </VCardText>
        <VCardText>
          <VForm @submit.prevent="handleSubmit">
            <VRow>
              <VCol cols="12">
                <VTextField
                  :id="useId()"
                  v-model="form.email"
                  autofocus
                  label="Email or Username"
                  type="email"
                  placeholder="johndoe@email.com"
                />
              </VCol>
              <VCol cols="12">
                <VTextField
                  :id="useId()"
                  v-model="form.password"
                  label="Password"
                  placeholder="············"
                  :type="isPasswordVisible ? 'text' : 'password'"
                  autocomplete="password"
                  :append-inner-icon="isPasswordVisible ? 'bx-hide' : 'bx-show'"
                  @click:append-inner="isPasswordVisible = !isPasswordVisible"
                />
                <div class="d-flex align-center justify-space-between flex-wrap my-6">
                  <VCheckbox
                    :id="useId()"
                    v-model="form.remember"
                    label="Remember me"
                  />
                  <a
                    class="text-primary"
                    href="javascript:void(0)"
                  >Forgot Password?</a>
                </div>
                <VBtn
                  block
                  type="submit"
                >
                  Login
                </VBtn>
              </VCol>
              <VCol
                cols="12"
                class="text-body-1 text-center"
              >
                <span class="d-inline-block">New on our platform?</span>
                <NuxtLink
                  class="text-primary ms-1 d-inline-block text-body-1"
                  to="/register"
                >
                  Create an account
                </NuxtLink>
              </VCol>
              <VCol
                cols="12"
                class="d-flex align-center"
              >
                <VDivider />
                <span class="mx-4 text-high-emphasis">or</span>
                <VDivider />
              </VCol>
              <VCol
                cols="12"
                class="text-center"
              >
                <AuthProvider />
              </VCol>
            </VRow>
          </VForm>
        </VCardText>
      </VCard>
    </div>
  </div>
</template>

<style lang="scss">
@use "@core/scss/template/pages/page-auth";
</style>
