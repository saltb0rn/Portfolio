<script lang="ts" setup>
import Map from '../components/Map/index.vue'
import Layout from '../components/ArtworkLayout.vue'
</script>

<template>

  <Layout>
    <template #renderer>
      <Map></Map>
    </template>

    <template #title>
      A Map of China
    </template>

    <template #info>
      最早在 BabylonJS 上练习的一个项目, 重构并使用 ThreeJS 实现, 使用 Shader 替代了一些效果, 从而进行优化.
    </template>

  </Layout>

</template>
