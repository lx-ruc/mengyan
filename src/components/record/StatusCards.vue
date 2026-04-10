<script setup lang="ts">
defineProps<{
  todayDreamDone: boolean
  todayRealityDone: boolean
  matchScore: number | null
  streak: number
}>()

const emit = defineEmits<{
  (e: 'tap-dream'): void
  (e: 'tap-reality'): void
  (e: 'tap-score'): void
  (e: 'tap-streak'): void
}>()

const matchLabels = ['待揭晓', '巧合而已', '有点意思', '值得关注', '高度吻合', '细思极恐']

function getMatchLabel(score: number | null): string {
  if (score == null) return '待揭晓'
  return matchLabels[Math.round(score * 5)] ?? '待揭晓'
}

function getScoreColor(score: number | null): string {
  if (score == null) return '#8899AA'
  if (score >= 0.7) return '#4CAF50'
  if (score >= 0.4) return '#FFA726'
  return '#FF6B6B'
}
</script>

<template>
  <view class="status-cards">
    <view class="status-cards__item" :class="{ 'status-cards__item--done': todayDreamDone }" @tap="emit('tap-dream')">
      <text class="status-cards__icon">{{ todayDreamDone ? '✅' : '🌙' }}</text>
      <text class="status-cards__text">{{ todayDreamDone ? '已记录' : '待记录' }}</text>
      <text class="status-cards__label">今日梦境</text>
    </view>
    <view class="status-cards__item" :class="{ 'status-cards__item--done': todayRealityDone }" @tap="emit('tap-reality')">
      <text class="status-cards__icon">{{ todayRealityDone ? '✅' : '📝' }}</text>
      <text class="status-cards__text">{{ todayRealityDone ? '已记录' : '待记录' }}</text>
      <text class="status-cards__label">今日现实</text>
    </view>
    <view class="status-cards__item" @tap="emit('tap-score')">
      <text class="status-cards__icon">🔮</text>
      <text class="status-cards__text" :style="{ color: getScoreColor(matchScore) }">{{ getMatchLabel(matchScore) }}</text>
      <text class="status-cards__label">吻合度</text>
    </view>
    <view class="status-cards__item" @tap="emit('tap-streak')">
      <text class="status-cards__icon">🔥</text>
      <text class="status-cards__text">{{ streak }}天</text>
      <text class="status-cards__label">连续记录</text>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.status-cards {
  display: flex;
  gap: $spacing-sm;
  padding: 0 $spacing-lg;

  &__item {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4rpx;
    padding: $spacing-md $spacing-xs;
    background-color: rgba(255, 255, 255, 0.06);
    border-radius: $radius-md;
    transition: background-color 0.15s;

    &:active {
      background-color: rgba(255, 255, 255, 0.1);
    }

    &--done {
      background-color: rgba(76, 175, 80, 0.08);
    }
  }

  &__icon {
    font-size: 32rpx;
  }

  &__text {
    font-size: 22rpx;
    color: $text-secondary;
    text-align: center;
    font-weight: 500;
  }

  &__label {
    font-size: 18rpx;
    color: $text-hint;
  }
}
</style>
