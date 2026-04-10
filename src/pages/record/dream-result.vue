<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { useDreamStore } from '@/stores/dream'
import { useDreamInterpreter } from '@/composables/useDreamInterpreter'
import { EmotionEmoji, type Emotion } from '@/types/dream'
import StarryBackground from '@/components/common/StarryBackground.vue'
import DreamSymbolCard from '@/components/verify/DreamSymbolCard.vue'

const dreamStore = useDreamStore()
const { interpretDream } = useDreamInterpreter()

const dreamId = ref('')
const isLoading = ref(true)
const errorMsg = ref('')

const dream = computed(() => {
  if (!dreamId.value) return undefined
  return dreamStore.getDreamById(dreamId.value)
})

const analysis = computed(() => dream.value?.aiAnalysis)

onLoad((options) => {
  if (options?.dreamId) {
    dreamId.value = options.dreamId
    loadOrAnalyze()
  } else {
    errorMsg.value = '缺少梦境ID参数'
    isLoading.value = false
  }
})

async function loadOrAnalyze(): Promise<void> {
  const d = dreamStore.getDreamById(dreamId.value)

  if (!d) {
    errorMsg.value = '未找到该梦境记录'
    isLoading.value = false
    return
  }

  // 已有解析结果，直接显示
  if (d.aiAnalysis) {
    isLoading.value = false
    return
  }

  // 没有解析结果，现场解析
  try {
    const { analysis: result, keywords } = await interpretDream(
      d.content,
      d.tags,
      d.emotion,
      d.clarity,
    )
    dreamStore.updateDreamAnalysis(dreamId.value, result, keywords)
    isLoading.value = false
  } catch (e) {
    console.error('解析失败:', e)
    errorMsg.value = '解析失败，请返回重试'
    isLoading.value = false
  }
}

function getEmotionEmoji(): string {
  if (!dream.value) return '💭'
  return EmotionEmoji[dream.value.emotion as Emotion] ?? '💭'
}

function goBack(): void {
  uni.navigateBack()
}

function goHome(): void {
  uni.switchTab({ url: '/pages/record/index' })
}

function goVerify(): void {
  if (!dreamId.value) return
  uni.navigateTo({ url: `/pages/record/reality-input?dreamId=${dreamId.value}` })
}
</script>

