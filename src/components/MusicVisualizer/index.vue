<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import type { Ref } from 'vue'
import { World } from './main.ts'
import { State } from './typed.ts'

const output: Ref<HTMLElement | undefined> = ref(undefined)

const world: Ref<World | undefined> = ref(undefined)

const lblText: Ref<string> = ref('Play')

function play() {
  if (world.value) {
    if (world.value.state == 2) {
      world.value.pause()
    } else {
      world.value.play()
    }
    const m = {
      [State.STOPED]: 'Play',
      [State.PAUSED]: 'Play',
      [State.PLAYING]: 'Pause'
    }
    lblText.value = m[world.value.state]
  }

}

onMounted(() => {
  if (output.value) {
    world.value = new World(output.value)
  }
})

onBeforeUnmount(() => {
  if (world.value) {
    world.value.dispose()
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
