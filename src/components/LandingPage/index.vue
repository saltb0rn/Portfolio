<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, type Ref } from 'vue'
import { World } from './main.ts'

const output: Ref<HTMLElement | undefined> = ref()
const world: Ref<World | undefined> = ref()

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
</template>

<style scoped>
.render-container {
  width: 31.25rem;
  height: 31.25rem;
}
</style>
