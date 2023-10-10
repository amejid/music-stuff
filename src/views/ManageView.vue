<script setup>
import UploadMusic from '../components/UploadMusic.vue'
import { auth, songsCollection } from '../includes/firebase'
import { onBeforeMount, reactive } from 'vue'
import CompositionItem from '../components/CompositionItem.vue'

const songs = reactive([])

onBeforeMount(async () => {
  const snapshot = await songsCollection.where('uid', '==', auth.currentUser.uid).get()

  snapshot.forEach((doc) => {
    const song = { ...doc.data(), docId: doc.id }
    songs.push(song)
  })
})

function updateSong(i, values) {
  songs[i].modifiedName = values.modifiedName
  songs[i].genre = values.genre
}
</script>

<template>
  <section class="container mx-auto mt-6">
    <div class="md:grid md:grid-cols-3 md:gap-4">
      <div class="col-span-1">
        <upload-music />
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
              :updateSong="updateSong"
            />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped></style>
