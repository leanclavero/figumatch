'use client'

import { useState, Suspense } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Mail, ArrowRight, Loader2, Calendar } from 'lucide-react'

function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [socialLoading, setSocialLoading] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [showEmailForm, setShowEmailForm] = useState(false)
  
  const supabase = createClient()
  const router = useRouter()
  const searchParams = useSearchParams()
  const message = searchParams.get('message')

  const handleSocialLogin = async (provider: 'google' | 'apple') => {
    setSocialLoading(provider)
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })
    if (error) {
      setError(`Error con ${provider}: ${error.message}`)
      setSocialLoading(null)
    }
  }

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setError('Credenciales incorrectas')
      setLoading(false)
    } else {
      router.push('/')
      router.refresh()
    }
  }

  return (
    <div className="min-h-screen -mt-20 flex flex-col items-center justify-center p-4">
      {/* Background Decor */}
      <div className="fixed inset-0 -z-10 bg-gray-50 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-100 rounded-full blur-[120px] opacity-60" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-100 rounded-full blur-[120px] opacity-60" />
      </div>

      <div className="w-full max-w-sm space-y-8 animate-in fade-in slide-in-from-bottom-10 duration-700">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-600 to-blue-800 rounded-[32px] shadow-2xl shadow-blue-200 mb-4 rotate-3">
             <TrophyIcon className="text-white w-10 h-10" />
          </div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">Figumatch</h1>
          <p className="text-gray-500 font-medium px-8 leading-relaxed">
            Completa tu álbum del Mundial con la comunidad más grande.
          </p>
        </div>

        {message && (
          <div className="bg-blue-50 text-blue-700 p-4 rounded-2xl border border-blue-100 text-xs font-bold text-center">
            {message}
          </div>
        )}

        <div className="space-y-4">
          <button
            onClick={() => handleSocialLogin('google')}
            disabled={!!socialLoading}
            className="w-full bg-white border-2 border-gray-100 h-16 rounded-[24px] flex items-center justify-center gap-4 text-gray-700 font-bold shadow-sm hover:border-blue-100 transition-all active:scale-[0.98] disabled:opacity-50"
          >
            {socialLoading === 'google' ? <Loader2 className="animate-spin" /> : <GoogleIcon />}
            Continuar con Google
          </button>

          <button
            onClick={() => handleSocialLogin('apple')}
            disabled={!!socialLoading}
            className="w-full bg-gray-900 h-16 rounded-[24px] flex items-center justify-center gap-4 text-white font-bold shadow-lg hover:bg-black transition-all active:scale-[0.98] disabled:opacity-50"
          >
            {socialLoading === 'apple' ? <Loader2 className="animate-spin" /> : <AppleIcon />}
            Continuar con Apple
          </button>

          <div className="relative py-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-gray-50 px-4 text-gray-400 font-black tracking-widest">O usa tu email</span>
            </div>
          </div>

          {!showEmailForm ? (
            <button
              onClick={() => setShowEmailForm(true)}
              className="w-full h-16 rounded-[24px] flex items-center justify-center gap-4 text-gray-500 font-bold hover:text-blue-600 transition-all"
            >
              <Mail size={20} />
              Ingresar con correo
            </button>
          ) : (
            <form onSubmit={handleEmailLogin} className="space-y-4 animate-in slide-in-from-top-4 duration-300">
              <div className="space-y-3">
                <input
                  type="email"
                  required
                  placeholder="Tu correo electrónico"
                  className="w-full h-14 px-6 rounded-[20px] border-2 border-gray-100 focus:border-blue-500 focus:outline-none transition-all font-medium text-gray-800 text-sm"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <input
                  type="password"
                  required
                  placeholder="Tu contraseña"
                  className="w-full h-14 px-6 rounded-[20px] border-2 border-gray-100 focus:border-blue-500 focus:outline-none transition-all font-medium text-gray-800 text-sm"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              {error && <p className="text-red-500 text-xs font-bold text-center">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className="w-full h-14 bg-blue-600 text-white rounded-[20px] font-bold flex items-center justify-center gap-2 shadow-lg shadow-blue-200 active:scale-95 transition-all disabled:opacity-50"
              >
                {loading ? <Loader2 className="animate-spin" /> : 'Entrar ahora'}
                {!loading && <ArrowRight size={20} />}
              </button>
            </form>
          )}
        </div>

        <p className="text-center text-sm text-gray-400 font-medium">
          ¿Nuevo en Figumatch?{' '}
          <Link href="/signup" className="text-blue-600 font-extrabold hover:underline">
            Crea tu cuenta
          </Link>
        </p>
      </div>
    </div>
  )
}

function TrophyIcon({ className }: { className?: string }) {
  return (
    <svg 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2.5" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
      <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
      <path d="M4 22h16" />
      <path d="M10 22V18" />
      <path d="M14 22V18" />
      <path d="M18 4H6v7a6 6 0 0 0 12 0V4Z" />
    </svg>
  )
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
  )
}

function AppleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
      <path d="M17.05 20.28c-.96.95-2.21 1.72-3.72 1.72-1.45 0-2.05-.84-3.72-.84s-2.3.84-3.72.84c-1.52 0-2.93-1.01-3.95-2.31-2.04-2.6-2.04-6.84 0-9.44 1.02-1.3 2.43-2.11 3.95-2.11 1.41 0 2.1.84 3.72.84s2.31-.84 3.72-.84c1.23 0 2.45.61 3.23 1.54-3.05 1.73-2.56 6.13.44 7.34-.61 1.52-1.61 3.12-3.05 4.3zM12.03 7.25c-.02-2.23 1.84-4.14 3.96-4.25.24 2.46-2.1 4.41-3.96 4.25z" />
    </svg>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="flex justify-center py-20">Cargando...</div>}>
      <LoginForm />
    </Suspense>
  )
}
