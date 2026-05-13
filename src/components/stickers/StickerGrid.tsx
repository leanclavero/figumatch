'use client'

import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Plus, Minus, Info } from 'lucide-react'

interface Sticker {
  id: number
  team: string
  sticker_number: string
  player_name: string | null
  rarity: string
}

interface Props {
  stickers: Sticker[]
  userStickers: Map<number, number>
  userId: string
}

export default function StickerGrid({ stickers, userStickers, userId }: Props) {
  const [counts, setCounts] = useState<Map<number, number>>(userStickers)
  const supabase = createClient()

  const updateCount = async (stickerId: number, delta: number) => {
    const currentCount = counts.get(stickerId) || 0
    const newCount = Math.max(0, currentCount + delta)
    
    if (newCount === currentCount) return

    // Optimistic update
    const newMap = new Map(counts)
    newMap.set(stickerId, newCount)
    setCounts(newMap)

    const { error } = await supabase
      .from('user_stickers')
      .upsert({
        user_id: userId,
        sticker_id: stickerId,
        count: newCount
      }, { onConflict: 'user_id,sticker_id' })

    if (error) {
      console.error('Error updating sticker count:', error)
      // Rollback
      const rollbackMap = new Map(counts)
      setCounts(rollbackMap)
    }
  }

  // Group stickers by team
  const teams = Array.from(new Set(stickers.map(s => s.team)))

  return (
    <div className="space-y-8">
      {teams.map(team => (
        <div key={team} className="space-y-4">
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">{team}</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {stickers.filter(s => s.team === team).map(sticker => {
              const count = counts.get(sticker.id) || 0
              const isOwned = count > 0
              const isRare = sticker.rarity !== 'common'

              return (
                <div 
                  key={sticker.id}
                  className={`relative p-4 rounded-2xl border-2 transition-all ${
                    isOwned 
                      ? 'bg-white border-blue-100 shadow-sm' 
                      : 'bg-gray-50 border-transparent grayscale opacity-60'
                  } ${isRare && isOwned ? 'ring-2 ring-yellow-400 ring-offset-2' : ''}`}
                >
                  <div className="flex flex-col gap-1 mb-4">
                    <span className="text-[10px] font-bold text-blue-600">{sticker.sticker_number}</span>
                    <p className="text-xs font-bold text-gray-800 line-clamp-1">
                      {sticker.player_name || 'Desconocido'}
                    </p>
                  </div>

                  <div className="flex items-center justify-between mt-auto">
                    <button 
                      onClick={() => updateCount(sticker.id, -1)}
                      className="p-1.5 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
                    >
                      <Minus size={14} />
                    </button>
                    <span className={`text-sm font-bold ${count > 1 ? 'text-orange-600' : 'text-gray-800'}`}>
                      {count}
                    </span>
                    <button 
                      onClick={() => updateCount(sticker.id, 1)}
                      className="p-1.5 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors"
                    >
                      <Plus size={14} />
                    </button>
                  </div>

                  {isRare && (
                    <div className="absolute -top-2 -right-2 bg-yellow-400 p-1 rounded-full shadow-md">
                      <StarBadge />
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}

function StarBadge() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}