<template>
  <view class="dream-result-page">
    <StarryBackground type="starry" />

    <view class="dream-result-page__content">
      <!-- 加载态 -->
      <view v-if="isLoading" class="dream-result-page__loading">
        <text class="dream-result-page__loading-icon">✨</text>
        <text class="dream-result-page__loading-text">正在解读你的梦境...</text>
      </view>

      <!-- 有数据 -->
      <template v-else-if="analysis && dream">
        <!-- 标题 -->
        <view class="dream-result-page__header">
          <text class="dream-result-page__title">✨ 梦境解析 ✨</text>
          <text class="dream-result-page__emotion">{{ getEmotionEmoji() }}</text>
        </view>

        <!-- 梦境原文 -->
        <view class="dream-result-page__section">
          <text class="dream-result-page__section-title">梦境原文</text>
          <view class="dream-result-page__original-card">
            <text class="dream-result-page__original-text">{{ dream.content }}</text>
          </view>
        </view>

        <!-- 核心意象卡 -->
        <view v-if="analysis.symbols && analysis.symbols.length > 0" class="dream-result-page__section">
          <text class="dream-result-page__section-title">核心意象</text>
          <scroll-view scroll-x class="dream-result-page__symbols-scroll">
            <view class="dream-result-page__symbols">
              <DreamSymbolCard
                v-for="sym in analysis.symbols"
                :key="sym.name"
                :symbol="sym"
              />
            </view>
          </scroll-view>
        </view>

        <!-- 解梦师留言 -->
        <view v-if="analysis.interpreterMessage" class="dream-result-page__section">
          <view class="dream-result-page__interpreter-card">
            <view class="dream-result-page__interpreter-header">
              <text class="dream-result-page__interpreter-avatar">🔮</text>
              <text class="dream-result-page__interpreter-name">验梦师</text>
            </view>
            <text class="dream-result-page__interpreter-msg">{{ analysis.interpreterMessage }}</text>
          </view>
        </view>

        <!-- 主题与情绪 -->
        <view v-if="(analysis.themes && analysis.themes.length > 0) || (analysis.emotions && analysis.emotions.length > 0)" class="dream-result-page__section">
          <text class="dream-result-page__section-title">主题与情绪</text>
          <view class="dream-result-page__chips">
            <text v-for="theme in (analysis.themes || [])" :key="theme" class="dream-result-page__chip dream-result-page__chip--theme">
              {{ theme }}
            </text>
            <text v-for="emo in (analysis.emotions || [])" :key="emo" class="dream-result-page__chip dream-result-page__chip--emotion">
              {{ emo }}
            </text>
          </view>
        </view>

        <!-- 总结 -->
        <view v-if="analysis.summary" class="dream-result-page__section">
          <text class="dream-result-page__section-title">解读</text>
          <text class="dream-result-page__summary">{{ analysis.summary }}</text>
        </view>

        <!-- 建议 -->
        <view v-if="analysis.suggestion" class="dream-result-page__section">
          <text class="dream-result-page__section-title">建议</text>
          <view class="dream-result-page__suggestion-card">
            <text class="dream-result-page__suggestion-text">{{ analysis.suggestion }}</text>
          </view>
        </view>
      </template>

      <!-- 错误 -->
      <view v-else class="dream-result-page__empty">
        <text class="dream-result-page__empty-icon">💭</text>
        <text class="dream-result-page__empty-text">{{ errorMsg || '未找到梦境解析数据' }}</text>
        <view class="dream-result-page__back-btn" @tap="goBack">
          <text class="dream-result-page__back-text">返回重试</text>
        </view>
      </view>

      <!-- 底部操作 -->
      <view v-if="analysis && dream" class="dream-result-page__actions">
        <view class="dream-result-page__action-btn dream-result-page__action-btn--verify" @tap="goVerify">
          <text class="dream-result-page__action-text">去验梦</text>
        </view>
        <view class="dream-result-page__action-btn" @tap="goHome">
          <text class="dream-result-page__action-text">返回首页</text>
        </view>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.dream-result-page {
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
    justify-content: center;
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
    gap: $spacing-sm;
    margin-bottom: $spacing-xl;
  }

  &__title {
    font-size: 36rpx;
    color: $accent-color;
    font-weight: 600;
  }

  &__emotion {
    font-size: 40rpx;
  }

  &__original-card {
    background-color: rgba(255, 255, 255, 0.04);
    border: 2rpx solid $border-color;
    border-radius: $radius-md;
    padding: $spacing-md;
  }

  &__original-text {
    font-size: 26rpx;
    color: $text-secondary;
    line-height: 1.7;
  }

  &__section {
    margin-bottom: $spacing-lg;
  }

  &__section-title {
    font-size: 28rpx;
    color: $text-secondary;
    margin-bottom: $spacing-sm;
    display: block;
  }

  &__symbols-scroll {
    white-space: nowrap;
  }

  &__symbols {
    display: flex;
    gap: $spacing-sm;
    padding-bottom: $spacing-sm;
  }

  &__interpreter-card {
    background-color: rgba(255, 215, 0, 0.06);
    border: 2rpx solid rgba(255, 215, 0, 0.2);
    border-radius: $radius-md;
    padding: $spacing-md;
  }

  &__interpreter-header {
    display: flex;
    align-items: center;
    gap: $spacing-xs;
    margin-bottom: $spacing-sm;
  }

  &__interpreter-avatar {
    font-size: 32rpx;
  }

  &__interpreter-name {
    font-size: 26rpx;
    color: $accent-color;
    font-weight: 600;
  }

  &__interpreter-msg {
    font-size: 28rpx;
    color: $text-primary;
    line-height: 1.6;
  }

  &__chips {
    display: flex;
    flex-wrap: wrap;
    gap: $spacing-xs;
  }

  &__chip {
    font-size: 24rpx;
    padding: $spacing-xs $spacing-md;
    border-radius: $radius-lg;

    &--theme {
      color: $dream-purple;
      background-color: rgba(123, 45, 142, 0.12);
    }

    &--emotion {
      color: $accent-color;
      background-color: rgba(255, 215, 0, 0.1);
    }
  }

  &__summary {
    font-size: 28rpx;
    color: $text-primary;
    line-height: 1.6;
  }

  &__suggestion-card {
    background-color: rgba(255, 255, 255, 0.04);
    border-radius: $radius-md;
    padding: $spacing-md;
  }

  &__suggestion-text {
    font-size: 26rpx;
    color: $text-secondary;
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
    font-size: 80rpx;
  }

  &__empty-text {
    font-size: 28rpx;
    color: $text-hint;
  }

  &__back-btn {
    padding: $spacing-sm $spacing-xl;
    background-color: rgba(255, 215, 0, 0.1);
    border-radius: $radius-lg;
    margin-top: $spacing-md;
  }

  &__back-text {
    font-size: 28rpx;
    color: $accent-color;
  }

  &__actions {
    margin-top: $spacing-xl;
    display: flex;
    justify-content: center;
    gap: $spacing-md;
  }

  &__action-btn {
    padding: $spacing-md $spacing-xl;
    background-color: rgba(255, 215, 0, 0.1);
    border-radius: $radius-lg;

    &:active {
      background-color: rgba(255, 215, 0, 0.2);
    }

    &--verify {
      background: linear-gradient(135deg, $accent-color, #FFA500);
    }
  }

  &__action-text {
    font-size: 28rpx;
    color: $accent-color;
    font-weight: 500;

    .dream-result-page__action-btn--verify & {
      color: #0D1B2A;
    }
  }
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
