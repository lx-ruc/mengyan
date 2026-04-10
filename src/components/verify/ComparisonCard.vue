<script setup lang="ts">
import { ref } from 'vue'
import type { DreamRecord } from '@/types/dream'
import type { RealityRecord } from '@/types/reality'
import { RealityEventTagLabel } from '@/types/reality'

defineProps<{
  dream: DreamRecord
  reality: RealityRecord
}>()

const expanded = ref(false)
</script>

<template>
  <view class="comparison-card" @tap="expanded = !expanded">
    <view class="comparison-card__side comparison-card__side--dream">
      <text class="comparison-card__label">🌙 梦境</text>
      <text class="comparison-card__content">
        {{ expanded ? dream.content : dream.content.slice(0, 100) + (dream.content.length > 100 ? '...' : '') }}
      </text>
      <view class="comparison-card__keywords">
        <text v-for="kw in dream.keywords.slice(0, expanded ? 8 : 4)" :key="kw" class="comparison-card__kw">{{ kw }}</text>
      </view>
    </view>
    <view class="comparison-card__divider">
      <text class="comparison-card__vs">VS</text>
    </view>
    <view class="comparison-card__side comparison-card__side--reality">
      <text class="comparison-card__label">☀️ 现实</text>
      <text class="comparison-card__content">
        {{ expanded ? reality.content : reality.content.slice(0, 100) + (reality.content.length > 100 ? '...' : '') }}
      </text>
      <view class="comparison-card__keywords">
        <text v-for="tag in reality.eventTags.slice(0, expanded ? 8 : 4)" :key="tag" class="comparison-card__kw">{{ RealityEventTagLabel[tag] }}</text>
      </view>
    </view>
  </view>
  <text class="comparison-card__tap-hint">{{ expanded ? '点击收起' : '点击展开全部内容' }}</text>
</template>

<style lang="scss" scoped>
.comparison-card {
  display: flex;
  border-radius: $radius-md;
  overflow: hidden;

  &__side {
    flex: 1;
    padding: $spacing-md;
    display: flex;
    flex-direction: column;
    gap: $spacing-xs;

    &--dream {
      background-color: rgba(123, 45, 142, 0.15);
      border-right: 2rpx solid rgba(123, 45, 142, 0.3);
    }

    &--reality {
      background-color: rgba(255, 138, 128, 0.1);
    }
  }

  &__label {
    font-size: 24rpx;
    color: $accent-color;
    font-weight: 600;
  }

  &__content {
    font-size: 24rpx;
    color: $text-primary;
    line-height: 1.5;
  }

  &__keywords {
    display: flex;
    flex-wrap: wrap;
    gap: 6rpx;
  }

  &__kw {
    font-size: 20rpx;
    color: $text-secondary;
    background-color: rgba(255, 255, 255, 0.06);
    padding: 2rpx 10rpx;
    border-radius: $radius-xs;
  }

  &__divider {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 4rpx;
  }

  &__vs {
    font-size: 22rpx;
    color: $text-hint;
    font-weight: 600;
  }

  &__tap-hint {
    display: block;
    text-align: center;
    font-size: 20rpx;
    color: $text-hint;
    margin-top: $spacing-xs;
    margin-bottom: $spacing-md;
  }
}
</style>
