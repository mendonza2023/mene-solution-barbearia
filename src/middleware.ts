import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Proteção de rotas
  if (!session && (req.nextUrl.pathname.startsWith('/admin') || req.nextUrl.pathname.startsWith('/funcionario'))) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  return res
}

// O Next.js precisa que você exporte o middleware como padrão também em alguns casos
export default middleware

export const config = {
  matcher: ['/admin/:path*', '/funcionario/:path*'],
}