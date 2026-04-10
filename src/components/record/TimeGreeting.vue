<script setup lang="ts">
import type { GreetingPeriod } from '@/utils/date'
import type { BackgroundType } from '@/composables/useTimeGreeting'

defineProps<{
  period: GreetingPeriod
  greeting: string
  backgroundType: BackgroundType
  periodIcon: string
}>()
</script>

<template>
  <view class="time-greeting">
    <text class="time-greeting__icon">{{ periodIcon }}</text>
    <text class="time-greeting__text">{{ greeting }}</text>
  </view>
</template>

<style lang="scss" scoped>
.time-greeting {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: $spacing-sm;
  padding: $spacing-xl 0;

  &__icon {
    font-size: 64rpx;
  }

  &__text {
    font-size: 36rpx;
    color: $text-primary;
    text-align: center;
    line-height: 1.5;
  }
}
</style>
