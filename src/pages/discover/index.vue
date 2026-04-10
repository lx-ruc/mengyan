<script setup lang="ts">
import { ref, computed } from 'vue'
import { DREAM_SYMBOLS } from '@/data/dream-symbols'
import type { SymbolCategory } from '@/types/dream'

const categories: { key: SymbolCategory | 'all'; label: string }[] = [
  { key: 'all', label: '全部' },
  { key: 'element', label: '元素' },
  { key: 'animal', label: '动物' },
  { key: 'person', label: '人物' },
  { key: 'place', label: '地点' },
  { key: 'action', label: '动作' },
  { key: 'object', label: '物品' },
]

const activeCategory = ref<SymbolCategory | 'all'>('all')
const expandedSymbol = ref<string | null>(null)

const filteredSymbols = computed(() => {
  if (activeCategory.value === 'all') return DREAM_SYMBOLS
  return DREAM_SYMBOLS.filter(s => s.category === activeCategory.value)
})

function toggleExpand(name: string): void {
  expandedSymbol.value = expandedSymbol.value === name ? null : name
}

const articles = [
  {
    title: '为什么我们总是记不住梦？',
    desc: '科学研究表明，人在 REM 睡眠阶段做梦最多，但醒来后几分钟内就会忘记 95% 的梦境内容。学会正确记录可以提高回忆率。',
    tag: '科普',
  },
  {
    title: '反复出现的梦意味着什么？',
    desc: '反复出现的梦通常是潜意识在试图传达某个重要的信息。它们往往与未解决的情感问题或生活压力有关。',
    tag: '心理',
  },
  {
    title: '清明梦：在梦中意识到自己在做梦',
    desc: '清明梦是一种特殊的意识状态，做梦者知道自己在做梦，甚至可以控制梦境的发展。通过练习，大多数人都可以学会做清明梦。',
    tag: '技巧',
  },
  {
    title: '梦境与创造力：从梦中获得灵感',
    desc: '历史上许多伟大的发明和艺术作品都源于梦境。门捷列夫在梦中看到了元素周期表，达利的画作也深受梦境启发。',
    tag: '故事',
  },
  {
    title: '噩梦不是坏事：理解恐惧梦境的价值',
    desc: '噩梦虽然令人不安，但实际上是大脑处理负面情绪和压力的方式。了解噩梦的含义，可以帮助你更好地面对现实中的挑战。',
    tag: '心理',
  },
]

const tips = [
  { icon: '🌅', text: '醒来后先不要动，闭眼回忆梦境' },
  { icon: '📝', text: '在床头放好纸笔或手机，随时记录' },
  { icon: '⏰', text: '记录时用现在时态，仿佛梦境正在发生' },
  { icon: '💭', text: '关注梦中的情绪，而不仅仅是画面' },
  { icon: '📅', text: '养成每天记录的习惯，回忆能力会提升' },
]
</script>

<template>
  <scroll-view scroll-y class="discover-page">
    <!-- 记梦技巧 -->
    <view class="discover-page__section">
      <text class="discover-page__section-title">记梦技巧</text>
      <scroll-view scroll-x class="discover-page__tips-scroll">
        <view class="discover-page__tips-row">
          <view v-for="(tip, i) in tips" :key="i" class="discover-page__tip-card">
            <text class="discover-page__tip-icon">{{ tip.icon }}</text>
            <text class="discover-page__tip-text">{{ tip.text }}</text>
          </view>
        </view>
      </scroll-view>
    </view>

    <!-- 梦境符号图鉴 -->
    <view class="discover-page__section">
      <text class="discover-page__section-title">梦境符号图鉴</text>

      <!-- 分类筛选 -->
      <scroll-view scroll-x class="discover-page__category-scroll">
        <view class="discover-page__categories">
          <view
            v-for="cat in categories"
            :key="cat.key"
            class="discover-page__category"
            :class="{ 'discover-page__category--active': activeCategory === cat.key }"
            @tap="activeCategory = cat.key"
          >
            <text class="discover-page__category-text">{{ cat.label }}</text>
          </view>
        </view>
      </scroll-view>

      <!-- 符号列表 -->
      <view class="discover-page__symbols">
        <view
          v-for="sym in filteredSymbols"
          :key="sym.name"
          class="discover-page__symbol"
          :class="{ 'discover-page__symbol--expanded': expandedSymbol === sym.name }"
          @tap="toggleExpand(sym.name)"
        >
          <view class="discover-page__symbol-header">
            <text class="discover-page__symbol-icon">{{ sym.icon }}</text>
            <text class="discover-page__symbol-name">{{ sym.name }}</text>
          </view>
          <view v-if="expandedSymbol === sym.name" class="discover-page__symbol-detail">
            <text class="discover-page__symbol-meaning">{{ sym.meaning }}</text>
            <view class="discover-page__symbol-keywords">
              <text v-for="kw in sym.keywords.slice(0, 5)" :key="kw" class="discover-page__keyword">
                {{ kw }}
              </text>
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- 解梦文章 -->
    <view class="discover-page__section">
      <text class="discover-page__section-title">解梦文章</text>
      <view v-for="article in articles" :key="article.title" class="discover-page__article">
        <view class="discover-page__article-header">
          <text class="discover-page__article-tag">{{ article.tag }}</text>
          <text class="discover-page__article-title">{{ article.title }}</text>
        </view>
        <text class="discover-page__article-desc">{{ article.desc }}</text>
      </view>
    </view>

    <!-- 底部间距 -->
    <view style="height: 40rpx" />
  </scroll-view>
