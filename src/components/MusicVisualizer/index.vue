<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { Ref } from 'vue'
import { World } from './main.ts'

const output: Ref<HTMLElement | undefined> = ref(undefined)

let world: World | null = null

function play() {
  if (world) {
    world.scene.musicMgr.play()
  }
}

onMounted(() => {
  if (output.value) {
    world = new World(output.value)
  }
})

</script>

<template>
  <div class="render-container" ref="output"></div>

  <input type="button"
         class="styled"
         value="Play"
         @click="play"
         :disabled="world ? true: false">
</template>

<style scoped>
.render-container {
  width: 100%;
  height: 100%;
}
</style>
