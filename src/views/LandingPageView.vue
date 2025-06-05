<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import LandPage from '../components/LandingPage/index.vue'
import Lettering from '../components/Lettering/index.ts'

import { gsap, Back } from 'gsap'

const tl = gsap.timeline()

const text = ref('页面施工中.....')

watch(text, () => {
  tl.fromTo('.lettering span',
            { ease: Back.easeOut.config(1.7), opacity: 0, y: -100 },
            { ease: Back.easeOut.config(1.7), opacity: 1, y: 0, stagger: 0.1 })
})

onMounted(() => {
  tl.fromTo('.lettering span',
            { ease: Back.easeOut.config(1.7), opacity: 0, y: -100 },
            { ease: Back.easeOut.config(1.7), opacity: 1, y: 0, stagger: 0.1 })
})

const changeTxt = () => {
  text.value = 'haha'
  console.log('fuck')
}


</script>

<template>
  <Lettering>
    {{ text }}
  </Lettering>

  <div @click="changeTxt">点击</div>

  <!-- "ISLAND" (https://skfb.ly/6DRvZ) by Stéphane Agullo is licensed under Creative Commons Attribution (http://creativecommons.org/licenses/by/4.0/). -->

  <!-- <a href="https://www.vecteezy.com/free-vector/alert">Alert Vectors by Vecteezy</a> -->

  <LandPage></LandPage>
</template>

<style>

</style>
