'use client'

import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function SignupPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [age, setAge] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const supabase = createClient()
  const router = useRouter()

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    if (parseInt(age) < 5) {
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
          age: parseInt(age),
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
    <div className="flex flex-col gap-6 max-w-md mx-auto py-10">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Crea tu cuenta</h1>
        <p className="text-gray-500">Únete a la mayor comunidad de canje del Mundial 2026</p>
      </div>

      <form onSubmit={handleSignup} className="flex flex-col gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div className="space-y-2">
          <label className="text-sm font-medium">Nombre Completo</label>
          <input
            type="text"
            required
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            placeholder="Juan Pérez"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Edad</label>
          <input
            type="number"
            required
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            placeholder="Ej: 25"
            value={age}
            onChange={(e) => setAge(e.target.value)}
          />
          <p className="text-[10px] text-gray-400">La edad determina el acceso a funciones sociales según leyes locales.</p>
        </div>

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
          {loading ? 'Cargando...' : 'Empezar mi colección'}
        </button>
      </form>

      <p className="text-center text-sm text-gray-500">
        ¿Ya tienes cuenta?{' '}
        <Link href="/login" className="text-blue-600 font-bold">
          Inicia sesión
        </Link>
      </p>
    </div>
  )
}
