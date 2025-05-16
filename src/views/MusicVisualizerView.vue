<script setup lang="ts">
import Layout from '../components/ArtworkLayout.vue'
import { ref, type Ref } from 'vue'
import MusicVisualizer from '../components/MusicVisualizer/index.vue'
import type { MusicInfo } from '../components/MusicVisualizer/typed.ts'

const music = ref()
const musicInfo: Ref<MusicInfo> = ref({ cover: '', title: '' })

function musicLoaded(data: MusicInfo) {
  musicInfo.value = data
}

</script>

<template>

  <Layout>
    <template #renderer>
      <MusicVisualizer ref="music" @loaded="musicLoaded"></MusicVisualizer>
    </template>

    <template #title>
      Gabor/Voronoi Mix Music Visualizer
    </template>

    <template #info>
      项目来源: <a href="https://www.youtube.com/watch?v=QRpCmBZpBU0&ab_channel=Visionary3D">YouTube</a>, 结合 Gabor Noise 和 Voronoi Noise 两种噪声来实现视觉效果, 视频没有给出最终代码, 为此参照思路并做出了一些调整得到目前的效果.
    </template>

    <template #extra>
      <div class="musicinfo border-1">
        <p>演示曲目: {{ musicInfo.title }}</p>
        <div class="cover">
          <img :src="musicInfo.cover" />
        </div>
      </div>

      <div class="instruction border-1">
        <p>点击进行播放</p>
      </div>
    </template>
  </Layout>

</template>

<style scoped>
.instruction,
.musicinfo {
  border: .1rem solid var(--border-color-basic);
  margin-top: 1.6rem;
}

.instruction p,
.musicinfo p {
  padding: .2rem .5rem;
}

.musicinfo .cover {
  padding: 1rem;
}

.musicinfo .cover img {
  width: 100%;
  object-fit: contain;
}
</style>
