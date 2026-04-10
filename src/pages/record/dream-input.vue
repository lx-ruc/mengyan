<script setup lang="ts">
import { ref } from 'vue'
import { useDreamStore } from '@/stores/dream'
import { useUserStore } from '@/stores/user'
import { useDreamInterpreter } from '@/composables/useDreamInterpreter'
import { DreamTag, DreamTagLabel, Emotion, type Emotion as EmotionType } from '@/types/dream'
import { generateId } from '@/utils/id'
import { getToday } from '@/utils/date'
import EmotionSelector from '@/components/record/EmotionSelector.vue'
import ClaritySlider from '@/components/record/ClaritySlider.vue'
import VoiceRecorder from '@/components/record/VoiceRecorder.vue'

const dreamStore = useDreamStore()
const userStore = useUserStore()
const { interpretDream } = useDreamInterpreter()

const content = ref('')
const selectedTags = ref<DreamTag[]>([])
const selectedEmotion = ref<EmotionType>(Emotion.CALM)
const clarity = ref(3)
const isRecurring = ref(false)
const isSubmitting = ref(false)
const voiceUrl = ref('')

const MAX_LENGTH = 2000
const today = getToday()

const allTags = Object.values(DreamTag)

function toggleTag(tag: DreamTag): void {
  const idx = selectedTags.value.indexOf(tag)
  if (idx === -1) {
    selectedTags.value = [...selectedTags.value, tag]
  } else {
    selectedTags.value = selectedTags.value.filter(t => t !== tag)
  }
}

