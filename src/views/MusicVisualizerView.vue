<script setup lang="ts">
import { ref, onMounted } from 'vue'
import MusicVisualizer from '../components/MusicVisualizer/index.vue'

const music = ref()

onMounted(() => {
  if (music.value) {
    console.log(music.value.getCover())
  }
})

</script>

<template>
  <div class="layout">
    <div class="render border-4">
      <MusicVisualizer ref="music"></MusicVisualizer>
    </div>

    <div class="intro">

      <div class="description">

        <h3 class="title border-5">Gabor/Voronoi Mix Music Visualizer</h3>

        <div>

          <div>项目来源: <a href="https://www.youtube.com/watch?v=QRpCmBZpBU0&ab_channel=Visionary3D">YouTube</a></div>

        <div>结合 Gabor Noise 和 Voronoi Noise 两种噪声来实现视觉效果.</div>

        <div>视频没有给出最终代码, 为此参照思路并做出了一些调整得到目前的效果.</div>
        
        </div>

      </div>

      <div class="musicinfo">
        <div>演示曲目: 街头霸王 6 的 Mr. Top Player (Jamie's Theme).</div>
        <img />
      </div>

      <div class="instruction">
        点击进行播放
      </div>
    </div>

  </div>
</template>

<style scoped src="../assets/creation.css"></style>
