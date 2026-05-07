<script setup lang="ts">
import { useUserStore } from '@/stores/user'
import { useDreamStore } from '@/stores/dream'
import { useRealityStore } from '@/stores/reality'
import { useSettingsStore } from '@/stores/settings'
import { useTheme } from '@/composables/useTheme'

const { colors, cssVars } = useTheme()
const userStore = useUserStore()
const dreamStore = useDreamStore()
const realityStore = useRealityStore()
const settingsStore = useSettingsStore()

function editNickname(): void {
  uni.showModal({
    title: '修改昵称',
    editable: true,
    placeholderText: '请输入昵称',
    content: userStore.nickname,
    confirmColor: colors.value.accent,
    success: (res) => {
      if (res.confirm && res.content?.trim()) {
        userStore.setNickname(res.content.trim())
        uni.showToast({ title: '昵称已更新', icon: 'success' })
      }
    },
  })
}

function handleClearData(): void {
  uni.showModal({
    title: '确认清除',
    content: '这将删除所有梦境和现实记录，此操作不可恢复',
    confirmColor: '#FF6B6B',
    success: (res) => {
      if (res.confirm) {
        dreamStore.clearAll()
        realityStore.clearAll()
        userStore.data.totalDreams = 0
        userStore.data.totalRealities = 0
        userStore.data.streak = 0
        userStore.data.lastRecordDate = ''
        userStore.persist()
        uni.showToast({ title: '数据已清除', icon: 'success' })
      }
    },
  })
}

/** 下一等级所需梦境数 */
function nextLevelDreams(): number {
  const thresholds = [7, 20, 50, 100]
  const current = userStore.totalDreams
  for (const t of thresholds) {
    if (current < t) return t
  }
  return 999
}

/** 当前等级进度 */
function levelProgress(): number {
  const thresholds = [0, 7, 20, 50, 100]
  const level = userStore.level
  if (level >= 5) return 100
  const base = thresholds[level - 1]
  const target = thresholds[level]
  return Math.min(100, Math.round(((userStore.totalDreams - base) / (target - base)) * 100))
}
</script>

