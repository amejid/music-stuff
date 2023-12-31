<script setup>
import { onBeforeUnmount, reactive, ref } from 'vue'
import { auth, songsCollection, storage } from '../includes/firebase'

const emit = defineEmits(['addSong'])

const isDragOver = ref(false)
const uploads = reactive([])

function dragEnable() {
  isDragOver.value = true
}

function dragDisable() {
  isDragOver.value = false
}

function upload(event) {
  dragDisable()

  const files = event.dataTransfer ? [...event.dataTransfer.files] : [...event.target.files]
  files.forEach((file) => {
    if (file.type !== 'audio/mpeg') {
      return
    }
    if (!navigator.onLine) {
      uploads.push({
        task: {},
        currentProgress: 100,
        name: file.name,
        variant: 'bg-red-400',
        icon: 'fas fa-times',
        textClass: 'text-red-400'
      })
      return
    }

    const storageRef = storage.ref()
    const songsRef = storageRef.child(`songs/${file.name}`)
    const task = songsRef.put(file)
    const uploadIdx =
      uploads.push({
        task,
        currentProgress: 0,
        name: file.name,
        variant: 'bg-blue-400',
        icon: 'fas fa-spinner fa-spin',
        textClass: ''
      }) - 1

    task.on(
      'state_changed',
      (snapshot) => {
        uploads[uploadIdx].currentProgress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
      },
      (error) => {
        uploads[uploadIdx].variant = 'bg-red-400'
        uploads[uploadIdx].icon = 'fas fa-times'
        uploads[uploadIdx].textClass = 'text-red-400'
        console.log(error)
      },
      async () => {
        const song = {
          uid: auth.currentUser.uid,
          displayName: auth.currentUser.displayName,
          originalName: task.snapshot.ref.name,
          modifiedName: task.snapshot.ref.name,
          genre: '',
          commentCount: 0
        }
        song.url = await task.snapshot.ref.getDownloadURL()
        const songRef = await songsCollection.add(song)
        const songSnapshot = await songRef.get()
        emit('addSong', songSnapshot)

        uploads[uploadIdx].variant = 'bg-green-400'
        uploads[uploadIdx].icon = 'fas fa-check'
        uploads[uploadIdx].textClass = 'text-green-400'
      }
    )
  })
}

onBeforeUnmount(() => {
  uploads.forEach((upload) => {
    upload.task.cancel()
  })
})
</script>

<template>
  <div class="bg-white rounded border border-gray-200 relative flex flex-col">
    <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200">
      <span class="card-title">Upload</span>
      <i class="fas fa-upload float-right text-green-400 text-2xl"></i>
    </div>
    <div class="p-6">
      <!-- Upload Dropbox -->
      <div
        class="w-full px-10 py-20 rounded text-center cursor-pointer border border-dashed border-gray-400 text-gray-400 transition duration-500 hover:text-white hover:bg-green-400 hover:border-green-400 hover:border-solid"
        :class="{ 'bg-green-400 border-green-400 border-solid': isDragOver }"
        @drag.prevent.stop=""
        @dragstart.prevent.stop=""
        @dragend.prevent.stop="dragDisable"
        @dragover.prevent.stop="dragEnable"
        @dragenter.prevent.stop="dragEnable"
        @dragleave.prevent.stop="dragDisable"
        @drop.prevent.stop="upload($event)"
      >
        <h5>Drop your files here</h5>
      </div>
      <input type="file" multiple @change="upload($event)" />
      <hr class="my-6" />
      <!-- Progess Bars -->
      <div class="mb-4" v-for="upload in uploads" :key="upload.name">
        <!-- File Name -->
        <div class="font-bold text-sm" :class="upload.textClass">
          <i :class="upload.icon"></i>{{ upload.name }}
        </div>
        <div class="flex h-4 overflow-hidden bg-gray-200 rounded">
          <!-- Inner Progress Bar -->
          <div
            class="transition-all progress-bar"
            :class="upload.variant"
            :style="{ width: `${upload.currentProgress}%` }"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
