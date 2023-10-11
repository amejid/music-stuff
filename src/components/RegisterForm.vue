<script setup>
import { ref } from 'vue'
import { useUserStore } from '../stores/user'

const user = useUserStore()

const userData = {
  country: 'Germany'
}
const schema = {
  name: 'required|min:3|max:100|alpha_spaces',
  email: 'required|min:3|max:100|email',
  age: 'required|min_value:18|max_value:100',
  password: 'required|min:9|max:100|excluded:password,12345',
  confirm_password: 'passwords_mismatch:@password',
  country: 'required|country_excluded:Antarctica',
  tos: 'tos'
}
const regInSubmission = ref(false)
const regShowAlert = ref(false)
const regAlertVariant = ref('bg-blue-500')
const regAlertMsg = ref('Please wait! Your account is being created')

async function register(values) {
  regShowAlert.value = true
  regInSubmission.value = true
  regAlertVariant.value = 'bg-blue-500'
  regAlertMsg.value = 'Please wait! Your account is being created'
  try {
    await user.createUser(values)
  } catch (err) {
    regInSubmission.value = false
    regAlertVariant.value = 'bg-red-500'
    regAlertMsg.value = 'An unexpected error occurred. Please try again.'
    return
  }

  regAlertVariant.value = 'bg-green-500'
  regAlertMsg.value = 'Success! Your account has been created.'
  window.location.reload()
}
</script>

<template>
  <div>
    <div
      class="text-white text-center font-bold p-4 rounded mb-4"
      v-if="regShowAlert"
      :class="regAlertVariant"
    >
      {{ regAlertMsg }}
    </div>
    <vee-form :validation-schema="schema" @submit="register" :initial-values="userData">
      <!-- Name -->
      <div class="mb-3">
        <label class="inline-block mb-2">Name</label>
        <vee-field
          name="name"
          type="text"
          class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
          placeholder="Enter Name"
        />
        <error-message name="name" class="text-red-600" />
      </div>
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
      <!-- Age -->
      <div class="mb-3">
        <label class="inline-block mb-2">Age</label>
        <vee-field
          type="number"
          name="age"
          class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
        />
        <error-message name="age" class="text-red-600" />
      </div>
      <!-- Password -->
      <div class="mb-3">
        <label class="inline-block mb-2">Password</label>
        <vee-field name="password" :bails="false" v-slot="{ field, errors }">
          <input
            type="password"
            class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
            placeholder="Password"
            v-bind="field"
          />
          <div class="text-red-600" v-for="error in errors" :key="error">
            {{ error }}
          </div>
        </vee-field>
      </div>
      <!-- Confirm Password -->
      <div class="mb-3">
        <label class="inline-block mb-2">Confirm Password</label>
        <vee-field
          name="confirm_password"
          type="password"
          class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
          placeholder="Confirm Password"
        />
        <error-message name="confirm_password" class="text-red-600" />
      </div>
      <!-- Country -->
      <div class="mb-3">
        <label class="inline-block mb-2">Country</label>
        <vee-field
          as="select"
          name="country"
          class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
        >
          <option value="USA">USA</option>
          <option value="Mexico">Mexico</option>
          <option value="Germany">Germany</option>
          <option value="Antarctica">Antarctica</option>
        </vee-field>
        <error-message name="country" class="text-red-600" />
      </div>
      <!-- TOS -->
      <div class="mb-3 pl-6">
        <vee-field
          name="tos"
          value="1"
          type="checkbox"
          class="w-4 h-4 float-left -ml-6 mt-1 rounded"
        />
        <i18n-t class="inline-block" keypath="register.accept" tag="label" scope="global">
          <a href="#">{{ $t('register.tos') }}</a>
        </i18n-t>
        <br />
        <error-message name="tos" class="text-red-600" />
      </div>
      <button
        type="submit"
        class="block w-full bg-purple-600 text-white py-1.5 px-3 rounded transition hover:bg-purple-700"
        :disabled="regInSubmission"
      >
        Submit
      </button>
    </vee-form>
  </div>
</template>

<style scoped></style>
