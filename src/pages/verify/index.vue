<script setup lang="ts">
import { computed, ref } from 'vue'
import { useDreamStore } from '@/stores/dream'
import { useRealityStore } from '@/stores/reality'
import { useUserStore } from '@/stores/user'
import { useTheme } from '@/composables/useTheme'
import DreamCard from '@/components/common/DreamCard.vue'

const { cssVars } = useTheme()
const dreamStore = useDreamStore()
const realityStore = useRealityStore()
const userStore = useUserStore()

const searchQuery = ref('')

const dreams = computed(() =>
  [...dreamStore.records].sort((a, b) => b.createdAt - a.createdAt),
)

const filteredDreams = computed(() => {
  if (!searchQuery.value.trim()) return dreams.value
  const q = searchQuery.value.trim().toLowerCase()
  return dreams.value.filter(d =>
    d.content.toLowerCase().includes(q)
    || d.tags.some(t => t.includes(q))
    || d.keywords.some(k => k.includes(q))
  )
})

const groupedByMonth = computed(() => {
  const groups: Record<string, typeof dreams.value> = {}
  for (const d of filteredDreams.value) {
    const month = d.date.slice(0, 7)
    if (!groups[month]) groups[month] = []
    groups[month].push(d)
  }
  return groups
})

const monthLabels: Record<string, string> = {}
const monthKeys = computed(() => {
  const keys = Object.keys(groupedByMonth.value).sort().reverse()
  for (const k of keys) {
    const [y, m] = k.split('-')
    monthLabels[k] = `${y}年${parseInt(m)}月`
  }
  return keys
})

function getMonthLabel(key: string): string {
  return monthLabels[key] ?? key
}

function goDetail(dreamId: string): void {
  const reality = realityStore.getRealityByDreamId(dreamId)
  if (reality) {
    uni.navigateTo({ url: `/pages/verify/comparison?realityId=${reality.id}` })
  } else {
    uni.navigateTo({ url: `/pages/record/dream-result?dreamId=${dreamId}` })
  }
}

function goStats(): void {
  uni.navigateTo({ url: '/pages/verify/stats' })
}

function deleteDream(dreamId: string): void {
  uni.showModal({
    title: '删除梦境',
    content: '确定删除这条梦境记录？相关联的现实记录也会被删除',
    confirmColor: '#FF6B6B',
    success: (res) => {
      if (res.confirm) {
        // 删除关联的现实记录
        const reality = realityStore.getRealityByDreamId(dreamId)
        if (reality) {
          realityStore.deleteReality(reality.id)
          userStore.data.totalRealities = Math.max(0, userStore.data.totalRealities - 1)
        }
        dreamStore.deleteDream(dreamId)
        userStore.data.totalDreams = Math.max(0, userStore.data.totalDreams - 1)
        userStore.persist()
        uni.showToast({ title: '已删除', icon: 'success' })
      }
    },
  })
}
</script>

<template>
  <view class="archive-page" :style="cssVars">
    <!-- 顶部操作栏 -->
    <view class="archive-page__header">
      <text class="archive-page__count">共 {{ dreams.length }} 条梦境记录</text>
      <view class="archive-page__stats-btn" @tap="goStats">
        <text class="archive-page__stats-btn-text">查看统计</text>
      </view>
    </view>

    <!-- 搜索框 -->
    <view v-if="dreams.length > 3" class="archive-page__search">
      <text class="archive-page__search-icon">🔍</text>
      <input
        v-model="searchQuery"
        class="archive-page__search-input"
        placeholder="搜索梦境..."
        placeholder-style="color: #5A6B7C"
        confirm-type="search"
      />
      <text v-if="searchQuery" class="archive-page__search-clear" @tap="searchQuery = ''">✕</text>
    </view>

    <!-- 梦境列表 -->
    <view v-if="filteredDreams.length > 0" class="archive-page__list">
      <view v-for="monthKey in monthKeys" :key="monthKey" class="archive-page__group">
        <text class="archive-page__month-label">{{ getMonthLabel(monthKey) }}</text>
        <view
          v-for="dream in groupedByMonth[monthKey]"
          :key="dream.id"
          class="archive-page__card-wrapper"
        >
          <view @tap="goDetail(dream.id)">
            <DreamCard :dream="dream" compact />
          </view>
          <view class="archive-page__card-delete" @tap.stop="deleteDream(dream.id)">
            <text class="archive-page__card-delete-text">删除</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 空状态 -->
    <view v-else class="archive-page__empty">
      <text class="archive-page__empty-icon">{{ searchQuery ? '🔍' : '🌙' }}</text>
      <text class="archive-page__empty-text">{{ searchQuery ? '没有找到匹配的梦境' : '还没有梦境记录' }}</text>
      <text v-if="!searchQuery" class="archive-page__empty-hint">去「记录」页面记录你的第一个梦吧</text>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.archive-page {
  min-height: 100vh;
  padding: $spacing-md $spacing-lg;

  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: $spacing-md;
  }

  &__count {
    font-size: 26rpx;
    color: $text-hint;
  }

  &__stats-btn {
    padding: $spacing-xs $spacing-md;
    background-color: var(--theme-accent-bg);
    border-radius: $radius-lg;
  }

  &__stats-btn-text {
    font-size: 24rpx;
    color: var(--theme-accent);
  }

  &__search {
    display: flex;
    align-items: center;
    gap: $spacing-sm;
    padding: $spacing-sm $spacing-md;
    background-color: $card-bg;
    border-radius: $radius-md;
    margin-bottom: $spacing-md;
  }

  &__search-icon {
    font-size: 24rpx;
    flex-shrink: 0;
  }

  &__search-input {
    flex: 1;
    font-size: 26rpx;
    color: $text-primary;
    height: 48rpx;
  }

  &__search-clear {
    font-size: 24rpx;
    color: $text-hint;
    padding: 4rpx 8rpx;
    flex-shrink: 0;
  }

  &__card-wrapper {
    position: relative;
    margin-bottom: $spacing-sm;
  }

  &__card-delete {
    position: absolute;
    right: $spacing-sm;
    top: $spacing-sm;
    padding: 4rpx 12rpx;
    background-color: rgba(255, 107, 107, 0.15);
    border-radius: $radius-xs;
    opacity: 0.5;
    transition: opacity 0.2s;

    .archive-page__card-wrapper:active & {
      opacity: 1;
    }
  }

  &__card-delete-text {
    font-size: 20rpx;
    color: #FF6B6B;
  }

  &__group {
    margin-bottom: $spacing-lg;
  }

  &__month-label {
    font-size: 26rpx;
    color: $text-secondary;
    font-weight: 600;
    margin-bottom: $spacing-sm;
    display: block;
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
    font-size: 32rpx;
    color: $text-secondary;
  }

  &__empty-hint {
    font-size: 26rpx;
    color: $text-hint;
  }
}
</style>