async function handleSubmit(): Promise<void> {
  if (isSubmitting.value) return
  if (!content.value.trim()) {
    uni.showToast({ title: '请先描述你的梦境', icon: 'none' })
    return
  }

  isSubmitting.value = true

  const id = generateId()

  try {
    const now = Date.now()
    const date = getToday()

    dreamStore.addDream({
      id,
      date,
      content: content.value.trim(),
      voiceUrl: voiceUrl.value || undefined,
      tags: [...selectedTags.value],
      emotion: selectedEmotion.value,
      clarity: clarity.value,
      isRecurring: isRecurring.value,
      keywords: [],
      createdAt: now,
    })

    userStore.incrementDreams()
    userStore.updateStreak(dreamStore.records.map(r => r.date))

    const { analysis, keywords } = await interpretDream(
      content.value,
      [...selectedTags.value],
      selectedEmotion.value,
      clarity.value,
    )

    dreamStore.updateDreamAnalysis(id, analysis, [...keywords])
    uni.navigateTo({ url: `/pages/record/dream-result?dreamId=${id}` })
  } catch (e) {
    // 回滚：删除刚创建的空记录
    dreamStore.deleteDream(id)
    userStore.data.totalDreams = Math.max(0, userStore.data.totalDreams - 1)
    userStore.updateStreak(dreamStore.records.map(r => r.date))
    console.error('梦境解析失败:', e)
    uni.showToast({ title: '解析失败，请重试', icon: 'none' })
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <view class="dream-input-page">
    <!-- 日期 -->
    <view class="dream-input-page__date">
      <text class="dream-input-page__date-text">{{ today }}</text>
    </view>

    <!-- 梦境描述输入 -->
    <view class="dream-input-page__section">
      <textarea
        v-model="content"
        class="dream-input-page__textarea"
        placeholder="描述你的梦境，越详细越好..."
        placeholder-style="color: #5A6B7C"
        :maxlength="MAX_LENGTH"
        auto-height
        :style="{ minHeight: '240rpx' }"
      />
      <text class="dream-input-page__counter">{{ content.length }}/{{ MAX_LENGTH }}</text>
    </view>

    <!-- 语音输入 -->
    <view class="dream-input-page__section">
      <VoiceRecorder v-model:voiceUrl="voiceUrl" />
    </view>

    <!-- 快捷标签 -->
    <view class="dream-input-page__section">
      <text class="dream-input-page__label">梦境类型</text>
      <view class="dream-input-page__tags">
        <view
          v-for="tag in allTags"
          :key="tag"
          class="dream-input-page__tag"
          :class="{ 'dream-input-page__tag--active': selectedTags.includes(tag) }"
          @tap="toggleTag(tag)"
        >
          <text class="dream-input-page__tag-text">{{ DreamTagLabel[tag] }}</text>
        </view>
      </view>
    </view>

    <!-- 情绪选择 -->
    <view class="dream-input-page__section">
      <EmotionSelector v-model="selectedEmotion" />
    </view>

    <!-- 清晰度 -->
    <view class="dream-input-page__section">
      <ClaritySlider v-model="clarity" />
    </view>

    <!-- 反复梦开关 -->
    <view class="dream-input-page__section">
      <view class="dream-input-page__switch-row">
        <text class="dream-input-page__label">是否反复出现的梦</text>
        <switch
          :checked="isRecurring"
          color="#FFD700"
          @change="(e: any) => isRecurring = e.detail.value"
        />
      </view>
    </view>

    <!-- 提交按钮 -->
    <view class="dream-input-page__submit">
      <view
        class="dream-input-page__submit-btn"
        :class="{ 'dream-input-page__submit-btn--loading': isSubmitting }"
        @tap="handleSubmit"
      >
        <text v-if="isSubmitting" class="dream-input-page__loading">✨</text>
        <text class="dream-input-page__submit-text">
          {{ isSubmitting ? '正在解析...' : '✨ 提交并解析' }}
        </text>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.dream-input-page {
  min-height: 100vh;
  padding: $spacing-md $spacing-lg;
  padding-bottom: 200rpx;

  &__date {
    margin-bottom: $spacing-md;
  }

  &__date-text {
    font-size: 26rpx;
    color: $text-hint;
  }

  &__section {
    margin-bottom: $spacing-lg;
  }

  &__textarea {
    width: 100%;
    min-height: 240rpx;
    padding: $spacing-md;
    background-color: $card-bg;
    border-radius: $radius-md;
    color: $text-primary;
    font-size: 28rpx;
    line-height: 1.6;
    box-sizing: border-box;
  }

  &__counter {
    display: block;
    text-align: right;
    font-size: 22rpx;
    color: $text-hint;
    margin-top: $spacing-xs;
  }

  &__label {
    font-size: 26rpx;
    color: $text-secondary;
    margin-bottom: $spacing-sm;
    display: block;
  }

  &__tags {
    display: flex;
    flex-wrap: wrap;
    gap: $spacing-sm;
  }

  &__tag {
    padding: $spacing-xs $spacing-md;
    border-radius: $radius-lg;
    background-color: rgba(255, 255, 255, 0.06);
    border: 2rpx solid transparent;

    &--active {
      background-color: rgba(255, 215, 0, 0.12);
      border-color: $accent-color;
    }

    &-text {
      font-size: 26rpx;
      color: $text-secondary;
    }
  }

  &__tag--active &__tag-text {
    color: $accent-color;
  }

  &__switch-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  &__submit {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    padding: $spacing-md $spacing-lg;
    padding-bottom: calc(#{$spacing-lg} + env(safe-area-inset-bottom));
    background-color: rgba(13, 27, 42, 0.95);
  }

  &__submit-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: $spacing-sm;
    padding: $spacing-lg;
    background: linear-gradient(135deg, $accent-color, #FFA500);
    border-radius: $radius-lg;
    box-shadow: 0 8rpx 24rpx $glow-gold;

    &:active {
      transform: scale(0.97);
    }

    &--loading {
      opacity: 0.7;
    }
  }

  &__loading {
    animation: spin 1.5s linear infinite;
  }

  &__submit-text {
    font-size: 32rpx;
    color: #0D1B2A;
    font-weight: 600;
  }
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
