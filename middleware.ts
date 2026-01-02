import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  
  // Cria o cliente do Supabase para o Middleware
  const supabase = createMiddlewareClient({ req, res })

  // Verifica se existe uma sessão ativa
  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Se o usuário tentar acessar /admin ou /funcionario sem estar logado, manda para o login
  if (!session && (req.nextUrl.pathname.startsWith('/admin') || req.nextUrl.pathname.startsWith('/funcionario'))) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  return res
}

// Define quais rotas o middleware deve vigiar
export const config = {
  matcher: ['/admin/:path*', '/funcionario/:path*'],
}

// v2