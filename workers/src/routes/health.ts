import type { Context } from 'hono'
import type { Env } from '../types'
import { ok } from '../response'

type AppContext = Context<{ Bindings: Env }>

/** 健康检查：返回 { success: true, data: { status: 'ok' } } */
export function health(c: AppContext) {
  return ok(c, { status: 'ok' })
}
