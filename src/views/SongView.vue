<script setup>
import { useRoute, useRouter } from 'vue-router'
import { computed, onBeforeMount, ref, watch } from 'vue'
import { auth, commentsCollection, songsCollection } from '../includes/firebase'
import { useUserStore } from '../stores/user'

const router = useRouter()
const route = useRoute()
const user = useUserStore()

const song = ref({})
const comments = ref([])
const sort = ref('1')
const inSubmission = ref(false)
const showAlert = ref(false)
const alertVariant = ref('bg-blue-500')
const alertMsg = ref('Please wait')

const schema = {
  comment: 'required|min:3'
}

const sortedComments = computed(() =>
  comments.value
    .slice()
    .sort((a, b) =>
      sort.value === '1'
        ? new Date(b.datePosted) - new Date(a.datePosted)
        : new Date(a.datePosted) - new Date(b.datePosted)
    )
)

async function addComment(values, { resetForm }) {
  inSubmission.value = true
  showAlert.value = true
  alertVariant.value = 'bg-blue-500'
  alertMsg.value = 'Please wait'

  const comment = {
    content: values.comment,
    datePosted: new Date().toString(),
    sid: route.params.id,
    name: auth.currentUser.displayName,
    uid: auth.currentUser.uid
  }

  await commentsCollection.add(comment)
  song.value.commentCount += 1
  await songsCollection.doc(route.params.id).update({ commentCount: song.value.commentCount })

  await getComments()

  inSubmission.value = false
  alertVariant.value = 'bg-green-500'
  alertMsg.value = 'Comment added'
  resetForm()
}

async function getComments() {
  const snapshots = await commentsCollection.where('sid', '==', route.params.id).get()
  comments.value = []

  snapshots.forEach((doc) => {
    comments.value.push({ docId: doc.id, ...doc.data() })
  })
}

watch(sort, (newVal) => {
  if (newVal === route.query.sort) return

  router.push({ query: { sort: newVal } })
})

onBeforeMount(async () => {
  const docSnapshot = await songsCollection.doc(route.params.id).get()
  if (!docSnapshot.exists) {
    router.push({ name: 'home' })
    return
  }

  const { sort: sortFromQuery } = route.query

  sort.value = sortFromQuery === '1' || sortFromQuery === '2' ? sortFromQuery : '1'

  song.value = docSnapshot.data()
  await getComments()
})
</script>

<template>
  <!-- Music Header -->
  <section class="w-full mb-8 py-14 text-center text-white relative">
    <div
      class="absolute inset-0 w-full h-full box-border bg-contain music-bg"
      style="background-image: url(/assets/img/song-header.png)"
    ></div>
    <div class="container mx-auto flex items-center">
      <!-- Play/Pause Button -->
      <button
        type="button"
        class="z-50 h-24 w-24 text-3xl bg-white text-black rounded-full focus:outline-none"
      >
        <i class="fas fa-play"></i>
      </button>
      <div class="z-50 text-left ml-8">
        <!-- Song Info -->
        <div class="text-3xl font-bold">{{ song.modifiedName }}</div>
        <div>{{ song.genre }}</div>
      </div>
    </div>
  </section>
  <!-- Form -->
  <section class="container mx-auto mt-6">
    <div class="bg-white rounded border border-gray-200 relative flex flex-col">
      <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200">
        <!-- Comment Count -->
        <span class="card-title">Comments ({{ song.commentCount }})</span>
        <i class="fa fa-comments float-right text-green-400 text-2xl"></i>
      </div>
      <div class="p-6">
        <div
          class="text-white text-center font-bold p-4 mb-4"
          v-if="showAlert"
          :class="alertVariant"
        >
          {{ alertMsg }}
        </div>
        <vee-form :validation-schema="schema" @submit="addComment" v-if="user.userLoggedIn">
          <vee-field
            as="textarea"
            name="comment"
            class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded mb-4"
            placeholder="Your comment here..."
          ></vee-field>
          <error-message name="comment" class="text-red-600" />
          <button
            type="submit"
            class="py-1.5 px-3 rounded text-white bg-green-600 block"
            :disabled="inSubmission"
          >
            Submit
          </button>
        </vee-form>
        <!-- Sort Comments -->
        <select
          v-model="sort"
          class="block mt-4 py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
        >
          <option value="1">Latest</option>
          <option value="2">Oldest</option>
        </select>
      </div>
    </div>
  </section>
  <!-- Comments -->
  <ul class="container mx-auto">
    <li
      class="p-6 bg-gray-50 border border-gray-200"
      v-for="comment in sortedComments"
      :key="comment.docId"
    >
      <!-- Comment Author -->
      <div class="mb-5">
        <div class="font-bold">{{ comment.name }}</div>
        <time>{{ comment.datePosted }}</time>
      </div>

      <p>{{ comment.content }}</p>
    </li>
  </ul>
</template>

<style scoped></style>
