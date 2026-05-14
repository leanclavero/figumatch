'use client'

import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Mail, ArrowRight, Loader2, Calendar } from 'lucide-react'

export default function SignupPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [birthDate, setBirthDate] = useState('')
  const [loading, setLoading] = useState(false)
  const [socialLoading, setSocialLoading] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  
  const supabase = createClient()
  const router = useRouter()

  const calculateAge = (dateString: string) => {
    if (!dateString) return 0
    const today = new Date()
    const birthDate = new Date(dateString)
    let age = today.getFullYear() - birthDate.getFullYear()
    const m = today.getMonth() - birthDate.getMonth()
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }
    return age
  }

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

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const age = calculateAge(birthDate)
    if (age < 5) {
      setError('Debes tener al menos 5 años para coleccionar figuritas.')
      setLoading(false)
      return
    }

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          age: age,
          birth_date: birthDate
        },
      },
    })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      router.push('/login?message=Revisa tu email para confirmar tu cuenta')
    }
  }

  return (
    <div className="min-h-screen -mt-10 flex flex-col items-center justify-center p-4">
      {/* Background Decor */}
      <div className="fixed inset-0 -z-10 bg-gray-50 overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-100 rounded-full blur-[120px] opacity-60" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-100 rounded-full blur-[120px] opacity-60" />
      </div>

      <div className="w-full max-w-sm space-y-8 animate-in fade-in slide-in-from-bottom-10 duration-700">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Crea tu cuenta</h1>
          <p className="text-gray-500 font-medium leading-relaxed">
            Únete a la mayor comunidad de canje del Mundial 2026.
          </p>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => handleSocialLogin('google')}
              disabled={!!socialLoading}
              className="bg-white border-2 border-gray-100 h-14 rounded-[20px] flex items-center justify-center gap-2 text-gray-700 font-bold shadow-sm hover:border-blue-100 transition-all disabled:opacity-50"
            >
              {socialLoading === 'google' ? <Loader2 className="animate-spin w-5 h-5" /> : <GoogleIcon />}
              Google
            </button>
            <button
              onClick={() => handleSocialLogin('apple')}
              disabled={!!socialLoading}
              className="bg-gray-900 h-14 rounded-[20px] flex items-center justify-center gap-2 text-white font-bold shadow-lg hover:bg-black transition-all disabled:opacity-50"
            >
              {socialLoading === 'apple' ? <Loader2 className="animate-spin w-5 h-5" /> : <AppleIcon />}
              Apple
            </button>
          </div>

          <div className="relative py-2">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-[10px] uppercase">
              <span className="bg-gray-50 px-4 text-gray-400 font-black tracking-widest">O regístrate con email</span>
            </div>
          </div>

          <form onSubmit={handleSignup} className="space-y-3">
            <div className="space-y-3">
              <input
                type="text"
                required
                placeholder="Nombre Completo"
                className="w-full h-12 px-5 rounded-[16px] border-2 border-gray-100 focus:border-blue-500 focus:outline-none transition-all font-medium text-gray-800 text-sm"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
              
              <div className="relative">
                <input
                  type="date"
                  required
                  className="w-full h-12 px-5 rounded-[16px] border-2 border-gray-100 focus:border-blue-500 focus:outline-none transition-all font-medium text-gray-800 text-sm"
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                  <Calendar size={18} />
                </div>
              </div>
              <p className="text-[10px] text-gray-400 px-2">Fecha de nacimiento para calcular tu edad.</p>

              <input
                type="email"
                required
                placeholder="Email"
                className="w-full h-12 px-5 rounded-[16px] border-2 border-gray-100 focus:border-blue-500 focus:outline-none transition-all font-medium text-gray-800 text-sm"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              
              <input
                type="password"
                required
                placeholder="Contraseña"
                className="w-full h-12 px-5 rounded-[16px] border-2 border-gray-100 focus:border-blue-500 focus:outline-none transition-all font-medium text-gray-800 text-sm"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {error && <p className="text-red-500 text-[10px] font-bold text-center bg-red-50 p-2 rounded-lg">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full h-14 bg-blue-600 text-white rounded-[20px] font-bold flex items-center justify-center gap-2 shadow-lg shadow-blue-200 active:scale-95 transition-all disabled:opacity-50 mt-4"
            >
              {loading ? <Loader2 className="animate-spin" /> : 'Empezar mi colección'}
              {!loading && <ArrowRight size={20} />}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-gray-400 font-medium">
          ¿Ya tienes cuenta?{' '}
          <Link href="/login" className="text-blue-600 font-extrabold hover:underline">
            Inicia sesión
          </Link>
        </p>
      </div>
    </div>
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