</template>

<style lang="scss" scoped>
.discover-page {
  min-height: 100vh;
  padding: $spacing-md $spacing-lg;

  &__section {
    margin-bottom: $spacing-xl;
  }

  &__section-title {
    font-size: 30rpx;
    color: $accent-color;
    font-weight: 600;
    margin-bottom: $spacing-md;
    display: block;
  }

  // Tips
  &__tips-scroll {
    white-space: nowrap;
    margin-bottom: $spacing-sm;
  }

  &__tips-row {
    display: flex;
    gap: $spacing-sm;
  }

  &__tip-card {
    display: inline-flex;
    flex-direction: column;
    align-items: center;
    gap: $spacing-xs;
    padding: $spacing-md;
    background-color: $card-bg;
    border-radius: $radius-md;
    width: 220rpx;
    flex-shrink: 0;
    white-space: normal;
  }

  &__tip-icon {
    font-size: 40rpx;
  }

  &__tip-text {
    font-size: 24rpx;
    color: $text-primary;
    line-height: 1.4;
    text-align: center;
  }

  // Categories
  &__category-scroll {
    white-space: nowrap;
    margin-bottom: $spacing-md;
  }

  &__categories {
    display: flex;
    gap: $spacing-sm;
  }

  &__category {
    padding: $spacing-xs $spacing-lg;
    background-color: rgba(255, 255, 255, 0.06);
    border-radius: $radius-lg;
    flex-shrink: 0;

    &--active {
      background-color: rgba(255, 215, 0, 0.15);
      border: 2rpx solid $accent-color;
    }
  }

  &__category-text {
    font-size: 26rpx;
    color: $text-secondary;

    .discover-page__category--active & {
      color: $accent-color;
    }
  }

  // Symbols
  &__symbols {
    display: flex;
    flex-wrap: wrap;
    gap: $spacing-sm;
  }

  &__symbol {
    background-color: $card-bg;
    border-radius: $radius-md;
    padding: $spacing-sm $spacing-md;
    min-width: 140rpx;

    &--expanded {
      width: 100%;
      min-width: unset;
    }
  }

  &__symbol-header {
    display: flex;
    align-items: center;
    gap: $spacing-xs;
  }

  &__symbol-icon {
    font-size: 32rpx;
  }

  &__symbol-name {
    font-size: 26rpx;
    color: $text-primary;
  }

  &__symbol-detail {
    margin-top: $spacing-sm;
    padding-top: $spacing-sm;
    border-top: 2rpx solid $border-color;
  }

  &__symbol-meaning {
    font-size: 24rpx;
    color: $text-secondary;
    line-height: 1.5;
    display: block;
    margin-bottom: $spacing-sm;
  }

  &__symbol-keywords {
    display: flex;
    flex-wrap: wrap;
    gap: $spacing-xs;
  }

  &__keyword {
    font-size: 20rpx;
    color: $text-hint;
    background-color: rgba(255, 255, 255, 0.06);
    padding: 2rpx 12rpx;
    border-radius: $radius-xs;
  }

  // Articles
  &__article {
    background-color: $card-bg;
    border-radius: $radius-md;
    padding: $spacing-md;
    margin-bottom: $spacing-sm;
  }

  &__article-header {
    display: flex;
    align-items: center;
    gap: $spacing-sm;
    margin-bottom: $spacing-xs;
  }

  &__article-tag {
    font-size: 20rpx;
    color: $dream-purple;
    background-color: rgba(123, 45, 142, 0.12);
    padding: 2rpx 12rpx;
    border-radius: $radius-xs;
    flex-shrink: 0;
  }

  &__article-title {
    font-size: 28rpx;
    color: $text-primary;
    font-weight: 500;
    flex: 1;
  }

  &__article-desc {
    font-size: 24rpx;
    color: $text-secondary;
    line-height: 1.5;
  }
}
</style>
