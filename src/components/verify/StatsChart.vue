<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  type: 'bar' | 'cloud'
  data: Record<string, number>
}>()

const maxVal = computed(() => Math.max(...Object.values(props.data), 1))
const sortedEntries = computed(() =>
  Object.entries(props.data).sort((a, b) => b[1] - a[1]),
)

const barColors = [
  'linear-gradient(90deg, #7B2D8E, #FFD700)',
  'linear-gradient(90deg, #2A5A4A, #4CAF50)',
  'linear-gradient(90deg, #FF8A80, #FF6B6B)',
  'linear-gradient(90deg, #1565C0, #42A5F5)',
  'linear-gradient(90deg, #E65100, #FFA726)',
]

function getBarGradient(index: number): string {
  return barColors[index % barColors.length]
}
</script>

<template>
  <view class="stats-chart">
    <!-- 柱状图模式 -->
    <view v-if="type === 'bar'" class="stats-chart__bars">
      <view v-for="[label, val], idx in sortedEntries" :key="label" class="stats-chart__row">
        <text class="stats-chart__label">{{ label }}</text>
        <view class="stats-chart__bar-track">
          <view
            class="stats-chart__bar-fill"
            :style="{ width: `${(val / maxVal) * 100}%`, background: getBarGradient(idx) }"
          />
        </view>
        <text class="stats-chart__value">{{ val }}</text>
      </view>
    </view>

    <!-- 词云模式 -->
    <view v-else class="stats-chart__cloud">
      <text
        v-for="[word, count] in sortedEntries"
        :key="word"
        class="stats-chart__word"
        :style="{ fontSize: `${Math.max(24, Math.min(44, 22 + count * 5))}rpx`, opacity: Math.max(0.5, Math.min(1, 0.4 + count / maxVal)) }"
      >{{ word }}</text>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.stats-chart {
  background-color: $card-bg;
  border-radius: $radius-md;
  padding: $spacing-md;

  &__bars {
    display: flex;
    flex-direction: column;
    gap: $spacing-md;
  }

  &__row {
    display: flex;
    align-items: center;
    gap: $spacing-sm;
  }

  &__label {
    font-size: 24rpx;
    color: $text-secondary;
    width: 120rpx;
    text-align: right;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    flex-shrink: 0;
  }

  &__bar-track {
    flex: 1;
    height: 24rpx;
    background-color: rgba(255, 255, 255, 0.06);
    border-radius: $radius-xs;
    overflow: hidden;
  }

  &__bar-fill {
    height: 100%;
    border-radius: $radius-xs;
    min-width: 8rpx;
  }

  &__value {
    font-size: 24rpx;
    color: $accent-color;
    width: 48rpx;
    text-align: right;
    flex-shrink: 0;
    font-weight: 600;
  }

  &__cloud {
    display: flex;
    flex-wrap: wrap;
    gap: $spacing-sm;
    justify-content: center;
    padding: $spacing-sm;
  }

  &__word {
    color: $accent-color;
    padding: $spacing-xs $spacing-md;
    background-color: rgba(255, 215, 0, 0.08);
    border-radius: $radius-lg;
  }
}
</style>
