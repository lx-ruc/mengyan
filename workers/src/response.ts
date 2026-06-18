import type { Context } from 'hono'
import type { ContentfulStatusCode } from 'hono/utils/http-status'
import type { ApiResponse, Env } from './types'

type AppContext = Context<{ Bindings: Env }>

/** 成功响应：{ success: true, data } */
export function ok<T>(c: AppContext, data: T) {
  const body: ApiResponse<T> = { success: true, data }
  return c.json(body)
}

/** 失败响应（4xx） */
export function fail(c: AppContext, status: ContentfulStatusCode, error: string) {
  const body: ApiResponse<never> = { success: false, error }
  return c.json(body, status)
}

/** 上游（Gemini）错误，默认 502 */
export function upstream(c: AppContext, error: string, status: ContentfulStatusCode = 502) {
  const body: ApiResponse<never> = { success: false, error }
  return c.json(body, status)
}
