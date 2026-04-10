<script setup lang="ts">
import type { DreamRecord } from '@/types/dream'
import { DreamTagLabel, EmotionEmoji, type Emotion } from '@/types/dream'
import { formatDisplayDate } from '@/utils/date'
import MatchScore from '@/components/common/MatchScore.vue'

defineProps<{
  dream: DreamRecord
  compact?: boolean
}>()

function formatDate(d: DreamRecord): string {
  return formatDisplayDate(d.date)
}

function getTagLabels(d: DreamRecord): string[] {
  return d.tags.map(t => DreamTagLabel[t]).filter(Boolean)
}

function getEmoji(d: DreamRecord): string {
  return EmotionEmoji[d.emotion as Emotion] ?? '💭'
}
</script>

<template>
  <view class="dream-card">
    <view class="dream-card__header">
      <view class="dream-card__header-left">
        <text class="dream-card__emotion">{{ getEmoji(dream) }}</text>
        <text class="dream-card__date">{{ formatDate(dream) }}</text>
      </view>
      <view v-if="dream.isRecurring" class="dream-card__recurring">
        <text class="dream-card__recurring-text">反复</text>
      </view>
    </view>
    <text class="dream-card__content">{{ compact ? dream.content.slice(0, 80) + (dream.content.length > 80 ? '...' : '') : dream.content }}</text>
    <view class="dream-card__footer">
      <view class="dream-card__tags">
        <text v-for="tag in getTagLabels(dream).slice(0, 3)" :key="tag" class="dream-card__tag">{{ tag }}</text>
      </view>
      <MatchScore v-if="dream.realityMatchScore != null" :score="dream.realityMatchScore" size="sm" />
      <text v-else class="dream-card__pending">待验梦</text>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.dream-card {
  background-color: $card-bg;
  border-radius: $radius-md;
  padding: $spacing-md;

  &:active {
    background-color: rgba(255, 255, 255, 0.06);
  }

  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: $spacing-xs;
  }

  &__header-left {
    display: flex;
    align-items: center;
    gap: $spacing-xs;
  }

  &__date {
    font-size: 24rpx;
    color: $text-secondary;
  }

  &__emotion {
    font-size: 32rpx;
  }

  &__recurring {
    padding: 2rpx 12rpx;
    background-color: rgba(123, 45, 142, 0.15);
    border-radius: $radius-xs;

    &-text {
      font-size: 20rpx;
      color: $dream-purple;
    }
  }

  &__content {
    font-size: 28rpx;
    color: $text-primary;
    line-height: 1.6;
    margin-bottom: $spacing-sm;
  }

  &__footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  &__tags {
    display: flex;
    gap: $spacing-xs;
    flex-wrap: wrap;
  }

  &__tag {
    font-size: 22rpx;
    color: $accent-color;
    background-color: rgba(255, 215, 0, 0.1);
    padding: 2rpx 12rpx;
    border-radius: $radius-xs;
  }

  &__pending {
    font-size: 22rpx;
    color: $text-hint;
  }
}
</style>
