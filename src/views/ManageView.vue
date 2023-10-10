<script setup>
import UploadMusic from '../components/UploadMusic.vue'
import { auth, songsCollection } from '../includes/firebase'
import { onBeforeMount, reactive, ref } from 'vue'
import CompositionItem from '../components/CompositionItem.vue'
import { onBeforeRouteLeave } from 'vue-router'

const songs = reactive([])
const unsavedFlag = ref(false)

onBeforeMount(async () => {
  const snapshot = await songsCollection.where('uid', '==', auth.currentUser.uid).get()

  snapshot.forEach(addSong)
})

onBeforeRouteLeave((to, from, next) => {
  if (!unsavedFlag.value) {
    next()
  } else {
    const leave = confirm('You have unsaved changes')
    next(leave)
  }
})

function updateSong(i, values) {
  songs[i].modifiedName = values.modifiedName
  songs[i].genre = values.genre
}

function removeSong(i) {
  songs.splice(i, 1)
}

function addSong(doc) {
  const song = { ...doc.data(), docId: doc.id }
  songs.push(song)
}

function updateUnsavedFlag(value) {
  unsavedFlag.value = value
}
</script>

<template>
  <section class="container mx-auto mt-6">
    <div class="md:grid md:grid-cols-3 md:gap-4">
      <div class="col-span-1">
        <upload-music @add-song="addSong" />
      </div>
      <div class="col-span-2">
        <div class="bg-white rounded border border-gray-200 relative flex flex-col">
          <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200">
            <span class="card-title">My Songs</span>
            <i class="fa fa-compact-disc float-right text-green-400 text-2xl"></i>
          </div>
          <div class="p-6">
            <!-- Composition Items -->
            <composition-item
              v-for="(song, i) in songs"
              :key="song.docId"
              :idx="i"
              :song="song"
              @update-song="updateSong"
              @remove-song="removeSong"
              @update-unsaved-flag="updateUnsavedFlag"
            />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped></style>
