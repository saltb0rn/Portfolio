<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { Ref } from 'vue'
import { World } from './main.ts'

const output: Ref<HTMLElement | undefined> = ref(undefined)

const world: Ref<World | undefined> = ref(undefined)

const lblText: Ref<string> = ref('Play')

function play() {
  if (world && world.value) {
    if (world.value.state == 2) {
      world.value.pause()
    } else {
      world.value.play()
    }
    const m = {
      0: 'Play',
      1: 'Play',
      2: 'Pause'
    }
    lblText.value = m[world.value.state]    
  }

}

onMounted(() => {
  if (output.value) {
    world.value = new World(output.value)
  }
})

</script>

<template>
  <div class="render-container" ref="output"></div>

  <input type="button"
         class="styled"
         v-model="lblText"
         @click="play()"
         :disabled="world ? false: true">
</template>

<style scoped>
.render-container {
  width: 100%;
  height: 100%;
}
</style>
