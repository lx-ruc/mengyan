<script setup lang="ts">
import { ref, computed } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { useRealityStore } from '@/stores/reality'
import { useDreamStore } from '@/stores/dream'
import { useUserStore } from '@/stores/user'
import { useDreamRealityMatcher } from '@/composables/useDreamRealityMatcher'
import { RealityEventTag, RealityEventTagLabel } from '@/types/reality'
import { generateId } from '@/utils/id'
import { getToday } from '@/utils/date'

const dreamStore = useDreamStore()
const realityStore = useRealityStore()
const userStore = useUserStore()
const { matchDreamReality } = useDreamRealityMatcher()

const dreamId = ref('')
const dream = computed(() => dreamStore.getDreamById(dreamId.value))
const selectedEventTags = ref<RealityEventTag[]>([])
const content = ref('')
const selfScore = ref(3)
const isSubmitting = ref(false)

const scoreLabels = ['', '毫无关联', '有点关联', '有点意思', '值得关注', '细思极恐']

const allEventTags = Object.values(RealityEventTag)

onLoad((options) => {
  if (options?.dreamId) {
    dreamId.value = options.dreamId
  }
})

function toggleTag(tag: RealityEventTag): void {
  const idx = selectedEventTags.value.indexOf(tag)
  if (idx === -1) {
    selectedEventTags.value = [...selectedEventTags.value, tag]
  } else {
    selectedEventTags.value = selectedEventTags.value.filter(t => t !== tag)
  }
}

