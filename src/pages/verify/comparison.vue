<script setup lang="ts">
import { ref, computed } from 'vue'
import { onLoad, onUnload } from '@dcloudio/uni-app'
import { useRealityStore } from '@/stores/reality'
import { useDreamStore } from '@/stores/dream'
import StarryBackground from '@/components/common/StarryBackground.vue'
import ComparisonCard from '@/components/verify/ComparisonCard.vue'
import MatchScore from '@/components/common/MatchScore.vue'

const realityStore = useRealityStore()
const dreamStore = useDreamStore()

const realityId = ref('')
const reality = computed(() => realityStore.getRealityById(realityId.value))
const dream = computed(() =>
  reality.value ? dreamStore.getDreamById(reality.value.dreamId) : undefined,
)

const isLoading = ref(false)
let pollTimer: ReturnType<typeof setInterval> | null = null
let timeoutTimer: ReturnType<typeof setTimeout> | null = null

onLoad((options) => {
  if (options?.realityId) {
    realityId.value = options.realityId
    if (reality.value?.finalScore == null) {
      isLoading.value = true
      pollTimer = setInterval(() => {
        const r = realityStore.getRealityById(realityId.value)
        if (r?.finalScore != null) {
          isLoading.value = false
          if (pollTimer) { clearInterval(pollTimer); pollTimer = null }
        }
      }, 500)
      timeoutTimer = setTimeout(() => {
        isLoading.value = false
        if (pollTimer) { clearInterval(pollTimer); pollTimer = null }
        timeoutTimer = null
      }, 5000)
    }
  }
})

onUnload(() => {
  if (pollTimer) { clearInterval(pollTimer); pollTimer = null }
  if (timeoutTimer) { clearTimeout(timeoutTimer); timeoutTimer = null }
})
</script>

