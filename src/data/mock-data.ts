import type { DreamRecord } from '@/types/dream'
import type { RealityRecord } from '@/types/reality'
import { DreamTag, Emotion } from '@/types/dream'
import { RealityEventTag } from '@/types/reality'

const now = Date.now()
const DAY = 86400000

/** 示例梦境记录 */
export const SAMPLE_DREAM_RECORDS: DreamRecord[] = [
  {
    id: 'sample1',
    date: new Date(now - DAY).toISOString().slice(0, 10),
    content: '梦见在一个很大很空旷的教室里考试，试卷上的文字全部看不懂，周围的人都在奋笔疾书，只有我一个人手足无措。监考老师一直在看着我，时间越来越少...',
    tags: [DreamTag.NIGHTMARE],
    emotion: Emotion.FEAR,
    clarity: 4,
    isRecurring: true,
    keywords: ['考试', '教室', '老师', '试卷'],
    createdAt: now - DAY,
  },
  {
    id: 'sample2',
    date: new Date(now - DAY * 2).toISOString().slice(0, 10),
    content: '梦见自己在海边散步，突然看到了一只很大的蝴蝶从海面上飞过来，蝴蝶的翅膀是蓝色的，非常美丽。我伸手去触碰它，感觉自己也在慢慢飘起来...',
    tags: [DreamTag.SWEET],
    emotion: Emotion.HAPPY,
    clarity: 3,
    isRecurring: false,
    keywords: ['海', '蝴蝶', '飞', '海边'],
    createdAt: now - DAY * 2,
  },
  {
    id: 'sample3',
    date: new Date(now - DAY * 3).toISOString().slice(0, 10),
    content: '一直在跑，好像有什么东西在后面追赶我，但我看不到是什么。跑着跑着到了一个森林里，路越来越窄，周围越来越黑，最后到了一个死胡同...',
    tags: [DreamTag.NIGHTMARE, DreamTag.RECURRING],
    emotion: Emotion.FEAR,
    clarity: 2,
    isRecurring: true,
    keywords: ['跑', '追赶', '森林', '路'],
    createdAt: now - DAY * 3,
  },
] as const

/** 示例现实记录（关联 sample1） */
export const SAMPLE_REALITY_RECORD: RealityRecord = {
  id: 'reality1',
  dreamId: 'sample1',
  date: new Date(now - DAY).toISOString().slice(0, 10),
  eventTags: [RealityEventTag.WORK, RealityEventTag.ANXIOUS],
  content: '今天公司突然安排了一个重要项目的汇报，准备时间很短，感觉很紧张。会议上领导一直看着我，压力很大。',
  selfScore: 4,
  aiScore: 0.85,
  finalScore: 0.71,
  aiComment: '你的梦境完美地预示了今天的工作挑战！考试场景与实际的工作汇报高度吻合，监考老师的注视与领导的眼神呼应。你的潜意识似乎已经提前感知到了这份压力。',
  createdAt: now - DAY,
}
