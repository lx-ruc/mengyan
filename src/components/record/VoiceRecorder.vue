<script setup lang="ts">
import { watch } from 'vue'
import { useVoiceRecorder } from '@/composables/useVoiceRecorder'

const emit = defineEmits<{
  (e: 'update:voiceUrl', url: string): void
}>()

const { isRecording, duration, tempFilePath, startRecording, stopRecording, cancelRecording, formatDuration } = useVoiceRecorder()

watch(tempFilePath, (url) => {
  if (url) emit('update:voiceUrl', url)
})

function handleTouchStart(): void {
  startRecording()
}

function handleTouchEnd(): void {
  stopRecording()
}

function handleCancel(): void {
  cancelRecording()
}
</script>

<template>
  <view class="voice-recorder">
    <!-- 录音按钮 -->
    <view
      v-if="!tempFilePath"
      class="voice-recorder__btn"
      :class="{ 'voice-recorder__btn--recording': isRecording }"
      @touchstart.prevent="handleTouchStart"
      @touchend.prevent="handleTouchEnd"
      @longpress.stop="() => {}"
    >
      <view v-if="isRecording" class="voice-recorder__pulse" />
      <text class="voice-recorder__icon">{{ isRecording ? '🔴' : '🎤' }}</text>
      <text class="voice-recorder__text">
        {{ isRecording ? `松开结束 ${formatDuration(duration)}` : '按住说话' }}
      </text>
    </view>

    <!-- 录音中提示 -->
    <template v-if="isRecording">
      <text class="voice-recorder__hint">最长 3 分钟</text>
      <view class="voice-recorder__cancel" @tap="handleCancel">
        <text class="voice-recorder__cancel-text">取消录音</text>
      </view>
    </template>

    <!-- 已录制 -->
    <view v-if="tempFilePath && !isRecording" class="voice-recorder__done">
      <text class="voice-recorder__done-icon">🎙️</text>
      <text class="voice-recorder__done-text">语音已录制 {{ formatDuration(duration) }}</text>
      <view class="voice-recorder__redo" @tap="cancelRecording">
        <text class="voice-recorder__redo-text">重录</text>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.voice-recorder {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: $spacing-xs;

  &__btn {
    display: flex;
    align-items: center;
    gap: $spacing-sm;
    padding: $spacing-md $spacing-xl;
    background-color: rgba(255, 255, 255, 0.08);
    border-radius: $radius-lg;
    position: relative;
    overflow: hidden;

    &--recording {
      background-color: rgba(255, 107, 107, 0.15);
      border: 2rpx solid #FF6B6B;
    }
  }

  &__pulse {
    position: absolute;
    inset: 0;
    border-radius: $radius-lg;
    border: 2rpx solid rgba(255, 107, 107, 0.4);
    animation: pulse 1.5s ease-in-out infinite;
  }

  &__icon {
    font-size: 36rpx;
  }

  &__text {
    font-size: 28rpx;
    color: $text-primary;
  }

  &__hint {
    font-size: 22rpx;
    color: $text-hint;
  }

  &__cancel {
    padding: $spacing-xs $spacing-md;
    margin-top: $spacing-xs;

    &-text {
      font-size: 24rpx;
      color: #FF6B6B;
    }
  }

  &__done {
    display: flex;
    align-items: center;
    gap: $spacing-sm;
    padding: $spacing-md $spacing-lg;
    background-color: rgba(255, 255, 255, 0.06);
    border-radius: $radius-md;
    width: 100%;
    box-sizing: border-box;

    &-icon {
      font-size: 32rpx;
    }

    &-text {
      flex: 1;
      font-size: 26rpx;
      color: $text-secondary;
    }
  }

  &__redo {
    padding: $spacing-xs $spacing-md;
    background-color: rgba(255, 255, 255, 0.08);
    border-radius: $radius-sm;

    &-text {
      font-size: 24rpx;
      color: $accent-color;
    }
  }
}

@keyframes pulse {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.05); opacity: 0.6; }
}
</style>
