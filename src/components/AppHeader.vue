<script setup>
import { useModalStore } from '../stores/modal'
import { useUserStore } from '../stores/user'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { computed } from 'vue'

const router = useRouter()
const route = useRoute()
const modal = useModalStore()
const user = useUserStore()
const i18n = useI18n({})

const currentLocale = computed(() => {
  return i18n.locale.value === 'am' ? 'Amharic' : 'English'
})

function toggleAuthModal() {
  modal.toggle()
}

function signOut() {
  user.signOut()

  if (route.meta.requiresAuth) {
    router.replace({ name: 'home' })
  }
}

function changeLocale() {
  i18n.locale.value = i18n.locale.value === 'am' ? 'en' : 'am'
}
</script>

<template>
  <header id="header" class="bg-gray-700">
    <nav class="container mx-auto flex justify-start items-center py-5 px-4">
      <!-- App Name -->
      <router-link
        class="text-white font-bold uppercase text-2xl mr-4"
        :to="{ name: 'home' }"
        exact-active-class="no-active"
      >
        Music
      </router-link>

      <div class="flex flex-grow items-center">
        <!-- Primary Navigation -->
        <ul class="flex flex-row mt-1">
          <!-- Navigation Links -->
          <li>
            <router-link to="/about" class="px-2 text-white">About</router-link>
          </li>
          <li v-if="!user.userLoggedIn">
            <a class="px-2 text-white" href="#" @click.prevent="toggleAuthModal"
              >Login / Register</a
            >
          </li>
          <template v-else>
            <li>
              <router-link class="px-2 text-white" :to="{ name: 'manage' }">Manage</router-link>
            </li>
            <li>
              <a class="px-2 text-white" href="#" @click.prevent="signOut">Logout</a>
            </li>
          </template>
        </ul>
        <ul class="ml-auto">
          <li>
            <a href="#" class="px-2 text-white" @click.prevent="changeLocale">
              {{ currentLocale }}
            </a>
          </li>
        </ul>
      </div>
    </nav>
  </header>
</template>

<style scoped></style>
