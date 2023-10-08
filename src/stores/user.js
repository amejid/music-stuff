import { defineStore } from 'pinia'
import { ref } from 'vue'
import { auth, usersCollection } from '../includes/firebase'

export const useUserStore = defineStore('user', () => {
  const userLoggedIn = ref(false)

  async function createUser(values) {
    const userCred = await auth.createUserWithEmailAndPassword(values.email, values.password)

    await usersCollection.doc(userCred.user.uid).set({
      name: values.name,
      email: values.email,
      age: values.age,
      country: values.country
    })

    await userCred.user.updateProfile({ displayName: values.name })

    userLoggedIn.value = true
  }

  async function authenticate(values) {
    await auth.signInWithEmailAndPassword(values.email, values.password)
    userLoggedIn.value = true
  }

  return { createUser, authenticate, userLoggedIn }
})
