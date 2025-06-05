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
      最早在 BabylonJS 上练习的一个项目, 使用 ThreeJS 实现.
    </template>

  </Layout>

</template>
