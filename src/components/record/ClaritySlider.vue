<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  modelValue: number
}>()

const emit = defineEmits<{
  'update:modelValue': [value: number]
}>()

function onInput(e: { detail: { value: number } }): void {
  emit('update:modelValue', e.detail.value)
}

const clarityDescriptions: Record<number, string> = {
  1: '像雾一样模糊',
  2: '只能记住片段',
  3: '大致能回忆',
  4: '细节比较清晰',
  5: '栩栩如生',
}

const description = computed(() => clarityDescriptions[props.modelValue] ?? '')
</script>

<template>
  <view class="clarity-slider">
    <view class="clarity-slider__header">
      <text class="clarity-slider__label">梦境清晰度</text>
      <text class="clarity-slider__value">{{ modelValue }}/5</text>
    </view>
    <view class="clarity-slider__row">
      <text class="clarity-slider__hint">模糊</text>
      <slider
        :value="modelValue"
        :min="1"
        :max="5"
        :step="1"
        active-color="#FFD700"
        background-color="#2A3A4A"
        block-color="#FFD700"
        block-size="20"
        class="clarity-slider__slider"
        @change="onInput"
      />
      <text class="clarity-slider__hint">清晰</text>
    </view>
    <text class="clarity-slider__desc">{{ description }}</text>
  </view>
</template>

<style lang="scss" scoped>
.clarity-slider {
  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: $spacing-xs;
  }

  &__label {
    font-size: 26rpx;
    color: $text-secondary;
  }

  &__value {
    font-size: 26rpx;
    color: $accent-color;
    font-weight: 600;
  }

  &__row {
    display: flex;
    align-items: center;
    gap: $spacing-sm;
  }

  &__hint {
    font-size: 22rpx;
    color: $text-hint;
    white-space: nowrap;
  }

  &__slider {
    flex: 1;
  }

  &__desc {
    display: block;
    text-align: center;
    font-size: 22rpx;
    color: $text-hint;
    margin-top: $spacing-xs;
  }
}
</style>
