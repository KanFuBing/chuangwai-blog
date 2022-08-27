import { NextResponse } from 'next/server'
import { NextRequest } from 'next/server'

const BLOCKED_COUNTRY = 'CN'

export function middleware(req: NextRequest) {
  const country = (req.geo && req.geo.country) || 'US'
  const isRequestingStatusImage = req.nextUrl.pathname.startsWith('/status')
  // 不应阻挡对 403 状态图片的大陆请求
  if (!isRequestingStatusImage && country === BLOCKED_COUNTRY) {
    req.nextUrl.pathname = '/403'
  }
  return NextResponse.rewrite(req.nextUrl)
}
