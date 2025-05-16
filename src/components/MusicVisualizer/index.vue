<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import type { Ref } from 'vue'
import { World } from './main.ts'
import type { MusicInfo } from './typed.ts'
import eventBus from './eventBus.ts'

const emit = defineEmits<{
  loaded: [data: any]
}>()

const output: Ref<HTMLElement | undefined> = ref(undefined)

const world: Ref<World | undefined> = ref(undefined)

eventBus.on('loaded', (musicInfo: MusicInfo) => {
  emit('loaded', musicInfo)
})

function play() {
  if (world.value) {
    if (world.value.state == 2) {
      world.value.pause()
    } else {
      world.value.play()
    }
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
  <div class="render-container" ref="output" @click="play()"></div>
</template>

<style scoped>
.render-container {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
}

@media (hover: hover) {
  .render-container:hover {
    cursor: pointer;
  }
}
</style>
