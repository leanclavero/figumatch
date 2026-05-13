'use client'

import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const supabase = createClient()
  const router = useRouter()
  const searchParams = useSearchParams()
  const message = searchParams.get('message')

  const handleLogin = async (e: React.FormEvent) => {
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
    <div className="flex flex-col gap-6 max-w-md mx-auto py-10">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Bienvenido</h1>
        <p className="text-gray-500">Inicia sesión para ver tus figuritas</p>
      </div>

      {message && (
        <div className="bg-green-50 text-green-700 p-4 rounded-xl border border-green-100 text-sm text-center">
          {message}
        </div>
      )}

      <form onSubmit={handleLogin} className="flex flex-col gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div className="space-y-2">
          <label className="text-sm font-medium">Email</label>
          <input
            type="email"
            required
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            placeholder="tu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Contraseña</label>
          <input
            type="password"
            required
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200 disabled:opacity-50"
        >
          {loading ? 'Entrando...' : 'Entrar'}
        </button>
      </form>

      <p className="text-center text-sm text-gray-500">
        ¿No tienes cuenta?{' '}
        <Link href="/signup" className="text-blue-600 font-bold">
          Regístrate ahora
        </Link>
      </p>
    </div>
  )
}