async function handleSubmit(): Promise<void> {
  if (isSubmitting.value) return
  if (!dreamId.value || !dream.value) {
    uni.showToast({ title: '找不到关联梦境', icon: 'none' })
    return
  }
  if (selectedEventTags.value.length === 0 && !content.value.trim()) {
    uni.showToast({ title: '请选择至少一个事件标签', icon: 'none' })
    return
  }

  isSubmitting.value = true

  try {
    const id = generateId()
    const now = Date.now()
    const date = getToday()

    // 创建现实记录
    realityStore.addReality({
      id,
      dreamId: dreamId.value,
      date,
      eventTags: [...selectedEventTags.value],
      content: content.value.trim(),
      selfScore: selfScore.value,
      createdAt: now,
    })

    userStore.incrementRealities()

    // 调用 AI 梦迹对照
    const matchResult = await matchDreamReality(dream.value, {
      id,
      dreamId: dreamId.value,
      date,
      eventTags: [...selectedEventTags.value],
      content: content.value.trim(),
      selfScore: selfScore.value,
      createdAt: now,
    })

    // 更新现实记录的评分
    realityStore.updateReality(id, {
      aiScore: matchResult.aiScore,
      finalScore: matchResult.finalScore,
      aiComment: matchResult.aiComment,
    })

    // 更新梦境的吻合度
    dreamStore.updateDream(dreamId.value, {
      realityMatchScore: matchResult.finalScore,
      realityId: id,
    })

    uni.redirectTo({ url: `/pages/verify/comparison?realityId=${id}` })
  } catch {
    // Rollback: remove the created reality record and restore counters
    realityStore.deleteReality(id)
    userStore.data.totalRealities = Math.max(0, userStore.data.totalRealities - 1)
    userStore.persist()
    uni.showToast({ title: '验梦失败，请重试', icon: 'none' })
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <view class="reality-input-page">
    <!-- 关联梦境摘要 -->
    <view v-if="dream" class="reality-input-page__dream-ref">
      <text class="reality-input-page__dream-label">🌙 今日梦境</text>
      <text class="reality-input-page__dream-content">{{ dream.content.length > 100 ? dream.content.slice(0, 100) + '...' : dream.content }}</text>
      <view v-if="dream.keywords.length > 0" class="reality-input-page__dream-kws">
        <text class="reality-input-page__dream-kw-label">关键词：</text>
        <text v-for="kw in dream.keywords.slice(0, 5)" :key="kw" class="reality-input-page__dream-kw">{{ kw }}</text>
      </view>
      <text class="reality-input-page__dream-hint">── 今日梦境是否映照了现实？</text>
    </view>

    <!-- 事件标签 -->
    <view class="reality-input-page__section">
      <text class="reality-input-page__label">今天发生了什么</text>
      <view class="reality-input-page__tags">
        <view
          v-for="tag in allEventTags"
          :key="tag"
          class="reality-input-page__tag"
          :class="{ 'reality-input-page__tag--active': selectedEventTags.includes(tag) }"
          @tap="toggleTag(tag)"
        >
          <text class="reality-input-page__tag-text">{{ RealityEventTagLabel[tag] }}</text>
        </view>
      </view>
    </view>

    <!-- 详细描述 -->
    <view class="reality-input-page__section">
      <textarea
        v-model="content"
        class="reality-input-page__textarea"
        placeholder="补充描述今天发生的特别事件（选填）..."
        placeholder-style="color: #5A6B7C"
        :maxlength="500"
        auto-height
        :style="{ minHeight: '160rpx' }"
      />
    </view>

    <!-- 吻合度自评 -->
    <view class="reality-input-page__section">
      <text class="reality-input-page__label">你觉得梦境和现实有关联吗？</text>
      <view class="reality-input-page__slider-row">
        <text class="reality-input-page__slider-hint">❌ 毫无关联</text>
        <slider
          :value="selfScore"
          :min="1"
          :max="5"
          :step="1"
          active-color="#FFD700"
          background-color="#2A3A4A"
          block-color="#FFD700"
          block-size="20"
          class="reality-input-page__slider"
          @change="(e: any) => selfScore = e.detail.value"
        />
        <text class="reality-input-page__slider-hint">✅ 高度吻合</text>
      </view>
      <text class="reality-input-page__score-label">{{ scoreLabels[selfScore] }}</text>
    </view>

    <!-- 提交 -->
    <view class="reality-input-page__submit">
      <view
        class="reality-input-page__submit-btn"
        :class="{ 'reality-input-page__submit-btn--loading': isSubmitting }"
        @tap="handleSubmit"
      >
        <text class="reality-input-page__submit-text">
          {{ isSubmitting ? '正在验梦...' : '🔮 提交并验梦' }}
        </text>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.reality-input-page {
  min-height: 100vh;
  padding: $spacing-md $spacing-lg;
  padding-bottom: 200rpx;

  &__dream-ref {
    background-color: rgba(123, 45, 142, 0.12);
    border: 2rpx solid rgba(123, 45, 142, 0.25);
    border-radius: $radius-md;
    padding: $spacing-md;
    margin-bottom: $spacing-lg;
  }

  &__dream-label {
    font-size: 24rpx;
    color: $dream-purple;
    margin-bottom: $spacing-xs;
  }

  &__dream-content {
    font-size: 26rpx;
    color: $text-primary;
    line-height: 1.5;
    display: block;
    margin-bottom: $spacing-sm;
  }

  &__dream-kws {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 6rpx;
    margin-bottom: $spacing-xs;
  }

  &__dream-kw-label {
    font-size: 22rpx;
    color: $text-hint;
  }

  &__dream-kw {
    font-size: 20rpx;
    color: $accent-color;
    background-color: rgba(255, 215, 0, 0.1);
    padding: 2rpx 10rpx;
    border-radius: $radius-xs;
  }

  &__dream-hint {
    font-size: 22rpx;
    color: $text-hint;
    display: block;
    margin-top: $spacing-xs;
  }

  &__section {
    margin-bottom: $spacing-lg;
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
      background-color: rgba(255, 138, 128, 0.12);
      border-color: $dawn-pink;
    }

    &-text {
      font-size: 26rpx;
      color: $text-secondary;
    }
  }

  &__tag--active &__tag-text {
    color: $dawn-pink;
  }

  &__textarea {
    width: 100%;
    min-height: 160rpx;
    padding: $spacing-md;
    background-color: $card-bg;
    border-radius: $radius-md;
    color: $text-primary;
    font-size: 28rpx;
    line-height: 1.6;
    box-sizing: border-box;
  }

  &__slider-row {
    display: flex;
    align-items: center;
    gap: $spacing-sm;
  }

  &__slider-hint {
    font-size: 22rpx;
    color: $text-hint;
    white-space: nowrap;
  }

  &__slider {
    flex: 1;
  }

  &__score-label {
    display: block;
    text-align: center;
    font-size: 26rpx;
    color: $accent-color;
    margin-top: $spacing-xs;
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

  &__submit-text {
    font-size: 32rpx;
    color: #0D1B2A;
    font-weight: 600;
  }
}
</style>