<template>
  <view class="profile-page" :style="cssVars">
    <!-- 个人信息 -->
    <view class="profile-page__header">
      <view class="profile-page__avatar">
        <text class="profile-page__avatar-icon">🔮</text>
      </view>
      <view class="profile-page__name-row" @tap="editNickname">
        <text class="profile-page__name">{{ userStore.nickname }}</text>
        <text class="profile-page__edit-icon">✏️</text>
      </view>
      <text class="profile-page__level">Lv.{{ userStore.level }} {{ userStore.levelTitle }}</text>

      <!-- 等级进度条 -->
      <view v-if="userStore.level < 5" class="profile-page__progress">
        <view class="profile-page__progress-bar">
          <view class="profile-page__progress-fill" :style="{ width: levelProgress() + '%' }" />
        </view>
        <text class="profile-page__progress-text">{{ userStore.totalDreams }}/{{ nextLevelDreams() }} 升级</text>
      </view>
    </view>

    <!-- 统计摘要 -->
    <view class="profile-page__stats">
      <view class="profile-page__stat">
        <text class="profile-page__stat-value">{{ dreamStore.records.length }}</text>
        <text class="profile-page__stat-label">梦境记录</text>
      </view>
      <view class="profile-page__stat">
        <text class="profile-page__stat-value">{{ realityStore.records.length }}</text>
        <text class="profile-page__stat-label">现实记录</text>
      </view>
      <view class="profile-page__stat">
        <text class="profile-page__stat-value">{{ userStore.streak }}</text>
        <text class="profile-page__stat-label">连续天数</text>
      </view>
    </view>

    <!-- 设置 -->
    <view class="profile-page__section">
      <text class="profile-page__section-title">设置</text>

      <view class="profile-page__setting-item">
        <text class="profile-page__setting-label">通知提醒</text>
        <switch
          :checked="settingsStore.notificationEnabled"
          :color="colors.accent"
          @change="(e: any) => settingsStore.setNotificationEnabled(e.detail.value)"
        />
      </view>

      <view class="profile-page__setting-item">
        <text class="profile-page__setting-label">音效</text>
        <switch
          :checked="settingsStore.soundEnabled"
          :color="colors.accent"
          @change="(e: any) => settingsStore.setSoundEnabled(e.detail.value)"
        />
      </view>
    </view>

    <!-- 数据管理 -->
    <view class="profile-page__section">
      <text class="profile-page__section-title">数据管理</text>
      <view class="profile-page__danger-btn" @tap="handleClearData">
        <text class="profile-page__danger-text">清除所有数据</text>
      </view>
    </view>

    <!-- 关于 -->
    <view class="profile-page__section">
      <text class="profile-page__section-title">关于</text>
      <view class="profile-page__about">
        <text class="profile-page__about-text">梦迹 v0.1.0</text>
        <text class="profile-page__about-desc">记录梦境、验证现实、解读潜意识——你的AI验梦师</text>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.profile-page {
  min-height: 100vh;
  padding: $spacing-md $spacing-lg;

  &__header {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: $spacing-xl 0;
    gap: $spacing-sm;
  }

  &__avatar {
    width: 120rpx;
    height: 120rpx;
    border-radius: $radius-full;
    background: linear-gradient(135deg, var(--theme-gradient-start), var(--theme-accent));
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: $spacing-sm;
  }

  &__avatar-icon {
    font-size: 48rpx;
  }

  &__name-row {
    display: flex;
    align-items: center;
    gap: $spacing-xs;
  }

  &__name {
    font-size: 32rpx;
    color: $text-primary;
    font-weight: 600;
  }

  &__edit-icon {
    font-size: 22rpx;
    opacity: 0.6;
  }

  &__level {
    font-size: 24rpx;
    color: var(--theme-accent);
    background-color: var(--theme-accent-bg);
    padding: 2rpx 16rpx;
    border-radius: $radius-lg;
  }

  &__progress {
    width: 60%;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4rpx;
    margin-top: $spacing-xs;
  }

  &__progress-bar {
    width: 100%;
    height: 8rpx;
    background-color: rgba(255, 255, 255, 0.1);
    border-radius: 4rpx;
    overflow: hidden;
  }

  &__progress-fill {
    height: 100%;
    background: linear-gradient(90deg, var(--theme-gradient-start), var(--theme-accent));
    border-radius: 4rpx;
    transition: width 0.3s ease;
  }

  &__progress-text {
    font-size: 20rpx;
    color: $text-hint;
  }

  &__stats {
    display: flex;
    gap: $spacing-sm;
    margin-bottom: $spacing-xl;
  }

  &__stat {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: $spacing-xs;
    padding: $spacing-md;
    background-color: $card-bg;
    border-radius: $radius-md;
  }

  &__stat-value {
    font-size: 36rpx;
    color: var(--theme-accent);
    font-weight: 700;
  }

  &__stat-label {
    font-size: 22rpx;
    color: $text-hint;
  }

  &__section {
    margin-bottom: $spacing-xl;
  }

  &__section-title {
    font-size: 26rpx;
    color: $text-hint;
    margin-bottom: $spacing-md;
    display: block;
  }

  &__setting-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: $spacing-md;
    background-color: $card-bg;
    border-radius: $radius-md;
    margin-bottom: $spacing-xs;
  }

  &__setting-label {
    font-size: 28rpx;
    color: $text-primary;
  }

  &__danger-btn {
    padding: $spacing-md;
    background-color: rgba(255, 107, 107, 0.1);
    border-radius: $radius-md;
    display: flex;
    justify-content: center;

    &:active {
      background-color: rgba(255, 107, 107, 0.2);
    }
  }

  &__danger-text {
    font-size: 28rpx;
    color: #FF6B6B;
  }

  &__about {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: $spacing-xs;
    padding: $spacing-md;
  }

  &__about-text {
    font-size: 28rpx;
    color: $text-secondary;
  }

  &__about-desc {
    font-size: 24rpx;
    color: $text-hint;
    text-align: center;
  }
}
</style>
