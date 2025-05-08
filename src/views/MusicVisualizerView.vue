<script setup lang="ts">
import MusicVisualizer from '../components/MusicVisualizer/index.vue'
</script>

<template>
  <div class="layout">
    <div class="render border-4">
      <MusicVisualizer></MusicVisualizer>
    </div>

    <div class="intro">
      <h3 class="title border-5">Gabor/Voronoi Mix Music Visualizer</h3>

      <div>项目来源于: https://www.youtube.com/watch?v=QRpCmBZpBU0&ab_channel=Visionary3D</div>

      <div>油管上还有很多其他的音频可视化教程或 Demo, 这个项目并没有提供成品源代码</div>

      <div>对于第一次尝试使用 three.js 做音频可视化的人来说, 算是比较友好</div>
    </div>
  </div>
</template>

<style scoped src="../assets/creation.css"></style>
