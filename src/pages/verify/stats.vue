<script setup lang="ts">
import { computed } from 'vue'
import { useDreamStore } from '@/stores/dream'
import { useRealityStore } from '@/stores/reality'
import { useUserStore } from '@/stores/user'
import { useDreamStats } from '@/composables/useDreamStats'
import { EmotionLabel } from '@/types/dream'
import StatsChart from '@/components/verify/StatsChart.vue'

const dreamStore = useDreamStore()
const realityStore = useRealityStore()
const userStore = useUserStore()

const stats = useDreamStats(
  () => dreamStore.records,
  () => realityStore.records,
)

const statCards = computed(() => [
  { label: '总梦境', value: stats.totalDreams.value, icon: '🌙' },
  { label: '连续天数', value: stats.streak.value, icon: '🔥' },
  { label: '平均吻合', value: stats.avgMatchScore.value > 0 ? `${Math.round(stats.avgMatchScore.value * 100)}%` : '--', icon: '🔮' },
  { label: '等级', value: `Lv${userStore.level}`, icon: '⭐' },
])

/** 翻译情绪英文为中文 */
const emotionLabels: Record<string, string> = {
  happy: '😊 开心',
  calm: '😐 平静',
  fear: '😰 恐惧',
  sad: '🥺 悲伤',
  angry: '😠 愤怒',
  cool: '😎 酷',
}

const labeledEmotions = computed(() => {
  const raw = stats.emotionDistribution.value
  const result: Record<string, number> = {}
  for (const [k, v] of Object.entries(raw)) {
    result[emotionLabels[k] ?? k] = v
  }
  return result
})
</script>

<template>
  <view class="stats-page">
    <!-- 统计卡片 -->
    <view class="stats-page__cards">
      <view v-for="card in statCards" :key="card.label" class="stats-page__card">
        <text class="stats-page__card-icon">{{ card.icon }}</text>
        <text class="stats-page__card-value">{{ card.value }}</text>
        <text class="stats-page__card-label">{{ card.label }}</text>
      </view>
    </view>

    <!-- 情绪分布 -->
    <view v-if="Object.keys(stats.emotionDistribution.value).length > 0" class="stats-page__section">
      <text class="stats-page__section-title">情绪分布</text>
      <StatsChart type="bar" :data="labeledEmotions" />
    </view>

    <!-- 热门关键词 -->
    <view v-if="stats.topKeywords.value.length > 0" class="stats-page__section">
      <text class="stats-page__section-title">热门梦境关键词</text>
      <StatsChart type="cloud" :data="Object.fromEntries(stats.topKeywords.value.map(k => [k.word, k.count]))" />
    </view>

    <!-- 月度频次 -->
    <view v-if="Object.keys(stats.monthlyFrequency.value).length > 0" class="stats-page__section">
      <text class="stats-page__section-title">月度梦境频次</text>
      <StatsChart type="bar" :data="stats.monthlyFrequency.value" />
    </view>

    <!-- 空状态 -->
    <view v-if="stats.totalDreams.value === 0" class="stats-page__empty">
      <text class="stats-page__empty-icon">📊</text>
      <text class="stats-page__empty-text">记录更多梦境后这里会显示统计数据</text>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.stats-page {
  min-height: 100vh;
  padding: $spacing-md $spacing-lg;

  &__cards {
    display: flex;
    gap: $spacing-sm;
    margin-bottom: $spacing-xl;
    flex-wrap: wrap;
  }

  &__card {
    flex: 1;
    min-width: 140rpx;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: $spacing-xs;
    padding: $spacing-md $spacing-xs;
    background-color: $card-bg;
    border-radius: $radius-md;
  }

  &__card-icon {
    font-size: 32rpx;
  }

  &__card-value {
    font-size: 32rpx;
    color: $accent-color;
    font-weight: 700;
  }

  &__card-label {
    font-size: 20rpx;
    color: $text-hint;
  }

  &__section {
    margin-bottom: $spacing-xl;
  }

  &__section-title {
    font-size: 28rpx;
    color: $text-secondary;
    font-weight: 600;
    margin-bottom: $spacing-md;
    display: block;
  }

  &__empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: $spacing-md;
    padding-top: 100rpx;
  }

  &__empty-icon {
    font-size: 64rpx;
  }

  &__empty-text {
    font-size: 28rpx;
    color: $text-hint;
  }
}
</style>
