'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Search, Share2, UserPlus, Users, ArrowRight, Loader2, Check } from 'lucide-react'
import Link from 'next/link'

interface Profile {
  id: string
  full_name: string | null
  avatar_url: string | null
}

export default function FriendsPage() {
  const [search, setSearch] = useState('')
  const [results, setResults] = useState<Profile[]>([])
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [copied, setCopied] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user)
    })
  }, [supabase.auth])

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!search.trim()) return
    
    setLoading(true)
    const { data, error } = await supabase
      .from('profiles')
      .select('id, full_name, avatar_url')
      .ilike('full_name', `%${search}%`)
      .limit(10)

    if (!error) setResults(data || [])
    setLoading(false)
  }

  const handleShare = () => {
    if (!user) return
    const url = `${window.location.origin}/trades/${user.id}`
    navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="flex flex-col gap-6 pb-20">
      {/* Header Social */}
      <section className="bg-gradient-to-br from-purple-600 to-indigo-700 rounded-3xl p-6 text-white shadow-xl shadow-purple-200">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-2xl font-black tracking-tight">Comunidad</h1>
            <p className="text-purple-100 text-[10px] font-bold uppercase tracking-widest opacity-80">Encuentra coleccionistas</p>
          </div>
          <div className="bg-white/20 p-2 rounded-xl backdrop-blur-md">
            <Users className="text-white" size={24} />
          </div>
        </div>

        <button 
          onClick={handleShare}
          className="w-full bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/30 py-4 rounded-2xl flex items-center justify-center gap-3 transition-all active:scale-95 group"
        >
          {copied ? <Check size={20} className="text-green-300" /> : <Share2 size={20} className="group-hover:rotate-12 transition-transform" />}
          <span className="font-bold">{copied ? '¡Enlace copiado!' : 'Compartir mi Perfil'}</span>
        </button>
      </section>

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="relative group">
        <input 
          type="text" 
          placeholder="Buscar por nombre..." 
          className="w-full bg-white border-2 border-gray-100 h-14 pl-12 pr-4 rounded-2xl focus:border-purple-500 focus:outline-none transition-all font-medium shadow-sm group-focus-within:shadow-md"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-purple-500 transition-colors" size={20} />
        <button 
          type="submit"
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-purple-600 text-white p-2 rounded-xl active:scale-90 transition-all"
        >
          {loading ? <Loader2 className="animate-spin" size={20} /> : <ArrowRight size={20} />}
        </button>
      </form>

      {/* Results / List */}
      <section className="space-y-4">
        <h2 className="text-sm font-black text-gray-400 uppercase tracking-widest px-2">
          {results.length > 0 ? 'Resultados de búsqueda' : 'Tus Amigos'}
        </h2>
        
        {results.length === 0 && !loading && (
          <div className="bg-white border border-gray-100 rounded-3xl p-10 text-center space-y-3">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto">
              <Users size={32} className="text-gray-200" />
            </div>
            <p className="text-gray-400 font-bold text-sm">Busca a otros usuarios para ver sus figuritas y hacer canjes.</p>
          </div>
        )}

        <div className="grid gap-3">
          {results.map((profile) => (
            <Link 
              key={profile.id} 
              href={`/trades/${profile.id}`}
              className="bg-white p-4 rounded-2xl border border-gray-100 flex items-center justify-between shadow-sm hover:shadow-md transition-all active:scale-[0.98]"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center text-lg font-bold text-gray-500">
                  {profile.full_name?.[0] || '?'}
                </div>
                <div>
                  <p className="font-bold text-gray-800">{profile.full_name || 'Sin nombre'}</p>
                  <p className="text-[10px] text-green-600 font-black uppercase">Ver Inventario</p>
                </div>
              </div>
              <div className="bg-purple-50 p-2 rounded-xl text-purple-600">
                <ArrowRight size={20} />
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
