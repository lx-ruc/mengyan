import { ref, onUnmounted } from 'vue'

/** 语音录制封装 */
export function useVoiceRecorder() {
  const isRecording = ref(false)
  const duration = ref(0)
  const tempFilePath = ref<string | null>(null)

  let recorderManager: UniApp.RecorderManager | null = null
  let timer: ReturnType<typeof setInterval> | null = null
  let cancelling = false

  function clearTimer(): void {
    if (timer) {
      clearInterval(timer)
      timer = null
    }
  }

  function getManager(): UniApp.RecorderManager {
    if (!recorderManager) {
      recorderManager = uni.getRecorderManager()
      recorderManager.onStop((res) => {
        if (cancelling) {
          cancelling = false
          return
        }
        tempFilePath.value = res.tempFilePath
      })
      recorderManager.onError(() => {
        isRecording.value = false
        clearTimer()
      })
    }
    return recorderManager
  }

  function startRecording(): void {
    if (isRecording.value) return
    const manager = getManager()
    manager.start({
      format: 'mp3',
      sampleRate: 16000,
      numberOfChannels: 1,
      encodeBitRate: 96000,
      duration: 180000, // 最长 3 分钟
    })
    isRecording.value = true
    duration.value = 0

    timer = setInterval(() => {
      duration.value++
      if (duration.value >= 180) {
        stopRecording()
      }
    }, 1000)
  }

  function stopRecording(): void {
    if (!isRecording.value) return
    isRecording.value = false
    clearTimer()
    const manager = getManager()
    manager.stop()
  }

  function cancelRecording(): void {
    if (!isRecording.value) return
    cancelling = true
    isRecording.value = false
    clearTimer()
    const manager = getManager()
    manager.stop()
    tempFilePath.value = null
    duration.value = 0
  }

  function formatDuration(secs: number): string {
    const m = Math.floor(secs / 60)
    const s = secs % 60
    return `${m}:${String(s).padStart(2, '0')}`
  }

  onUnmounted(() => {
    if (isRecording.value) {
      cancelRecording()
    }
    clearTimer()
  })

  return {
    isRecording,
    duration,
    tempFilePath,
    startRecording,
    stopRecording,
    cancelRecording,
    formatDuration,
  }
}
