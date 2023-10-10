<script setup>
import { usePlayerStore } from '../stores/player'

const player = usePlayerStore()
</script>

<template>
  <div class="fixed bottom-0 left-0 bg-white px-4 py-2 w-full">
    <!-- Track Info -->
    <div class="text-center" v-if="player.currentSong.modifiedName">
      <span class="song-title font-bold">{{ player.currentSong.modifiedName }}</span> by
      <span class="song-artist">{{ player.currentSong.displayName }}</span>
    </div>
    <div class="flex flex-nowrap gap-4 items-center">
      <!-- Play/Pause Button -->
      <button type="button" @click.prevent="player.toggleAudio">
        <i
          class="fa text-gray-500 text-xl"
          :class="{ 'fa-play': !player.playing(), 'fa-pause': player.playing() }"
        ></i>
      </button>
      <!-- Current Position -->
      <div class="player-currenttime">{{ player.seek }}</div>
      <!-- Scrub Container  -->
      <div
        class="w-full h-2 rounded bg-gray-200 relative cursor-pointer"
        @click.prevent="player.updateSeek"
      >
        <!-- Player Ball -->
        <span
          class="absolute -top-2.5 -ml-2.5 text-gray-800 text-lg"
          :style="{ left: player.playerProgress }"
        >
          <i class="fas fa-circle"></i>
        </span>
        <!-- Player Progress Bar-->
        <span
          class="block h-2 rounded bg-gradient-to-r from-green-500 to-green-400"
          :style="{ width: player.playerProgress }"
        ></span>
      </div>
      <!-- Duration -->
      <div class="player-duration">{{ player.duration }}</div>
    </div>
  </div>
</template>

<style scoped></style>
