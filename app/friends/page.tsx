'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Search, Share2, UserPlus, Users, ArrowRight, Loader2, Check, Bell, X, UserCheck } from 'lucide-react'
import Link from 'next/link'

interface Profile {
  id: string
  full_name: string | null
  avatar_url: string | null
}

interface Notification {
  id: string
  from_user_id: string
  profiles: { full_name: string | null }
}

export default function FriendsPage() {
  const [search, setSearch] = useState('')
  const [results, setResults] = useState<Profile[]>([])
  const [friends, setFriends] = useState<Profile[]>([])
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [copied, setCopied] = useState(false)
  const [sendingId, setSendingId] = useState<string | null>(null)
  
  const supabase = createClient()

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setUser(user)
        fetchFriends(user.id)
        fetchNotifications(user.id)
      }
    })
  }, [supabase.auth])

  const fetchFriends = async (userId: string) => {
    const { data, error } = await supabase
      .from('friendships')
      .select(`
        sender_id,
        receiver_id,
        sender:profiles!friendships_sender_id_fkey(id, full_name, avatar_url),
        receiver:profiles!friendships_receiver_id_fkey(id, full_name, avatar_url)
      `)
      .eq('status', 'accepted')
      .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)

    if (!error && data) {
      const friendsList = data.map((f: any) => 
        f.sender_id === userId ? f.receiver : f.sender
      )
      setFriends(friendsList)
    }
  }

  const fetchNotifications = async (userId: string) => {
    const { data, error } = await supabase
      .from('notifications')
      .select(`
        id,
        from_user_id,
        profiles!notifications_from_user_id_fkey(full_name)
      `)
      .eq('user_id', userId)
      .eq('is_read', false)

    if (!error) setNotifications(data || [])
  }

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!search.trim()) return
    
    const cleanSearch = search.trim()
    setLoading(true)
    
    // Buscamos coincidencias en nombre o email de forma más robusta
    const { data, error } = await supabase
      .from('profiles')
      .select('id, full_name, avatar_url, email')
      .or(`email.ilike.%${cleanSearch}%,full_name.ilike.%${cleanSearch}%`)
      .limit(10)

    if (error) {
      console.error('Error en búsqueda Figumatch:', error)
      setResults([])
    } else {
      console.log('Resultados encontrados:', data?.length)
      setResults(data || [])
    }
    setLoading(false)
  }

  const sendFriendRequest = async (targetUserId: string) => {
    if (!user) return
    setSendingId(targetUserId)

    // 1. Crear la amistad pendiente
    const { error: friendError } = await supabase
      .from('friendships')
      .upsert({ 
        sender_id: user.id, 
        receiver_id: targetUserId, 
        status: 'pending' 
      })

    // 2. Crear la notificación
    if (!friendError) {
      await supabase.from('notifications').insert({
        user_id: targetUserId,
        from_user_id: user.id,
        type: 'friend_request'
      })
      alert('¡Solicitud enviada!')
    }

    setSendingId(null)
  }

  const handleAcceptRequest = async (notif: Notification) => {
    if (!user) return
    
    // 1. Actualizar amistad
    await supabase
      .from('friendships')
      .update({ status: 'accepted' })
      .match({ sender_id: notif.from_user_id, receiver_id: user.id })

    // 2. Marcar notif como leída
    await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', notif.id)

    fetchFriends(user.id)
    fetchNotifications(user.id)
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
            <p className="text-purple-100 text-[10px] font-bold uppercase tracking-widest opacity-80">Conecta y Canjea</p>
          </div>
          <div className="bg-white/20 p-2 rounded-xl backdrop-blur-md">
            <Users className="text-white" size={24} />
          </div>
        </div>

        <button 
          onClick={handleShare}
          className="w-full bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/30 py-4 rounded-2xl flex items-center justify-center gap-3 transition-all active:scale-95 group"
        >
          {copied ? <Check size={20} className="text-green-300" /> : <Share2 size={20} />}
          <span className="font-bold">{copied ? '¡Enlace copiado!' : 'Compartir mi Perfil'}</span>
        </button>
      </section>

      {/* Notifications Bar */}
      {notifications.length > 0 && (
        <section className="bg-blue-50 border border-blue-100 rounded-2xl p-4 animate-in slide-in-from-top-4">
          <div className="flex items-center gap-2 mb-3">
            <Bell size={16} className="text-blue-600" />
            <h3 className="text-xs font-black text-blue-800 uppercase tracking-widest">Solicitudes Pendientes</h3>
          </div>
          <div className="space-y-2">
            {notifications.map((notif) => (
              <div key={notif.id} className="bg-white p-3 rounded-xl flex items-center justify-between shadow-sm border border-blue-100">
                <p className="text-sm font-bold text-gray-700">
                  <span className="text-blue-600">{notif.profiles?.full_name || 'Alguien'}</span> quiere ser tu amigo
                </p>
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleAcceptRequest(notif)}
                    className="bg-blue-600 text-white p-2 rounded-lg active:scale-90 transition-all"
                  >
                    <Check size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="relative group">
        <input 
          type="text" 
          placeholder="Busca por nombre o email..." 
          className="w-full bg-white border-2 border-gray-100 h-14 pl-12 pr-4 rounded-2xl focus:border-purple-500 focus:outline-none transition-all font-medium shadow-sm"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-purple-500" size={20} />
        <button 
          type="submit"
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-purple-600 text-white p-2 rounded-xl"
        >
          {loading ? <Loader2 className="animate-spin" size={20} /> : <ArrowRight size={20} />}
        </button>
      </form>

      {/* Results / List */}
      <section className="space-y-4">
        <h2 className="text-sm font-black text-gray-400 uppercase tracking-widest px-2">
          {results.length > 0 ? 'Resultados de búsqueda' : 'Tus Amigos'}
        </h2>
        
        {results.length > 0 ? (
          <div className="grid gap-3">
            {results.map((profile) => (
              <div 
                key={profile.id} 
                className="bg-white p-4 rounded-2xl border border-gray-100 flex items-center justify-between shadow-sm"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center text-lg font-bold text-gray-500">
                    {profile.full_name?.[0] || '?'}
                  </div>
                  <div>
                    <p className="font-bold text-gray-800">{profile.full_name || 'Sin nombre'}</p>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Coleccionista</p>
                  </div>
                </div>
                {user?.id !== profile.id && (
                  <button 
                    onClick={() => sendFriendRequest(profile.id)}
                    disabled={sendingId === profile.id}
                    className="bg-purple-100 text-purple-600 p-3 rounded-xl hover:bg-purple-600 hover:text-white transition-all active:scale-95 disabled:opacity-50"
                  >
                    {sendingId === profile.id ? <Loader2 className="animate-spin" size={20} /> : <UserPlus size={20} />}
                  </button>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="grid gap-3">
            {friends.map((friend) => (
              <Link 
                key={friend.id} 
                href={`/trades/${friend.id}`}
                className="bg-white p-4 rounded-2xl border border-gray-100 flex items-center justify-between shadow-sm hover:shadow-md transition-all active:scale-[0.98]"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-lg font-bold text-indigo-600">
                    {friend.full_name?.[0] || '?'}
                  </div>
                  <div>
                    <p className="font-bold text-gray-800">{friend.full_name || 'Sin nombre'}</p>
                    <p className="text-[10px] text-green-600 font-black uppercase tracking-widest flex items-center gap-1">
                      <UserCheck size={10} /> Amigo
                    </p>
                  </div>
                </div>
                <div className="bg-gray-50 p-2 rounded-xl text-gray-400">
                  <ArrowRight size={20} />
                </div>
              </Link>
            ))}
            {friends.length === 0 && !loading && (
              <div className="bg-white border border-gray-100 rounded-3xl p-10 text-center space-y-3">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto">
                  <Users size={32} className="text-gray-200" />
                </div>
                <p className="text-gray-400 font-bold text-sm px-10">Busca amigos para ver sus figuritas y empezar a canjear.</p>
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  )
}
