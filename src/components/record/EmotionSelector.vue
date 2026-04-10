<script setup lang="ts">
import { Emotion, EmotionLabel, EmotionEmoji, type Emotion as EmotionType } from '@/types/dream'

const props = defineProps<{
  modelValue?: EmotionType | null
}>()

const emit = defineEmits<{
  'update:modelValue': [value: EmotionType]
}>()

const emotions = Object.values(Emotion)

function select(e: EmotionType): void {
  emit('update:modelValue', e)
}
</script>

<template>
  <view class="emotion-selector">
    <text class="emotion-selector__label">梦境情绪</text>
    <view class="emotion-selector__grid">
      <view
        v-for="e in emotions"
        :key="e"
        class="emotion-selector__item"
        :class="{ 'emotion-selector__item--active': modelValue === e }"
        @tap="select(e)"
      >
        <text class="emotion-selector__emoji">{{ EmotionEmoji[e] }}</text>
        <text class="emotion-selector__text">{{ EmotionLabel[e] }}</text>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.emotion-selector {
  &__label {
    font-size: 26rpx;
    color: $text-secondary;
    margin-bottom: $spacing-sm;
  }

  &__grid {
    display: flex;
    justify-content: space-between;
    gap: $spacing-xs;
  }

  &__item {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: $spacing-sm $spacing-xs;
    border-radius: $radius-sm;
    background-color: rgba(255, 255, 255, 0.05);
    transition: all 0.2s ease;

    &--active {
      background-color: rgba(255, 215, 0, 0.15);
      border: 2rpx solid $accent-color;
      transform: scale(1.05);
    }
  }

  &__emoji {
    font-size: 40rpx;
    margin-bottom: 4rpx;
  }

  &__text {
    font-size: 20rpx;
    color: $text-secondary;
  }
}
</style>
