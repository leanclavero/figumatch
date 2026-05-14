'use client'

import { useState } from 'react'
import { Trophy, Users, Star, PlusCircle } from 'lucide-react'
import Link from 'next/link'
import TeamSummaryList from '@/components/stickers/TeamSummaryList'
import { getTranslatedTeamName } from '@/utils/teams'

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
    setCounts(prev => ({
      ...prev,
      [stickerId]: newCount
    }))
  }

  return (
    <div className="flex flex-col gap-6 pb-10">
      {/* Header / Stats */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-3xl p-6 text-white shadow-xl shadow-blue-200">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">¡Hola, {user.user_metadata.full_name?.split(' ')[0]}!</h1>
            <p className="text-blue-100 text-[10px] opacity-70 font-medium tracking-widest uppercase">{user.email}</p>
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

      {/* Teams Summary List */}
      <section className="relative">
        <div className="flex flex-col gap-4 mb-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold text-gray-800 tracking-tight">Mi Álbum por Países</h2>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">A-Z</span>
          </div>
          
          {/* Letter Carousel - STICKY ANCHOR MENU */}
          <div className="sticky top-0 z-30 -mx-4 px-4 py-3 bg-white border-b border-gray-100 flex gap-2 overflow-x-auto no-scrollbar shadow-sm">
            {Array.from('ABCDEFGHIJKLMNOPQRSTUVWXYZ').map((letter) => {
              const hasTeams = initialAllStickers.some(s => getTranslatedTeamName(s.team).toUpperCase().startsWith(letter))
              if (!hasTeams) return null
              
              return (
                <button
                  key={letter}
                  onClick={() => {
                    const element = document.getElementById(`letter-${letter}`)
                    if (element) {
                      const offset = 80 // Height of the sticky letter menu
                      const bodyRect = document.body.getBoundingClientRect().top
                      const elementRect = element.getBoundingClientRect().top
                      const elementPosition = elementRect - bodyRect
                      const offsetPosition = elementPosition - offset

                      window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                      })
                    }
                  }}
                  className="flex-none w-10 h-10 bg-white rounded-xl flex items-center justify-center text-sm font-black text-gray-400 border border-gray-100 shadow-sm active:bg-blue-600 active:text-white transition-all"
                >
                  {letter}
                </button>
              )
            })}
          </div>
        </div>
        
        <TeamSummaryList 
          allStickers={initialAllStickers} 
          ownedStickersMap={counts} 
          userId={user.id}
          onUpdateCount={handleUpdateCount}
        />
      </section>
    </div>
  )
}