<template>
  <view class="comparison-page">
    <StarryBackground type="starry" />

    <view class="comparison-page__content">
      <!-- 加载态 -->
      <view v-if="isLoading" class="comparison-page__loading">
        <text class="comparison-page__loading-icon">🔮</text>
        <text class="comparison-page__loading-text">正在对照梦境与现实...</text>
      </view>

      <template v-else-if="reality && dream">
        <!-- 标题 -->
        <view class="comparison-page__header">
          <text class="comparison-page__title">梦迹对照</text>
        </view>

        <!-- 梦 vs 现实对照卡 -->
        <ComparisonCard :dream="dream" :reality="reality" />

        <!-- AI 吻合度 -->
        <view v-if="reality.finalScore != null" class="comparison-page__score-section">
          <text class="comparison-page__section-title">梦迹吻合度</text>
          <view class="comparison-page__score-card">
            <MatchScore :score="reality.finalScore" size="lg" />
            <text class="comparison-page__score-num">{{ Math.round(reality.finalScore * 100) }}%</text>
          </view>
        </view>

        <!-- 自评 vs AI 评 -->
        <view v-if="reality.aiScore != null" class="comparison-page__compare-section">
          <text class="comparison-page__section-title">评分对比</text>
          <view class="comparison-page__compare-row">
            <view class="comparison-page__compare-item">
              <text class="comparison-page__compare-label">你的感觉</text>
              <view class="comparison-page__compare-bar">
                <view
                  class="comparison-page__compare-fill comparison-page__compare-fill--self"
                  :style="{ width: `${(reality.selfScore / 5) * 100}%` }"
                />
              </view>
              <text class="comparison-page__compare-val">{{ reality.selfScore }}/5</text>
            </view>
            <view class="comparison-page__compare-item">
              <text class="comparison-page__compare-label">AI 分析</text>
              <view class="comparison-page__compare-bar">
                <view
                  class="comparison-page__compare-fill comparison-page__compare-fill--ai"
                  :style="{ width: `${reality.aiScore * 100}%` }"
                />
              </view>
              <text class="comparison-page__compare-val">{{ Math.round(reality.aiScore * 100) }}%</text>
            </view>
          </view>
        </view>

        <!-- AI 评语 -->
        <view v-if="reality.aiComment" class="comparison-page__comment-section">
          <text class="comparison-page__section-title">验梦师评语</text>
          <view class="comparison-page__comment-card">
            <text class="comparison-page__comment-text">{{ reality.aiComment }}</text>
          </view>
        </view>

        <!-- 底部操作 -->
        <view class="comparison-page__actions">
          <view class="comparison-page__action-btn comparison-page__action-btn--primary" @tap="() => uni.switchTab({ url: '/pages/record/index' })">
            <text class="comparison-page__action-text comparison-page__action-text--primary">返回首页</text>
          </view>
          <view class="comparison-page__action-btn" @tap="() => uni.switchTab({ url: '/pages/verify/index' })">
            <text class="comparison-page__action-text">查看档案</text>
          </view>
        </view>
      </template>

      <view v-else class="comparison-page__empty">
        <text class="comparison-page__empty-icon">💭</text>
        <text class="comparison-page__empty-text">未找到对照数据</text>
        <view class="comparison-page__back-btn" @tap="() => uni.navigateBack()">
          <text class="comparison-page__back-text">返回</text>
        </view>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.comparison-page {
  min-height: 100vh;
  position: relative;

  &__content {
    position: relative;
    z-index: 1;
    padding: $spacing-lg;
    padding-bottom: 120rpx;
  }

  &__loading {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: 200rpx;
    gap: $spacing-md;
  }

  &__loading-icon {
    font-size: 64rpx;
    animation: spin 2s linear infinite;
  }

  &__loading-text {
    font-size: 30rpx;
    color: $text-secondary;
  }

  &__header {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: $spacing-xl;
  }

  &__title {
    font-size: 36rpx;
    color: $accent-color;
    font-weight: 600;
  }

  &__section-title {
    font-size: 28rpx;
    color: $text-secondary;
    margin-bottom: $spacing-sm;
    display: block;
  }

  &__score-section {
    margin-bottom: $spacing-lg;
  }

  &__score-card {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: $spacing-md;
    padding: $spacing-lg;
    background-color: $card-bg;
    border-radius: $radius-md;
  }

  &__score-num {
    font-size: 48rpx;
    color: $accent-color;
    font-weight: 700;
  }

  &__compare-section {
    margin-bottom: $spacing-lg;
  }

  &__compare-row {
    display: flex;
    flex-direction: column;
    gap: $spacing-md;
    background-color: $card-bg;
    border-radius: $radius-md;
    padding: $spacing-md;
  }

  &__compare-item {
    display: flex;
    align-items: center;
    gap: $spacing-sm;
  }

  &__compare-label {
    font-size: 24rpx;
    color: $text-hint;
    width: 120rpx;
  }

  &__compare-bar {
    flex: 1;
    height: 16rpx;
    background-color: rgba(255, 255, 255, 0.06);
    border-radius: $radius-xs;
    overflow: hidden;
  }

  &__compare-fill {
    height: 100%;
    border-radius: $radius-xs;
    transition: width 0.5s ease;

    &--self {
      background: linear-gradient(90deg, $dawn-pink, #FF6B6B);
    }

    &--ai {
      background: linear-gradient(90deg, $dream-purple, $accent-color);
    }
  }

  &__compare-val {
    font-size: 24rpx;
    color: $text-primary;
    width: 80rpx;
    text-align: right;
  }

  &__comment-section {
    margin-bottom: $spacing-lg;
  }

  &__comment-card {
    background-color: rgba(255, 215, 0, 0.06);
    border: 2rpx solid rgba(255, 215, 0, 0.15);
    border-radius: $radius-md;
    padding: $spacing-md;
  }

  &__comment-text {
    font-size: 28rpx;
    color: $text-primary;
    line-height: 1.6;
  }

  &__empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: 200rpx;
    gap: $spacing-md;
  }

  &__empty-icon {
    font-size: 64rpx;
  }

  &__empty-text {
    font-size: 28rpx;
    color: $text-hint;
  }

  &__back-btn {
    margin-top: $spacing-md;
    padding: $spacing-sm $spacing-xl;
    background: linear-gradient(135deg, $dream-purple, #4A1D8E);
    border-radius: $radius-lg;
  }

  &__back-text {
    font-size: 28rpx;
    color: $text-primary;
  }

  &__actions {
    margin-top: $spacing-xl;
    display: flex;
    justify-content: center;
    gap: $spacing-md;
    padding-top: $spacing-lg;
  }

  &__action-btn {
    padding: $spacing-md $spacing-xl;
    background-color: rgba(255, 255, 255, 0.06);
    border-radius: $radius-lg;

    &:active {
      background-color: rgba(255, 255, 255, 0.12);
    }

    &--primary {
      background: linear-gradient(135deg, $accent-color, #FFA500);
    }
  }

  &__action-text {
    font-size: 28rpx;
    color: $accent-color;
    font-weight: 500;

    &--primary {
      color: #0D1B2A;
    }
  }
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
