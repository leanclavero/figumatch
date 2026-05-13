'use client'

import { useState } from 'react'
import { Trophy, Users, Star, PlusCircle } from 'lucide-react'
import Link from 'next/link'
import TeamSummaryList from '@/components/stickers/TeamSummaryList'

interface Sticker {
  id: number
  team: string
  sticker_number: string
  player_name: string | null
  rarity: string
}

interface Props {
  initialAllStickers: Sticker[]
  initialUserStickers: any[]
  user: any
}

export default function HomeDashboard({ initialAllStickers, initialUserStickers, user }: Props) {
  // Use plain object for counts
  const [counts, setCounts] = useState<Record<number, number>>(() => {
    const initialMap: Record<number, number> = {}
    initialUserStickers.forEach((us) => {
      initialMap[us.sticker_id] = us.count
    })
    return initialMap
  })
  
  // VERSION COUNTER: Forces React to re-render everything
  const [version, setVersion] = useState(0)

  // STATS: Calculated on EVERY render
  const totalStickers = initialAllStickers.length
  let ownedCount = 0
  let totalDuplicates = 0

  initialAllStickers.forEach(s => {
    const count = counts[s.id] || 0
    if (count > 0) ownedCount++
    if (count > 1) totalDuplicates += (count - 1)
  })

  const completionPercentage = Math.round((ownedCount / totalStickers) * 100) || 0

  const handleUpdateCount = (stickerId: number, newCount: number) => {
    console.log(`Updating sticker ${stickerId} to ${newCount}`)
    setCounts(prev => {
      const next = { ...prev, [stickerId]: newCount }
      return next
    })
    setVersion(v => v + 1)
  }

  return (
    <div className="flex flex-col gap-6 pb-10">
      {/* Header / Stats */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-3xl p-6 text-white shadow-xl shadow-blue-200">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">¡Hola, {user.user_metadata.full_name?.split(' ')[0]}!</h1>
            <p className="text-blue-100 text-xs opacity-70">v.{version} | {user.email}</p>
          </div>
          <div className="bg-white/20 p-2 rounded-xl backdrop-blur-md">
            <Trophy className="text-yellow-400" size={24} />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-xs font-bold uppercase tracking-wider">
            <span>Álbum Completo</span>
            <span>{completionPercentage}%</span>
          </div>
          <div className="w-full bg-white/20 h-3 rounded-full overflow-hidden border border-white/10">
            <div 
              className="bg-yellow-400 h-full rounded-full transition-all duration-300 shadow-[0_0_10px_rgba(250,204,21,0.5)]" 
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
          <div className="flex justify-between items-center">
            <p className="text-[10px] text-blue-100 font-medium">
              {ownedCount} de {totalStickers} únicas
            </p>
            <p className="text-[10px] text-yellow-300 font-bold">
              {totalDuplicates} repetidas totales
            </p>
          </div>
        </div>
      </section>

      {/* Quick Actions Bar */}
      <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 no-scrollbar">
        <Link href="/search" className="flex-none bg-blue-600 text-white px-4 py-3 rounded-2xl flex items-center gap-2 text-sm font-bold shadow-lg shadow-blue-100">
          <PlusCircle size={18} />
          Cargar Figus
        </Link>
        <Link href="/trades" className="flex-none bg-white text-gray-700 px-4 py-3 rounded-2xl flex items-center gap-2 text-sm font-bold border border-gray-100 shadow-sm">
          <Users size={18} className="text-blue-600" />
          Ver Canjes
        </Link>
      </div>

      {/* Mini Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-3">
          <div className="bg-orange-100 p-2 rounded-lg text-orange-600">
            <Star size={20} />
          </div>
          <div>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">Repetidas</p>
            <p className="text-xl font-black text-gray-800">{totalDuplicates}</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-3 overflow-hidden">
          <div className="bg-purple-100 p-2 rounded-lg text-purple-600">
            <Users size={20} />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">Tu Zona</p>
            <p className="text-sm font-black text-gray-800 truncate">Argentina</p>
          </div>
        </div>
      </div>

      {/* Teams Summary List */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-gray-800 tracking-tight">Mi Álbum por Países</h2>
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">A-Z</span>
        </div>
        
        <TeamSummaryList 
          key={`dashboard-v${version}`}
          allStickers={initialAllStickers} 
          ownedStickersMap={counts} 
          userId={user.id}
          onUpdateCount={handleUpdateCount}
        />
      </section>
    </div>
  )
}
