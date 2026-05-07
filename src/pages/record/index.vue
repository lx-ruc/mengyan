<script setup lang="ts">
import { computed } from 'vue'
import { useTimeGreeting } from '@/composables/useTimeGreeting'
import { useTheme } from '@/composables/useTheme'
import { useDreamStore } from '@/stores/dream'
import { useRealityStore } from '@/stores/reality'
import { useUserStore } from '@/stores/user'
import { formatDisplayDate } from '@/utils/date'
import StarryBackground from '@/components/common/StarryBackground.vue'
import TimeGreeting from '@/components/record/TimeGreeting.vue'
import StatusCards from '@/components/record/StatusCards.vue'

const { period, greeting, backgroundType, mode, periodIcon } = useTimeGreeting()
const { cssVars } = useTheme()
const dreamStore = useDreamStore()
const realityStore = useRealityStore()
const userStore = useUserStore()

const todayDreamDone = computed(() => !!dreamStore.todayDream)
const todayRealityDone = computed(() => !!realityStore.todayReality)

const matchScore = computed(() => {
  const todayDream = dreamStore.todayDream
  if (todayDream?.realityMatchScore != null) return todayDream.realityMatchScore
  return null
})

const recentDreams = computed(() => dreamStore.recentDreams.slice(0, 3))

function goDreamInput(): void {
  uni.navigateTo({ url: '/pages/record/dream-input' })
}

function goRealityInput(): void {
  const todayDream = dreamStore.todayDream
  if (!todayDream) {
    uni.showToast({ title: '请先记录今天的梦境', icon: 'none' })
    return
  }
  uni.navigateTo({ url: `/pages/record/reality-input?dreamId=${todayDream.id}` })
}

function goDreamResult(id?: string): void {
  const dreamId = id ?? dreamStore.todayDream?.id
  if (!dreamId) {
    uni.showToast({ title: '还没有今天的梦境', icon: 'none' })
    return
  }
  uni.navigateTo({ url: `/pages/record/dream-result?dreamId=${dreamId}` })
}
</script>

<template>
  <view class="record-page" :style="cssVars">
    <StarryBackground :type="backgroundType" />

    <view class="record-page__content">
      <!-- 问候区 -->
      <view class="record-page__greeting">
        <TimeGreeting
          :period="period"
          :greeting="greeting"
          :background-type="backgroundType"
          :period-icon="periodIcon"
        />
      </view>

      <!-- 状态卡片 -->
      <StatusCards
        :today-dream-done="todayDreamDone"
        :today-reality-done="todayRealityDone"
        :match-score="matchScore"
        :streak="userStore.streak"
        @tap-dream="goDreamInput"
        @tap-reality="goRealityInput"
        @tap-score="goDreamResult"
        @tap-streak="() => uni.switchTab({ url: '/pages/verify/index' })"
      />

      <!-- 主操作按钮 -->
      <view class="record-page__actions">
        <view class="record-page__both-btns">
          <view
            class="record-page__btn record-page__btn--dream"
            :class="{ 'record-page__btn--done': todayDreamDone }"
            @tap="goDreamInput"
          >
            <text class="record-page__btn-icon">🌙</text>
            <text class="record-page__btn-text">{{ todayDreamDone ? '已记录梦境' : '记录梦境' }}</text>
          </view>
          <view
            class="record-page__btn record-page__btn--reality"
            :class="{ 'record-page__btn--done': todayRealityDone }"
            @tap="goRealityInput"
          >
            <text class="record-page__btn-icon">📝</text>
            <text class="record-page__btn-text">{{ todayRealityDone ? '已记录现实' : '记录现实' }}</text>
          </view>
        </view>
      </view>

      <!-- 历史梦境速览 -->
      <view v-if="recentDreams.length > 0" class="record-page__history">
        <text class="record-page__history-title">近期梦境</text>
        <view
          v-for="dream in recentDreams"
          :key="dream.id"
          class="record-page__history-item"
          @tap="goDreamResult(dream.id)"
        >
          <view class="record-page__history-left">
            <text class="record-page__history-date">{{ formatDisplayDate(dream.date) }}</text>
            <text class="record-page__history-content">{{ dream.content.length > 40 ? dream.content.slice(0, 40) + '...' : dream.content }}</text>
          </view>
          <view v-if="dream.realityMatchScore != null" class="record-page__history-score">
            <text class="record-page__history-stars">
              {{ '★'.repeat(Math.round(dream.realityMatchScore * 5)) }}{{ '☆'.repeat(5 - Math.round(dream.realityMatchScore * 5)) }}
            </text>
          </view>
          <view v-else>
            <text class="record-page__history-pending">待验梦</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.record-page {
  min-height: 100vh;
  position: relative;

  &__content {
    position: relative;
    z-index: 1;
    padding-top: 120rpx;
    padding-bottom: 180rpx;
  }

  &__greeting {
    padding: 0 $spacing-lg;
    margin-bottom: $spacing-lg;
  }

  &__actions {
    padding: $spacing-lg $spacing-lg;
  }

  &__both-btns {
    display: flex;
    gap: $spacing-md;
  }

  &__btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: $spacing-sm;
    padding: $spacing-lg $spacing-xl;
    border-radius: $radius-lg;
    transition: transform 0.15s ease;

    &:active {
      transform: scale(0.97);
    }

    &--main {
      background: linear-gradient(135deg, $dream-purple, #4A1D8E);
      box-shadow: 0 8rpx 24rpx $glow-purple;
    }

    &--dream {
      flex: 1;
      background: linear-gradient(135deg, var(--theme-gradient-start), var(--theme-gradient-end));
      box-shadow: 0 8rpx 24rpx var(--theme-accent-glow);
    }

    &--reality {
      flex: 1;
      background: linear-gradient(135deg, #2A5A4A, #3D7A6A);
      box-shadow: 0 8rpx 24rpx rgba(61, 122, 106, 0.3);
    }

    &--done {
      opacity: 0.5;
      box-shadow: none;
    }

    &-icon {
      font-size: 36rpx;
    }

    &-text {
      font-size: 32rpx;
      color: $text-primary;
      font-weight: 500;
    }
  }

  &__history {
    padding: $spacing-lg;
    margin-top: $spacing-md;

    &-title {
      font-size: 28rpx;
      color: $text-secondary;
      margin-bottom: $spacing-md;
    }

    &-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: $spacing-md;
      background-color: $card-bg;
      border-radius: $radius-md;
      margin-bottom: $spacing-sm;

      &:active {
        background-color: rgba(255, 255, 255, 0.08);
      }
    }

    &-left {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 4rpx;
    }

    &-date {
      font-size: 22rpx;
      color: $text-hint;
    }

    &-content {
      font-size: 26rpx;
      color: $text-primary;
    }

    &-stars {
      font-size: 24rpx;
      color: $accent-color;
    }

    &-pending {
      font-size: 22rpx;
      color: $text-hint;
    }

    &-score {
      flex-shrink: 0;
    }
  }
}
</style>
