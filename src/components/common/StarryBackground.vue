<script setup lang="ts">
import { computed } from 'vue'
import type { BackgroundType } from '@/composables/useTimeGreeting'

const props = defineProps<{
  type?: BackgroundType
}>()

const bgStyle = computed(() => {
  switch (props.type ?? 'starry') {
    case 'starry': return 'background: linear-gradient(180deg, #0D1B2A 0%, #1B2838 50%, #0D1B2A 100%)'
    case 'dawn': return 'background: linear-gradient(180deg, #0D1B2A 0%, #2D1B3D 40%, #5C3D5E 70%, #FF8A80 100%)'
    case 'daytime': return 'background: linear-gradient(180deg, #0D1B2A 0%, #1B3A4B 50%, #2D4A5B 100%)'
  }
})

// 预计算星星位置，减少渲染开销
const stars = computed(() => {
  const result = []
  for (let i = 0; i < 20; i++) {
    const size = i % 3 === 0 ? 6 : 4
    result.push({
      left: `${(i * 37 + i * i * 7) % 100}%`,
      top: `${(i * 53 + i * i * 3) % 70}%`,
      delay: `${(i * 0.4) % 5}s`,
      duration: `${2.5 + (i % 3)}s`,
      width: `${size}rpx`,
      height: `${size}rpx`,
      opacity: i % 4 === 0 ? 0.9 : 0.6,
    })
  }
  return result
})
</script>

<template>
  <view class="starry-bg" :style="bgStyle">
    <view
      v-for="(star, i) in stars"
      :key="i"
      class="star"
      :style="{
        left: star.left,
        top: star.top,
        animationDelay: star.delay,
        animationDuration: star.duration,
        width: star.width,
        height: star.height,
        opacity: star.opacity,
      }"
    />
  </view>
</template>

<style lang="scss" scoped>
.starry-bg {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 0;
  overflow: hidden;
  will-change: auto;
}

.star {
  position: absolute;
  border-radius: $radius-full;
  background-color: rgba(255, 255, 255, 0.8);
  animation: twinkle 3s ease-in-out infinite;
  will-change: opacity;
}

@keyframes twinkle {
  0%, 100% { opacity: 0.2; }
  50% { opacity: 1; }
}
</style>
