import { NextResponse } from 'next/server'
import { NextRequest } from 'next/server'

const BLOCKED_COUNTRY = 'CN'

export function middleware(req: NextRequest) {
  const country = (req.geo && req.geo.country) || 'US'
  if (country === BLOCKED_COUNTRY) {
    req.nextUrl.pathname = '/403'
  }
  return NextResponse.rewrite(req.nextUrl)
}
