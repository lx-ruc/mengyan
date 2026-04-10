import type { DreamSymbol } from '@/types/dream'

/** 50+ 梦境符号词典 */
export const DREAM_SYMBOLS: readonly DreamSymbol[] = [
  // ── 元素类 ──
  { name: '水', icon: '🌊', meaning: '水象征情感与潜意识。清水代表心灵净化，浑浊的水暗示情感困惑，大水则意味着情绪的涌动。', category: 'element', keywords: ['水', '河', '海', '湖', '雨', '洪水', '游泳', '溺水', '下雨', '淋雨'] },
  { name: '火', icon: '🔥', meaning: '火象征激情、转变与净化。大火可能暗示内心的焦虑或即将到来的改变，温暖的火则代表希望与力量。', category: 'element', keywords: ['火', '燃烧', '着火', '火焰', '火灾', '烧'] },
  { name: '风', icon: '💨', meaning: '风代表变化与不确定性。微风象征轻柔的改变，狂风则暗示生活中即将到来的动荡。', category: 'element', keywords: ['风', '台风', '龙卷风', '吹'] },
  { name: '月亮', icon: '🌙', meaning: '月亮象征直觉、神秘与女性能量。满月代表圆满与高潮，新月暗示新的开始。', category: 'element', keywords: ['月亮', '月光', '月', '满月'] },
  { name: '太阳', icon: '☀️', meaning: '太阳象征生命力、意识与成功。明亮的阳光预示积极的发展，被遮蔽的太阳则暗示暂时的迷茫。', category: 'element', keywords: ['太阳', '阳光', '日出', '日落'] },
  { name: '星星', icon: '⭐', meaning: '星星象征希望、指引与命运。璀璨的星空代表美好的愿景，坠落的星星则暗示目标的失落。', category: 'element', keywords: ['星星', '星空', '流星', '星辰'] },
  { name: '雪', icon: '❄️', meaning: '雪象征纯洁、宁静与隐藏。下雪可能暗示需要冷静思考，融雪则预示困境即将消解。', category: 'element', keywords: ['雪', '下雪', '冰雪', '雪地'] },
  { name: '云', icon: '☁️', meaning: '云象征梦想、不确定性。白云代表美好的遐想，乌云则暗示忧虑和即将到来的困难。', category: 'element', keywords: ['云', '白云', '乌云', '云朵'] },

  // ── 动物类 ──
  { name: '蛇', icon: '🐍', meaning: '蛇是最常见的梦境符号之一，象征转变、智慧与潜意识中的恐惧。被蛇咬可能暗示健康或人际方面的警告。', category: 'animal', keywords: ['蛇', '蟒蛇', '毒蛇'] },
  { name: '狗', icon: '🐕', meaning: '狗象征忠诚、友谊与保护。友善的狗代表可靠的朋友，凶猛的狗可能暗示身边存在不可信任的人。', category: 'animal', keywords: ['狗', '小狗', '犬'] },
  { name: '猫', icon: '🐱', meaning: '猫象征独立、直觉与神秘。梦中的猫可能暗示需要更多关注自己的直觉感受。', category: 'animal', keywords: ['猫', '小猫', '猫咪'] },
  { name: '鸟', icon: '🐦', meaning: '鸟象征自由、灵魂与信息。飞翔的鸟代表自由与希望，受伤的鸟可能暗示创造力受到压抑。', category: 'animal', keywords: ['鸟', '鸟飞', '飞翔', '麻雀', '老鹰', '鸽子'] },
  { name: '鱼', icon: '🐟', meaning: '鱼象征财富、机遇与潜意识。抓住鱼预示收获，鱼在水中自由游动代表内心的和谐。', category: 'animal', keywords: ['鱼', '钓鱼', '金鱼', '大鱼', '鱼塘'] },
  { name: '马', icon: '🐴', meaning: '马象征力量、自由与前行的动力。骑马代表掌控力，失控的马暗示方向感的缺失。', category: 'animal', keywords: ['马', '骑马', '马跑'] },
  { name: '蝴蝶', icon: '🦋', meaning: '蝴蝶象征蜕变、美丽与灵魂的成长。梦中的蝴蝶暗示你正在经历或即将经历一次美好的转变。', category: 'animal', keywords: ['蝴蝶', '蝶'] },
  { name: '蜘蛛', icon: '🕷️', meaning: '蜘蛛象征创造力与命运的编织。也可能代表某种让你感到被困住的关系或处境。', category: 'animal', keywords: ['蜘蛛', '蜘蛛网', '网'] },

  // ── 人物类 ──
  { name: '母亲', icon: '👩', meaning: '母亲象征滋养、安全感与无条件的爱。梦中的母亲可能反映你对照顾和被照顾的渴望。', category: 'person', keywords: ['妈妈', '母亲', '妈', '老妈'] },
  { name: '父亲', icon: '👨', meaning: '父亲象征权威、保护与人生方向。梦中的父亲可能反映你对指引和支持的需求。', category: 'person', keywords: ['爸爸', '父亲', '爸', '老爸'] },
  { name: '孩子', icon: '👶', meaning: '孩子象征纯真、新的可能与内在的小孩。梦中的孩子可能代表你内心深处需要被关注的部分。', category: 'person', keywords: ['孩子', '小孩', '婴儿', '宝宝', '儿童'] },
  { name: '陌生人', icon: '🎭', meaning: '陌生人象征你尚未认识到的自我面向。梦中的陌生人可能代表你潜意识中的某种潜能或恐惧。', category: 'person', keywords: ['陌生人', '不认识的人', '陌生人说话'] },
  { name: '老师', icon: '👨‍🏫', meaning: '老师象征智慧、指引与自我评判。梦中的老师可能暗示你需要学习某个教训或正在被评判。', category: 'person', keywords: ['老师', '教师', '教授', '导师'] },
  { name: '前任/恋人', icon: '💕', meaning: '梦到前任或恋人不一定是想念对方，更多是反映你对亲密关系的期待或未解决的情感议题。', category: 'person', keywords: ['前任', '恋人', '男朋友', '女朋友', '男友', '女友', '爱人'] },

  // ── 地点类 ──
  { name: '家', icon: '🏠', meaning: '家象征安全感、自我与内心世界。梦中的家如果陌生或变化了，可能暗示你对自我认知正在发生改变。', category: 'place', keywords: ['家', '房子', '房间', '卧室', '家里', '回家'] },
  { name: '学校', icon: '🏫', meaning: '学校象征学习、成长与社会评价。在梦中回到学校通常反映你对某项挑战的焦虑或对成长的渴望。', category: 'place', keywords: ['学校', '教室', '课堂', '校园', '大学'] },
  { name: '森林', icon: '🌲', meaning: '森林象征潜意识深处与未知领域。在森林中迷路可能暗示你对人生方向的困惑。', category: 'place', keywords: ['森林', '树林', '丛林', '山里'] },
  { name: '海洋', icon: '🌊', meaning: '海洋象征潜意识的浩瀚与深层情感。平静的海面代表内心平和，汹涌的海浪暗示情绪波动。', category: 'place', keywords: ['海', '大海', '海洋', '海边', '沙滩'] },
  { name: '山', icon: '⛰️', meaning: '山象征挑战、成就与人生目标。爬山代表克服困难，山顶则象征目标的达成。', category: 'place', keywords: ['山', '爬山', '山顶', '高山', '悬崖'] },
  { name: '医院', icon: '🏥', meaning: '医院象征疗愈、健康焦虑与对自我的审视。梦中的医院可能暗示你需要关注自己的身心健康。', category: 'place', keywords: ['医院', '看病', '医生', '手术'] },
  { name: '道路', icon: '🛤️', meaning: '道路象征人生旅途与选择。宽阔的大路代表前途开阔，狭窄的小路暗示选择的困难。', category: 'place', keywords: ['路', '道路', '走路', '迷路', '小路', '大路', '十字路口'] },
  { name: '电梯', icon: '🛗', meaning: '电梯象征人生的升降与失控感。上行的电梯代表进步，下坠的电梯则暗示对失去控制的恐惧。', category: 'place', keywords: ['电梯', '升降', '坠落', '掉下去'] },

  // ── 动作类 ──
  { name: '飞翔', icon: '🕊️', meaning: '飞翔象征自由、超越与雄心。梦中飞翔是非常积极的信号，代表你正在突破限制。', category: 'action', keywords: ['飞', '飞翔', '飞起来', '在空中', '漂浮'] },
  { name: '坠落', icon: '📉', meaning: '坠落象征失控、焦虑与不安全感。这是最常见的梦境之一，通常反映生活中的压力。', category: 'action', keywords: ['掉', '坠落', '掉下', '掉落', '摔下', '掉下去'] },
  { name: '被追赶', icon: '🏃', meaning: '被追赶象征逃避与压力。梦中的追赶者通常代表你试图回避的问题或情绪。', category: 'action', keywords: ['追', '被追', '逃跑', '跑', '追赶', '追杀'] },
  { name: '考试', icon: '📝', meaning: '考试象征自我审视与对评价的焦虑。在梦中考试不及格通常反映你对某项现实挑战的不自信。', category: 'action', keywords: ['考试', '测试', '答题', '试卷', '不及格', '分数'] },
  { name: '迟到', icon: '⏰', meaning: '迟到象征时间压力与错失恐惧。梦到迟到可能反映你对现实中的某个重要时刻感到准备不足。', category: 'action', keywords: ['迟到', '赶时间', '来不及', '错过'] },
  { name: '裸体', icon: '👤', meaning: '梦中裸体象征脆弱感与被暴露的恐惧。也可能代表你渴望真实地展现自我。', category: 'action', keywords: ['裸', '裸体', '没穿衣服', '光着'] },
  { name: '寻找', icon: '🔍', meaning: '寻找象征对缺失之物的渴望。你在梦中寻找什么，就代表你在现实中缺少什么。', category: 'action', keywords: ['找', '寻找', '找不到', '丢失', '丢了', '搜寻'] },
  { name: '打架', icon: '👊', meaning: '打架象征内心冲突与压抑的愤怒。梦中的对手可能代表你与自己对峙的某个面向。', category: 'action', keywords: ['打架', '争吵', '打', '冲突', '吵架', '动手'] },

  // ── 物品类 ──
  { name: '钥匙', icon: '🔑', meaning: '钥匙象征解决方案与新的机遇。找到钥匙代表即将找到答案，丢失钥匙则暗示错失机会。', category: 'object', keywords: ['钥匙', '开门', '锁'] },
  { name: '镜子', icon: '🪞', meaning: '镜子象征自我反思与真实的自我。梦中镜子中的形象可能揭示你如何看待自己。', category: 'object', keywords: ['镜子', '照镜子', '倒影', '反射'] },
  { name: '书籍', icon: '📖', meaning: '书籍象征知识、智慧与人生答案。梦中的书可能暗示你需要学习新知识来应对当前的挑战。', category: 'object', keywords: ['书', '读书', '书本', '图书馆'] },
  { name: '门', icon: '🚪', meaning: '门象征机会、选择与过渡。打开的门代表新的可能，关闭的门暗示被阻断的道路。', category: 'object', keywords: ['门', '开门', '关门', '大门', '推门'] },
  { name: '桥', icon: '🌉', meaning: '桥象征过渡、连接与转变。梦中的桥代表你正在或需要从一个人生阶段过渡到另一个。', category: 'object', keywords: ['桥', '过桥', '断桥'] },
  { name: '车', icon: '🚗', meaning: '车象征人生方向与掌控力。驾驶代表掌控，失控的车暗示生活中的方向感缺失。', category: 'object', keywords: ['车', '开车', '坐车', '汽车', '公交车', '驾驶'] },
  { name: '手机', icon: '📱', meaning: '手机象征沟通与信息连接。梦中的手机可能反映你的社交焦虑或对信息的渴求。', category: 'object', keywords: ['手机', '电话', '打电话', '接电话', '消息'] },
  { name: '钱', icon: '💰', meaning: '钱象征价值、安全感与自我评价。梦到钱不一定是财富预兆，更多反映你对自身价值的认知。', category: 'object', keywords: ['钱', '钱币', '钱包', '钞票', '金钱', '取钱'] },
] as const

/** 根据关键词匹配梦境符号 */
export function findSymbolsByKeywords(keywords: string[]): DreamSymbol[] {
  const result: DreamSymbol[] = []
  const matched = new Set<string>()
  for (const kw of keywords) {
    for (const sym of DREAM_SYMBOLS) {
      if (!matched.has(sym.name) && sym.keywords.some(k => kw.includes(k) || k.includes(kw))) {
        result.push(sym)
        matched.add(sym.name)
        if (result.length >= 5) return result
      }
    }
  }
  return result
}

/** 从文本中提取梦境关键词 */
export function extractDreamKeywords(content: string): string[] {
  const allKeywords: string[] = []
  for (const sym of DREAM_SYMBOLS) {
    for (const kw of sym.keywords) {
      if (content.includes(kw)) {
        allKeywords.push(kw)
      }
    }
  }
  return [...new Set(allKeywords)]
}
