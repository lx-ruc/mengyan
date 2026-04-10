<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  score: number
  size?: 'sm' | 'md' | 'lg'
}>()

const stars = computed(() => {
  const normalized = Math.round(props.score * 5)
  return Array.from({ length: 5 }, (_, i) => i < normalized)
})

const sizeClass = computed(() => `match-score--${props.size ?? 'md'}`)

const colorClass = computed(() => {
  if (props.score >= 0.7) return 'match-score--high'
  if (props.score >= 0.4) return 'match-score--mid'
  return 'match-score--low'
})
</script>

<template>
  <view class="match-score" :class="[sizeClass, colorClass]">
    <text
      v-for="(filled, i) in stars"
      :key="i"
      class="match-score__star"
      :class="{ 'match-score__star--filled': filled }"
    >{{ filled ? '★' : '☆' }}</text>
  </view>
</template>

<style lang="scss" scoped>
.match-score {
  display: flex;
  gap: 2rpx;

  &--sm .match-score__star { font-size: 24rpx; }
  &--md .match-score__star { font-size: 32rpx; }
  &--lg .match-score__star { font-size: 48rpx; }

  &--high .match-score__star--filled { color: #4CAF50; }
  &--mid .match-score__star--filled { color: #FFA726; }
  &--low .match-score__star--filled { color: #FF6B6B; }

  &__star {
    color: $text-hint;

    &--filled {
      color: $accent-color;
    }
  }
}
</style>
