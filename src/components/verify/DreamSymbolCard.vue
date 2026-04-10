<script setup lang="ts">
import type { DreamSymbol } from '@/types/dream'

defineProps<{
  symbol: DreamSymbol
}>()

const categoryLabels: Record<string, string> = {
  element: '元素',
  animal: '动物',
  person: '人物',
  place: '地点',
  action: '动作',
  object: '物品',
}
</script>

<template>
  <view class="symbol-card">
    <view class="symbol-card__header">
      <text class="symbol-card__icon">{{ symbol.icon }}</text>
      <view class="symbol-card__title-col">
        <text class="symbol-card__name">{{ symbol.name }}</text>
        <text class="symbol-card__category">{{ categoryLabels[symbol.category] ?? symbol.category }}</text>
      </view>
    </view>
    <text class="symbol-card__meaning">{{ symbol.meaning }}</text>
  </view>
</template>

<style lang="scss" scoped>
.symbol-card {
  min-width: 280rpx;
  max-width: 320rpx;
  background-color: $card-bg;
  border: 2rpx solid $border-color;
  border-radius: $radius-md;
  padding: $spacing-md;
  flex-shrink: 0;

  &__header {
    display: flex;
    align-items: center;
    gap: $spacing-xs;
    margin-bottom: $spacing-sm;
  }

  &__icon {
    font-size: 40rpx;
  }

  &__title-col {
    display: flex;
    flex-direction: column;
    gap: 2rpx;
  }

  &__name {
    font-size: 30rpx;
    color: $accent-color;
    font-weight: 600;
  }

  &__category {
    font-size: 18rpx;
    color: $text-hint;
  }

  &__meaning {
    font-size: 24rpx;
    color: $text-secondary;
    line-height: 1.5;
  }
}
</style>
