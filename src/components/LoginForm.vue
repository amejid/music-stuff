<script setup>
import { ref } from 'vue'
import { useUserStore } from '../stores/user'

const user = useUserStore()
const loginSchema = {
  email: 'required|email',
  password: 'required|min:9|max:100'
}
const loginInSubmission = ref(false)
const loginShowAlert = ref(false)
const loginAlertVariant = ref('bg-blue-500')
const loginAlertMsg = ref('Please wait! We are logging you in')

async function login(values) {
  loginShowAlert.value = true
  loginInSubmission.value = true
  loginAlertVariant.value = 'bg-blue-500'
  loginAlertMsg.value = 'Please wait! We are logging you in'

  try {
    await user.authenticate(values)
  } catch (err) {
    loginInSubmission.value = false
    loginAlertVariant.value = 'bg-red-500'
    loginAlertMsg.value = 'Invalid login details'
    return
  }

  loginAlertVariant.value = 'bg-green-500'
  loginAlertMsg.value = 'Success! You are now logged in.'
  window.location.reload()
}
</script>

<template>
  <div>
    <div
      class="text-white text-center font-bold p-4 mb-4"
      v-if="loginShowAlert"
      :class="loginAlertVariant"
    >
      {{ loginAlertMsg }}
    </div>
    <vee-form :validation-schema="loginSchema" @submit="login">
      <!-- Email -->
      <div class="mb-3">
        <label class="inline-block mb-2">Email</label>
        <vee-field
          name="email"
          type="email"
          class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
          placeholder="Enter Email"
        />
        <error-message name="email" class="text-red-600" />
      </div>
      <!-- Password -->
      <div class="mb-3">
        <label class="inline-block mb-2">Password</label>
        <vee-field
          name="password"
          type="password"
          class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
          placeholder="Password"
        />
        <error-message name="password" class="text-red-600" />
      </div>
      <button
        type="submit"
        class="block w-full bg-purple-600 text-white py-1.5 px-3 rounded transition hover:bg-purple-700"
        :disabled="loginInSubmission"
      >
        Submit
      </button>
    </vee-form>
  </div>
</template>

<style scoped></style>
