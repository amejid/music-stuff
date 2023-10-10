<script setup>
import { ref } from 'vue'
import { songsCollection, storage } from '../includes/firebase'

const props = defineProps({
  song: {
    type: Object,
    required: true
  },
  idx: {
    type: Number,
    required: true
  }
})

const emit = defineEmits(['updateSong', 'removeSong'])

const title = ref(props.song.modifiedName)
const genre = ref(props.song.genre)
const showForm = ref(false)
const inSubmission = ref(false)
const showAlert = ref(false)
const alertVariant = ref('bg-blue-500')
const alertMsg = ref('Please wait! Updating song info')

const schema = {
  modifiedName: 'required',
  genre: 'alpha_spaces'
}

function toggle() {
  showForm.value = !showForm.value
}

async function edit(values) {
  inSubmission.value = true
  showAlert.value = true
  alertVariant.value = 'bg-blue-500'
  alertMsg.value = 'Please wait! Updating song info'

  try {
    await songsCollection.doc(props.song.docId).update(values)
  } catch (err) {
    inSubmission.value = false
    alertVariant.value = 'bg-red-500'
    alertMsg.value = 'Something went wrong'
    return
  }

  emit('updateSong', props.idx, values)

  inSubmission.value = false
  alertVariant.value = 'bg-green-500'
  alertMsg.value = 'Success'
}

async function deleteSong() {
  const storageRef = storage.ref()
  const songRef = storageRef.child(`songs/${props.song.originalName}`)

  await songRef.delete()

  await songsCollection.doc(props.song.docId).delete()

  emit('removeSong', props.idx)
}
</script>

<template>
  <div class="border border-gray-200 p-3 mb-4 rounded">
    <div v-show="!showForm">
      <h4 class="inline-block text-2xl font-bold">{{ song.modifiedName }}</h4>
      <button
        class="ml-1 py-1 px-2 text-sm rounded text-white bg-red-600 float-right"
        @click.prevent="deleteSong"
      >
        <i class="fa fa-times"></i>
      </button>
      <button
        class="ml-1 py-1 px-2 text-sm rounded text-white bg-blue-600 float-right"
        @click.prevent="toggle"
      >
        <i class="fa fa-pencil-alt"></i>
      </button>
    </div>
    <div v-show="showForm">
      <div class="text-white text-center font-bold p-4 mb-4" v-if="showAlert" :class="alertVariant">
        {{ alertMsg }}
      </div>
      <vee-form :validation-schema="schema" @submit="edit">
        <div class="mb-3">
          <label class="inline-block mb-2">Song Title</label>
          <vee-field
            type="text"
            name="modifiedName"
            class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
            placeholder="Enter Song Title"
            v-model="title"
          />
          <error-message name="modifiedName" class="text-red-600" />
        </div>
        <div class="mb-3">
          <label class="inline-block mb-2">Genre</label>
          <vee-field
            type="text"
            name="genre"
            class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
            placeholder="Enter Genre"
            v-model="genre"
          />
          <error-message name="genre" class="text-red-600" />
        </div>
        <button
          type="submit"
          class="py-1.5 px-3 rounded text-white bg-green-600"
          :disabled="inSubmission"
        >
          Submit
        </button>
        <button
          type="button"
          class="py-1.5 px-3 rounded text-white bg-gray-600"
          @click.prevent="toggle"
          :disabled="inSubmission"
        >
          Go Back
        </button>
      </vee-form>
    </div>
  </div>
</template>

<style scoped></style>
